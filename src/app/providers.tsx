"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCProvider } from "@/lib/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<NuqsAdapter>
			<TRPCProvider>{children}</TRPCProvider>
		</NuqsAdapter>
	);
};
