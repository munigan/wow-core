"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	httpBatchStreamLink,
	httpLink,
	isNonJsonSerializable,
	splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { makeQueryClient } from "@/lib/trpc/query-client";
import type { AppRouter } from "@/lib/trpc/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient | undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!clientQueryClientSingleton) {
		clientQueryClientSingleton = makeQueryClient();
	}
	return clientQueryClientSingleton;
}

function getUrl() {
	if (typeof window !== "undefined") return "/api/trpc";
	if (process.env.VERCEL_URL)
		return `https://${process.env.VERCEL_URL}/api/trpc`;
	return "http://localhost:3000/api/trpc";
}

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				splitLink({
					condition: (op) => isNonJsonSerializable(op.input),
					true: httpLink({ url: getUrl() }),
					false: httpBatchStreamLink({ url: getUrl() }),
				}),
			],
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
