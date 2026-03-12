import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
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
});
