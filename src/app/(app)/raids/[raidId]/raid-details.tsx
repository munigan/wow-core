"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SortHeader } from "@/components/ui/sort-header";
import { trpc } from "@/lib/trpc/client";
import { EncounterRow } from "./encounter-row";
import { PlayerBreakdown } from "./player-breakdown";

function getMetricPct(current: number, average: number): number | null {
	if (average === 0) return null;
	return ((current - average) / average) * 100;
}

function getValueColor(pct: number | null, higherIsBetter: boolean): string {
	if (pct === null) return "text-primary";
	const goodPct = higherIsBetter ? pct : -pct;
	if (goodPct >= 5) return "text-accent";
	if (goodPct >= -5) return "text-warning";
	return "text-danger";
}

function MetricChange({
	pct,
	colorClass,
}: { pct: number | null; colorClass: string }) {
	if (pct === null) return null;
	const isPositive = pct > 0;

	return (
		<span className="flex items-center gap-1 text-dimmed">
			{isPositive ? (
				<TrendingUp className={`size-3 ${colorClass}`} />
			) : (
				<TrendingDown className={`size-3 ${colorClass}`} />
			)}
			<span className="font-body text-2xs font-semibold">
				{isPositive ? "+" : ""}
				{pct.toFixed(1)}%
			</span>
		</span>
	);
}

type RaidDetailsProps = {
	raidId: string;
};

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString();
}

export function RaidDetails({ raidId }: RaidDetailsProps) {
	const [encSort, setEncSort] = useQueryState(
		"esort",
		parseAsString.withDefault("order"),
	);
	const [encDir, setEncDir] = useQueryState(
		"edir",
		parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
	);

	const { data } = trpc.raids.getById.useQuery({ raidId });
	const { data: avgData } = trpc.raids.getInstanceAverages.useQuery(
		{ raidInstance: data?.raidInstance ?? "" },
		{ enabled: !!data?.raidInstance },
	);

	const killEncounters = useMemo(() => {
		if (!data) return [];
		const kills = data.encounters.filter((e) => e.result === "kill");
		const dir = encDir === "asc" ? 1 : -1;
		return [...kills].sort((a, b) => {
			switch (encSort) {
				case "encounter":
					return dir * a.bossName.localeCompare(b.bossName);
				case "dps":
					return dir * (a.raidDps - b.raidDps);
				case "duration":
					return dir * (a.durationMs - b.durationMs);
				case "deaths":
					return dir * (a.deathCount - b.deathCount);
				default:
					return dir * (a.order - b.order);
			}
		});
	}, [data, encSort, encDir]);

	if (!data) {
		return (
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<div className="grid grid-cols-4 gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full" />
					))}
				</div>
				<div className="flex flex-col gap-3">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-48 w-full" />
				</div>
			</div>
		);
	}

	const { encounters, ...raid } = data;

	const wipeEncounters = encounters.filter((e) => e.result === "wipe");

	// Group encounters by boss name for wipe count
	const wipeCountByBoss = new Map<string, number>();
	for (const enc of wipeEncounters) {
		wipeCountByBoss.set(
			enc.bossName,
			(wipeCountByBoss.get(enc.bossName) ?? 0) + 1,
		);
	}

	// Wipe attempts grouped by boss for expandable rows
	const wipesByBoss = new Map<string, typeof encounters>();
	for (const enc of wipeEncounters) {
		const existing = wipesByBoss.get(enc.bossName) ?? [];
		existing.push(enc);
		wipesByBoss.set(enc.bossName, existing);
	}

	// Metrics — use totalDamage from server to avoid rounding errors
	const totalKillDamage = killEncounters.reduce(
		(sum, e) => sum + e.totalDamage,
		0,
	);
	const totalKillDurationMs = killEncounters.reduce(
		(sum, e) => sum + e.durationMs,
		0,
	);
	const raidDps =
		totalKillDurationMs > 0
			? Math.round((totalKillDamage / totalKillDurationMs) * 1000)
			: 0;

	const showAvg = avgData && avgData.raidCount > 1;

	const raidDateStr = new Date(raid.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					Raid Details
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// "}
					{raid.name} — {raidDateStr}
					{raid.raidInstance ? ` — ${raid.raidInstance}` : ""}
				</p>
			</div>

			{/* Metric Cards */}
			{(() => {
				const dpsPct = showAvg ? getMetricPct(raidDps, avgData.avgDps) : null;
				const durPct = showAvg
					? getMetricPct(raid.durationMs ?? 0, avgData.avgDurationMs)
					: null;
				const consPct = showAvg
					? getMetricPct(data.totalConsumables, avgData.avgConsumables)
					: null;
				const deathPct = showAvg
					? getMetricPct(data.totalDeaths, avgData.avgDeaths)
					: null;

				return (
					<div className="grid grid-cols-4 gap-3">
						<div className="flex flex-col gap-2 border border-border bg-card p-4">
							<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
								Raid DPS
							</span>
							<span
								className={`font-heading text-3xl font-bold ${getValueColor(dpsPct, true)}`}
							>
								{formatNumber(raidDps)}
							</span>
							<MetricChange pct={dpsPct} colorClass={getValueColor(dpsPct, true)} />
						</div>
						<div className="flex flex-col gap-2 border border-border bg-card p-4">
							<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
								Duration
							</span>
							<span
								className={`font-heading text-3xl font-bold ${getValueColor(durPct, false)}`}
							>
								{formatDuration(raid.durationMs ?? 0)}
							</span>
							<MetricChange pct={durPct} colorClass={getValueColor(durPct, false)} />
						</div>
						<div className="flex flex-col gap-2 border border-border bg-card p-4">
							<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
								Consumables
							</span>
							<span
								className={`font-heading text-3xl font-bold ${getValueColor(consPct, true)}`}
							>
								{data.totalConsumables}
							</span>
							<MetricChange pct={consPct} colorClass={getValueColor(consPct, true)} />
						</div>
						<div className="flex flex-col gap-2 border border-border bg-card p-4">
							<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
								Deaths
							</span>
							<span
								className={`font-heading text-3xl font-bold ${getValueColor(deathPct, false)}`}
							>
								{data.totalDeaths}
							</span>
							<MetricChange pct={deathPct} colorClass={getValueColor(deathPct, false)} />
						</div>
					</div>
				);
			})()}

			{/* Encounters Table */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-secondary">
					Encounters / Bosses
				</span>
				<div className="overflow-hidden border border-border bg-card">
					<table className="w-full font-body">
						<thead>
							<tr className="border-b border-border">
								<SortHeader
									label="#"
									column="order"
									currentSort={encSort}
									currentDirection={encDir}
									onSortAction={(c, d) => {
										setEncSort(c);
										setEncDir(d);
									}}
									className="w-14 pl-4"
								/>
								<SortHeader
									label="Encounter"
									column="encounter"
									currentSort={encSort}
									currentDirection={encDir}
									onSortAction={(c, d) => {
										setEncSort(c);
										setEncDir(d);
									}}
								/>
								<SortHeader
									label="DPS"
									column="dps"
									currentSort={encSort}
									currentDirection={encDir}
									onSortAction={(c, d) => {
										setEncSort(c);
										setEncDir(d);
									}}
									className="w-28"
								/>
								<SortHeader
									label="Duration"
									column="duration"
									currentSort={encSort}
									currentDirection={encDir}
									onSortAction={(c, d) => {
										setEncSort(c);
										setEncDir(d);
									}}
									className="w-28"
								/>
								<SortHeader
									label="Deaths"
									column="deaths"
									currentSort={encSort}
									currentDirection={encDir}
									onSortAction={(c, d) => {
										setEncSort(c);
										setEncDir(d);
									}}
									className="w-24"
								/>
								<th className="w-24 py-2.5 pr-4 text-left text-2xs font-normal uppercase tracking-wider text-dimmed">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{killEncounters.map((enc, idx) => (
								<EncounterRow
									key={enc.id}
									encounter={enc}
									killOrder={idx + 1}
									wipeCount={wipeCountByBoss.get(enc.bossName) ?? 0}
									wipes={wipesByBoss.get(enc.bossName) ?? []}
									formatNumber={formatNumber}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Per-Player Breakdown */}
			{killEncounters.length > 0 && (
				<PlayerBreakdown
					encounters={killEncounters.map((e) => ({
						id: e.id,
						bossName: e.bossName,
					}))}
					formatNumber={formatNumber}
				/>
			)}
		</div>
	);
}
