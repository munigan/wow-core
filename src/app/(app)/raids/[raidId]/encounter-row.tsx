"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type EncounterData = {
	id: string;
	bossName: string;
	durationMs: number;
	result: string;
	difficulty: string | null;
	totalDamage: number;
	raidDps: number;
	deathCount: number;
};

type EncounterRowProps = {
	encounter: EncounterData;
	wipeCount: number;
	wipes: EncounterData[];
	formatNumber: (n: number) => string;
};

function formatEncounterDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function EncounterRow({
	encounter,
	wipeCount,
	wipes,
	formatNumber,
}: EncounterRowProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasWipes = wipeCount > 0;

	return (
		<>
			<tr
				data-expandable={hasWipes || undefined}
				className="border-b border-elevated text-sm data-expandable:cursor-pointer data-expandable:hover:bg-subtle"
				onClick={hasWipes ? () => setIsExpanded((prev) => !prev) : undefined}
			>
				<td className="py-3 pl-4">
					<span className="flex items-center gap-2">
						{hasWipes && (
							<span className="text-dimmed">
								{isExpanded ? (
									<ChevronDown className="size-3.5" />
								) : (
									<ChevronRight className="size-3.5" />
								)}
							</span>
						)}
						<span className="text-primary">{encounter.bossName}</span>
						{hasWipes && (
							<span className="text-2xs text-danger">
								{wipeCount} {wipeCount === 1 ? "wipe" : "wipes"}
							</span>
						)}
					</span>
				</td>
				<td className="py-3 text-primary">
					{formatNumber(encounter.raidDps)}
				</td>
				<td className="py-3 text-secondary">
					{formatEncounterDuration(encounter.durationMs)}
				</td>
				<td
					data-has-deaths={encounter.deathCount > 0 || undefined}
					className="py-3 text-dimmed data-has-deaths:text-danger"
				>
					{encounter.deathCount}
				</td>
				<td className="py-3 pr-4">
					<span className="bg-accent-20 px-2 py-0.5 text-3xs font-semibold uppercase text-accent">
						Kill
					</span>
				</td>
			</tr>

			{isExpanded &&
				wipes.map((wipe, idx) => (
					<tr
						key={wipe.id}
						className="border-b border-elevated border-l-2 border-l-danger/40 bg-page text-xs text-secondary"
					>
						<td className="py-2 pl-8">Attempt {idx + 1}</td>
						<td className="py-2">{formatNumber(wipe.raidDps)}</td>
						<td className="py-2 text-secondary">
							{formatEncounterDuration(wipe.durationMs)}
						</td>
						<td
							data-has-deaths={wipe.deathCount > 0 || undefined}
							className="py-2 text-dimmed data-has-deaths:text-danger"
						>
							{wipe.deathCount}
						</td>
						<td className="py-2 pr-4">
							<span className="bg-danger-20 px-2 py-0.5 text-3xs font-semibold uppercase text-danger">
								Wipe
							</span>
						</td>
					</tr>
				))}
		</>
	);
}
