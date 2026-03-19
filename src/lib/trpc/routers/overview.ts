import {
	and,
	count,
	countDistinct,
	eq,
	gte,
	inArray,
	lt,
	sql,
	sum,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const overviewRouter = createTRPCRouter({
	getQuickStats: protectedProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const windowStart = new Date(now);
		windowStart.setDate(windowStart.getDate() - 56);

		const raidRows = await db
			.select({ id: raids.id })
			.from(raids)
			.where(
				and(
					eq(raids.coreId, ctx.coreId),
					gte(raids.date, windowStart),
					lt(raids.date, now),
				),
			);

		const totalRaids = raidRows.length;
		if (totalRaids === 0) {
			return {
				topDps: null,
				mostAttended: null,
				bestSurvival: null,
				topPrePot: null,
				mostResilient: null,
				fastestKill: null,
			};
		}

		const raidIds = raidRows.map((r) => r.id);

		const encounterRows = await db
			.select({ id: encounters.id, raidId: encounters.raidId })
			.from(encounters)
			.where(inArray(encounters.raidId, raidIds));

		if (encounterRows.length === 0) {
			return {
				topDps: null,
				mostAttended: null,
				bestSurvival: null,
				topPrePot: null,
				mostResilient: null,
				fastestKill: null,
			};
		}

		const encounterIds = encounterRows.map((e) => e.id);

		// Get roster member names for filtering
		const rosterMembers = await db
			.select({ name: members.name })
			.from(members)
			.where(eq(members.coreId, ctx.coreId));

		const rosterNames = new Set(rosterMembers.map((m) => m.name));

		// TOP DPS: sum damage / sum duration for kill encounters per player
		const killEncounters = await db
			.select({
				id: encounters.id,
				durationMs: encounters.durationMs,
			})
			.from(encounters)
			.where(
				and(inArray(encounters.raidId, raidIds), eq(encounters.result, "kill")),
			);

		let topDps: { name: string; value: number } | null = null;
		if (killEncounters.length > 0) {
			const killEncounterIds = killEncounters.map((e) => e.id);
			const durationMap = new Map(
				killEncounters.map((e) => [e.id, e.durationMs]),
			);

			const playerDamageRows = await db
				.select({
					playerName: encounterPlayers.playerName,
					encounterId: encounterPlayers.encounterId,
					damage: encounterPlayers.damage,
				})
				.from(encounterPlayers)
				.where(inArray(encounterPlayers.encounterId, killEncounterIds));

			const playerDps = new Map<
				string,
				{ totalDamage: number; totalDurationMs: number }
			>();
			for (const row of playerDamageRows) {
				if (!rosterNames.has(row.playerName)) continue;
				const dur = durationMap.get(row.encounterId) ?? 0;
				if (dur <= 0) continue;
				const existing = playerDps.get(row.playerName) ?? {
					totalDamage: 0,
					totalDurationMs: 0,
				};
				existing.totalDamage += row.damage;
				existing.totalDurationMs += dur;
				playerDps.set(row.playerName, existing);
			}

			let bestDps = 0;
			for (const [name, stats] of playerDps) {
				const dps =
					stats.totalDurationMs > 0
						? (stats.totalDamage / stats.totalDurationMs) * 1000
						: 0;
				if (dps > bestDps) {
					bestDps = dps;
					topDps = { name, value: Math.round(dps) };
				}
			}
		}

		// MOST ATTENDED: count distinct raids per player
		const attendanceRows = await db
			.select({
				playerName: encounterPlayers.playerName,
				raidId: encounters.raidId,
			})
			.from(encounterPlayers)
			.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
			.where(inArray(encounters.raidId, raidIds));

		const playerRaids = new Map<string, Set<string>>();
		for (const row of attendanceRows) {
			if (!rosterNames.has(row.playerName)) continue;
			const set = playerRaids.get(row.playerName) ?? new Set();
			set.add(row.raidId);
			playerRaids.set(row.playerName, set);
		}

		let mostAttended: {
			name: string;
			attended: number;
			total: number;
		} | null = null;
		let maxAttended = 0;
		for (const [name, raidSet] of playerRaids) {
			if (raidSet.size > maxAttended) {
				maxAttended = raidSet.size;
				mostAttended = { name, attended: raidSet.size, total: totalRaids };
			}
		}

		// BEST SURVIVAL: fewest deaths per raid attended
		const deathRows = await db
			.select({
				playerName: playerDeaths.playerName,
				encounterId: playerDeaths.encounterId,
			})
			.from(playerDeaths)
			.where(inArray(playerDeaths.encounterId, encounterIds));

		const playerDeathCounts = new Map<string, number>();
		for (const row of deathRows) {
			if (!rosterNames.has(row.playerName)) continue;
			playerDeathCounts.set(
				row.playerName,
				(playerDeathCounts.get(row.playerName) ?? 0) + 1,
			);
		}

		let bestSurvival: { name: string; value: number } | null = null;
		let lowestDeathRate = Number.POSITIVE_INFINITY;
		for (const [name, raidSet] of playerRaids) {
			const deaths = playerDeathCounts.get(name) ?? 0;
			const raidsAttended = raidSet.size;
			if (raidsAttended === 0) continue;
			const deathRate = deaths / raidsAttended;
			if (deathRate < lowestDeathRate) {
				lowestDeathRate = deathRate;
				bestSurvival = {
					name,
					value: Math.round(deathRate * 10) / 10,
				};
			}
		}

		// TOP PRE-POT: highest pre-pot rate (distinct encounter/player pairs)
		const prePotRows = await db
			.select({
				playerGuid: consumableUses.playerGuid,
				encounterId: consumableUses.encounterId,
			})
			.from(consumableUses)
			.where(
				and(
					inArray(consumableUses.encounterId, encounterIds),
					eq(consumableUses.prePot, true),
				),
			);

		// Map guid to name via encounterPlayers
		const guidToName = new Map<string, string>();
		const playerEncounterCounts = new Map<string, number>();

		const epRows = await db
			.select({
				playerGuid: encounterPlayers.playerGuid,
				playerName: encounterPlayers.playerName,
				encounterId: encounterPlayers.encounterId,
			})
			.from(encounterPlayers)
			.where(inArray(encounterPlayers.encounterId, encounterIds));

		const playerEncounterSets = new Map<string, Set<string>>();
		for (const row of epRows) {
			if (!rosterNames.has(row.playerName)) continue;
			guidToName.set(row.playerGuid, row.playerName);
			const set = playerEncounterSets.get(row.playerGuid) ?? new Set();
			set.add(row.encounterId);
			playerEncounterSets.set(row.playerGuid, set);
		}

		const prePotPairs = new Map<string, Set<string>>();
		for (const row of prePotRows) {
			const name = guidToName.get(row.playerGuid);
			if (!name) continue;
			const set = prePotPairs.get(row.playerGuid) ?? new Set();
			set.add(row.encounterId);
			prePotPairs.set(row.playerGuid, set);
		}

		let topPrePot: { name: string; value: number } | null = null;
		let bestRate = 0;
		for (const [guid, prePotSet] of prePotPairs) {
			const totalEncounters = playerEncounterSets.get(guid)?.size ?? 0;
			if (totalEncounters === 0) continue;
			const rate = (prePotSet.size / totalEncounters) * 100;
			if (rate > bestRate) {
				bestRate = rate;
				const name = guidToName.get(guid) ?? "Unknown";
				topPrePot = { name, value: Math.round(rate) };
			}
		}

		// MOST RESILIENT: lowest avg damage taken per encounter
		const playerDamageTaken = new Map<
			string,
			{ totalDamage: number; encounterCount: number }
		>();
		for (const row of epRows) {
			if (!rosterNames.has(row.playerName)) continue;
			const existing = playerDamageTaken.get(row.playerName) ?? {
				totalDamage: 0,
				encounterCount: 0,
			};
			existing.encounterCount += 1;
			playerDamageTaken.set(row.playerName, existing);
		}

		const damageTakenRows = await db
			.select({
				playerName: encounterPlayers.playerName,
				damageTaken: encounterPlayers.damageTaken,
			})
			.from(encounterPlayers)
			.where(inArray(encounterPlayers.encounterId, encounterIds));

		for (const row of damageTakenRows) {
			if (!rosterNames.has(row.playerName)) continue;
			const existing = playerDamageTaken.get(row.playerName);
			if (existing) {
				existing.totalDamage += row.damageTaken;
			}
		}

		let mostResilient: { name: string; value: number } | null = null;
		let lowestAvgDmg = Number.POSITIVE_INFINITY;
		for (const [name, stats] of playerDamageTaken) {
			if (stats.encounterCount === 0) continue;
			const avgDmg = stats.totalDamage / stats.encounterCount;
			if (avgDmg < lowestAvgDmg) {
				lowestAvgDmg = avgDmg;
				mostResilient = { name, value: Math.round(avgDmg) };
			}
		}

		// FASTEST KILL: shortest kill encounter
		let fastestKill: { bossName: string; durationMs: number } | null = null;
		if (killEncounters.length > 0) {
			const killEncounterIds = killEncounters.map((e) => e.id);
			const killDetails = await db
				.select({
					bossName: encounters.bossName,
					durationMs: encounters.durationMs,
				})
				.from(encounters)
				.where(inArray(encounters.id, killEncounterIds))
				.orderBy(encounters.durationMs)
				.limit(1);

			if (killDetails.length > 0) {
				fastestKill = {
					bossName: killDetails[0].bossName,
					durationMs: killDetails[0].durationMs,
				};
			}
		}

		return {
			topDps,
			mostAttended,
			bestSurvival,
			topPrePot,
			mostResilient,
			fastestKill,
		};
	}),

	getClassDistribution: protectedProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const windowStart = new Date(now);
		windowStart.setDate(windowStart.getDate() - 56);

		const raidRows = await db
			.select({ id: raids.id })
			.from(raids)
			.where(
				and(
					eq(raids.coreId, ctx.coreId),
					gte(raids.date, windowStart),
					lt(raids.date, now),
				),
			);

		if (raidRows.length === 0) return [];

		const raidIds = raidRows.map((r) => r.id);

		const rows = await db
			.select({
				class: encounterPlayers.class,
				playerName: encounterPlayers.playerName,
			})
			.from(encounterPlayers)
			.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
			.where(inArray(encounters.raidId, raidIds))
			.groupBy(encounterPlayers.class, encounterPlayers.playerName);

		const classMap = new Map<string, Set<string>>();
		for (const row of rows) {
			if (!row.class) continue;
			const set = classMap.get(row.class) ?? new Set();
			set.add(row.playerName);
			classMap.set(row.class, set);
		}

		return Array.from(classMap.entries())
			.map(([cls, players]) => ({
				class: cls,
				count: players.size,
				players: Array.from(players).sort(),
			}))
			.sort((a, b) => b.count - a.count);
	}),
});
