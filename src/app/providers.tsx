"use client";

import { TRPCProvider } from "@/lib/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return <TRPCProvider>{children}</TRPCProvider>;
};
