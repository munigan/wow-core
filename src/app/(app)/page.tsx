import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { OverviewClassDistribution } from "./overview-class-distribution";
import { OverviewQuickStats } from "./overview-quick-stats";

export const metadata: Metadata = {
	title: "Overview",
};

export default async function DashboardPage() {
	await connection();
	void trpc.overview.getQuickStats.prefetch();
	void trpc.overview.getClassDistribution.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Overview
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Raid Core Analyzer"}
					</p>
				</div>
				<div className="grid grid-cols-2 items-stretch gap-4">
					<OverviewQuickStats />
					<OverviewClassDistribution />
				</div>
			</div>
		</HydrateClient>
	);
}
