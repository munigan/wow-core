import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const createTRPCContext = cache(async (opts: { headers: Headers }) => {
	const session = await auth.api.getSession({ headers: opts.headers });

	return {
		session: session?.session ?? null,
		user: session?.user ?? null,
		coreId: session?.session?.activeOrganizationId ?? null,
	};
});

const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session || !ctx.user || !ctx.coreId) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			session: ctx.session,
			user: ctx.user,
			coreId: ctx.coreId,
		},
	});
});
