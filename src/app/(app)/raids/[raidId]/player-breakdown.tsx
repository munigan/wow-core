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
	encounterId,
	playerName,
	deathCount,
}: {
	encounterId: string;
	playerName: string;
	deathCount: number;
}) {
	const { data, isLoading } = trpc.raids.getEncounterDeaths.useQuery(
		{ encounterId },
		{ enabled: deathCount > 0 },
	);

	if (deathCount === 0) {
		return <span className="text-dimmed">0</span>;
	}

	const playerDeaths = data?.filter((d) => d.playerName === playerName) ?? [];

	return (
		<TooltipRoot>
			<TooltipTrigger render={<span />}>
				<span className="cursor-default text-danger underline decoration-dashed decoration-danger/40 underline-offset-4 hover:decoration-danger">
					{deathCount}
				</span>
			</TooltipTrigger>
			<TooltipContent side="top">
				<TooltipLabel>Deaths — {playerName}</TooltipLabel>
				{isLoading || !data ? (
					<span className="font-body text-2xs text-dimmed">Loading...</span>
				) : (
					<div className="flex flex-col gap-1.5">
						{playerDeaths.map((death, i) => (
							<div
								key={`${death.timeIntoEncounter}-${i}`}
								className="flex flex-col gap-0.5"
							>
								<div className="flex items-center justify-between gap-6 font-body text-xs">
									<span className="text-primary">{death.playerName}</span>
									<span className="text-dimmed">
										{formatDeathTime(death.timeIntoEncounter)}
									</span>
								</div>
								{death.killingSpell && (
									<span className="font-body text-2xs text-secondary">
										{death.killingSpell}
										{death.killedBy && death.killedBy !== "nil"
											? ` — ${death.killedBy}`
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

function getUptimeAttrs(
	value: number | null,
): Record<string, boolean | undefined> {
	if (value === null) return {};
	if (value >= 100) return { "data-full": true };
	if (value >= 80) return { "data-partial": true };
	return {};
}

function formatUptime(value: number | null): string {
	if (value === null) return "—";
	return `${Math.round(value)}%`;
}

type EncounterOption = {
	id: string;
	bossName: string;
};

type PlayerBreakdownProps = {
	encounters: EncounterOption[];
	formatNumber: (n: number) => string;
};

export function PlayerBreakdown({
	encounters,
	formatNumber,
}: PlayerBreakdownProps) {
	const [selectedEncounterId, setSelectedEncounterId] = useQueryState(
		"encounter",
		parseAsString.withDefault(encounters[0]?.id ?? ""),
	);
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

	const { data, isLoading } = trpc.raids.getEncounterDetails.useQuery(
		{ encounterId: selectedEncounterId },
		{
			enabled: selectedEncounterId !== "",
			placeholderData: keepPreviousData,
		},
	);

	const filteredPlayers = useMemo(() => {
		if (!data) return [];
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
				case "flask":
					return dir * ((a.flaskUptime ?? -1) - (b.flaskUptime ?? -1));
				case "food":
					return dir * ((a.foodUptime ?? -1) - (b.foodUptime ?? -1));
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
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-full border-t border-border" />
					))}
				</div>
			</div>
		);
	}

	if (!data) return null;

	const uniqueClasses = [
		...new Set(data.players.map((p) => p.class).filter(Boolean)),
	].sort() as string[];

	return (
		<div className="flex flex-col gap-3">
			<span className="font-body text-xs uppercase tracking-wider text-secondary">
				Per-Player Breakdown
			</span>
			<div className="flex items-center gap-2">
				<SelectRoot
					value={selectedEncounterId}
					items={encounters.map((enc) => ({
						value: enc.id,
						label: enc.bossName,
					}))}
					onValueChangeAction={(v) =>
						setSelectedEncounterId(v ?? encounters[0]?.id ?? "")
					}
				>
					<SelectTrigger placeholder="Select Encounter" size="sm" />
					<SelectPopup>
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
								label="Flask"
								column="flask"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-16"
							/>
							<SortHeader
								label="Food"
								column="food"
								currentSort={sortColumn}
								currentDirection={sortDir}
								onSortAction={(c, d) => {
									setSortColumn(c);
									setSortDir(d);
								}}
								className="w-16"
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
							<tr key={player.id} className="border-b border-elevated">
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
										encounterId={selectedEncounterId}
										playerName={player.playerName}
										deathCount={player.deathCount}
									/>
								</td>
								<td
									{...getUptimeAttrs(player.flaskUptime)}
									className="py-2.5 text-danger data-full:text-accent data-partial:text-warning"
								>
									{formatUptime(player.flaskUptime)}
								</td>
								<td
									{...getUptimeAttrs(player.foodUptime)}
									className="py-2.5 text-danger data-full:text-accent data-partial:text-warning"
								>
									{formatUptime(player.foodUptime)}
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
																key={item.spellName}
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
																key={item.spellName}
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
