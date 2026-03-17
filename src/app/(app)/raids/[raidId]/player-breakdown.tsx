"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc/client";

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

type PlayerBreakdownProps = {
	encounterId: string;
	formatNumber: (n: number) => string;
};

export function PlayerBreakdown({
	encounterId,
	formatNumber,
}: PlayerBreakdownProps) {
	const { data, isLoading } = trpc.raids.getEncounterDetails.useQuery({
		encounterId,
	});
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [classFilter, setClassFilter] = useState<string>("all");

	const filteredPlayers = useMemo(() => {
		if (!data) return [];
		return data.players.filter((p) => {
			if (roleFilter !== "all" && getRole(p.spec) !== roleFilter)
				return false;
			if (classFilter !== "all" && p.class !== classFilter) return false;
			return true;
		});
	}, [data, roleFilter, classFilter]);

	if (isLoading) {
		return (
			<div className="font-body text-sm text-dimmed">
				Loading player data...
			</div>
		);
	}

	if (!data) return null;

	const uniqueClasses = [
		...new Set(data.players.map((p) => p.class).filter(Boolean)),
	].sort() as string[];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="font-body text-xs uppercase tracking-wider text-dimmed">
					Per-Player Breakdown
				</span>
				<div className="flex gap-2">
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="border border-border bg-elevated px-2 py-1 font-body text-2xs text-secondary"
					>
						<option value="all">All Roles</option>
						<option value="tank">Tank</option>
						<option value="healer">Healer</option>
						<option value="dps">DPS</option>
					</select>
					<select
						value={classFilter}
						onChange={(e) => setClassFilter(e.target.value)}
						className="border border-border bg-elevated px-2 py-1 font-body text-2xs text-secondary capitalize"
					>
						<option value="all">All Classes</option>
						{uniqueClasses.map((cls) => (
							<option key={cls} value={cls} className="capitalize">
								{cls}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="overflow-hidden border border-border bg-card">
				{/* Header */}
				<div className="flex border-b border-border px-4 py-2.5 font-body text-3xs uppercase tracking-wider text-dimmed">
					<div className="w-8">#</div>
					<div className="flex-[2]">Player</div>
					<div className="flex-1">Class</div>
					<div className="flex-[1.5]">DPS</div>
					<div className="flex-1">Damage</div>
					<div className="flex-1">Deaths</div>
				</div>
				{/* Rows */}
				{filteredPlayers.map((player, idx) => (
					<div
						key={player.id}
						className="flex items-center border-b border-elevated px-4 py-2.5 font-body text-sm"
					>
						<div className="w-8 text-dimmed">{idx + 1}</div>
						<div className="flex-[2] text-primary">
							{player.playerName}
						</div>
						<div className="flex-1">
							<span
								className={`capitalize ${CLASS_COLORS[player.class ?? ""] ?? "text-secondary"}`}
							>
								{player.class ?? "Unknown"}
							</span>
						</div>
						<div className="flex-[1.5] font-semibold text-accent">
							{formatNumber(player.dps)}
						</div>
						<div className="flex-1 text-secondary">
							{formatNumber(player.damage)}
						</div>
						<div
							className={`flex-1 ${player.deathCount > 0 ? "text-danger" : "text-dimmed"}`}
						>
							{player.deathCount}
						</div>
					</div>
				))}
				{filteredPlayers.length === 0 && (
					<div className="px-4 py-6 text-center font-body text-sm text-dimmed">
						No players match the selected filters.
					</div>
				)}
			</div>
		</div>
	);
}
