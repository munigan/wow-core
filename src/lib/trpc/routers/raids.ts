import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray, sql, sum } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const raidsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select()
			.from(raids)
			.where(eq(raids.coreId, ctx.coreId))
			.orderBy(desc(raids.date));
	}),

	listByCores: protectedProcedure
		.input(z.object({ coreIds: z.array(z.string()) }))
		.query(async ({ input }) => {
			if (input.coreIds.length === 0) return [];
			return db
				.select({
					id: raids.id,
					coreId: raids.coreId,
					name: raids.name,
					date: raids.date,
				})
				.from(raids)
				.where(inArray(raids.coreId, input.coreIds))
				.orderBy(desc(raids.date));
		}),

	getById: protectedProcedure
		.input(z.object({ raidId: z.string() }))
		.query(async ({ ctx, input }) => {
			const raid = await db
				.select()
				.from(raids)
				.where(
					and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)),
				)
				.then((rows) => rows[0]);

			if (!raid) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Raid not found",
				});
			}

			const encounterRows = await db
				.select()
				.from(encounters)
				.where(eq(encounters.raidId, raid.id))
				.orderBy(encounters.order);

			if (encounterRows.length === 0) {
				return {
					...raid,
					uniquePlayerCount: 0,
					encounters: [],
				};
			}

			// Aggregate damage and deaths per encounter in two queries
			const damageByEncounter = await db
				.select({
					encounterId: encounterPlayers.encounterId,
					totalDamage: sum(encounterPlayers.damage),
				})
				.from(encounterPlayers)
				.where(
					inArray(
						encounterPlayers.encounterId,
						encounterRows.map((e) => e.id),
					),
				)
				.groupBy(encounterPlayers.encounterId);

			const deathsByEncounter = await db
				.select({
					encounterId: playerDeaths.encounterId,
					deathCount: count(),
				})
				.from(playerDeaths)
				.where(
					inArray(
						playerDeaths.encounterId,
						encounterRows.map((e) => e.id),
					),
				)
				.groupBy(playerDeaths.encounterId);

			const damageMap = new Map(
				damageByEncounter.map((d) => [d.encounterId, Number(d.totalDamage ?? 0)]),
			);
			const deathMap = new Map(
				deathsByEncounter.map((d) => [d.encounterId, d.deathCount]),
			);

			// Count unique players across all encounters
			const [playerCountResult] = await db
				.select({ uniquePlayers: sql<number>`count(distinct ${encounterPlayers.playerGuid})` })
				.from(encounterPlayers)
				.where(
					inArray(
						encounterPlayers.encounterId,
						encounterRows.map((e) => e.id),
					),
				);

			const encountersWithStats = encounterRows.map((enc) => {
				const totalDamage = damageMap.get(enc.id) ?? 0;
				const raidDps =
					enc.durationMs > 0
						? Math.round((totalDamage / enc.durationMs) * 1000)
						: 0;

				return {
					...enc,
					totalDamage,
					raidDps,
					deathCount: deathMap.get(enc.id) ?? 0,
				};
			});

			return {
				...raid,
				uniquePlayerCount: Number(playerCountResult?.uniquePlayers ?? 0),
				encounters: encountersWithStats,
			};
		}),

	getEncounterDetails: protectedProcedure
		.input(z.object({ encounterId: z.string() }))
		.query(async ({ ctx, input }) => {
			// Verify the encounter belongs to a raid in the user's core
			const encounter = await db
				.select()
				.from(encounters)
				.innerJoin(raids, eq(encounters.raidId, raids.id))
				.where(
					and(
						eq(encounters.id, input.encounterId),
						eq(raids.coreId, ctx.coreId),
					),
				)
				.then((rows) => rows[0]);

			if (!encounter) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Encounter not found",
				});
			}

			const players = await db
				.select()
				.from(encounterPlayers)
				.where(eq(encounterPlayers.encounterId, input.encounterId));

			const deaths = await db
				.select()
				.from(playerDeaths)
				.where(eq(playerDeaths.encounterId, input.encounterId));

			const deathCountByPlayer = new Map<string, number>();
			for (const death of deaths) {
				deathCountByPlayer.set(
					death.playerGuid,
					(deathCountByPlayer.get(death.playerGuid) ?? 0) + 1,
				);
			}

			const durationMs = encounter.encounters.durationMs;

			const playersWithStats = players
				.map((p) => ({
					...p,
					dps:
						durationMs > 0
							? Math.round((p.damage / durationMs) * 1000)
							: 0,
					deathCount: deathCountByPlayer.get(p.playerGuid) ?? 0,
				}))
				.sort((a, b) => b.dps - a.dps);

			return {
				encounter: encounter.encounters,
				players: playersWithStats,
			};
		}),
});
