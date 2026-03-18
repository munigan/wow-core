"use client";

import Image from "next/image";
import dkIcon from "@/assets/classes/dk.png";
import druidIcon from "@/assets/classes/druid.png";
import hunterIcon from "@/assets/classes/hunter.png";
import mageIcon from "@/assets/classes/mage.png";
import paladinIcon from "@/assets/classes/paladin.png";
import priestIcon from "@/assets/classes/priest.png";
import rogueIcon from "@/assets/classes/rogue.png";
import shamanIcon from "@/assets/classes/shaman.png";
import warlockIcon from "@/assets/classes/warlock.png";
import warriorIcon from "@/assets/classes/warrior.png";
import { AreaChart } from "@/components/ui/area-chart";
import type { HeatmapCell, HeatmapRow } from "@/components/ui/heatmap-grid";
import { HeatmapGrid } from "@/components/ui/heatmap-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipLabel } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

const CLASS_ICONS: Record<string, typeof dkIcon> = {
	warrior: warriorIcon,
	paladin: paladinIcon,
	hunter: hunterIcon,
	rogue: rogueIcon,
	priest: priestIcon,
	"death-knight": dkIcon,
	shaman: shamanIcon,
	mage: mageIcon,
	warlock: warlockIcon,
	druid: druidIcon,
};

const CLASS_COLORS: Record<string, string> = {
	warrior: "text-class-warrior",
	paladin: "text-class-paladin",
	hunter: "text-class-hunter",
	rogue: "text-class-rogue",
	priest: "text-class-priest",
	"death-knight": "text-class-dk",
	shaman: "text-class-shaman",
	mage: "text-class-mage",
	warlock: "text-class-warlock",
	druid: "text-class-druid",
};

function formatSpec(
	spec: string | null,
	playerClass: string | null,
): string | null {
	if (!spec || !playerClass) return null;
	const classPrefix =
		playerClass === "death-knight" ? "death-knight-" : `${playerClass}-`;
	if (!spec.startsWith(classPrefix)) return null;
	const specName = spec.slice(classPrefix.length);
	return specName.charAt(0).toUpperCase() + specName.slice(1);
}

function formatNumber(value: number): string {
	return value.toLocaleString("en-US");
}

function getStatAttrs(
	type: "dps" | "attendance" | "prepot" | "deaths",
	value: number,
): Record<string, boolean | undefined> {
	switch (type) {
		case "prepot":
			if (value >= 80) return { "data-good": true };
			if (value >= 50) return { "data-warn": true };
			return {};
		case "deaths":
			if (value === 0) return { "data-good": true };
			if (value <= 5) return { "data-warn": true };
			return {};
		default:
			return { "data-neutral": true };
	}
}

function getUptimeStatus(value: number | null): "full" | "partial" | "empty" {
	if (value === null) return "empty";
	if (value >= 95) return "full";
	if (value >= 80) return "partial";
	return "empty";
}

function getCoverageStatus(
	covered: number,
	total: number,
): "full" | "partial" | "empty" {
	if (total === 0) return "empty";
	const ratio = covered / total;
	if (ratio >= 1) return "full";
	if (ratio >= 0.5) return "partial";
	return "empty";
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type MemberDetailsProps = {
	memberId: string;
};

export function MemberDetails({ memberId }: MemberDetailsProps) {
	const { data, isLoading } = trpc.members.getById.useQuery({ memberId });

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-8 p-8">
				{/* Header skeleton */}
				<div className="flex flex-col gap-1">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				{/* Stat cards skeleton */}
				<div className="grid grid-cols-4 gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full" />
					))}
				</div>
				{/* Chart skeleton */}
				<div className="flex flex-col gap-3">
					<Skeleton className="h-3 w-48" />
					<Skeleton className="h-70" />
				</div>
				{/* Heatmap skeleton */}
				<div className="flex flex-col gap-3">
					<Skeleton className="h-3 w-40" />
					<Skeleton className="h-48" />
				</div>
			</div>
		);
	}

	const { member, stats, dpsTrend, heatmapData } = data;
	const playerClass = member.class;
	const spec = formatSpec(member.latestSpec, playerClass);

	const hasData = dpsTrend.length > 0 || heatmapData.length > 0;

	// Transform DPS trend for chart
	const chartData = dpsTrend.map((d) => ({
		label: formatDate(d.date),
		value: d.avgDps,
		meta: { encounters: d.encounters, date: d.date },
	}));

	// Transform heatmap data
	const heatmapRows: HeatmapRow[] = heatmapData.map((d) => ({
		label: formatDate(d.date),
		badge: `${d.encounterCount}`,
		cells: [
			{
				value: d.flaskUptime ?? undefined,
				display: d.flaskUptime !== null ? `${Math.round(d.flaskUptime)}%` : "—",
				status: getUptimeStatus(d.flaskUptime),
			},
			{
				value: d.foodUptime ?? undefined,
				display: d.foodUptime !== null ? `${Math.round(d.foodUptime)}%` : "—",
				status: getUptimeStatus(d.foodUptime),
			},
			{
				display: `${d.consumableCoverage.covered}/${d.consumableCoverage.total}`,
				status: getCoverageStatus(
					d.consumableCoverage.covered,
					d.consumableCoverage.total,
				),
			},
		] satisfies HeatmapCell[],
	}));

	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					{member.name}
				</h1>
				<div className="flex items-center gap-2 font-body text-sm">
					{playerClass && CLASS_ICONS[playerClass] && (
						<Image
							src={CLASS_ICONS[playerClass]}
							alt={playerClass}
							width={16}
							height={16}
						/>
					)}
					<span
						className={`capitalize ${CLASS_COLORS[playerClass ?? ""] ?? "text-secondary"}`}
					>
						{playerClass ?? "Unknown"}
						{spec && <span className="text-dimmed"> ({spec})</span>}
					</span>
				</div>
			</div>

			{/* Metric Cards */}
			<div className="grid grid-cols-4 gap-3">
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Avg DPS
					</span>
					<span
						{...getStatAttrs("dps", stats.avgDps)}
						className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
					>
						{hasData ? formatNumber(stats.avgDps) : "—"}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Raids Attended
					</span>
					<span
						{...getStatAttrs("attendance", stats.raidAttendance)}
						className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
					>
						{hasData ? stats.raidAttendance : "—"}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Pre-pot Rate
					</span>
					<span
						{...getStatAttrs("prepot", stats.prePotRate)}
						className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
					>
						{hasData ? `${stats.prePotRate}%` : "—"}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Total Deaths
					</span>
					<span
						{...getStatAttrs("deaths", stats.totalDeaths)}
						className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
					>
						{hasData ? stats.totalDeaths : "—"}
					</span>
				</div>
			</div>

			{/* DPS Trend Chart */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-secondary">
					// DPS Trend — Last 8 Weeks
				</span>
				{chartData.length > 0 ? (
					<div className="border border-border bg-card p-4">
						<AreaChart
							data={chartData}
							color="var(--color-accent)"
							height={280}
							tooltipFormatterAction={(point) => (
								<div className="flex flex-col gap-1">
									<TooltipLabel>{point.meta?.date ?? point.label}</TooltipLabel>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Avg DPS</span>
										<span className="font-semibold text-accent">
											{formatNumber(point.value)}
										</span>
									</div>
									<div className="flex items-center justify-between gap-6 font-body text-xs">
										<span className="text-secondary">Encounters</span>
										<span className="text-primary">
											{point.meta?.encounters}
										</span>
									</div>
								</div>
							)}
						/>
					</div>
				) : (
					<div className="flex h-70 items-center justify-center border border-border bg-card">
						<span className="font-body text-sm text-dimmed">
							No encounter data in the last 8 weeks
						</span>
					</div>
				)}
			</div>

			{/* Consumable Compliance Heatmap */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-secondary">
					// Consumable Compliance
				</span>
				{heatmapRows.length > 0 ? (
					<HeatmapGrid
						rows={heatmapRows}
						columns={["Flask", "Food", "Consumables"]}
						tooltipFormatterAction={(row, colIndex) => {
							const dateData = heatmapData.find(
								(d) => formatDate(d.date) === row.label,
							);
							if (!dateData) return null;

							if (colIndex === 0) {
								return (
									<div className="flex flex-col gap-1">
										<TooltipLabel>Flask Uptime</TooltipLabel>
										<span className="font-body text-xs text-primary">
											{dateData.flaskUptime !== null
												? `${Math.round(dateData.flaskUptime)}%`
												: "No data"}
										</span>
										<span className="font-body text-2xs text-dimmed">
											{dateData.encounterCount} encounters
										</span>
									</div>
								);
							}

							if (colIndex === 1) {
								return (
									<div className="flex flex-col gap-1">
										<TooltipLabel>Food Uptime</TooltipLabel>
										<span className="font-body text-xs text-primary">
											{dateData.foodUptime !== null
												? `${Math.round(dateData.foodUptime)}%`
												: "No data"}
										</span>
										<span className="font-body text-2xs text-dimmed">
											{dateData.encounterCount} encounters
										</span>
									</div>
								);
							}

							// Consumables column — show per-boss breakdown
							return (
								<div className="flex flex-col gap-2">
									<TooltipLabel>Consumables</TooltipLabel>
									<span className="font-body text-2xs text-dimmed">
										{dateData.consumableCoverage.covered}/
										{dateData.consumableCoverage.total} encounters covered
									</span>
									{Object.entries(dateData.consumablesByBoss).map(
										([boss, items]) => (
											<div key={boss} className="flex flex-col gap-0.5">
												<span className="font-body text-2xs font-bold text-primary">
													{boss}
												</span>
												{items.length > 0 ? (
													items.map((item, i) => (
														<div
															key={i}
															className="flex items-center justify-between gap-6 font-body text-xs"
														>
															<span className="text-accent">
																{item.spellName}
																{item.isPrePot && (
																	<span className="text-warning"> (PP)</span>
																)}
															</span>
															<span className="text-secondary">
																x{item.count}
															</span>
														</div>
													))
												) : (
													<span className="font-body text-2xs text-dimmed">
														None
													</span>
												)}
											</div>
										),
									)}
								</div>
							);
						}}
					/>
				) : (
					<div className="flex h-32 items-center justify-center border border-border bg-card">
						<span className="font-body text-sm text-dimmed">
							No consumable data in the last 8 weeks
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
