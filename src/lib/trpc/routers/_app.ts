import { createTRPCRouter } from "@/lib/trpc/init";
import { gearRouter } from "@/lib/trpc/routers/gear";
import { membersRouter } from "@/lib/trpc/routers/members";
import { raidsRouter } from "@/lib/trpc/routers/raids";

export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
	gear: gearRouter,
});

export type AppRouter = typeof appRouter;
