import { and, avg, count, eq, gte, inArray, lt, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
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
});
