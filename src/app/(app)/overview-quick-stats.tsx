"use client";

import {
	CalendarCheck,
	FlaskConical,
	Shield,
	ShieldPlus,
	Timer,
	Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

const formatNumber = (n: number): string => {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString();
};

const formatDuration = (ms: number): string => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

type StatRowProps = {
	icon: ReactNode;
	label: string;
	value: string;
};

const StatRow = ({ icon, label, value }: StatRowProps) => (
	<div className="flex items-center gap-2.5">
		{icon}
		<span className="flex-1 font-body text-2xs font-medium uppercase tracking-wider text-secondary">
			{label}
		</span>
		<span className="font-body text-base font-semibold text-primary">
			{value}
		</span>
	</div>
);

const Divider = () => <div className="h-px w-full bg-border" />;

export const OverviewQuickStats = () => {
	const { data, isLoading } = trpc.overview.getQuickStats.useQuery();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 border border-border bg-card p-6">
				<Skeleton className="h-3 w-24" />
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex flex-col gap-4">
						{i > 0 && <Divider />}
						<div className="flex items-center gap-2.5">
							<Skeleton className="size-3.5" />
							<Skeleton className="h-3 w-24 flex-1" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4 border border-border bg-card p-6">
			<span className="font-body text-2xs font-bold uppercase tracking-wider text-secondary">
				{"// Quick Stats"}
			</span>

			{data.topDps && (
				<StatRow
					icon={<Zap className="size-3.5 text-accent" />}
					label="Top DPS"
					value={`${data.topDps.name} — ${formatNumber(data.topDps.value)}`}
				/>
			)}

			{data.mostAttended && (
				<>
					<Divider />
					<StatRow
						icon={<CalendarCheck className="size-3.5 text-accent" />}
						label="Most Attended"
						value={`${data.mostAttended.name} — ${data.mostAttended.attended}/${data.mostAttended.total}`}
					/>
				</>
			)}

			{data.bestSurvival && (
				<>
					<Divider />
					<StatRow
						icon={<Shield className="size-3.5 text-accent" />}
						label="Best Survival"
						value={`${data.bestSurvival.name} — ${data.bestSurvival.value}/raid`}
					/>
				</>
			)}

			{data.topPrePot && (
				<>
					<Divider />
					<StatRow
						icon={<FlaskConical className="size-3.5 text-accent" />}
						label="Top Pre-Pot"
						value={`${data.topPrePot.name} — ${data.topPrePot.value}%`}
					/>
				</>
			)}

			{data.mostResilient && (
				<>
					<Divider />
					<StatRow
						icon={<ShieldPlus className="size-3.5 text-accent" />}
						label="Most Resilient"
						value={`${data.mostResilient.name} — ${formatNumber(data.mostResilient.value)}/fight`}
					/>
				</>
			)}

			{data.fastestKill && (
				<>
					<Divider />
					<StatRow
						icon={<Timer className="size-3.5 text-accent" />}
						label="Fastest Kill"
						value={`${data.fastestKill.bossName} — ${formatDuration(data.fastestKill.durationMs)}`}
					/>
				</>
			)}
		</div>
	);
};
