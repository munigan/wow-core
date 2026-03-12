import { createTRPCRouter } from "@/lib/trpc/init";
import { membersRouter } from "@/lib/trpc/routers/members";
import { raidsRouter } from "@/lib/trpc/routers/raids";

export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
});

export type AppRouter = typeof appRouter;
