"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { EncounterRow } from "./encounter-row";
import { PlayerBreakdown } from "./player-breakdown";

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
	const { data } = trpc.raids.getById.useQuery({ raidId });
	const [selectedEncounterId, setSelectedEncounterId] = useState<
		string | null
	>(null);

	if (!data) return null;

	const { encounters, ...raid } = data;

	const killEncounters = encounters.filter((e) => e.result === "kill");
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

	const uniqueBossKills = new Set(killEncounters.map((e) => e.bossName)).size;
	const difficulties = killEncounters.reduce(
		(acc, e) => {
			const diff = e.difficulty ?? "N/C";
			acc.set(diff, (acc.get(diff) ?? 0) + 1);
			return acc;
		},
		new Map<string, number>(),
	);
	const difficultyText = [...difficulties.entries()]
		.map(([diff, count]) => `${count}x ${diff}`)
		.join(", ");

	const uniquePlayerCount = data.uniquePlayerCount;

	const raidDateStr = new Date(raid.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	// Default selected encounter: first kill
	const activeEncounterId =
		selectedEncounterId ?? killEncounters[0]?.id ?? null;

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
			<div className="grid grid-cols-4 gap-3">
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Raid DPS
					</span>
					<span className="font-heading text-2xl font-bold text-accent">
						{formatNumber(raidDps)}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Duration
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{formatDuration(raid.durationMs ?? 0)}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Bosses
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{uniqueBossKills}
					</span>
					<span className="font-body text-3xs text-dimmed">
						{difficultyText}
					</span>
				</div>
				<div className="flex flex-col gap-1 border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Players
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{uniquePlayerCount}
					</span>
				</div>
			</div>

			{/* Encounters Table */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-dimmed">
					Encounters / Bosses
				</span>
				<div className="overflow-hidden border border-border bg-card">
					{/* Header row */}
					<div className="flex border-b border-border px-4 py-2.5 font-body text-2xs uppercase tracking-wider text-secondary">
						<div className="flex-[3]">Encounter</div>
						<div className="flex-[1.5]">DPS</div>
						<div className="flex-1">Duration</div>
						<div className="flex-1">Deaths</div>
						<div className="flex-1">Status</div>
					</div>
					{/* Kill rows */}
					{killEncounters.map((enc) => (
						<EncounterRow
							key={enc.id}
							encounter={enc}
							wipeCount={wipeCountByBoss.get(enc.bossName) ?? 0}
							wipes={wipesByBoss.get(enc.bossName) ?? []}
							isSelected={enc.id === activeEncounterId}
							onSelect={() => setSelectedEncounterId(enc.id)}
							formatNumber={formatNumber}
						/>
					))}
				</div>
			</div>

			{/* Per-Player Breakdown */}
			{activeEncounterId && (
				<PlayerBreakdown
					encounterId={activeEncounterId}
					formatNumber={formatNumber}
				/>
			)}
		</div>
	);
}
