"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
	useQueryState,
} from "nuqs";
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
import { Input } from "@/components/ui/input";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SortHeader } from "@/components/ui/sort-header";
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

const PER_PAGE = 50;

export function MembersList() {
	const [classFilter, setClassFilter] = useQueryState(
		"class",
		parseAsString.withDefault(""),
	);
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [sortColumn, setSortColumn] = useQueryState(
		"sort",
		parseAsString.withDefault("name"),
	);
	const [sortDir, setSortDir] = useQueryState(
		"dir",
		parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
	);
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

	const { data, isLoading } = trpc.members.listWithStats.useQuery(
		{
			class: classFilter || undefined,
			search: search || undefined,
			sort: sortColumn as "name" | "class" | "raids",
			direction: sortDir as "asc" | "desc",
			page,
			perPage: PER_PAGE,
		},
		{ placeholderData: keepPreviousData },
	);

	const membersList = data?.items ?? [];
	const totalCount = data?.totalCount ?? 0;
	const totalPages = Math.ceil(totalCount / PER_PAGE);

	const uniqueClasses = [
		...new Set(membersList.map((m) => m.class).filter(Boolean)),
	].sort() as string[];

	const classItems = [
		{ value: "", label: "All Classes" },
		...uniqueClasses.map((cls) => ({ value: cls, label: cls })),
	];

	if (isLoading && !data) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton
							key={`skeleton-${i}`}
							className="h-12 w-full border-t border-border"
						/>
					))}
				</div>
			</div>
		);
	}

	const hasNoMembers = membersList.length === 0;
	const isFiltered = classFilter !== "" || search !== "";

	function handleSort(column: string, direction: "asc" | "desc") {
		setSortColumn(column);
		setSortDir(direction);
		setPage(1);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<div className="flex items-center gap-2">
				<SelectRoot
					value={classFilter}
					items={classItems}
					onValueChangeAction={(v) => {
						setClassFilter(v ?? "");
						setPage(1);
					}}
				>
					<SelectTrigger placeholder="All Classes" size="sm" />
					<SelectPopup>
						<SelectItem value="">All Classes</SelectItem>
						{uniqueClasses.map((cls) => (
							<SelectItem key={cls} value={cls}>
								{cls}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>

				<Input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value || null);
						setPage(1);
					}}
					placeholder="Search members..."
					className="h-8 w-48 text-2xs"
				/>
			</div>

			{/* Empty states */}
			{hasNoMembers && !isFiltered && (
				<p className="font-body text-sm text-dimmed">
					No members yet. Upload a combat log to populate the roster.
				</p>
			)}
			{hasNoMembers && isFiltered && (
				<p className="font-body text-sm text-dimmed">
					No members match the selected filters.
				</p>
			)}

			{/* Table */}
			{!hasNoMembers && (
				<div className="border border-border bg-card">
					<table className="w-full font-body">
						<thead>
							<tr className="border-b border-border">
								<SortHeader
									label="Name"
									column="name"
									currentSort={sortColumn}
									currentDirection={sortDir}
									onSortAction={handleSort}
									className="pl-4"
								/>
								<SortHeader
									label="Class"
									column="class"
									currentSort={sortColumn}
									currentDirection={sortDir}
									onSortAction={handleSort}
								/>
								<SortHeader
									label="Raids"
									column="raids"
									currentSort={sortColumn}
									currentDirection={sortDir}
									onSortAction={handleSort}
									className="w-20 pr-4"
								/>
							</tr>
						</thead>
						<tbody className="text-sm">
							{membersList.map((member) => (
								<tr
									key={member.id}
									className="border-b border-elevated hover:bg-subtle"
								>
									<td className="py-2.5 pl-4">
										<Link
											href={`/members/${member.id}`}
											className="font-semibold text-primary hover:text-accent"
										>
											{member.name}
										</Link>
									</td>
									<td className="py-2.5">
										<span className="flex items-center gap-1.5 whitespace-nowrap">
											{member.class && CLASS_ICONS[member.class] && (
												<Image
													src={CLASS_ICONS[member.class]}
													alt={member.class}
													width={16}
													height={16}
												/>
											)}
											<span
												className={`capitalize ${CLASS_COLORS[member.class ?? ""] ?? "text-secondary"}`}
											>
												{member.class ?? "Unknown"}
												{formatSpec(member.latestSpec, member.class) && (
													<span className="text-dimmed">
														{" "}
														({formatSpec(member.latestSpec, member.class)})
													</span>
												)}
											</span>
										</span>
									</td>
									<td className="py-2.5 pr-4 text-primary">
										{member.raidCount}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between font-body text-xs text-secondary">
					<span>
						Page {page} of {totalPages} ({totalCount} members)
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
			)}
		</div>
	);
}
