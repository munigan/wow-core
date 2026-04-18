import { logger, schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "@/lib/db";
import { wotlkItems } from "@/lib/db/schema/wotlk-items";
import { fetchWotlkItemTooltip } from "@/lib/game/wotlk-item-tooltip";

const fetchWarmaneItemDataPayloadSchema = z.object({
	itemId: z.number().int().positive(),
	realm: z.string().min(1),
});

/**
 * Background job: fetch WotLK item tooltip (Wowhead) and persist for loot-council / queries.
 * `realm` is the Warmane realm string (`cores.realm`) for provenance.
 */
export const fetchWarmaneItemData = schemaTask({
	id: "fetch-warmane-item-data",
	schema: fetchWarmaneItemDataPayloadSchema,
	run: async (payload) => {
		const data = await fetchWotlkItemTooltip(payload.itemId);

		await db
			.insert(wotlkItems)
			.values({
				itemId: payload.itemId,
				name: data.name,
				quality: data.quality,
				icon: data.icon,
				tooltipHtml: data.tooltip,
				fetchedForRealm: payload.realm,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: wotlkItems.itemId,
				set: {
					name: data.name,
					quality: data.quality,
					icon: data.icon,
					tooltipHtml: data.tooltip,
					fetchedForRealm: payload.realm,
					updatedAt: new Date(),
				},
			});

		logger.info("Cached WotLK item row", {
			itemId: payload.itemId,
			realm: payload.realm,
		});

		return {
			ok: true as const,
			itemId: payload.itemId,
			realm: payload.realm,
			name: data.name,
		};
	},
});
