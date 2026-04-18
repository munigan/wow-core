"use client";

import { useQuery } from "@tanstack/react-query";
import {
	TooltipContent,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchWotlkItemTooltip } from "@/lib/game/wotlk-item-tooltip";

const QUALITY_COLORS: Record<number, string> = {
	0: "#9d9d9d",
	1: "#ffffff",
	2: "#1eff00",
	3: "#0070dd",
	4: "#a335ee",
	5: "#ff8000",
	6: "#e6cc80",
	7: "#00ccff",
};

export type ItemTooltipProps = {
	itemId: number;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
};

export const ItemTooltip = ({
	itemId,
	children,
	side = "right",
}: ItemTooltipProps) => {
	const { data } = useQuery({
		queryKey: ["wowhead-item", itemId],
		queryFn: () => fetchWotlkItemTooltip(itemId),
		staleTime: 30 * 60 * 1000,
	});

	const qualityColor = data
		? (QUALITY_COLORS[data.quality] ?? "#ffffff")
		: "#ffffff";

	return (
		<TooltipRoot>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent
				side={side}
				className="w-80 gap-0 border-transparent p-0"
				style={{ borderColor: qualityColor }}
			>
				{data ? (
					<div
						className="wh-tooltip px-3.5 py-2.5"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Wowhead tooltip API returns pre-built HTML
						dangerouslySetInnerHTML={{ __html: data.tooltip }}
					/>
				) : (
					<div className="px-3.5 py-2.5 font-body text-xs text-dimmed">
						Loading...
					</div>
				)}
			</TooltipContent>
		</TooltipRoot>
	);
};
