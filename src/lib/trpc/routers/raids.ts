import { desc, eq } from "drizzle-orm";
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
});
