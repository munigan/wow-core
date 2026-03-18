import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { fetchArmoryGear } from "@/lib/armory";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { members } from "@/lib/db/schema/members";
import { QUALITY_NAME_TO_NUMBER } from "@/lib/wow-data/constants";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const ENCHANTABLE_SLOTS = new Set([
	"Head",
	"Shoulders",
	"Back",
	"Chest",
	"Wrist",
	"Hands",
	"Legs",
	"Feet",
	"Main Hand",
	"Off Hand",
	"Ring 1",
	"Ring 2",
]);

export const gearRouter = createTRPCRouter({
	getByMember: protectedProcedure
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

			const core = await db
				.select({ realm: cores.realm })
				.from(cores)
				.where(eq(cores.id, ctx.coreId))
				.then((rows) => rows[0]);

			if (!core) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Core not found",
				});
			}

			const armoryResult = await fetchArmoryGear(member.name, core.realm);

			if (!armoryResult.success) {
				return {
					member: {
						id: member.id,
						name: member.name,
						class: member.class,
					},
					gear: [],
					professions: [],
					notes: [],
					error: armoryResult.error,
				};
			}

			// Build gear response — data is already resolved by crawl4ai
			const gear = armoryResult.gear.map((slot) => {
				const isEnchantable = ENCHANTABLE_SLOTS.has(slot.slot);
				const qualityNumber =
					QUALITY_NAME_TO_NUMBER[slot.quality.toLowerCase()] ?? 0;

				return {
					slot: slot.slot,
					itemId: slot.itemId,
					itemName: slot.itemName,
					itemLevel: slot.itemLevel,
					itemQuality: qualityNumber,
					enchant: slot.enchant,
					gems: slot.gems.map((name) => ({ name })),
					isEnchantable,
					hasAllGems: slot.gems.length >= slot.totalSockets,
				};
			});

			// Generate actionable notes
			const notes: {
				severity: "error" | "warning" | "info";
				message: string;
			}[] = [];
			for (const slot of gear) {
				if (slot.isEnchantable && !slot.enchant) {
					notes.push({
						severity: "error",
						message: `Missing enchant on ${slot.slot} (${slot.itemName})`,
					});
				}
				if (!slot.hasAllGems) {
					notes.push({
						severity: "warning",
						message: `Empty gem socket in ${slot.slot} (${slot.itemName})`,
					});
				}
			}

			return {
				member: {
					id: member.id,
					name: member.name,
					class: member.class,
				},
				gear,
				professions: armoryResult.professions,
				notes,
				error: null,
			};
		}),
});
