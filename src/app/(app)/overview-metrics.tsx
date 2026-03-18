"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

const computePctChange = (current: number, prev: number): number | null => {
	if (prev === 0) return current === 0 ? null : 100;
	return ((current - prev) / prev) * 100;
};

function formatNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return String(Math.round(n));
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type MetricCardProps = {
	label: string;
	value: string;
	pct: number | null;
	higherIsBetter: boolean;
};

function MetricCard({ label, value, pct, higherIsBetter }: MetricCardProps) {
	const goodPct = pct !== null ? (higherIsBetter ? pct : -pct) : null;
	const isPositive = pct !== null && pct > 0;

	return (
		<div className="flex flex-col gap-2 border border-border bg-card p-4">
			<span className="font-body text-2xs uppercase tracking-wider text-dimmed">{label}</span>
			<span
				data-good={goodPct !== null && goodPct >= 5 ? true : undefined}
				data-warn={goodPct !== null && goodPct >= -5 && goodPct < 5 ? true : undefined}
				data-bad={goodPct !== null && goodPct < -5 ? true : undefined}
				className="font-heading text-3xl font-bold text-primary data-bad:text-danger data-good:text-accent data-warn:text-warning"
			>
				{value}
			</span>
			{pct !== null && (
				<span className="flex items-center gap-1 text-dimmed">
					{isPositive ? (
						<TrendingUp
							data-good={goodPct !== null && goodPct >= 5 ? true : undefined}
							data-warn={goodPct !== null && goodPct >= -5 && goodPct < 5 ? true : undefined}
							data-bad={goodPct !== null && goodPct < -5 ? true : undefined}
							className="size-3 data-bad:text-danger data-good:text-accent data-warn:text-warning"
						/>
					) : (
						<TrendingDown
							data-good={goodPct !== null && goodPct >= 5 ? true : undefined}
							data-warn={goodPct !== null && goodPct >= -5 && goodPct < 5 ? true : undefined}
							data-bad={goodPct !== null && goodPct < -5 ? true : undefined}
							className="size-3 data-bad:text-danger data-good:text-accent data-warn:text-warning"
						/>
					)}
					<span className="font-body text-2xs font-semibold">
						{isPositive ? "+" : ""}
						{pct.toFixed(1)}%
					</span>
				</span>
			)}
		</div>
	);
}

export const OverviewMetrics = () => {
	const { data, isLoading } = trpc.overview.getMetrics.useQuery();

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
		);
	}

	if (!data) return null;

	const { current, previous } = data;

	const cards: MetricCardProps[] = [
		{
			label: "Total Raids",
			value: String(current.totalRaids),
			pct: computePctChange(current.totalRaids, previous.totalRaids),
			higherIsBetter: true,
		},
		{
			label: "Raid DPS",
			value: formatNumber(current.avgRaidDps),
			pct: computePctChange(current.avgRaidDps, previous.avgRaidDps),
			higherIsBetter: true,
		},
		{
			label: "Avg Duration",
			value: formatDuration(current.avgDurationMs),
			pct: computePctChange(current.avgDurationMs, previous.avgDurationMs),
			higherIsBetter: false,
		},
		{
			label: "Deaths / Raid",
			value: current.avgDeathsPerRaid.toFixed(1),
			pct: computePctChange(current.avgDeathsPerRaid, previous.avgDeathsPerRaid),
			higherIsBetter: false,
		},
		{
			label: "Consumable Score",
			value: `${Math.round(current.consumableScore)}%`,
			pct: computePctChange(current.consumableScore, previous.consumableScore),
			higherIsBetter: true,
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{cards.map((card) => (
				<MetricCard key={card.label} {...card} />
			))}
		</div>
	);
};
