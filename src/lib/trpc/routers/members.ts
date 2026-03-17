import { TRPCError } from "@trpc/server";
import { and, asc, countDistinct, desc, eq, ilike, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
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

			// Find all encounter_players rows for this member in this core
			const playerEncounters = await db
				.select({
					encounterId: encounterPlayers.encounterId,
					playerGuid: encounterPlayers.playerGuid,
					raidId: encounters.raidId,
					raidName: raids.name,
					raidDate: raids.date,
					spec: encounterPlayers.spec,
				})
				.from(encounterPlayers)
				.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
				.innerJoin(raids, eq(encounters.raidId, raids.id))
				.where(
					and(
						eq(encounterPlayers.playerName, member.name),
						eq(raids.coreId, ctx.coreId),
					),
				)
				.orderBy(desc(raids.date));

			if (playerEncounters.length === 0) {
				return { member: { ...member, latestSpec: member.spec }, raids: [] };
			}

			// Group encounters by raid
			const raidEncounterMap = new Map<
				string,
				{
					raidName: string;
					raidDate: Date;
					encounters: { encounterId: string; playerGuid: string }[];
				}
			>();
			for (const pe of playerEncounters) {
				const existing = raidEncounterMap.get(pe.raidId) ?? {
					raidName: pe.raidName,
					raidDate: pe.raidDate,
					encounters: [],
				};
				existing.encounters.push({
					encounterId: pe.encounterId,
					playerGuid: pe.playerGuid,
				});
				raidEncounterMap.set(pe.raidId, existing);
			}

			// Collect all encounter IDs and GUIDs for batch queries
			const allEncounterIds = playerEncounters.map((pe) => pe.encounterId);
			const allGuids = [...new Set(playerEncounters.map((pe) => pe.playerGuid))];

			// Batch query buff_uptimes
			const uptimes = await db
				.select()
				.from(buffUptimes)
				.where(
					and(
						inArray(buffUptimes.encounterId, allEncounterIds),
						inArray(buffUptimes.playerGuid, allGuids),
					),
				);

			const uptimeByEncGuid = new Map(
				uptimes.map((u) => [`${u.encounterId}:${u.playerGuid}`, u]),
			);

			// Batch query consumable_uses
			const consumables = await db
				.select()
				.from(consumableUses)
				.where(
					and(
						inArray(consumableUses.encounterId, allEncounterIds),
						inArray(consumableUses.playerGuid, allGuids),
					),
				);

			// Group consumables by enc:guid
			const consumablesByEncGuid = new Map<string, typeof consumables>();
			for (const c of consumables) {
				const key = `${c.encounterId}:${c.playerGuid}`;
				const existing = consumablesByEncGuid.get(key) ?? [];
				existing.push(c);
				consumablesByEncGuid.set(key, existing);
			}

			// Aggregate per raid
			const raidResults = [...raidEncounterMap.entries()].map(
				([raidId, raidData]) => {
					let flaskTotal = 0;
					let foodTotal = 0;
					let uptimeCount = 0;
					let totalPots = 0;
					let hasPrePot = false;
					let totalEngi = 0;
					const itemMap = new Map<string, { spellName: string; count: number; type: string }>();

					for (const enc of raidData.encounters) {
						const key = `${enc.encounterId}:${enc.playerGuid}`;

						const uptime = uptimeByEncGuid.get(key);
						if (uptime) {
							flaskTotal += uptime.flaskUptimePercent;
							foodTotal += uptime.foodUptimePercent;
							uptimeCount++;
						}

						const cons = consumablesByEncGuid.get(key) ?? [];
						for (const c of cons) {
							if (c.type === "potion" || c.type === "mana_potion") {
								totalPots += c.count;
								if (c.prePot) hasPrePot = true;
							} else if (c.type === "engineering") {
								totalEngi += c.count;
							}
							const existing = itemMap.get(c.spellName);
							if (existing) {
								existing.count += c.count;
							} else {
								itemMap.set(c.spellName, {
									spellName: c.spellName,
									count: c.count,
									type: c.type,
								});
							}
						}
					}

					return {
						raidId,
						raidName: raidData.raidName,
						raidDate: raidData.raidDate,
						flaskUptime: uptimeCount > 0 ? Math.round(flaskTotal / uptimeCount) : null,
						foodUptime: uptimeCount > 0 ? Math.round(foodTotal / uptimeCount) : null,
						totalPots,
						hasPrePot,
						totalEngi,
						consumableItems: [...itemMap.values()],
					};
				},
			);

			// Latest spec from most recent encounter
			const latestSpec = playerEncounters[0]?.spec ?? member.spec;

			return {
				member: { ...member, latestSpec },
				raids: raidResults,
			};
		}),
});
