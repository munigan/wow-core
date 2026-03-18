import { and, avg, count, eq, gte, inArray, lt, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const getTimeWindows = () => {
	const now = new Date();
	const currentStart = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);
	const prevStart = new Date(now.getTime() - 112 * 24 * 60 * 60 * 1000);
	return { now, currentStart, prevStart };
};

export const overviewRouter = createTRPCRouter({
	getMetrics: protectedProcedure.query(async ({ ctx }) => {
		const { now, currentStart, prevStart } = getTimeWindows();

		const computePeriodMetrics = async (start: Date, end: Date) => {
			// Total raids in period
			const [{ totalRaids }] = await db
				.select({ totalRaids: count() })
				.from(raids)
				.where(and(eq(raids.coreId, ctx.coreId), gte(raids.date, start), lt(raids.date, end)));

			if (totalRaids === 0) {
				return {
					totalRaids: 0,
					avgRaidDps: 0,
					avgDurationMs: 0,
					avgDeathsPerRaid: 0,
					consumableScore: 0,
				};
			}

			// Raids in period
			const periodRaids = await db
				.select({ id: raids.id, durationMs: raids.durationMs })
				.from(raids)
				.where(and(eq(raids.coreId, ctx.coreId), gte(raids.date, start), lt(raids.date, end)));

			const raidIds = periodRaids.map((r) => r.id);

			// Avg duration (excluding nulls)
			const validDurations = periodRaids
				.map((r) => r.durationMs)
				.filter((d): d is number => d !== null);
			const avgDurationMs =
				validDurations.length > 0
					? Math.round(validDurations.reduce((s, d) => s + d, 0) / validDurations.length)
					: 0;

			// Kill encounters for this period
			const killEncounters = await db
				.select({ id: encounters.id, durationMs: encounters.durationMs })
				.from(encounters)
				.where(and(inArray(encounters.raidId, raidIds), eq(encounters.result, "kill")));

			// avgRaidDps: sum damage / sum duration * 1000 for kill encounters
			let avgRaidDps = 0;
			if (killEncounters.length > 0) {
				const killEncounterIds = killEncounters.map((e) => e.id);
				const [damageResult] = await db
					.select({ totalDamage: sum(encounterPlayers.damage) })
					.from(encounterPlayers)
					.where(inArray(encounterPlayers.encounterId, killEncounterIds));
				const totalDamage = Number(damageResult?.totalDamage ?? 0);
				const totalDurationMs = killEncounters.reduce((s, e) => s + e.durationMs, 0);
				avgRaidDps =
					totalDurationMs > 0 ? Math.round((totalDamage / totalDurationMs) * 1000) : 0;
			}

			// All encounter ids for this period (for deaths and consumables)
			const allEncounters = await db
				.select({ id: encounters.id })
				.from(encounters)
				.where(inArray(encounters.raidId, raidIds));

			const allEncounterIds = allEncounters.map((e) => e.id);

			// Avg deaths per raid
			let avgDeathsPerRaid = 0;
			if (allEncounterIds.length > 0) {
				const [deathResult] = await db
					.select({ total: count() })
					.from(playerDeaths)
					.where(inArray(playerDeaths.encounterId, allEncounterIds));
				avgDeathsPerRaid = totalRaids > 0 ? (deathResult?.total ?? 0) / totalRaids : 0;
			}

			// Consumable score: (avg flaskUptimePercent + avg foodUptimePercent + prePotRate) / 3
			let consumableScore = 0;
			if (allEncounterIds.length > 0) {
				const [uptimeResult] = await db
					.select({
						avgFlask: avg(buffUptimes.flaskUptimePercent),
						avgFood: avg(buffUptimes.foodUptimePercent),
					})
					.from(buffUptimes)
					.where(inArray(buffUptimes.encounterId, allEncounterIds));

				// prePotRate: distinct (encounterId, playerGuid) pairs with prePot=true / total distinct pairs
				const [prePotResult] = await db
					.select({
						prePotPairs: sql<number>`count(distinct (${consumableUses.encounterId}, ${consumableUses.playerGuid})) filter (where ${consumableUses.prePot} = true)`,
					})
					.from(consumableUses)
					.where(inArray(consumableUses.encounterId, allEncounterIds));

				const [totalPairsResult] = await db
					.select({
						totalPairs: sql<number>`count(distinct (${encounterPlayers.encounterId}, ${encounterPlayers.playerGuid}))`,
					})
					.from(encounterPlayers)
					.where(inArray(encounterPlayers.encounterId, allEncounterIds));

				const avgFlask = Number(uptimeResult?.avgFlask ?? 0);
				const avgFood = Number(uptimeResult?.avgFood ?? 0);
				const prePotPairs = Number(prePotResult?.prePotPairs ?? 0);
				const totalPairs = Number(totalPairsResult?.totalPairs ?? 0);
				const prePotRate = totalPairs > 0 ? (prePotPairs / totalPairs) * 100 : 0;
				consumableScore = (avgFlask + avgFood + prePotRate) / 3;
			}

			return {
				totalRaids,
				avgRaidDps,
				avgDurationMs,
				avgDeathsPerRaid,
				consumableScore,
			};
		};

		const [current, previous] = await Promise.all([
			computePeriodMetrics(currentStart, now),
			computePeriodMetrics(prevStart, currentStart),
		]);

		return { current, previous };
	}),

	getAttendance: protectedProcedure.query(async ({ ctx }) => {
		const { now, currentStart } = getTimeWindows();

		// All raids in 8-week window
		const periodRaids = await db
			.select({ id: raids.id, date: raids.date })
			.from(raids)
			.where(and(eq(raids.coreId, ctx.coreId), gte(raids.date, currentStart)));

		const totalRaids = periodRaids.length;
		const raidIds = periodRaids.map((r) => r.id);

		const startDate = currentStart;
		const endDate = now;

		// All roster members for this core
		const rosterMembers = await db
			.select({
				id: members.id,
				name: members.name,
				class: members.class,
				spec: members.spec,
			})
			.from(members)
			.where(eq(members.coreId, ctx.coreId));

		if (totalRaids === 0 || rosterMembers.length === 0) {
			return {
				totalRaids,
				startDate,
				endDate,
				members: rosterMembers.map((m) => ({
					memberId: m.id,
					name: m.name,
					class: m.class,
					spec: m.spec,
					raidsAttended: 0,
					attendanceRate: 0,
					lastSeenDate: null as Date | null,
				})),
			};
		}

		// Join encounterPlayers -> encounters -> raids to get distinct raidIds per playerName
		const attendanceRows = await db
			.select({
				playerName: encounterPlayers.playerName,
				raidId: encounters.raidId,
				raidDate: raids.date,
			})
			.from(encounterPlayers)
			.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
			.innerJoin(raids, eq(encounters.raidId, raids.id))
			.where(inArray(encounters.raidId, raidIds));

		// Aggregate per playerName: distinct raidIds and max date
		const attendanceByName = new Map<string, { raidIds: Set<string>; lastSeenDate: Date }>();
		for (const row of attendanceRows) {
			const existing = attendanceByName.get(row.playerName) ?? {
				raidIds: new Set<string>(),
				lastSeenDate: row.raidDate,
			};
			existing.raidIds.add(row.raidId);
			if (row.raidDate > existing.lastSeenDate) {
				existing.lastSeenDate = row.raidDate;
			}
			attendanceByName.set(row.playerName, existing);
		}

		const memberStats = rosterMembers
			.map((m) => {
				const att = attendanceByName.get(m.name);
				const raidsAttended = att?.raidIds.size ?? 0;
				const attendanceRate = totalRaids > 0 ? (raidsAttended / totalRaids) * 100 : 0;
				return {
					memberId: m.id,
					name: m.name,
					class: m.class,
					spec: m.spec,
					raidsAttended,
					attendanceRate,
					lastSeenDate: att?.lastSeenDate ?? null,
				};
			})
			.sort((a, b) => b.attendanceRate - a.attendanceRate);

		return { totalRaids, startDate, endDate, members: memberStats };
	}),

	getConsumableCompliance: protectedProcedure.query(async ({ ctx }) => {
		const { currentStart } = getTimeWindows();

		// Raids in window
		const periodRaids = await db
			.select({ id: raids.id, date: raids.date, name: raids.name })
			.from(raids)
			.where(and(eq(raids.coreId, ctx.coreId), gte(raids.date, currentStart)));

		if (periodRaids.length === 0) {
			return { byPlayer: [], byRaid: [] };
		}

		const raidIds = periodRaids.map((r) => r.id);

		// All encounters for these raids
		const encounterRows = await db
			.select({ id: encounters.id, raidId: encounters.raidId })
			.from(encounters)
			.where(inArray(encounters.raidId, raidIds));

		const encounterIds = encounterRows.map((e) => e.id);
		if (encounterIds.length === 0) {
			return { byPlayer: [], byRaid: [] };
		}

		const encounterToRaid = new Map(encounterRows.map((e) => [e.id, e.raidId]));
		const raidDateMap = new Map(periodRaids.map((r) => [r.id, r.date]));
		const raidNameMap = new Map(periodRaids.map((r) => [r.id, r.name]));

		// Roster members for this core
		const rosterMembers = await db
			.select({ id: members.id, name: members.name, class: members.class, spec: members.spec })
			.from(members)
			.where(eq(members.coreId, ctx.coreId));

		// Buff uptimes per (encounterId, playerGuid)
		const uptimeRows = await db
			.select({
				encounterId: buffUptimes.encounterId,
				playerGuid: buffUptimes.playerGuid,
				flaskUptimePercent: buffUptimes.flaskUptimePercent,
				foodUptimePercent: buffUptimes.foodUptimePercent,
			})
			.from(buffUptimes)
			.where(inArray(buffUptimes.encounterId, encounterIds));

		// Get encounterPlayers to map playerGuid -> playerName
		const epRows = await db
			.select({
				encounterId: encounterPlayers.encounterId,
				playerGuid: encounterPlayers.playerGuid,
				playerName: encounterPlayers.playerName,
			})
			.from(encounterPlayers)
			.where(inArray(encounterPlayers.encounterId, encounterIds));

		const guidToName = new Map<string, string>();
		for (const ep of epRows) {
			if (!guidToName.has(ep.playerGuid)) {
				guidToName.set(ep.playerGuid, ep.playerName);
			}
		}

		// Consumable uses with prePot per (encounterId, playerGuid)
		const consumableRows = await db
			.select({
				encounterId: consumableUses.encounterId,
				playerGuid: consumableUses.playerGuid,
				prePot: consumableUses.prePot,
			})
			.from(consumableUses)
			.where(inArray(consumableUses.encounterId, encounterIds));

		// --- byPlayer aggregation ---
		type PlayerAgg = {
			flaskValues: number[];
			foodValues: number[];
			prePotPairs: Set<string>;
			totalPairs: Set<string>;
		};
		const playerAgg = new Map<string, PlayerAgg>();

		for (const row of uptimeRows) {
			const name = guidToName.get(row.playerGuid) ?? row.playerGuid;
			const existing = playerAgg.get(name) ?? {
				flaskValues: [],
				foodValues: [],
				prePotPairs: new Set(),
				totalPairs: new Set(),
			};
			existing.flaskValues.push(row.flaskUptimePercent);
			existing.foodValues.push(row.foodUptimePercent);
			playerAgg.set(name, existing);
		}

		for (const row of epRows) {
			const name = guidToName.get(row.playerGuid) ?? row.playerGuid;
			const existing = playerAgg.get(name) ?? {
				flaskValues: [],
				foodValues: [],
				prePotPairs: new Set(),
				totalPairs: new Set(),
			};
			existing.totalPairs.add(`${row.encounterId}:${row.playerGuid}`);
			playerAgg.set(name, existing);
		}

		for (const row of consumableRows) {
			if (row.prePot) {
				const name = guidToName.get(row.playerGuid) ?? row.playerGuid;
				const existing = playerAgg.get(name);
				if (existing) {
					existing.prePotPairs.add(`${row.encounterId}:${row.playerGuid}`);
				}
			}
		}

		const rosterNameSet = new Set(rosterMembers.map((m) => m.name));

		const byPlayer = [...playerAgg.entries()]
			.filter(([name]) => rosterNameSet.has(name))
			.map(([name, agg]) => {
				const avgFlask =
					agg.flaskValues.length > 0
						? agg.flaskValues.reduce((s, v) => s + v, 0) / agg.flaskValues.length
						: 0;
				const avgFood =
					agg.foodValues.length > 0
						? agg.foodValues.reduce((s, v) => s + v, 0) / agg.foodValues.length
						: 0;
				const prePotRate =
					agg.totalPairs.size > 0
						? (agg.prePotPairs.size / agg.totalPairs.size) * 100
						: 0;
				const overallCompliance = (avgFlask + avgFood + prePotRate) / 3;
				const member = rosterMembers.find((m) => m.name === name);
				return {
					memberId: member?.id ?? null,
					name,
					class: member?.class ?? null,
					spec: member?.spec ?? null,
					avgFlaskUptime: avgFlask,
					avgFoodUptime: avgFood,
					prePotRate,
					overallCompliance,
				};
			})
			.sort((a, b) => b.overallCompliance - a.overallCompliance);

		// --- byRaid aggregation ---
		type RaidAgg = {
			flaskValues: number[];
			foodValues: number[];
			prePotPairs: Set<string>;
			totalPairs: Set<string>;
		};
		const raidAgg = new Map<string, RaidAgg>();

		for (const row of uptimeRows) {
			const raidId = encounterToRaid.get(row.encounterId);
			if (!raidId) continue;
			const existing = raidAgg.get(raidId) ?? {
				flaskValues: [],
				foodValues: [],
				prePotPairs: new Set(),
				totalPairs: new Set(),
			};
			existing.flaskValues.push(row.flaskUptimePercent);
			existing.foodValues.push(row.foodUptimePercent);
			raidAgg.set(raidId, existing);
		}

		for (const row of epRows) {
			const raidId = encounterToRaid.get(row.encounterId);
			if (!raidId) continue;
			const existing = raidAgg.get(raidId) ?? {
				flaskValues: [],
				foodValues: [],
				prePotPairs: new Set(),
				totalPairs: new Set(),
			};
			existing.totalPairs.add(`${row.encounterId}:${row.playerGuid}`);
			raidAgg.set(raidId, existing);
		}

		for (const row of consumableRows) {
			if (row.prePot) {
				const raidId = encounterToRaid.get(row.encounterId);
				if (!raidId) continue;
				const existing = raidAgg.get(raidId);
				if (existing) {
					existing.prePotPairs.add(`${row.encounterId}:${row.playerGuid}`);
				}
			}
		}

		const byRaid = [...raidAgg.entries()]
			.map(([raidId, agg]) => {
				const avgFlask =
					agg.flaskValues.length > 0
						? agg.flaskValues.reduce((s, v) => s + v, 0) / agg.flaskValues.length
						: 0;
				const avgFood =
					agg.foodValues.length > 0
						? agg.foodValues.reduce((s, v) => s + v, 0) / agg.foodValues.length
						: 0;
				const prePotRate =
					agg.totalPairs.size > 0
						? (agg.prePotPairs.size / agg.totalPairs.size) * 100
						: 0;
				return {
					raidId,
					raidName: raidNameMap.get(raidId) ?? null,
					date: raidDateMap.get(raidId) ?? null,
					avgFlaskUptime: avgFlask,
					avgFoodUptime: avgFood,
					avgPrePotRate: prePotRate,
				};
			})
			.sort((a, b) => {
				if (!a.date || !b.date) return 0;
				return a.date.getTime() - b.date.getTime();
			});

		return { byPlayer, byRaid };
	}),
});
