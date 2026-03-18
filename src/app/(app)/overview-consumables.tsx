"use client";

import { useMemo } from "react";
import { MultiSeriesAreaChart } from "@/components/ui/multi-series-area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { StackedBarChart } from "@/components/ui/stacked-bar-chart";
import { TooltipLabel } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

const formatDate = (date: string | Date | null): string => {
	if (!date) return "—";
	return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const bars = [
	{ dataKey: "flask", color: "var(--color-accent)", name: "Flask" },
	{ dataKey: "food", color: "var(--color-chart-food)", name: "Food" },
	{ dataKey: "prePot", color: "var(--color-warning)", name: "Pre-Pot" },
];

const trendSeries = [
	{ dataKey: "flask", color: "var(--color-accent)", name: "Flask" },
	{ dataKey: "food", color: "var(--color-chart-food)", name: "Food" },
	{ dataKey: "prePot", color: "var(--color-warning)", name: "Pre-Pot" },
];

export const OverviewConsumables = () => {
	const { data, isLoading } = trpc.overview.getConsumableCompliance.useQuery();

	const barData = useMemo(() => {
		if (!data) return [];
		return data.byPlayer.map((p) => ({
			name: p.name,
			flask: Math.round(p.avgFlaskUptime),
			food: Math.round(p.avgFoodUptime),
			prePot: Math.round(p.prePotRate),
		}));
	}, [data]);

	const trendData = useMemo(() => {
		if (!data) return [];
		return data.byRaid.map((r) => ({
			date: formatDate(r.date),
			flask: Math.round(r.avgFlaskUptime),
			food: Math.round(r.avgFoodUptime),
			prePot: Math.round(r.avgPrePotRate),
		}));
	}, [data]);

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-80" />
				</div>
				<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
					<Skeleton className="h-72 w-full" />
					<Skeleton className="h-72 w-full" />
				</div>
			</div>
		);
	}

	const barHeight = Math.max(300, barData.length * 32);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<h2 className="font-heading text-2xl font-bold uppercase text-primary">
					Consumable Compliance
				</h2>
				<p className="font-body text-xs uppercase tracking-wider text-secondary">
					{"// Average across all encounters — last 8 weeks"}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
				{/* Left: stacked bar */}
				<div className="border border-border bg-card p-4">
					<span className="mb-3 block font-body text-2xs uppercase tracking-wider text-dimmed">
						Compliance by Player
					</span>
					<StackedBarChart
						data={barData}
						bars={bars}
						categoryKey="name"
						height={barHeight}
						tooltipFormatterAction={(payload) => {
							const p = payload as {
								name: string;
								flask: number;
								food: number;
								prePot: number;
							};
							return (
								<div className="flex flex-col gap-1">
									<TooltipLabel>{p.name}</TooltipLabel>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Flask</span>
										<span className="text-accent">{p.flask}%</span>
									</div>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Food</span>
										<span style={{ color: "var(--color-chart-food)" }}>{p.food}%</span>
									</div>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Pre-Pot</span>
										<span className="text-warning">{p.prePot}%</span>
									</div>
								</div>
							);
						}}
					/>
				</div>

				{/* Right: area trend */}
				<div className="border border-border bg-card p-4">
					<span className="mb-3 block font-body text-2xs uppercase tracking-wider text-dimmed">
						Raid Compliance Trend
					</span>
					<MultiSeriesAreaChart
						data={trendData}
						series={trendSeries}
						xAxisKey="date"
						yAxisFormatter={(v) => `${v}%`}
						tooltipFormatterAction={(payload) => {
							const p = payload as {
								date: string;
								flask: number;
								food: number;
								prePot: number;
							};
							return (
								<div className="flex flex-col gap-1">
									<TooltipLabel>{p.date}</TooltipLabel>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Flask</span>
										<span className="text-accent">{p.flask}%</span>
									</div>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Food</span>
										<span style={{ color: "var(--color-chart-food)" }}>{p.food}%</span>
									</div>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Pre-Pot</span>
										<span className="text-warning">{p.prePot}%</span>
									</div>
								</div>
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
};
