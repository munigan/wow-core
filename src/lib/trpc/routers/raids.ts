import { TRPCError } from "@trpc/server";
import {
	and,
	asc,
	count,
	countDistinct,
	desc,
	eq,
	gte,
	inArray,
	isNotNull,
	isNull,
	sql,
	sum,
} from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
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
					page: z.number().int().min(1).optional(),
					perPage: z.number().int().min(1).max(100).optional(),
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

			const page = input?.page ?? 1;
			const perPage = input?.perPage ?? 20;

			const [{ totalCount }] = await db
				.select({ totalCount: count() })
				.from(raids)
				.where(and(...conditions));

			const raidRows = await db
				.select()
				.from(raids)
				.where(and(...conditions))
				.orderBy(desc(raids.date))
				.limit(perPage)
				.offset((page - 1) * perPage);

			if (raidRows.length === 0) return { items: [], totalCount };

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
			const encounterToRaid = new Map(
				encounterRows.map((e) => [e.id, e.raidId]),
			);

			// Aggregate player count per raid (through encounters)
			let playerCountMap = new Map<string, number>();
			const deathCountMap = new Map<string, number>();

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
					[...playersPerRaid.entries()].map(([raidId, guids]) => [
						raidId,
						guids.size,
					]),
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

			const items = raidRows.map((raid) => ({
				...raid,
				bossKills: bossKillMap.get(raid.id) ?? 0,
				playerCount: playerCountMap.get(raid.id) ?? 0,
				deathCount: deathCountMap.get(raid.id) ?? 0,
			}));

			return { items, totalCount };
		}),

	listInstances: protectedProcedure.query(async ({ ctx }) => {
		const rows = await db
			.select({ raidInstance: raids.raidInstance })
			.from(raids)
			.where(and(eq(raids.coreId, ctx.coreId), isNotNull(raids.raidInstance)))
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

	deleteRaid: protectedProcedure
		.input(z.object({ raidId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const deleted = await db
				.delete(raids)
				.where(and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)))
				.returning({ id: raids.id });

			if (deleted.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Raid not found",
				});
			}

			return { id: deleted[0].id };
		}),

	getById: protectedProcedure
		.input(z.object({ raidId: z.string() }))
		.query(async ({ ctx, input }) => {
			const raid = await db
				.select()
				.from(raids)
				.where(and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)))
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
					totalDeaths: 0,
					totalConsumables: 0,
				};
			}

			// Aggregate useful + total damage per encounter (total is null if any row lacks damage_total)
			const damageByEncounter = await db
				.select({
					encounterId: encounterPlayers.encounterId,
					usefulDamage: sum(encounterPlayers.damage),
					totalSum: sum(encounterPlayers.damageTotal),
					nullTotalCount:
						sql<number>`coalesce(sum(case when ${encounterPlayers.damageTotal} is null then 1 else 0 end), 0)::int`.mapWith(
							Number,
						),
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
				damageByEncounter.map((d) => {
					const usefulDamage = Number(d.usefulDamage ?? 0);
					const nullTotalCount = d.nullTotalCount ?? 0;
					const totalDamage =
						nullTotalCount > 0 ? null : Number(d.totalSum ?? 0);
					return [d.encounterId, { usefulDamage, totalDamage }] as const;
				}),
			);
			const deathMap = new Map(
				deathsByEncounter.map((d) => [d.encounterId, d.deathCount]),
			);

			// Count unique players across all encounters
			const [playerCountResult] = await db
				.select({
					uniquePlayers: sql<number>`count(distinct ${encounterPlayers.playerGuid})`,
				})
				.from(encounterPlayers)
				.where(
					inArray(
						encounterPlayers.encounterId,
						encounterRows.map((e) => e.id),
					),
				);

			const encountersWithStats = encounterRows.map((enc) => {
				const sums = damageMap.get(enc.id) ?? {
					usefulDamage: 0,
					totalDamage: 0,
				};
				const usefulDamage = sums.usefulDamage;
				const totalDamage = sums.totalDamage;
				const raidDpsUseful =
					enc.durationMs > 0
						? Math.round((usefulDamage / enc.durationMs) * 1000)
						: 0;
				const raidDpsTotal =
					enc.durationMs > 0 && totalDamage !== null
						? Math.round((totalDamage / enc.durationMs) * 1000)
						: null;

				return {
					...enc,
					usefulDamage,
					totalDamage,
					raidDpsUseful,
					raidDpsTotal,
					deathCount: deathMap.get(enc.id) ?? 0,
				};
			});

			// Total deaths across all encounters
			const totalDeaths = encountersWithStats.reduce(
				(sum, e) => sum + e.deathCount,
				0,
			);

			// Total consumable uses across all encounters
			const encounterIdsForRaid = encounterRows.map((e) => e.id);
			let totalConsumables = 0;
			if (encounterIdsForRaid.length > 0) {
				const [consumableResult] = await db
					.select({ total: sum(consumableUses.count) })
					.from(consumableUses)
					.where(
						and(
							inArray(consumableUses.encounterId, encounterIdsForRaid),
							inArray(consumableUses.type, [
								"potion",
								"mana_potion",
								"engineering",
							]),
						),
					);
				totalConsumables = Number(consumableResult?.total ?? 0);
			}

			return {
				...raid,
				uniquePlayerCount: Number(playerCountResult?.uniquePlayers ?? 0),
				encounters: encountersWithStats,
				totalDeaths,
				totalConsumables,
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

			// Consumable uses
			const consumables = await db
				.select()
				.from(consumableUses)
				.where(eq(consumableUses.encounterId, input.encounterId));

			type ConsumableAgg = {
				totalPots: number;
				hasPrePot: boolean;
				totalEngi: number;
				items: { spellName: string; count: number; type: string }[];
			};
			const consumableMap = new Map<string, ConsumableAgg>();
			for (const c of consumables) {
				const existing = consumableMap.get(c.playerGuid) ?? {
					totalPots: 0,
					hasPrePot: false,
					totalEngi: 0,
					items: [],
				};
				if (c.type === "potion" || c.type === "mana_potion") {
					existing.totalPots += c.count;
					if (c.prePot) existing.hasPrePot = true;
				} else if (c.type === "engineering") {
					existing.totalEngi += c.count;
				}
				existing.items.push({
					spellName: c.spellName,
					count: c.count,
					type: c.type,
				});
				consumableMap.set(c.playerGuid, existing);
			}

			const durationMs = encounter.encounters.durationMs;

			const playersWithStats = players
				.map((p) => {
					const cons = consumableMap.get(p.playerGuid);
					const dpsUseful =
						durationMs > 0 ? Math.round((p.damage / durationMs) * 1000) : 0;
					const damageTotal = p.damageTotal;
					const dpsTotal =
						durationMs > 0 && damageTotal !== null
							? Math.round((damageTotal / durationMs) * 1000)
							: null;
					return {
						...p,
						dps: dpsUseful,
						dpsTotal,
						deathCount: deathCountByPlayer.get(p.playerGuid) ?? 0,
						totalPots: cons?.totalPots ?? 0,
						hasPrePot: cons?.hasPrePot ?? false,
						totalEngi: cons?.totalEngi ?? 0,
						consumableItems: cons?.items ?? [],
					};
				})
				.sort((a, b) => b.dps - a.dps);

			return {
				encounter: encounter.encounters,
				players: playersWithStats,
			};
		}),

	getRaidKillPlayerBreakdownAggregated: protectedProcedure
		.input(z.object({ raidId: z.string() }))
		.query(async ({ ctx, input }) => {
			const raidRow = await db
				.select({ id: raids.id })
				.from(raids)
				.where(and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)))
				.then((rows) => rows[0]);

			if (!raidRow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Raid not found",
				});
			}

			const killEncounterRows = await db
				.select()
				.from(encounters)
				.where(
					and(
						eq(encounters.raidId, input.raidId),
						eq(encounters.result, "kill"),
					),
				)
				.orderBy(asc(encounters.order));

			if (killEncounterRows.length === 0) {
				return { players: [] };
			}

			// One row per boss (latest kill by encounter order), matching raid details UI
			const killByBoss = new Map<string, (typeof killEncounterRows)[number]>();
			for (const enc of killEncounterRows) {
				const prev = killByBoss.get(enc.bossName);
				if (!prev || enc.order > prev.order) {
					killByBoss.set(enc.bossName, enc);
				}
			}
			const killEncounters = [...killByBoss.values()].sort(
				(a, b) => a.order - b.order,
			);

			const encounterIds = killEncounters.map((e) => e.id);

			const legacyEncounterRows = await db
				.selectDistinct({ encounterId: encounterPlayers.encounterId })
				.from(encounterPlayers)
				.where(
					and(
						inArray(encounterPlayers.encounterId, encounterIds),
						isNull(encounterPlayers.damageTotal),
					),
				);
			const legacyEncounterIds = new Set(
				legacyEncounterRows.map((r) => r.encounterId),
			);
			const raidKillHasLegacyTotal = killEncounters.some((e) =>
				legacyEncounterIds.has(e.id),
			);

			const allPlayers = await db
				.select()
				.from(encounterPlayers)
				.where(inArray(encounterPlayers.encounterId, encounterIds));

			const allDeaths = await db
				.select()
				.from(playerDeaths)
				.where(inArray(playerDeaths.encounterId, encounterIds));

			const allConsumables = await db
				.select()
				.from(consumableUses)
				.where(inArray(consumableUses.encounterId, encounterIds));

			type ConsumableAgg = {
				totalPots: number;
				hasPrePot: boolean;
				totalEngi: number;
				items: { spellName: string; count: number; type: string }[];
			};

			type Acc = {
				playerGuid: string;
				playerName: string;
				class: string | null;
				spec: string | null;
				rowId: string;
				dpsSum: number;
				dpsSumTotal: number;
				dpsEncCount: number;
				damage: number;
				damageTotalSum: number;
				damageTaken: number;
				deaths: number;
				totalPots: number;
				totalEngi: number;
				hasPrePot: boolean;
				itemCounts: Map<
					string,
					{ spellName: string; count: number; type: string }
				>;
			};

			const byGuid = new Map<string, Acc>();

			for (const enc of killEncounters) {
				const players = allPlayers.filter((p) => p.encounterId === enc.id);
				const encDeaths = allDeaths.filter((d) => d.encounterId === enc.id);
				const encConsumables = allConsumables.filter(
					(c) => c.encounterId === enc.id,
				);

				const deathCountByPlayer = new Map<string, number>();
				for (const death of encDeaths) {
					deathCountByPlayer.set(
						death.playerGuid,
						(deathCountByPlayer.get(death.playerGuid) ?? 0) + 1,
					);
				}

				const consumableMap = new Map<string, ConsumableAgg>();
				for (const c of encConsumables) {
					const existing = consumableMap.get(c.playerGuid) ?? {
						totalPots: 0,
						hasPrePot: false,
						totalEngi: 0,
						items: [],
					};
					if (c.type === "potion" || c.type === "mana_potion") {
						existing.totalPots += c.count;
						if (c.prePot) existing.hasPrePot = true;
					} else if (c.type === "engineering") {
						existing.totalEngi += c.count;
					}
					existing.items.push({
						spellName: c.spellName,
						count: c.count,
						type: c.type,
					});
					consumableMap.set(c.playerGuid, existing);
				}

				const durationMs = enc.durationMs;

				for (const p of players) {
					const cons = consumableMap.get(p.playerGuid);
					const dps =
						durationMs > 0 ? Math.round((p.damage / durationMs) * 1000) : 0;
					const dpsTotalEnc =
						durationMs > 0 && p.damageTotal !== null
							? Math.round((p.damageTotal / durationMs) * 1000)
							: 0;
					const deathCount = deathCountByPlayer.get(p.playerGuid) ?? 0;

					let acc = byGuid.get(p.playerGuid);
					if (!acc) {
						acc = {
							playerGuid: p.playerGuid,
							playerName: p.playerName,
							class: p.class,
							spec: p.spec,
							rowId: p.id,
							dpsSum: 0,
							dpsSumTotal: 0,
							dpsEncCount: 0,
							damage: 0,
							damageTotalSum: 0,
							damageTaken: 0,
							deaths: 0,
							totalPots: 0,
							totalEngi: 0,
							hasPrePot: false,
							itemCounts: new Map(),
						};
						byGuid.set(p.playerGuid, acc);
					} else {
						acc.playerName = p.playerName;
						acc.class = p.class;
						acc.spec = p.spec;
						acc.rowId = p.id;
					}

					acc.dpsSum += dps;
					acc.dpsSumTotal += dpsTotalEnc;
					acc.dpsEncCount += 1;
					acc.damage += p.damage;
					acc.damageTotalSum += p.damageTotal ?? 0;
					acc.damageTaken += p.damageTaken;
					acc.deaths += deathCount;
					acc.totalPots += cons?.totalPots ?? 0;
					acc.totalEngi += cons?.totalEngi ?? 0;
					acc.hasPrePot = acc.hasPrePot || (cons?.hasPrePot ?? false);

					for (const item of cons?.items ?? []) {
						const key = `${item.type}:${item.spellName}`;
						const prev = acc.itemCounts.get(key);
						if (prev) {
							prev.count += item.count;
						} else {
							acc.itemCounts.set(key, { ...item });
						}
					}
				}
			}

			const playersWithStats = [...byGuid.values()].map((acc) => {
				const avgDps =
					acc.dpsEncCount > 0 ? Math.round(acc.dpsSum / acc.dpsEncCount) : 0;
				const avgDpsTotal =
					!raidKillHasLegacyTotal && acc.dpsEncCount > 0
						? Math.round(acc.dpsSumTotal / acc.dpsEncCount)
						: null;

				return {
					id: acc.rowId,
					playerGuid: acc.playerGuid,
					playerName: acc.playerName,
					class: acc.class,
					spec: acc.spec,
					damage: acc.damage,
					damageTotal: raidKillHasLegacyTotal ? null : acc.damageTotalSum,
					damageTaken: acc.damageTaken,
					dps: avgDps,
					dpsTotal: avgDpsTotal,
					deathCount: acc.deaths,
					totalPots: acc.totalPots,
					hasPrePot: acc.hasPrePot,
					totalEngi: acc.totalEngi,
					consumableItems: [...acc.itemCounts.values()],
				};
			});

			playersWithStats.sort((a, b) => b.dps - a.dps);

			return { players: playersWithStats };
		}),

	getRaidKillPlayerDeaths: protectedProcedure
		.input(
			z.object({
				raidId: z.string(),
				playerGuid: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const raidRow = await db
				.select({ id: raids.id })
				.from(raids)
				.where(and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)))
				.then((rows) => rows[0]);

			if (!raidRow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Raid not found",
				});
			}

			const rows = await db
				.select({
					bossName: encounters.bossName,
					playerName: playerDeaths.playerName,
					timeIntoEncounter: playerDeaths.timeIntoEncounter,
					killingBlow: playerDeaths.killingBlow,
				})
				.from(playerDeaths)
				.innerJoin(encounters, eq(playerDeaths.encounterId, encounters.id))
				.where(
					and(
						eq(encounters.raidId, input.raidId),
						eq(encounters.result, "kill"),
						eq(playerDeaths.playerGuid, input.playerGuid),
					),
				)
				.orderBy(asc(encounters.order), asc(playerDeaths.timeIntoEncounter));

			return rows.map((d) => {
				const kb = d.killingBlow as {
					spellName?: string;
					sourceName?: string;
					amount?: number;
				} | null;
				return {
					bossName: d.bossName,
					playerName: d.playerName,
					timeIntoEncounter: d.timeIntoEncounter,
					killingSpell: kb?.spellName ?? null,
					killedBy: kb?.sourceName ?? null,
				};
			});
		}),

	getEncounterDeaths: protectedProcedure
		.input(z.object({ encounterId: z.string() }))
		.query(async ({ ctx, input }) => {
			// Verify encounter belongs to user's core
			const encounter = await db
				.select({ id: encounters.id })
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

			const deaths = await db
				.select({
					playerName: playerDeaths.playerName,
					timeIntoEncounter: playerDeaths.timeIntoEncounter,
					killingBlow: playerDeaths.killingBlow,
				})
				.from(playerDeaths)
				.where(eq(playerDeaths.encounterId, input.encounterId))
				.orderBy(playerDeaths.timeIntoEncounter);

			return deaths.map((d) => {
				const kb = d.killingBlow as {
					spellName?: string;
					sourceName?: string;
					amount?: number;
				} | null;
				return {
					playerName: d.playerName,
					timeIntoEncounter: d.timeIntoEncounter,
					killingSpell: kb?.spellName ?? null,
					killedBy: kb?.sourceName ?? null,
				};
			});
		}),

	getInstanceAverages: protectedProcedure
		.input(z.object({ raidInstance: z.string() }))
		.query(async ({ ctx, input }) => {
			// Get all raids of this instance for the core
			const instanceRaids = await db
				.select({ id: raids.id, durationMs: raids.durationMs })
				.from(raids)
				.where(
					and(
						eq(raids.coreId, ctx.coreId),
						eq(raids.raidInstance, input.raidInstance),
					),
				);

			const raidCount = instanceRaids.length;
			if (raidCount === 0) {
				return {
					avgDps: 0,
					avgDpsTotal: null,
					avgDurationMs: 0,
					avgDeaths: 0,
					avgConsumables: 0,
					raidCount: 0,
				};
			}

			const raidIds = instanceRaids.map((r) => r.id);

			// All encounters for these raids
			const allEncounters = await db
				.select({
					id: encounters.id,
					raidId: encounters.raidId,
					durationMs: encounters.durationMs,
					result: encounters.result,
				})
				.from(encounters)
				.where(inArray(encounters.raidId, raidIds));

			const killEncounters = allEncounters.filter((e) => e.result === "kill");
			const allEncounterIds = allEncounters.map((e) => e.id);
			const killEncounterIds = killEncounters.map((e) => e.id);

			// Avg DPS (useful): total kill useful damage / total kill duration across all raids
			let avgDps = 0;
			let avgDpsTotal: number | null = null;
			if (killEncounterIds.length > 0) {
				const legacyProbeRows = await db
					.select({ id: encounterPlayers.id })
					.from(encounterPlayers)
					.where(
						and(
							inArray(encounterPlayers.encounterId, killEncounterIds),
							isNull(encounterPlayers.damageTotal),
						),
					)
					.limit(1);
				const killTotalsHaveLegacy = legacyProbeRows.length > 0;

				const [damageResult] = await db
					.select({ totalDamage: sum(encounterPlayers.damage) })
					.from(encounterPlayers)
					.where(inArray(encounterPlayers.encounterId, killEncounterIds));
				const totalUsefulDamage = Number(damageResult?.totalDamage ?? 0);
				const totalDurationMs = killEncounters.reduce(
					(s, e) => s + e.durationMs,
					0,
				);
				avgDps =
					totalDurationMs > 0
						? Math.round((totalUsefulDamage / totalDurationMs) * 1000)
						: 0;

				if (!killTotalsHaveLegacy) {
					const [totalDmgRow] = await db
						.select({ s: sum(encounterPlayers.damageTotal) })
						.from(encounterPlayers)
						.where(inArray(encounterPlayers.encounterId, killEncounterIds));
					const totalAllDamage = Number(totalDmgRow?.s ?? 0);
					avgDpsTotal =
						totalDurationMs > 0
							? Math.round((totalAllDamage / totalDurationMs) * 1000)
							: 0;
				}
			}

			// Avg Duration
			const totalDuration = instanceRaids.reduce(
				(s, r) => s + (r.durationMs ?? 0),
				0,
			);
			const avgDurationMs = Math.round(totalDuration / raidCount);

			// Avg Deaths per raid
			let avgDeaths = 0;
			if (allEncounterIds.length > 0) {
				const [deathResult] = await db
					.select({ total: count() })
					.from(playerDeaths)
					.where(inArray(playerDeaths.encounterId, allEncounterIds));
				avgDeaths = Math.round((deathResult?.total ?? 0) / raidCount);
			}

			// Avg Consumables per raid
			let avgConsumables = 0;
			if (allEncounterIds.length > 0) {
				const [consumableResult] = await db
					.select({ total: count() })
					.from(consumableUses)
					.where(inArray(consumableUses.encounterId, allEncounterIds));
				avgConsumables = Math.round((consumableResult?.total ?? 0) / raidCount);
			}

			return {
				avgDps,
				avgDpsTotal,
				avgDurationMs,
				avgDeaths,
				avgConsumables,
				raidCount,
			};
		}),
});
