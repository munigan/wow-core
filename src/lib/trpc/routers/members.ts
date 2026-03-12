import { asc, eq } from "drizzle-orm";
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
});
