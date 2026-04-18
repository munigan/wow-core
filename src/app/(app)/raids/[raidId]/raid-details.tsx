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
}: {
	pct: number | null;
	colorClass: string;
}) {
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

	type EncounterRow = NonNullable<typeof data>["encounters"][number];

	type BossTableRow = {
		bossName: string;
		minOrder: number;
		primary: EncounterRow;
		nestedAttempts: EncounterRow[];
		/** True when at least one pull is logged as kill — primary row is the last kill */
		isPrimarySuccessfulKill: boolean;
	};

	const bossRows = useMemo((): BossTableRow[] => {
		if (!data) return [];
		const all = data.encounters;
		const byBoss = new Map<string, EncounterRow[]>();
		for (const e of all) {
			const list = byBoss.get(e.bossName) ?? [];
			list.push(e);
			byBoss.set(e.bossName, list);
		}

		const rows: BossTableRow[] = [];
		for (const list of byBoss.values()) {
			const sorted = [...list].sort((a, b) => a.order - b.order);
			const kills = sorted.filter((e) => e.result === "kill");
			const primary =
				kills.length > 0
					? kills.reduce((a, b) => (a.order > b.order ? a : b))
					: sorted[sorted.length - 1];
			const nestedAttempts = sorted.filter((e) => e.id !== primary.id);
			const minOrder = Math.min(...sorted.map((e) => e.order));
			const hasSuccessfulKill = kills.length > 0;
			rows.push({
				bossName: sorted[0].bossName,
				minOrder,
				primary,
				nestedAttempts,
				isPrimarySuccessfulKill: hasSuccessfulKill,
			});
		}

		const dir = encDir === "asc" ? 1 : -1;
		rows.sort((a, b) => {
			const pa = a.primary;
			const pb = b.primary;
			switch (encSort) {
				case "encounter":
					return dir * a.bossName.localeCompare(b.bossName);
				case "dps":
					return dir * (pa.raidDpsUseful - pb.raidDpsUseful);
				case "duration":
					return dir * (pa.durationMs - pb.durationMs);
				case "deaths":
					return dir * (pa.deathCount - pb.deathCount);
				default:
					return dir * (a.minOrder - b.minOrder);
			}
		});

		return rows;
	}, [data, encSort, encDir]);

	const killEncountersForMetrics = useMemo(() => {
		if (!data) return [];
		return bossRows
			.filter((row) => row.isPrimarySuccessfulKill)
			.map((row) => row.primary);
	}, [data, bossRows]);

	const totalKillDurationMs = killEncountersForMetrics.reduce(
		(sum, e) => sum + e.durationMs,
		0,
	);
	const totalKillUsefulDamage = killEncountersForMetrics.reduce(
		(sum, e) => sum + e.usefulDamage,
		0,
	);
	const raidDps =
		totalKillDurationMs > 0
			? Math.round((totalKillUsefulDamage / totalKillDurationMs) * 1000)
			: 0;

	if (!data) {
		return (
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<div className="grid grid-cols-4 gap-3">
					{(["m1", "m2", "m3", "m4"] as const).map((k) => (
						<Skeleton key={k} className="h-16 w-full" />
					))}
				</div>
				<div className="flex flex-col gap-3">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-48 w-full" />
				</div>
			</div>
		);
	}

	const { ...raid } = data;

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
								className={`font-heading text-3xl font-bold tabular-nums ${getValueColor(dpsPct, true)}`}
								title="Useful DPS (kill encounters)"
							>
								{formatNumber(raidDps)}
							</span>
							<MetricChange
								pct={dpsPct}
								colorClass={getValueColor(dpsPct, true)}
							/>
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
							<MetricChange
								pct={durPct}
								colorClass={getValueColor(durPct, false)}
							/>
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
							<MetricChange
								pct={consPct}
								colorClass={getValueColor(consPct, true)}
							/>
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
							<MetricChange
								pct={deathPct}
								colorClass={getValueColor(deathPct, false)}
							/>
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
							{bossRows.map((row, idx) => (
								<EncounterRow
									key={row.primary.id}
									encounter={row.primary}
									killOrder={idx + 1}
									priorAttemptCount={row.nestedAttempts.length}
									isPrimarySuccessfulKill={row.isPrimarySuccessfulKill}
									nestedAttempts={row.nestedAttempts}
									formatNumber={formatNumber}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Per-Player Breakdown */}
			{killEncountersForMetrics.length > 0 && (
				<PlayerBreakdown
					raidId={raidId}
					encounters={killEncountersForMetrics.map((e) => ({
						id: e.id,
						bossName: e.bossName,
					}))}
					formatNumber={formatNumber}
				/>
			)}
		</div>
	);
}
