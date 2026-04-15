"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
	TooltipContent,
	TooltipLabel,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

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
	killOrder: number;
	/** Earlier pulls shown under expand (counted as wipe attempts for the badge) */
	priorAttemptCount: number;
	/** When true, the primary row is the raid’s last successful kill for this boss */
	isPrimarySuccessfulKill: boolean;
	/** Earlier / other attempts (chronological); always shown as wipe in the UI */
	nestedAttempts: EncounterData[];
	formatNumber: (n: number) => string;
};

function formatEncounterDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDeathTime(secs: number): string {
	const minutes = Math.floor(secs / 60);
	const seconds = secs % 60;
	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function DeathsTooltip({
	encounterId,
	deathCount,
}: {
	encounterId: string;
	deathCount: number;
}) {
	const { data, isLoading } = trpc.raids.getEncounterDeaths.useQuery(
		{ encounterId },
		{ enabled: deathCount > 0 },
	);

	if (deathCount === 0) {
		return <span className="text-dimmed">0</span>;
	}

	return (
		<TooltipRoot>
			<TooltipTrigger render={<span />}>
				<span className="cursor-default text-danger underline decoration-dashed decoration-danger/40 underline-offset-4 hover:decoration-danger">
					{deathCount}
				</span>
			</TooltipTrigger>
			<TooltipContent side="top">
				<TooltipLabel>Deaths</TooltipLabel>
				{isLoading || !data ? (
					<span className="font-body text-2xs text-dimmed">Loading...</span>
				) : (
					<div className="flex flex-col gap-1.5">
						{data.map((death) => (
							<div
								key={`${death.playerName}-${death.timeIntoEncounter}-${death.killingSpell ?? "x"}`}
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

export function EncounterRow({
	encounter,
	killOrder,
	priorAttemptCount,
	isPrimarySuccessfulKill,
	nestedAttempts,
	formatNumber,
}: EncounterRowProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasNested = nestedAttempts.length > 0;

	return (
		<>
			<tr
				data-expandable={hasNested || undefined}
				className="border-b border-elevated text-sm data-expandable:cursor-pointer data-expandable:hover:bg-subtle"
				onClick={hasNested ? () => setIsExpanded((prev) => !prev) : undefined}
			>
				<td className="w-14 py-3 pl-4 text-dimmed">{killOrder}</td>
				<td className="py-3">
					<span className="flex items-center gap-2">
						{hasNested && (
							<span className="text-dimmed">
								{isExpanded ? (
									<ChevronDown className="size-3.5" />
								) : (
									<ChevronRight className="size-3.5" />
								)}
							</span>
						)}
						<span className="text-primary">{encounter.bossName}</span>
						{priorAttemptCount > 0 && (
							<span className="text-2xs text-danger">
								{priorAttemptCount} {priorAttemptCount === 1 ? "wipe" : "wipes"}
							</span>
						)}
					</span>
				</td>
				<td className="py-3 text-primary">{formatNumber(encounter.raidDps)}</td>
				<td className="py-3 text-secondary">
					{formatEncounterDuration(encounter.durationMs)}
				</td>
				<td className="py-3">
					<DeathsTooltip
						encounterId={encounter.id}
						deathCount={encounter.deathCount}
					/>
				</td>
				<td className="py-3 pr-4">
					{isPrimarySuccessfulKill ? (
						<span className="bg-accent-20 px-2 py-0.5 text-3xs font-semibold uppercase text-accent">
							Kill
						</span>
					) : (
						<span className="bg-danger-20 px-2 py-0.5 text-3xs font-semibold uppercase text-danger">
							Wipe
						</span>
					)}
				</td>
			</tr>

			{isExpanded &&
				nestedAttempts.map((attempt, idx) => (
					<tr
						key={attempt.id}
						className="border-b border-elevated bg-page text-xs text-secondary shadow-[inset_2px_0_0_0_var(--color-danger-40)]"
					>
						<td className="py-2 pl-4" />
						<td className="py-2 pl-4">Attempt {idx + 1}</td>
						<td className="py-2">{formatNumber(attempt.raidDps)}</td>
						<td className="py-2 text-secondary">
							{formatEncounterDuration(attempt.durationMs)}
						</td>
						<td className="py-2">
							<DeathsTooltip
								encounterId={attempt.id}
								deathCount={attempt.deathCount}
							/>
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
