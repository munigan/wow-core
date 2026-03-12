import { createTRPCRouter } from "@/lib/trpc/init";

export const appRouter = createTRPCRouter({});

export type AppRouter = typeof appRouter;
