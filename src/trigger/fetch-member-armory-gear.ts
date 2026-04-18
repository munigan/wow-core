import { logger, schemaTask } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { armoryFetchRuns } from "@/lib/db/schema/armory-fetch-runs";
import { cores } from "@/lib/db/schema/cores";
import { memberArmoryMeta } from "@/lib/db/schema/member-armory-meta";
import { memberGearSlots } from "@/lib/db/schema/member-gear-slots";
import { members } from "@/lib/db/schema/members";
import {
	buildWarmaneProfileUrl,
	computeEnchantGemStatus,
	parseWarmaneArmoryProfileHtml,
} from "@/lib/game/parse-warmane-armory-html";
import {
	fetchWotlkItemTooltip,
	parseItemLevelFromWowheadTooltipHtml,
} from "@/lib/game/wotlk-item-tooltip";

const payloadSchema = z.object({
	memberId: z.string().uuid(),
});

const ARMORY_USER_AGENT =
	"Mozilla/5.0 (compatible; WowRaidTools/1.0; +https://github.com/wow-raid-tools)";

async function resolveItemDetails(itemId: number): Promise<{
	name: string;
	quality: number;
	itemLevel: number | null;
}> {
	try {
		const data = await fetchWotlkItemTooltip(itemId);
		const ilvl = parseItemLevelFromWowheadTooltipHtml(data.tooltip);
		return {
			name: data.name,
			quality: data.quality,
			itemLevel: ilvl,
		};
	} catch {
		return { name: "Unknown item", quality: 1, itemLevel: null };
	}
}

export const fetchMemberArmoryGear = schemaTask({
	id: "fetch-member-armory-gear",
	schema: payloadSchema,
	run: async (payload) => {
		try {
			const [row] = await db
				.select({
					memberName: members.name,
					realm: cores.realm,
				})
				.from(members)
				.innerJoin(cores, eq(members.coreId, cores.id))
				.where(eq(members.id, payload.memberId))
				.limit(1);

			if (!row) {
				throw new Error("Member not found.");
			}

			const url = buildWarmaneProfileUrl(row.memberName, row.realm);
			const res = await fetch(url, {
				headers: { "User-Agent": ARMORY_USER_AGENT },
			});

			const html = await res.text();

			if (
				!res.ok ||
				html.includes("Page not found") ||
				html.includes("does not exist")
			) {
				await db
					.delete(memberGearSlots)
					.where(eq(memberGearSlots.memberId, payload.memberId));
				await db
					.insert(memberArmoryMeta)
					.values({
						memberId: payload.memberId,
						syncedAt: new Date(),
						fetchError: "Character not found on Warmane armory.",
					})
					.onConflictDoUpdate({
						target: memberArmoryMeta.memberId,
						set: {
							syncedAt: new Date(),
							fetchError: "Character not found on Warmane armory.",
						},
					});
				logger.warn("Armory character not found", { url });
				await db
					.delete(armoryFetchRuns)
					.where(eq(armoryFetchRuns.memberId, payload.memberId));
				return { ok: false as const, reason: "not_found" as const };
			}

			const parsedSlots = parseWarmaneArmoryProfileHtml(html);
			if (parsedSlots.length === 0) {
				throw new Error("Could not parse armory item model.");
			}

			const rows: (typeof memberGearSlots.$inferInsert)[] = [];

			for (const slot of parsedSlots) {
				if (!slot.rel) {
					rows.push({
						memberId: payload.memberId,
						sortOrder: slot.sortOrder,
						slotLabel: slot.slotLabel,
						itemId: null,
						itemName: null,
						itemLevel: null,
						quality: null,
						enchantStatus: "na",
						gemStatus: "na",
					});
					continue;
				}

				const { enchantStatus, gemStatus } = computeEnchantGemStatus(
					slot.slotLabel,
					slot.rel,
				);
				const details = await resolveItemDetails(slot.rel.itemId);
				const quality = details.quality ?? slot.qualityFromClass ?? 1;

				rows.push({
					memberId: payload.memberId,
					sortOrder: slot.sortOrder,
					slotLabel: slot.slotLabel,
					itemId: slot.rel.itemId,
					itemName: details.name,
					itemLevel: details.itemLevel,
					quality,
					enchantStatus,
					gemStatus,
				});
			}

			await db.transaction(async (tx) => {
				await tx
					.delete(memberGearSlots)
					.where(eq(memberGearSlots.memberId, payload.memberId));
				await tx.insert(memberGearSlots).values(rows);
				await tx
					.insert(memberArmoryMeta)
					.values({
						memberId: payload.memberId,
						syncedAt: new Date(),
						fetchError: null,
					})
					.onConflictDoUpdate({
						target: memberArmoryMeta.memberId,
						set: {
							syncedAt: new Date(),
							fetchError: null,
						},
					});
			});

			logger.info("Armory gear cached", {
				memberId: payload.memberId,
				slots: rows.filter((r) => r.itemId !== null).length,
			});

			await db
				.delete(armoryFetchRuns)
				.where(eq(armoryFetchRuns.memberId, payload.memberId));

			return { ok: true as const, slotCount: rows.length };
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Armory fetch failed.";
			await db
				.insert(memberArmoryMeta)
				.values({
					memberId: payload.memberId,
					syncedAt: new Date(),
					fetchError: message,
				})
				.onConflictDoUpdate({
					target: memberArmoryMeta.memberId,
					set: {
						syncedAt: new Date(),
						fetchError: message,
					},
				});
			await db
				.delete(armoryFetchRuns)
				.where(eq(armoryFetchRuns.memberId, payload.memberId));
			throw err;
		}
	},
});
