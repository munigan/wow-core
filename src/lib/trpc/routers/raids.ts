import { TRPCError } from "@trpc/server";
import { and, count, countDistinct, desc, eq, gte, inArray, isNotNull, sql, sum } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const raidsRouter = createTRPCRouter({
	list: protectedProcedure
		.input(
			z
				.object({
					instance: z.string().optional(),
					dateRange: z.enum(["7d", "30d", "90d", "all"]).optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(raids.coreId, ctx.coreId)];

			if (input?.instance) {
				conditions.push(eq(raids.raidInstance, input.instance));
			}

			if (input?.dateRange && input.dateRange !== "all") {
				const days = { "7d": 7, "30d": 30, "90d": 90 }[input.dateRange];
				const cutoff = new Date();
				cutoff.setDate(cutoff.getDate() - days);
				conditions.push(gte(raids.date, cutoff));
			}

			const raidRows = await db
				.select()
				.from(raids)
				.where(and(...conditions))
				.orderBy(desc(raids.date));

			if (raidRows.length === 0) return [];

			const raidIds = raidRows.map((r) => r.id);

			// Aggregate boss kills per raid
			const bossKills = await db
				.select({
					raidId: encounters.raidId,
					bossKills: countDistinct(encounters.bossName),
				})
				.from(encounters)
				.where(
					and(
						inArray(encounters.raidId, raidIds),
						eq(encounters.result, "kill"),
					),
				)
				.groupBy(encounters.raidId);

			// Get all encounter IDs for these raids
			const encounterRows = await db
				.select({ id: encounters.id, raidId: encounters.raidId })
				.from(encounters)
				.where(inArray(encounters.raidId, raidIds));

			const encounterIds = encounterRows.map((e) => e.id);
			const encounterToRaid = new Map(encounterRows.map((e) => [e.id, e.raidId]));

			// Aggregate player count per raid (through encounters)
			let playerCountMap = new Map<string, number>();
			let deathCountMap = new Map<string, number>();

			if (encounterIds.length > 0) {
				const playerCounts = await db
					.select({
						encounterId: encounterPlayers.encounterId,
						playerGuid: encounterPlayers.playerGuid,
					})
					.from(encounterPlayers)
					.where(inArray(encounterPlayers.encounterId, encounterIds));

				// Count distinct players per raid
				const playersPerRaid = new Map<string, Set<string>>();
				for (const row of playerCounts) {
					const raidId = encounterToRaid.get(row.encounterId);
					if (!raidId) continue;
					const existing = playersPerRaid.get(raidId) ?? new Set();
					existing.add(row.playerGuid);
					playersPerRaid.set(raidId, existing);
				}
				playerCountMap = new Map(
					[...playersPerRaid.entries()].map(([raidId, guids]) => [raidId, guids.size]),
				);

				// Aggregate deaths per raid
				const deathCounts = await db
					.select({
						encounterId: playerDeaths.encounterId,
						deathCount: count(),
					})
					.from(playerDeaths)
					.where(inArray(playerDeaths.encounterId, encounterIds))
					.groupBy(playerDeaths.encounterId);

				for (const row of deathCounts) {
					const raidId = encounterToRaid.get(row.encounterId);
					if (!raidId) continue;
					deathCountMap.set(
						raidId,
						(deathCountMap.get(raidId) ?? 0) + row.deathCount,
					);
				}
			}

			const bossKillMap = new Map(
				bossKills.map((b) => [b.raidId, b.bossKills]),
			);

			return raidRows.map((raid) => ({
				...raid,
				bossKills: bossKillMap.get(raid.id) ?? 0,
				playerCount: playerCountMap.get(raid.id) ?? 0,
				deathCount: deathCountMap.get(raid.id) ?? 0,
			}));
		}),

	listInstances: protectedProcedure.query(async ({ ctx }) => {
		const rows = await db
			.select({ raidInstance: raids.raidInstance })
			.from(raids)
			.where(
				and(eq(raids.coreId, ctx.coreId), isNotNull(raids.raidInstance)),
			)
			.groupBy(raids.raidInstance);

		return rows
			.map((r) => r.raidInstance)
			.filter((v): v is string => v !== null);
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

			// Buff uptimes
			const uptimes = await db
				.select()
				.from(buffUptimes)
				.where(eq(buffUptimes.encounterId, input.encounterId));

			const uptimeMap = new Map(
				uptimes.map((u) => [u.playerGuid, u]),
			);

			// Consumable uses
			const consumables = await db
				.select()
				.from(consumableUses)
				.where(eq(consumableUses.encounterId, input.encounterId));

			const consumableMap = new Map<
				string,
				{ totalPots: number; hasPrePot: boolean; totalEngi: number }
			>();
			for (const c of consumables) {
				const existing = consumableMap.get(c.playerGuid) ?? {
					totalPots: 0,
					hasPrePot: false,
					totalEngi: 0,
				};
				if (c.type === "potion" || c.type === "mana_potion") {
					existing.totalPots += c.count;
					if (c.prePot) existing.hasPrePot = true;
				} else if (c.type === "engineering") {
					existing.totalEngi += c.count;
				}
				consumableMap.set(c.playerGuid, existing);
			}

			const durationMs = encounter.encounters.durationMs;

			const playersWithStats = players
				.map((p) => {
					const uptime = uptimeMap.get(p.playerGuid);
					const cons = consumableMap.get(p.playerGuid);
					return {
						...p,
						dps:
							durationMs > 0
								? Math.round((p.damage / durationMs) * 1000)
								: 0,
						deathCount: deathCountByPlayer.get(p.playerGuid) ?? 0,
						flaskUptime: uptime?.flaskUptimePercent ?? null,
						foodUptime: uptime?.foodUptimePercent ?? null,
						totalPots: cons?.totalPots ?? 0,
						hasPrePot: cons?.hasPrePot ?? false,
						totalEngi: cons?.totalEngi ?? 0,
					};
				})
				.sort((a, b) => b.dps - a.dps);

			return {
				encounter: encounter.encounters,
				players: playersWithStats,
			};
		}),
});
