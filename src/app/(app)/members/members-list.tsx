"use client";

import { keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
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

function formatSpec(spec: string | null, playerClass: string | null): string | null {
	if (!spec || !playerClass) return null;
	const classPrefix = playerClass === "death-knight" ? "death-knight-" : `${playerClass}-`;
	if (!spec.startsWith(classPrefix)) return null;
	const specName = spec.slice(classPrefix.length);
	return specName.charAt(0).toUpperCase() + specName.slice(1);
}

export function MembersList() {
	const [classFilter, setClassFilter] = useQueryState(
		"class",
		parseAsString.withDefault(""),
	);
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);

	const { data: membersList, isLoading } = trpc.members.listWithStats.useQuery(
		{
			class: classFilter || undefined,
			search: search || undefined,
		},
		{ placeholderData: keepPreviousData },
	);

	const uniqueClasses = [
		...new Set(
			(membersList ?? [])
				.map((m) => m.class)
				.filter(Boolean),
		),
	].sort() as string[];

	const classItems = [
		{ value: "", label: "All Classes" },
		...uniqueClasses.map((cls) => ({ value: cls, label: cls })),
	];

	if (isLoading && !membersList) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full border-t border-border" />
					))}
				</div>
			</div>
		);
	}

	const hasNoMembers = !membersList || membersList.length === 0;
	const isFiltered = classFilter !== "" || search !== "";

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<div className="flex items-center gap-2">
				<SelectRoot
					value={classFilter}
					items={classItems}
					onValueChangeAction={(v) => setClassFilter(v ?? "")}
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
					onChange={(e) => setSearch(e.target.value || null)}
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
							<tr className="border-b border-border text-2xs uppercase tracking-wider text-dimmed">
								<th className="py-2.5 pl-4 text-left font-normal">Name</th>
								<th className="py-2.5 text-left font-normal">Class</th>
								<th className="w-20 py-2.5 pr-4 text-left font-normal">Raids</th>
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
														{" "}({formatSpec(member.latestSpec, member.class)})
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
		</div>
	);
}
