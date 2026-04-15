import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { getMinRaidsForQuickStatsEligibility } from "@/lib/game/quick-stats-participation";
import {
	getPhaseIdForRaidInstance,
	getRaidInstancesForPhase,
	QUICK_STATS_DEFAULT_PHASE,
	WOTLK_PHASE_IDS,
	type WotlkPhaseId,
} from "@/lib/game/wotlk-content-phases";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const quickStatsInputSchema = z
	.object({
		phase: z.enum(WOTLK_PHASE_IDS),
	})
	.optional();

export const overviewRouter = createTRPCRouter({
	getQuickStats: protectedProcedure
		.input(quickStatsInputSchema)
		.query(async ({ ctx, input }) => {
			const now = new Date();
			const windowStart = new Date(now);
			windowStart.setDate(windowStart.getDate() - 56);

			const windowCondition = and(
				eq(raids.coreId, ctx.coreId),
				gte(raids.date, windowStart),
				lt(raids.date, now),
			);

			let appliedPhase: WotlkPhaseId;
			if (input?.phase) {
				appliedPhase = input.phase;
			} else {
				const recentRows = await db
					.select({ raidInstance: raids.raidInstance })
					.from(raids)
					.where(windowCondition)
					.orderBy(desc(raids.date))
					.limit(100);

				appliedPhase = QUICK_STATS_DEFAULT_PHASE;
				for (const row of recentRows) {
					const p = getPhaseIdForRaidInstance(row.raidInstance);
					if (p === "t8" || p === "t9") {
						appliedPhase = p;
						break;
					}
				}
			}

			const phaseInstances = getRaidInstancesForPhase(appliedPhase);

			const quickStatsRaids = db.$with("quick_stats_raids").as(
				db
					.select({ id: raids.id })
					.from(raids)
					.where(
						and(windowCondition, inArray(raids.raidInstance, phaseInstances)),
					),
			);

			const quickStatsEncounters = db.$with("quick_stats_encounters").as(
				db
					.select({
						id: encounters.id,
						raidId: encounters.raidId,
						result: encounters.result,
						durationMs: encounters.durationMs,
						bossName: encounters.bossName,
						encounterOrder: encounters.order,
					})
					.from(encounters)
					.innerJoin(
						quickStatsRaids,
						eq(encounters.raidId, quickStatsRaids.id),
					),
			);

			const emptyStats = {
				appliedPhase,
				topDps: null,
				mostAttended: null,
				bestSurvival: null,
				topPrePot: null,
				mostResilient: null,
				fastestKill: null,
			} as const;

			const raidScopeRows = await db
				.with(quickStatsRaids)
				.select({ id: quickStatsRaids.id })
				.from(quickStatsRaids);

			const totalRaids = raidScopeRows.length;

			if (totalRaids === 0) {
				return emptyStats;
			}

			const [
				rosterMembers,
				encounterPlayerFacts,
				deathEventRows,
				prePotEventRows,
			] = await Promise.all([
				db
					.select({ name: members.name, class: members.class })
					.from(members)
					.where(eq(members.coreId, ctx.coreId)),
				db
					.with(quickStatsRaids, quickStatsEncounters)
					.select({
						playerGuid: encounterPlayers.playerGuid,
						playerName: encounterPlayers.playerName,
						encounterId: encounterPlayers.encounterId,
						damage: encounterPlayers.damage,
						damageTaken: encounterPlayers.damageTaken,
						raidId: quickStatsEncounters.raidId,
						result: quickStatsEncounters.result,
						durationMs: quickStatsEncounters.durationMs,
						bossName: quickStatsEncounters.bossName,
						encounterOrder: quickStatsEncounters.encounterOrder,
					})
					.from(encounterPlayers)
					.innerJoin(
						quickStatsEncounters,
						eq(encounterPlayers.encounterId, quickStatsEncounters.id),
					),
				db
					.with(quickStatsRaids, quickStatsEncounters)
					.select({ playerName: playerDeaths.playerName })
					.from(playerDeaths)
					.innerJoin(
						quickStatsEncounters,
						eq(playerDeaths.encounterId, quickStatsEncounters.id),
					),
				db
					.with(quickStatsRaids, quickStatsEncounters)
					.select({
						playerGuid: consumableUses.playerGuid,
						encounterId: consumableUses.encounterId,
					})
					.from(consumableUses)
					.innerJoin(
						quickStatsEncounters,
						eq(consumableUses.encounterId, quickStatsEncounters.id),
					)
					.where(eq(consumableUses.prePot, true)),
			]);

			if (encounterPlayerFacts.length === 0) {
				return emptyStats;
			}

			const rosterNames = new Set(rosterMembers.map((m) => m.name));
			const rosterClassMap = new Map(
				rosterMembers.map((m) => [m.name, m.class]),
			);

			const playerRaids = new Map<string, Set<string>>();
			const killEncounterDurations = new Map<string, number>();
			for (const row of encounterPlayerFacts) {
				if (!rosterNames.has(row.playerName)) continue;
				const raidSet = playerRaids.get(row.playerName) ?? new Set();
				raidSet.add(row.raidId);
				playerRaids.set(row.playerName, raidSet);
				if (row.result === "kill" && row.durationMs > 0) {
					killEncounterDurations.set(row.encounterId, row.durationMs);
				}
			}

			const minRaidsParticipated =
				getMinRaidsForQuickStatsEligibility(totalRaids);
			const hasEligibleRaidParticipation = (playerName: string) =>
				(playerRaids.get(playerName)?.size ?? 0) >= minRaidsParticipated;

			// TOP DPS: sum damage / sum duration for kill encounters per player
			const playerDps = new Map<
				string,
				{ totalDamage: number; totalDurationMs: number }
			>();
			for (const row of encounterPlayerFacts) {
				if (!rosterNames.has(row.playerName)) continue;
				if (row.result !== "kill") continue;
				const dur = killEncounterDurations.get(row.encounterId) ?? 0;
				if (dur <= 0) continue;
				const existing = playerDps.get(row.playerName) ?? {
					totalDamage: 0,
					totalDurationMs: 0,
				};
				existing.totalDamage += row.damage;
				existing.totalDurationMs += dur;
				playerDps.set(row.playerName, existing);
			}

			let topDps: { name: string; class: string | null; value: number } | null =
				null;
			let bestDps = 0;
			for (const [name, stats] of playerDps) {
				if (!hasEligibleRaidParticipation(name)) continue;
				const dps =
					stats.totalDurationMs > 0
						? (stats.totalDamage / stats.totalDurationMs) * 1000
						: 0;
				if (dps > bestDps) {
					bestDps = dps;
					topDps = {
						name,
						class: rosterClassMap.get(name) ?? null,
						value: Math.round(dps),
					};
				}
			}

			// MOST ATTENDED: count distinct raids per player
			let mostAttended: {
				name: string;
				class: string | null;
				attended: number;
				total: number;
			} | null = null;
			let maxAttended = 0;
			for (const [name, raidSet] of playerRaids) {
				if (!hasEligibleRaidParticipation(name)) continue;
				if (raidSet.size > maxAttended) {
					maxAttended = raidSet.size;
					mostAttended = {
						name,
						class: rosterClassMap.get(name) ?? null,
						attended: raidSet.size,
						total: totalRaids,
					};
				}
			}

			// BEST SURVIVAL: fewest deaths per raid attended
			const playerDeathCounts = new Map<string, number>();
			for (const row of deathEventRows) {
				if (!rosterNames.has(row.playerName)) continue;
				playerDeathCounts.set(
					row.playerName,
					(playerDeathCounts.get(row.playerName) ?? 0) + 1,
				);
			}

			let bestSurvival: {
				name: string;
				class: string | null;
				value: number;
			} | null = null;
			let lowestDeathRate = Number.POSITIVE_INFINITY;
			for (const [name, raidSet] of playerRaids) {
				if (!hasEligibleRaidParticipation(name)) continue;
				const deaths = playerDeathCounts.get(name) ?? 0;
				const raidsAttended = raidSet.size;
				if (raidsAttended === 0) continue;
				const deathRate = deaths / raidsAttended;
				if (deathRate < lowestDeathRate) {
					lowestDeathRate = deathRate;
					bestSurvival = {
						name,
						class: rosterClassMap.get(name) ?? null,
						value: Math.round(deathRate * 10) / 10,
					};
				}
			}

			// TOP PRE-POT: highest pre-pot rate (distinct encounter/player pairs)
			const guidToName = new Map<string, string>();
			const playerEncounterSets = new Map<string, Set<string>>();
			for (const row of encounterPlayerFacts) {
				if (!rosterNames.has(row.playerName)) continue;
				guidToName.set(row.playerGuid, row.playerName);
				const set = playerEncounterSets.get(row.playerGuid) ?? new Set();
				set.add(row.encounterId);
				playerEncounterSets.set(row.playerGuid, set);
			}

			const prePotPairs = new Map<string, Set<string>>();
			for (const row of prePotEventRows) {
				const name = guidToName.get(row.playerGuid);
				if (!name) continue;
				const set = prePotPairs.get(row.playerGuid) ?? new Set();
				set.add(row.encounterId);
				prePotPairs.set(row.playerGuid, set);
			}

			let topPrePot: {
				name: string;
				class: string | null;
				value: number;
			} | null = null;
			let bestRate = 0;
			for (const [guid, prePotSet] of prePotPairs) {
				const totalEncounters = playerEncounterSets.get(guid)?.size ?? 0;
				if (totalEncounters === 0) continue;
				const name = guidToName.get(guid) ?? "Unknown";
				if (!hasEligibleRaidParticipation(name)) continue;
				const rate = (prePotSet.size / totalEncounters) * 100;
				if (rate > bestRate) {
					bestRate = rate;
					topPrePot = {
						name,
						class: rosterClassMap.get(name) ?? null,
						value: Math.round(rate),
					};
				}
			}

			// MOST RESILIENT: lowest avg damage taken per encounter
			const playerDamageTaken = new Map<
				string,
				{ totalDamage: number; encounterCount: number }
			>();
			for (const row of encounterPlayerFacts) {
				if (!rosterNames.has(row.playerName)) continue;
				const existing = playerDamageTaken.get(row.playerName) ?? {
					totalDamage: 0,
					encounterCount: 0,
				};
				existing.encounterCount += 1;
				existing.totalDamage += row.damageTaken;
				playerDamageTaken.set(row.playerName, existing);
			}

			let mostResilient: {
				name: string;
				class: string | null;
				value: number;
			} | null = null;
			let lowestAvgDmg = Number.POSITIVE_INFINITY;
			for (const [name, stats] of playerDamageTaken) {
				if (stats.encounterCount === 0) continue;
				if (!hasEligibleRaidParticipation(name)) continue;
				const avgDmg = stats.totalDamage / stats.encounterCount;
				if (avgDmg < lowestAvgDmg) {
					lowestAvgDmg = avgDmg;
					mostResilient = {
						name,
						class: rosterClassMap.get(name) ?? null,
						value: Math.round(avgDmg),
					};
				}
			}

			// FASTEST KILL: shortest duration among "primary" kills per boss per raid
			// (last kill by encounter order), matching raid-details.tsx boss grouping — not
			// raw min(duration) over every row flagged kill (earlier wipes/pulls can be wrong).
			let fastestKill: { bossName: string; durationMs: number } | null = null;
			const encounterMetaById = new Map<
				string,
				{
					raidId: string;
					bossName: string;
					durationMs: number;
					result: string;
					encounterOrder: number;
				}
			>();
			for (const row of encounterPlayerFacts) {
				if (encounterMetaById.has(row.encounterId)) continue;
				encounterMetaById.set(row.encounterId, {
					raidId: row.raidId,
					bossName: row.bossName,
					durationMs: row.durationMs,
					result: row.result,
					encounterOrder: row.encounterOrder,
				});
			}
			const primaryKillByRaidBoss = new Map<
				string,
				{
					bossName: string;
					durationMs: number;
					encounterOrder: number;
				}
			>();
			for (const enc of encounterMetaById.values()) {
				if (enc.result !== "kill") continue;
				const key = `${enc.raidId}:${enc.bossName}`;
				const prev = primaryKillByRaidBoss.get(key);
				if (!prev || enc.encounterOrder > prev.encounterOrder) {
					primaryKillByRaidBoss.set(key, {
						bossName: enc.bossName,
						durationMs: enc.durationMs,
						encounterOrder: enc.encounterOrder,
					});
				}
			}
			for (const info of primaryKillByRaidBoss.values()) {
				if (!fastestKill || info.durationMs < fastestKill.durationMs) {
					fastestKill = {
						bossName: info.bossName,
						durationMs: info.durationMs,
					};
				}
			}

			return {
				appliedPhase,
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
