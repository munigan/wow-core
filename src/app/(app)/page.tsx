import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { OverviewAttendance } from "./overview-attendance";
import { OverviewConsumables } from "./overview-consumables";
import { OverviewDeathsPerformance } from "./overview-deaths-performance";
import { OverviewMetrics } from "./overview-metrics";

export const metadata: Metadata = {
	title: "Overview",
};

export default async function DashboardPage() {
	await connection();
	void trpc.overview.getMetrics.prefetch();
	void trpc.overview.getAttendance.prefetch();
	void trpc.overview.getConsumableCompliance.prefetch();
	void trpc.overview.getDeathsAndPerformance.prefetch();

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
				<OverviewMetrics />
				<OverviewAttendance />
				<OverviewConsumables />
				<OverviewDeathsPerformance />
			</div>
		</HydrateClient>
	);
}
