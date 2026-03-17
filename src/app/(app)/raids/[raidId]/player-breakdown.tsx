"use client";

import Image from "next/image";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
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

function formatSpec(spec: string | null, playerClass: string | null): string | null {
	if (!spec || !playerClass) return null;
	const classPrefix = playerClass === "death-knight" ? "death-knight-" : `${playerClass}-`;
	if (!spec.startsWith(classPrefix)) return null;
	const specName = spec.slice(classPrefix.length);
	return specName.charAt(0).toUpperCase() + specName.slice(1);
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
	const [selectedEncounterId, setSelectedEncounterId] = useState<string>(
		encounters[0]?.id ?? "",
	);
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [classFilter, setClassFilter] = useState<string>("all");

	const { data, isLoading } = trpc.raids.getEncounterDetails.useQuery(
		{ encounterId: selectedEncounterId },
		{
			enabled: selectedEncounterId !== "",
			placeholderData: keepPreviousData,
		},
	);

	const filteredPlayers = useMemo(() => {
		if (!data) return [];
		return data.players.filter((p) => {
			if (roleFilter !== "all" && getRole(p.spec) !== roleFilter)
				return false;
			if (classFilter !== "all" && p.class !== classFilter) return false;
			return true;
		});
	}, [data, roleFilter, classFilter]);

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
			<span className="font-body text-xs uppercase tracking-wider text-dimmed">
				Per-Player Breakdown
			</span>
			<div className="flex items-center gap-2">
				<SelectRoot
					value={selectedEncounterId}
					items={encounters.map((enc) => ({ value: enc.id, label: enc.bossName }))}
					onValueChangeAction={(v) => setSelectedEncounterId(v ?? encounters[0]?.id ?? "")}
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
						<tr className="border-b border-border text-2xs uppercase tracking-wider text-secondary">
							<th className="w-10 py-2.5 pl-4 text-left font-normal">#</th>
							<th className="py-2.5 text-left font-normal">Player</th>
							<th className="py-2.5 text-left font-normal">Class</th>
							<th className="w-20 py-2.5 text-left font-normal">DPS</th>
							<th className="w-20 py-2.5 text-left font-normal">Damage</th>
							<th className="w-16 py-2.5 pr-4 text-left font-normal">Deaths</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{filteredPlayers.map((player, idx) => (
							<tr
								key={player.id}
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
													{" "}({formatSpec(player.spec, player.class)})
												</span>
											)}
										</span>
									</span>
								</td>
								<td className="py-2.5 font-semibold text-accent">
									{formatNumber(player.dps)}
								</td>
								<td className="py-2.5 text-secondary">
									{formatNumber(player.damage)}
								</td>
								<td
									data-has-deaths={player.deathCount > 0 || undefined}
									className="py-2.5 pr-4 text-dimmed data-has-deaths:text-danger"
								>
									{player.deathCount}
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
