"use client";

import {
	CalendarCheck,
	FlaskConical,
	Shield,
	ShieldPlus,
	Timer,
	Zap,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
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

const CLASS_COLOR_HEX: Record<string, string> = {
	warrior: "#C69B6D",
	paladin: "#F48CBA",
	hunter: "#AAD372",
	rogue: "#FFF468",
	priest: "#FFFFFF",
	"death-knight": "#C41E3A",
	shaman: "#0070DD",
	mage: "#3FC7EB",
	warlock: "#8788EE",
	druid: "#FF7C0A",
};

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
	playerName?: string;
	playerClass?: string | null;
	value: string;
};

const StatRow = ({
	icon,
	label,
	playerName,
	playerClass,
	value,
}: StatRowProps) => {
	const classIcon = playerClass ? CLASS_ICONS[playerClass] : undefined;
	const classColor = playerClass
		? (CLASS_COLOR_HEX[playerClass] ?? "var(--color-primary)")
		: undefined;

	return (
		<div className="flex items-center gap-2.5">
			{icon}
			<span className="flex-1 font-body text-2xs font-medium uppercase tracking-wider text-secondary">
				{label}
			</span>
			{playerName && (
				<>
					<span className="flex items-center gap-1.5">
						{classIcon && (
							<Image
								src={classIcon}
								alt={playerClass ?? ""}
								width={14}
								height={14}
							/>
						)}
						<span
							className="font-body text-base font-semibold"
							style={{ color: classColor }}
						>
							{playerName}
						</span>
					</span>
					<span className="font-body text-2xs text-dimmed">—</span>
				</>
			)}
			<span className="font-body text-base font-semibold text-primary">
				{value}
			</span>
		</div>
	);
};

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
					playerName={data.topDps.name}
					playerClass={data.topDps.class}
					value={formatNumber(data.topDps.value)}
				/>
			)}

			{data.mostAttended && (
				<>
					<Divider />
					<StatRow
						icon={<CalendarCheck className="size-3.5 text-accent" />}
						label="Most Attended"
						playerName={data.mostAttended.name}
						playerClass={data.mostAttended.class}
						value={`${data.mostAttended.attended}/${data.mostAttended.total}`}
					/>
				</>
			)}

			{data.bestSurvival && (
				<>
					<Divider />
					<StatRow
						icon={<Shield className="size-3.5 text-accent" />}
						label="Best Survival"
						playerName={data.bestSurvival.name}
						playerClass={data.bestSurvival.class}
						value={`${data.bestSurvival.value}/raid`}
					/>
				</>
			)}

			{data.topPrePot && (
				<>
					<Divider />
					<StatRow
						icon={<FlaskConical className="size-3.5 text-accent" />}
						label="Top Pre-Pot"
						playerName={data.topPrePot.name}
						playerClass={data.topPrePot.class}
						value={`${data.topPrePot.value}%`}
					/>
				</>
			)}

			{data.mostResilient && (
				<>
					<Divider />
					<StatRow
						icon={<ShieldPlus className="size-3.5 text-accent" />}
						label="Most Resilient"
						playerName={data.mostResilient.name}
						playerClass={data.mostResilient.class}
						value={`${formatNumber(data.mostResilient.value)}/fight`}
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
