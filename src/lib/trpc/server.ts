import "server-only";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "@/lib/trpc/init";
import { makeQueryClient } from "@/lib/trpc/query-client";
import { appRouter } from "@/lib/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(async () =>
	createTRPCContext({ headers: await headers() }),
);

// Empty router causes AnyRouter to match TRouter; resolves when procedures are added
export const { trpc, HydrateClient } =
	// @ts-expect-error - empty router type workaround
	createHydrationHelpers<typeof appRouter>(caller, getQueryClient);
