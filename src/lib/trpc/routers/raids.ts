import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
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
});
