import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { fetchArmoryGear } from "@/lib/armory";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { members } from "@/lib/db/schema/members";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { ENCHANT_MAP } from "@/lib/wow-data/enchants";
import { GEM_MAP } from "@/lib/wow-data/gems";
import { fetchItemData } from "@/lib/wow-data/items";

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

			// Resolve all item IDs in parallel
			const itemDataMap = new Map<
				number,
				Awaited<ReturnType<typeof fetchItemData>>
			>();
			const uniqueItemIds = [
				...new Set(armoryResult.gear.map((g) => g.itemId)),
			];
			const itemResults = await Promise.all(
				uniqueItemIds.map((id) => fetchItemData(id)),
			);
			for (const item of itemResults) {
				itemDataMap.set(item.itemId, item);
			}

			// Build gear response with resolved names
			const gear = armoryResult.gear.map((slot) => {
				const item = itemDataMap.get(slot.itemId);
				const isEnchantable = ENCHANTABLE_SLOTS.has(slot.slot);
				const enchant = slot.enchantId
					? (ENCHANT_MAP[slot.enchantId] ??
						`Unknown Enchant (${slot.enchantId})`)
					: null;

				const gems = slot.gemIds
					.filter((id) => id !== 0)
					.map((id) => {
						const gem = GEM_MAP[id];
						return gem
							? { name: gem.name, color: gem.color }
							: {
									name: `Unknown Gem (${id})`,
									color: "prismatic" as const,
								};
					});

				const hasEmptySocket = slot.gemIds.some((id) => id === 0);

				return {
					slot: slot.slot,
					itemId: slot.itemId,
					itemName: item?.name ?? "Unknown Item",
					itemQuality: item?.quality ?? slot.quality,
					itemLevel: item?.itemLevel ?? 0,
					itemIcon: item?.icon ?? "",
					enchant,
					gems,
					isEnchantable,
					hasAllGems: !hasEmptySocket || slot.gemIds.length === 0,
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
