import { tasks } from "@trigger.dev/sdk";
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { wotlkItems } from "@/lib/db/schema/wotlk-items";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import type { fetchWarmaneItemData } from "@/trigger/fetch-warmane-item-data";

export const itemsRouter = createTRPCRouter({
	/** Read cached tooltip rows (if any) for the given item ids. */
	getCachedByIds: protectedProcedure
		.input(
			z.object({
				itemIds: z.array(z.number().int().positive()).max(200),
			}),
		)
		.query(async ({ input }) => {
			if (input.itemIds.length === 0) {
				return [];
			}
			return db.query.wotlkItems.findMany({
				where: inArray(wotlkItems.itemId, input.itemIds),
			});
		}),

	/**
	 * Enqueue a Trigger.dev job to refresh cached tooltip data for an item.
	 * Realm is taken from the active core (Warmane realm name).
	 */
	enqueueWarmaneItemFetch: protectedProcedure
		.input(z.object({ itemId: z.number().int().positive() }))
		.mutation(async ({ ctx, input }) => {
			const core = await db.query.cores.findFirst({
				columns: { realm: true },
				where: eq(cores.id, ctx.coreId),
			});

			if (!core) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Core not found." });
			}

			const handle = await tasks.trigger<typeof fetchWarmaneItemData>(
				"fetch-warmane-item-data",
				{
					itemId: input.itemId,
					realm: core.realm,
				},
			);

			return { runId: handle.id };
		}),
});
