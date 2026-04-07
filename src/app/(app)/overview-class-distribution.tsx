"use client";

import Image from "next/image";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
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

const ICON_SIZE = 20;

type ClassDataPoint = {
	class: string;
	count: number;
	players: string[];
};

type RadarTooltipProps = {
	active?: boolean;
	payload?: { payload: ClassDataPoint }[];
};

const RadarTooltip = ({ active, payload }: RadarTooltipProps) => {
	if (!active || !payload?.length) return null;
	const point = payload[0].payload;
	const icon = CLASS_ICONS[point.class];
	const color = CLASS_COLOR_HEX[point.class] ?? "var(--color-primary)";

	return (
		<div className="border border-accent bg-sidebar px-3.5 py-2.5">
			<div className="flex items-center gap-2">
				{icon && <Image src={icon} alt={point.class} width={16} height={16} />}
				<span
					className="font-body text-xs font-bold uppercase"
					style={{ color }}
				>
					{point.class}
				</span>
				<span className="font-body text-xs font-semibold text-accent">
					{point.count}
				</span>
			</div>
			<div className="mt-1.5 flex flex-col gap-0.5">
				{point.players.map((name) => (
					<span key={name} className="font-body text-2xs text-secondary">
						{name}
					</span>
				))}
			</div>
		</div>
	);
};

type CustomTickProps = {
	x: number;
	y: number;
	payload: { value: string };
};

const CustomTick = ({ x, y, payload }: CustomTickProps) => {
	const icon = CLASS_ICONS[payload.value];
	if (!icon) return null;

	return (
		<image
			href={icon.src}
			x={x - ICON_SIZE / 2}
			y={y - ICON_SIZE / 2}
			width={ICON_SIZE}
			height={ICON_SIZE}
		/>
	);
};

export const OverviewClassDistribution = () => {
	const { data, isLoading } = trpc.overview.getClassDistribution.useQuery();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 border border-border bg-card p-6">
				<Skeleton className="h-3 w-36" />
				<div className="flex items-center justify-center">
					<Skeleton className="size-52 rounded-full" />
				</div>
			</div>
		);
	}

	if (!data || data.length === 0) return null;

	return (
		<div className="flex flex-col gap-4 border border-border bg-card p-6">
			<span className="font-body text-2xs font-bold uppercase tracking-wider text-secondary">
				{"// Class Distribution"}
			</span>
			<div className="min-h-0 flex-1">
				<ResponsiveContainer width="100%" height="100%">
					<RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
						<PolarGrid stroke="var(--color-border)" strokeDasharray="4 4" />
						<PolarAngleAxis
							dataKey="class"
							tick={CustomTick as never}
							tickSize={28}
						/>
						<Tooltip content={<RadarTooltip />} cursor={false} />
						<Radar
							dataKey="count"
							fill="var(--color-accent)"
							fillOpacity={0.15}
							stroke="var(--color-accent)"
							strokeWidth={1.5}
							dot={{
								r: 3,
								fill: "var(--color-accent)",
								strokeWidth: 0,
							}}
						/>
					</RadarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
