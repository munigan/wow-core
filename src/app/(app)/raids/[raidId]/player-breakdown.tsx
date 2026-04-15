"use client";

import { keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useMemo } from "react";
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
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SortHeader } from "@/components/ui/sort-header";
import {
	TooltipContent,
	TooltipLabel,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

function formatDeathTime(secs: number): string {
	const minutes = Math.floor(secs / 60);
	const seconds = secs % 60;
	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function PlayerDeathsTooltip({
	mode,
	raidId,
	encounterId,
	playerGuid,
	playerName,
	deathCount,
}: {
	mode: "encounter" | "raid";
	raidId?: string;
	encounterId?: string;
	playerGuid: string;
	playerName: string;
	deathCount: number;
}) {
	const encounterQuery = trpc.raids.getEncounterDeaths.useQuery(
		{ encounterId: encounterId ?? "" },
		{
			enabled: mode === "encounter" && deathCount > 0 && Boolean(encounterId),
		},
	);

	const raidQuery = trpc.raids.getRaidKillPlayerDeaths.useQuery(
		{ raidId: raidId ?? "", playerGuid },
		{
			enabled: mode === "raid" && deathCount > 0 && Boolean(raidId),
		},
	);

	const isLoading =
		mode === "encounter" ? encounterQuery.isLoading : raidQuery.isLoading;

	if (deathCount === 0) {
		return <span className="text-dimmed">0</span>;
	}

	const encounterDeaths =
		mode === "encounter"
			? (encounterQuery.data?.filter((d) => d.playerName === playerName) ?? [])
			: [];
	const raidDeaths = mode === "raid" ? (raidQuery.data ?? []) : [];

	const hasDetailData =
		mode === "encounter" ? encounterQuery.data : raidQuery.data;

	return (
		<TooltipRoot>
			<TooltipTrigger render={<span />}>
				<span className="cursor-default text-danger underline decoration-dashed decoration-danger/40 underline-offset-4 hover:decoration-danger">
					{deathCount}
				</span>
			</TooltipTrigger>
			<TooltipContent side="top">
				<TooltipLabel>Deaths — {playerName}</TooltipLabel>
				{isLoading || !hasDetailData ? (
					<span className="font-body text-2xs text-dimmed">Loading...</span>
				) : mode === "raid" ? (
					<div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
						{raidDeaths.map((d) => (
							<div
								key={`${d.bossName}-${d.timeIntoEncounter}-${d.killingSpell ?? "x"}`}
								className="flex flex-col gap-0.5"
							>
								<div className="flex items-center justify-between gap-6 font-body text-xs">
									<span className="text-secondary">{d.bossName}</span>
									<span className="text-dimmed">
										{formatDeathTime(d.timeIntoEncounter)}
									</span>
								</div>
								{d.killingSpell && (
									<span className="font-body text-2xs text-secondary">
										{d.killingSpell}
										{d.killedBy && d.killedBy !== "nil"
											? ` — ${d.killedBy}`
											: ""}
									</span>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
						{encounterDeaths.map((d) => (
							<div
								key={`${d.timeIntoEncounter}-${d.killingSpell ?? "x"}`}
								className="flex flex-col gap-0.5"
							>
								<div className="flex items-center justify-between gap-6 font-body text-xs">
									<span className="text-primary">{playerName}</span>
									<span className="text-dimmed">
										{formatDeathTime(d.timeIntoEncounter)}
									</span>
								</div>
								{d.killingSpell && (
									<span className="font-body text-2xs text-secondary">
										{d.killingSpell}
										{d.killedBy && d.killedBy !== "nil"
											? ` — ${d.killedBy}`
											: ""}
									</span>
								)}
							</div>
						))}
					</div>
				)}
			</TooltipContent>
		</TooltipRoot>
	);
}

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

const SPEC_ROLES: Record<string, string> = {
	"warrior-protection": "tank",
	"paladin-protection": "tank",
	"death-knight-blood": "tank",
	"druid-feral": "dps",
	"paladin-holy": "healer",
	"priest-holy": "healer",
	"priest-discipline": "healer",
	"shaman-restoration": "healer",
	"druid-restoration": "healer",
};

function getRole(spec: string | null): string {
	if (!spec) return "dps";
	return SPEC_ROLES[spec] ?? "dps";
}

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

type EncounterOption = {
	id: string;
	bossName: string;
};

const ALL_ENCOUNTERS_VALUE = "all";

type PlayerBreakdownProps = {
	raidId: string;
	encounters: EncounterOption[];
	formatNumber: (n: number) => string;
};

export function PlayerBreakdown({
	raidId,
	encounters,
	formatNumber,
}: PlayerBreakdownProps) {
	const [selectedEncounterId, setSelectedEncounterId] = useQueryState(
		"encounter",
		parseAsString.withDefault(ALL_ENCOUNTERS_VALUE),
	);

	const isAllEncounters = selectedEncounterId === ALL_ENCOUNTERS_VALUE;
	const [roleFilter, setRoleFilter] = useQueryState(
		"role",
		parseAsString.withDefault("all"),
	);
	const [classFilter, setClassFilter] = useQueryState(
		"class",
		parseAsString.withDefault("all"),
	);
	const [sortColumn, setSortColumn] = useQueryState(
		"sort",
		parseAsString.withDefault("dps"),
	);
	const [sortDir, setSortDir] = useQueryState(
		"dir",
		parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
	);

	const encounterDetailsQuery = trpc.raids.getEncounterDetails.useQuery(
		{ encounterId: selectedEncounterId },
		{
			enabled: !isAllEncounters && selectedEncounterId !== "",
			placeholderData: keepPreviousData,
		},
	);

	const aggregatedQuery =
		trpc.raids.getRaidKillPlayerBreakdownAggregated.useQuery(
			{ raidId },
			{
				enabled: isAllEncounters,
				placeholderData: keepPreviousData,
			},
		);

	const data = isAllEncounters
		? aggregatedQuery.data
		: encounterDetailsQuery.data;
	const isLoading = isAllEncounters
		? aggregatedQuery.isLoading
		: encounterDetailsQuery.isLoading;

	const filteredPlayers = useMemo(() => {
		if (!data?.players) return [];
		const filtered = data.players.filter((p) => {
			if (roleFilter !== "all" && getRole(p.spec) !== roleFilter) return false;
			if (classFilter !== "all" && p.class !== classFilter) return false;
			return true;
		});

		const dir = sortDir === "asc" ? 1 : -1;
		return filtered.sort((a, b) => {
			switch (sortColumn) {
				case "name":
					return dir * a.playerName.localeCompare(b.playerName);
				case "class":
					return dir * (a.class ?? "").localeCompare(b.class ?? "");
				case "damage":
					return dir * (a.damage - b.damage);
				case "deaths":
					return dir * (a.deathCount - b.deathCount);
				case "pots":
					return dir * (a.totalPots - b.totalPots);
				case "engi":
					return dir * (a.totalEngi - b.totalEngi);
				default:
					return dir * (a.dps - b.dps);
			}
		});
	}, [data, roleFilter, classFilter, sortColumn, sortDir]);

	if (isLoading && !data) {
		return (
			<div className="flex flex-col gap-3">
				<Skeleton className="h-4 w-48" />
				<div className="flex gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-28" />
					<Skeleton className="h-8 w-28" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{(
						[
							"pb-sk-1",
							"pb-sk-2",
							"pb-sk-3",
							"pb-sk-4",
							"pb-sk-5",
							"pb-sk-6",
							"pb-sk-7",
							"pb-sk-8",
						] as const
					).map((skId) => (
						<Skeleton
							key={skId}
							className="h-10 w-full border-t border-border"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!data?.players) return null;

	const uniqueClasses = [
		...new Set(data.players.map((p) => p.class).filter(Boolean)),
	].sort() as string[];

	const encounterSelectItems = [
		{ value: ALL_ENCOUNTERS_VALUE, label: "ALL" },
		...encounters.map((enc) => ({ value: enc.id, label: enc.bossName })),
	];

	return (
		<div className="flex flex-col gap-3">
			<span className="font-body text-xs uppercase tracking-wider text-secondary">
				Per-Player Breakdown
			</span>
			{isAllEncounters && (
				<p className="font-body text-2xs text-dimmed">
					ALL: DPS is averaged per boss; damage, deaths, and pot/engineering
					counts are summed across kill encounters.
				</p>
			)}
			<div className="flex flex-wrap items-center gap-2">
				<SelectRoot
					value={selectedEncounterId}
					items={encounterSelectItems}
					onValueChangeAction={(v) =>
						setSelectedEncounterId(v ?? ALL_ENCOUNTERS_VALUE)
					}
				>
					<SelectTrigger placeholder="Encounter" size="sm" />
					<SelectPopup>
						<SelectItem value={ALL_ENCOUNTERS_VALUE}>ALL</SelectItem>
						{encounters.map((enc) => (
							<SelectItem key={enc.id} value={enc.id}>
								{enc.bossName}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>
				<SelectRoot
					value={roleFilter}
					items={[
						{ value: "all", label: "All Roles" },
						{ value: "tank", label: "Tank" },
						{ value: "healer", label: "Healer" },
						{ value: "dps", label: "DPS" },
					]}
					onValueChangeAction={(v) => setRoleFilter(v ?? "all")}
				>
					<SelectTrigger placeholder="All Roles" size="sm" />
					<SelectPopup>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="tank">Tank</SelectItem>
						<SelectItem value="healer">Healer</SelectItem>
						<SelectItem value="dps">DPS</SelectItem>
					</SelectPopup>
				</SelectRoot>
				<SelectRoot
					value={classFilter}
					items={[
						{ value: "all", label: "All Classes" },
						...uniqueClasses.map((cls) => ({ value: cls, label: cls })),
					]}
					onValueChangeAction={(v) => setClassFilter(v ?? "all")}
				>
					<SelectTrigger placeholder="All Classes" size="sm" />
					<SelectPopup>
						<SelectItem value="all">All Classes</SelectItem>
						{uniqueClasses.map((cls) => (
							<SelectItem key={cls} value={cls}>
								{cls}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>
			</div>

			<div className="overflow-hidden border border-border bg-card">
				<table className="w-full font-body">
					<thead>
						<tr className="border-b border-border">
							<th className="w-10 py-2.5 pl-4 text-left text-2xs font-normal uppercase tracking-wider text-dimmed">
								#
							</th>
							<SortHeader
								label="Player"
								column="name"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
							/>
							<SortHeader
								label="Class"
								column="class"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
							/>
							<SortHeader
								label="DPS"
								column="dps"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-28"
							/>
							<SortHeader
								label="Damage"
								column="damage"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-28"
							/>
							<SortHeader
								label="Deaths"
								column="deaths"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-24"
							/>
							<SortHeader
								label="Pots"
								column="pots"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-16"
							/>
							<SortHeader
								label="Engi"
								column="engi"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-16 pr-4"
							/>
						</tr>
					</thead>
					<tbody className="text-sm">
						{filteredPlayers.map((player, idx) => (
							<tr
								key={isAllEncounters ? player.playerGuid : player.id}
								className="border-b border-elevated"
							>
								<td className="py-2.5 pl-4 text-dimmed">{idx + 1}</td>
								<td className="py-2.5 text-primary">{player.playerName}</td>
								<td className="py-2.5">
									<span className="flex items-center gap-1.5 whitespace-nowrap">
										{player.class && CLASS_ICONS[player.class] && (
											<Image
												src={CLASS_ICONS[player.class]}
												alt={player.class}
												width={16}
												height={16}
											/>
										)}
										<span
											className={`capitalize ${CLASS_COLORS[player.class ?? ""] ?? "text-secondary"}`}
										>
											{player.class ?? "Unknown"}
											{formatSpec(player.spec, player.class) && (
												<span className="text-dimmed">
													{" "}
													({formatSpec(player.spec, player.class)})
												</span>
											)}
										</span>
									</span>
								</td>
								<td className="py-2.5 font-semibold text-primary">
									{formatNumber(player.dps)}
								</td>
								<td className="py-2.5 text-secondary">
									{formatNumber(player.damage)}
								</td>
								<td className="py-2.5">
									<PlayerDeathsTooltip
										mode={isAllEncounters ? "raid" : "encounter"}
										raidId={raidId}
										encounterId={
											isAllEncounters ? undefined : selectedEncounterId
										}
										playerGuid={player.playerGuid}
										playerName={player.playerName}
										deathCount={player.deathCount}
									/>
								</td>
								<td
									data-has-prepot={player.hasPrePot || undefined}
									data-has-value={player.totalPots > 0 || undefined}
									className="py-2.5 text-dimmed data-has-value:text-primary data-has-prepot:text-accent"
								>
									{(() => {
										const potItems = player.consumableItems.filter(
											(c) =>
												c.type === "potion" ||
												c.type === "mana_potion" ||
												c.type === "flame_cap",
										);
										const label =
											player.totalPots > 0
												? player.hasPrePot
													? `${player.totalPots} (PP)`
													: String(player.totalPots)
												: "0";
										if (potItems.length === 0) return label;
										return (
											<TooltipRoot>
												<TooltipTrigger render={<span />}>
													<span className="cursor-default underline decoration-dashed decoration-dimmed underline-offset-4 hover:decoration-secondary">
														{label}
													</span>
												</TooltipTrigger>
												<TooltipContent side="top">
													<TooltipLabel>Consumables</TooltipLabel>
													<div className="flex flex-col gap-1">
														{potItems.map((item) => (
															<div
																key={`${item.type}-${item.spellName}`}
																className="flex items-center justify-between gap-6 font-body text-xs"
															>
																<span className="text-accent">
																	{item.spellName}
																</span>
																<span className="text-secondary">
																	x{item.count}
																</span>
															</div>
														))}
													</div>
												</TooltipContent>
											</TooltipRoot>
										);
									})()}
								</td>
								<td
									data-has-value={player.totalEngi > 0 || undefined}
									className="py-2.5 pr-4 text-dimmed data-has-value:text-primary"
								>
									{(() => {
										const engiItems = player.consumableItems.filter(
											(c) => c.type === "engineering",
										);
										if (engiItems.length === 0) return player.totalEngi;
										return (
											<TooltipRoot>
												<TooltipTrigger render={<span />}>
													<span className="cursor-default underline decoration-dashed decoration-dimmed underline-offset-4 hover:decoration-secondary">
														{player.totalEngi}
													</span>
												</TooltipTrigger>
												<TooltipContent side="top">
													<TooltipLabel>Consumables</TooltipLabel>
													<div className="flex flex-col gap-1">
														{engiItems.map((item) => (
															<div
																key={`${item.type}-${item.spellName}`}
																className="flex items-center justify-between gap-6 font-body text-xs"
															>
																<span className="text-accent">
																	{item.spellName}
																</span>
																<span className="text-secondary">
																	x{item.count}
																</span>
															</div>
														))}
													</div>
												</TooltipContent>
											</TooltipRoot>
										);
									})()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{filteredPlayers.length === 0 && (
					<div className="px-4 py-6 text-center font-body text-sm text-dimmed">
						No players match the selected filters.
					</div>
				)}
			</div>
		</div>
	);
}
