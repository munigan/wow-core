"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCProvider } from "@/lib/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<NuqsAdapter>
			<TRPCProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</TRPCProvider>
		</NuqsAdapter>
	);
};
