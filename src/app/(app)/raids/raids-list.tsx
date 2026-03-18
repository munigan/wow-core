"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
	useQueryState,
} from "nuqs";
import { Fragment } from "react";
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

const PER_PAGE = 20;

export function RaidsList() {
	const [instance, setInstance] = useQueryState(
		"instance",
		parseAsString.withDefault(""),
	);
	const [dateRange, setDateRange] = useQueryState(
		"range",
		parseAsStringEnum(["7d", "30d", "90d", "all"]).withDefault("all"),
	);
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

	const { data: instances } = trpc.raids.listInstances.useQuery();
	const { data, isLoading } = trpc.raids.list.useQuery(
		{
			instance: instance || undefined,
			dateRange: dateRange as "7d" | "30d" | "90d" | "all",
			page,
			perPage: PER_PAGE,
		},
		{ placeholderData: keepPreviousData },
	);

	const instanceItems = [
		{ value: "", label: "All Instances" },
		...(instances ?? []).map((i) => ({ value: i, label: i })),
	];

	if (isLoading && !data) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-64" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton
							key={`skeleton-${i}`}
							className="h-12 w-full border-t border-border"
						/>
					))}
				</div>
			</div>
		);
	}

	const raids = data?.items ?? [];
	const totalCount = data?.totalCount ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
	const grouped = groupByDate(raids);
	const hasNoRaidsAtAll = raids.length === 0;
	const isFiltered = instance !== "" || dateRange !== "all";

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<div className="flex items-center gap-2">
				<SelectRoot
					value={instance}
					items={instanceItems}
					onValueChangeAction={(v) => {
						setInstance(v ?? "");
						setPage(1);
					}}
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

				<div className="flex -space-x-px">
					{DATE_RANGES.map((range) => (
						<button
							key={range}
							type="button"
							data-active={dateRange === range || undefined}
							className="border border-border bg-elevated px-3 py-1.5 font-body text-2xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:text-primary data-active:bg-accent-10 data-active:text-accent"
							onClick={() => {
								setDateRange(range);
								setPage(1);
							}}
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
								<th className="py-2.5 pl-4 text-left font-normal">Raid</th>
								<th className="py-2.5 text-left font-normal">Instance</th>
								<th className="w-24 py-2.5 text-left font-normal">Duration</th>
								<th className="w-20 py-2.5 text-left font-normal">Bosses</th>
								<th className="w-20 py-2.5 text-left font-normal">Players</th>
								<th className="w-20 py-2.5 pr-4 text-left font-normal">
									Deaths
								</th>
							</tr>
						</thead>
						<tbody className="text-sm">
							{[...grouped.entries()].map(([dateLabel, dateRaids]) => (
								<Fragment key={dateLabel}>
									<tr>
										<td
											colSpan={6}
											className="border-b border-elevated bg-page py-2 pl-4 font-body text-xs uppercase tracking-wider text-secondary"
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
													<span className="ml-2 font-body text-2xs text-dimmed">
														{new Date(r.date).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
														})}
													</span>
												</td>
												<td className="py-2.5 text-secondary">
													{r.raidInstance ?? "—"}
												</td>
												<td className="py-2.5 text-secondary">
													{formatDuration(r.durationMs)}
												</td>
												<td className="py-2.5 text-primary">{r.bossKills}</td>
												<td className="py-2.5 text-primary">{r.playerCount}</td>
												<td
													data-has-deaths={r.deathCount > 0 || undefined}
													className="py-2.5 pr-4 text-dimmed data-has-deaths:text-danger"
												>
													{r.deathCount}
												</td>
											</tr>
										);
									})}
								</Fragment>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			<div className="flex items-center justify-between font-body text-xs text-secondary">
				<span>
					Page {page} of {totalPages} ({totalCount} raids)
				</span>
				<div className="flex gap-1">
					<button
						type="button"
						disabled={page <= 1}
						onClick={() => setPage(page - 1)}
						className="inline-flex items-center gap-1 border border-border px-2.5 py-1.5 text-secondary transition-colors hover:text-primary disabled:opacity-40 disabled:hover:text-secondary"
					>
						<ChevronLeft className="size-3" />
						Prev
					</button>
					<button
						type="button"
						disabled={page >= totalPages}
						onClick={() => setPage(page + 1)}
						className="inline-flex items-center gap-1 border border-border px-2.5 py-1.5 text-secondary transition-colors hover:text-primary disabled:opacity-40 disabled:hover:text-secondary"
					>
						Next
						<ChevronRight className="size-3" />
					</button>
				</div>
			</div>
		</div>
	);
}
