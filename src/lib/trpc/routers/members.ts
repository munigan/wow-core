import { TRPCError } from "@trpc/server";
import { and, asc, countDistinct, desc, eq, gte, ilike, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const membersRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select()
			.from(members)
			.where(eq(members.coreId, ctx.coreId))
			.orderBy(asc(members.name));
	}),

	listByCore: protectedProcedure
		.input(z.object({ coreId: z.string() }))
		.query(async ({ input }) => {
			return db
				.select({ name: members.name })
				.from(members)
				.where(eq(members.coreId, input.coreId));
		}),

	listByCores: protectedProcedure
		.input(z.object({ coreIds: z.array(z.string()) }))
		.query(async ({ input }) => {
			if (input.coreIds.length === 0) return [];
			return db
				.select({ coreId: members.coreId, name: members.name })
				.from(members)
				.where(inArray(members.coreId, input.coreIds));
		}),

	listWithStats: protectedProcedure
		.input(
			z
				.object({
					class: z.string().optional(),
					search: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(members.coreId, ctx.coreId)];

			if (input?.class) {
				conditions.push(eq(members.class, input.class));
			}
			if (input?.search) {
				conditions.push(ilike(members.name, `%${input.search}%`));
			}

			const memberRows = await db
				.select()
				.from(members)
				.where(and(...conditions))
				.orderBy(asc(members.name));

			if (memberRows.length === 0) return [];

			// Get raid counts per member by joining encounter_players → encounters
			const memberNames = memberRows.map((m) => m.name);

			const raidCounts = await db
				.select({
					playerName: encounterPlayers.playerName,
					raidCount: countDistinct(encounters.raidId),
				})
				.from(encounterPlayers)
				.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
				.innerJoin(raids, eq(encounters.raidId, raids.id))
				.where(
					and(
						inArray(encounterPlayers.playerName, memberNames),
						eq(raids.coreId, ctx.coreId),
					),
				)
				.groupBy(encounterPlayers.playerName);

			const raidCountMap = new Map(
				raidCounts.map((r) => [r.playerName, r.raidCount]),
			);

			// Get latest spec per member (from most recent raid)
			const latestSpecs = await db
				.select({
					playerName: encounterPlayers.playerName,
					spec: encounterPlayers.spec,
				})
				.from(encounterPlayers)
				.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
				.innerJoin(raids, eq(encounters.raidId, raids.id))
				.where(
					and(
						inArray(encounterPlayers.playerName, memberNames),
						eq(raids.coreId, ctx.coreId),
					),
				)
				.orderBy(desc(raids.date))
				.limit(memberNames.length * 2);

			// Take first spec found per member (already ordered by most recent)
			const specMap = new Map<string, string | null>();
			for (const row of latestSpecs) {
				if (!specMap.has(row.playerName)) {
					specMap.set(row.playerName, row.spec);
				}
			}

			return memberRows.map((member) => ({
				...member,
				raidCount: raidCountMap.get(member.name) ?? 0,
				latestSpec: specMap.get(member.name) ?? member.spec,
			}));
		}),

	getById: protectedProcedure
		.input(z.object({ memberId: z.string() }))
		.query(async ({ ctx, input }) => {
			const member = await db
				.select()
				.from(members)
				.where(
					and(eq(members.id, input.memberId), eq(members.coreId, ctx.coreId)),
				)
				.then((rows) => rows[0]);

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Member not found",
				});
			}

			const eightWeeksAgo = new Date();
			eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

			// Find all encounter_players rows for this member in this core
			const playerEncounters = await db
				.select({
					encounterId: encounterPlayers.encounterId,
					playerGuid: encounterPlayers.playerGuid,
					raidId: encounters.raidId,
					raidName: raids.name,
					raidDate: raids.date,
					spec: encounterPlayers.spec,
					damage: encounterPlayers.damage,
					durationMs: encounters.durationMs,
					bossName: encounters.bossName,
				})
				.from(encounterPlayers)
				.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
				.innerJoin(raids, eq(encounters.raidId, raids.id))
				.where(
					and(
						eq(encounterPlayers.playerName, member.name),
						eq(raids.coreId, ctx.coreId),
						gte(raids.date, eightWeeksAgo),
					),
				)
				.orderBy(desc(raids.date));

			if (playerEncounters.length === 0) {
				return {
					member: { ...member, latestSpec: member.spec },
					stats: { avgDps: 0, raidAttendance: 0, prePotRate: 0, totalDeaths: 0 },
					dpsTrend: [],
					heatmapData: [],
				};
			}

			// Collect all encounter IDs and GUIDs for batch queries
			const allEncounterIds = playerEncounters.map((pe) => pe.encounterId);
			const allGuids = [...new Set(playerEncounters.map((pe) => pe.playerGuid))];

			const [uptimes, consumables, deaths] = await Promise.all([
				db.select().from(buffUptimes).where(and(inArray(buffUptimes.encounterId, allEncounterIds), inArray(buffUptimes.playerGuid, allGuids))),
				db.select().from(consumableUses).where(and(inArray(consumableUses.encounterId, allEncounterIds), inArray(consumableUses.playerGuid, allGuids))),
				db.select().from(playerDeaths).where(and(inArray(playerDeaths.encounterId, allEncounterIds), inArray(playerDeaths.playerGuid, allGuids))),
			]);

			const uptimeByEncGuid = new Map(
				uptimes.map((u) => [`${u.encounterId}:${u.playerGuid}`, u]),
			);

			// Group consumables by enc:guid
			const consumablesByEncGuid = new Map<string, typeof consumables>();
			for (const c of consumables) {
				const key = `${c.encounterId}:${c.playerGuid}`;
				const existing = consumablesByEncGuid.get(key) ?? [];
				existing.push(c);
				consumablesByEncGuid.set(key, existing);
			}

			// Stat card aggregates
			const totalEncounters = playerEncounters.length;
			const totalDps = totalEncounters > 0
				? Math.round(
						playerEncounters.reduce((sum, pe) => {
							const dps = pe.durationMs > 0 ? (pe.damage / pe.durationMs) * 1000 : 0;
							return sum + dps;
						}, 0) / totalEncounters,
					)
				: 0;

			const uniqueRaidIds = new Set(playerEncounters.map((pe) => pe.raidId));
			const raidAttendance = uniqueRaidIds.size;

			const encounterIdsWithPrePot = new Set<string>();
			for (const c of consumables) {
				if (c.prePot) {
					encounterIdsWithPrePot.add(c.encounterId);
				}
			}
			const prePotRate = totalEncounters > 0
				? Math.round((encounterIdsWithPrePot.size / totalEncounters) * 100)
				: 0;

			const totalDeaths = deaths.length;

			// DPS trend data
			const dpsByDate = new Map<string, { totalDps: number; count: number }>();
			for (const pe of playerEncounters) {
				const dateKey = new Date(pe.raidDate).toISOString().split("T")[0];
				const entry = dpsByDate.get(dateKey) ?? { totalDps: 0, count: 0 };
				const dps = pe.durationMs > 0 ? (pe.damage / pe.durationMs) * 1000 : 0;
				entry.totalDps += dps;
				entry.count++;
				dpsByDate.set(dateKey, entry);
			}

			const dpsTrend = [...dpsByDate.entries()]
				.map(([date, { totalDps: total, count }]) => ({
					date,
					avgDps: Math.round(total / count),
					encounters: count,
				}))
				.sort((a, b) => a.date.localeCompare(b.date));

			// Heatmap data
			const encountersByDate = new Map<string, { encounters: { encounterId: string; playerGuid: string; bossName: string }[] }>();
			for (const pe of playerEncounters) {
				const dateKey = new Date(pe.raidDate).toISOString().split("T")[0];
				const entry = encountersByDate.get(dateKey) ?? { encounters: [] };
				entry.encounters.push({ encounterId: pe.encounterId, playerGuid: pe.playerGuid, bossName: pe.bossName });
				encountersByDate.set(dateKey, entry);
			}

			const heatmapData = [...encountersByDate.entries()]
				.map(([date, { encounters: encs }]) => {
					let flaskTotal = 0;
					let foodTotal = 0;
					let uptimeCount = 0;
					let encountersWithConsumable = 0;
					const consumablesByBoss: Record<string, { spellName: string; count: number; type: string; isPrePot: boolean }[]> = {};

					for (const enc of encs) {
						const key = `${enc.encounterId}:${enc.playerGuid}`;
						const uptime = uptimeByEncGuid.get(key);
						if (uptime) {
							flaskTotal += uptime.flaskUptimePercent;
							foodTotal += uptime.foodUptimePercent;
							uptimeCount++;
						}
						const cons = consumablesByEncGuid.get(key) ?? [];
						if (cons.length > 0) encountersWithConsumable++;
						if (!consumablesByBoss[enc.bossName]) consumablesByBoss[enc.bossName] = [];
						for (const c of cons) {
							consumablesByBoss[enc.bossName].push({ spellName: c.spellName, count: c.count, type: c.type, isPrePot: c.prePot });
						}
					}

					return {
						date,
						encounterCount: encs.length,
						flaskUptime: uptimeCount > 0 ? Math.round(flaskTotal / uptimeCount) : null,
						foodUptime: uptimeCount > 0 ? Math.round(foodTotal / uptimeCount) : null,
						consumableCoverage: { covered: encountersWithConsumable, total: encs.length },
						consumablesByBoss,
					};
				})
				.sort((a, b) => b.date.localeCompare(a.date));

			// Latest spec from most recent encounter
			const latestSpec = playerEncounters[0]?.spec ?? member.spec;

			return {
				member: { ...member, latestSpec },
				stats: { avgDps: totalDps, raidAttendance, prePotRate, totalDeaths },
				dpsTrend,
				heatmapData,
			};
		}),
});
