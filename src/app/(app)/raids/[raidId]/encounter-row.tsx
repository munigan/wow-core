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
	isSelected: boolean;
	onSelect: () => void;
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
	isSelected,
	onSelect,
	formatNumber,
}: EncounterRowProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasWipes = wipeCount > 0;

	return (
		<>
			<button
				type="button"
				data-selected={isSelected || undefined}
				className="flex w-full items-center border-b border-elevated px-4 py-3 text-left font-body text-sm transition-colors hover:bg-subtle data-selected:bg-accent-10"
				onClick={() => {
					onSelect();
					if (hasWipes) setIsExpanded((prev) => !prev);
				}}
			>
				<div className="flex flex-[3] items-center gap-2">
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
				</div>
				<div className="flex-[1.5] text-accent">
					{formatNumber(encounter.raidDps)}
				</div>
				<div className="flex-1 text-dimmed">
					{formatEncounterDuration(encounter.durationMs)}
				</div>
				<div
					data-has-deaths={encounter.deathCount > 0 || undefined}
					className="flex-1 text-dimmed data-has-deaths:text-danger"
				>
					{encounter.deathCount}
				</div>
				<div className="flex-1">
					<span className="bg-accent-20 px-2 py-0.5 text-3xs font-semibold uppercase text-accent">
						Kill
					</span>
				</div>
			</button>

			{/* Expanded wipe sub-rows */}
			{isExpanded &&
				wipes.map((wipe, idx) => (
					<div
						key={wipe.id}
						className="flex items-center border-b border-elevated border-l-2 border-l-danger/40 bg-page px-4 py-2 pl-8 font-body text-xs text-secondary"
					>
						<div className="flex-[3]">Attempt {idx + 1}</div>
						<div className="flex-[1.5]">{formatNumber(wipe.raidDps)}</div>
						<div className="flex-1 text-dimmed">
							{formatEncounterDuration(wipe.durationMs)}
						</div>
						<div
							data-has-deaths={wipe.deathCount > 0 || undefined}
							className="flex-1 text-dimmed data-has-deaths:text-danger"
						>
							{wipe.deathCount}
						</div>
						<div className="flex-1">
							<span className="bg-danger-20 px-2 py-0.5 text-3xs font-semibold uppercase text-danger">
								Wipe
							</span>
						</div>
					</div>
				))}
		</>
	);
}
