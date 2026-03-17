"use client";

import { keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

const DATE_RANGES = ["7d", "30d", "90d", "all"] as const;

const DATE_RANGE_LABELS: Record<string, string> = {
	"7d": "Last 7 days",
	"30d": "Last 30 days",
	"90d": "Last 90 days",
	all: "All time",
};

function formatDuration(ms: number | null): string {
	if (!ms) return "—";
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function groupByDate(
	raids: Array<{ id: string; date: Date | string; [key: string]: unknown }>,
): Map<string, typeof raids> {
	const groups = new Map<string, typeof raids>();
	for (const raid of raids) {
		const dateKey = new Date(raid.date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		const existing = groups.get(dateKey) ?? [];
		existing.push(raid);
		groups.set(dateKey, existing);
	}
	return groups;
}

export function RaidsList() {
	const [instance, setInstance] = useQueryState(
		"instance",
		parseAsString.withDefault(""),
	);
	const [dateRange, setDateRange] = useQueryState(
		"range",
		parseAsStringEnum(["7d", "30d", "90d", "all"]).withDefault("all"),
	);

	const { data: instances } = trpc.raids.listInstances.useQuery();
	const { data: raids, isLoading } = trpc.raids.list.useQuery(
		{
			instance: instance || undefined,
			dateRange: dateRange as "7d" | "30d" | "90d" | "all",
		},
		{ placeholderData: keepPreviousData },
	);

	const instanceItems = [
		{ value: "", label: "All Instances" },
		...(instances ?? []).map((i) => ({ value: i, label: i })),
	];

	if (isLoading && !raids) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-64" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full border-t border-border" />
					))}
				</div>
			</div>
		);
	}

	const grouped = groupByDate(raids ?? []);
	const hasNoRaidsAtAll = !raids || raids.length === 0;
	const isFiltered = instance !== "" || dateRange !== "all";

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<div className="flex items-center gap-2">
				<SelectRoot
					value={instance}
					items={instanceItems}
					onValueChangeAction={(v) => setInstance(v ?? "")}
				>
					<SelectTrigger placeholder="All Instances" size="sm" />
					<SelectPopup>
						<SelectItem value="">All Instances</SelectItem>
						{(instances ?? []).map((inst) => (
							<SelectItem key={inst} value={inst}>
								{inst}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>

				<div className="flex">
					{DATE_RANGES.map((range) => (
						<button
							key={range}
							type="button"
							data-active={dateRange === range || undefined}
							className="border border-border bg-elevated px-3 py-1.5 font-body text-2xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:text-primary data-active:bg-accent-10 data-active:text-accent"
							onClick={() => setDateRange(range)}
						>
							{DATE_RANGE_LABELS[range]}
						</button>
					))}
				</div>
			</div>

			{/* Empty states */}
			{hasNoRaidsAtAll && !isFiltered && (
				<p className="font-body text-sm text-dimmed">
					No raids uploaded yet. Upload a combat log to get started.
				</p>
			)}
			{hasNoRaidsAtAll && isFiltered && (
				<p className="font-body text-sm text-dimmed">
					No raids match the selected filters.
				</p>
			)}

			{/* Table */}
			{!hasNoRaidsAtAll && (
				<div className="border border-border bg-card">
					<table className="w-full font-body">
						<thead>
							<tr className="border-b border-border text-2xs uppercase tracking-wider text-dimmed">
								<th className="py-2.5 pl-4 text-left font-normal">
									Raid
								</th>
								<th className="py-2.5 text-left font-normal">
									Instance
								</th>
								<th className="w-24 py-2.5 text-left font-normal">
									Duration
								</th>
								<th className="w-20 py-2.5 text-left font-normal">
									Bosses
								</th>
								<th className="w-20 py-2.5 text-left font-normal">
									Players
								</th>
								<th className="w-20 py-2.5 pr-4 text-left font-normal">
									Deaths
								</th>
							</tr>
						</thead>
						<tbody className="text-sm">
							{[...grouped.entries()].map(([dateLabel, dateRaids]) => (
								<>
									<tr key={dateLabel}>
										<td
											colSpan={6}
											className="bg-page py-2 pl-4 font-body text-xs uppercase tracking-wider text-secondary"
										>
											{dateLabel}
										</td>
									</tr>
									{dateRaids.map((raid) => {
										const r = raid as typeof raid & {
											bossKills: number;
											playerCount: number;
											deathCount: number;
											durationMs: number | null;
											raidInstance: string | null;
										};
										return (
											<tr
												key={r.id}
												className="border-b border-elevated hover:bg-subtle"
											>
												<td className="py-2.5 pl-4">
													<Link
														href={`/raids/${r.id}`}
														className="font-semibold text-primary hover:text-accent"
													>
														{r.name as string}
													</Link>
												</td>
												<td className="py-2.5 text-secondary">
													{r.raidInstance ?? "—"}
												</td>
												<td className="py-2.5 text-secondary">
													{formatDuration(r.durationMs)}
												</td>
												<td className="py-2.5 text-primary">
													{r.bossKills}
												</td>
												<td className="py-2.5 text-primary">
													{r.playerCount}
												</td>
												<td
													data-has-deaths={r.deathCount > 0 || undefined}
													className="py-2.5 pr-4 text-dimmed data-has-deaths:text-danger"
												>
													{r.deathCount}
												</td>
											</tr>
										);
									})}
								</>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
