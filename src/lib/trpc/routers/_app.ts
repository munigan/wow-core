import { createTRPCRouter } from "@/lib/trpc/init";
import { membersRouter } from "@/lib/trpc/routers/members";
import { overviewRouter } from "@/lib/trpc/routers/overview";
import { raidsRouter } from "@/lib/trpc/routers/raids";

export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
	overview: overviewRouter,
});

export type AppRouter = typeof appRouter;
