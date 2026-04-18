export type WotlkItemTooltipData = {
	name: string;
	quality: number;
	icon: string;
	tooltip: string;
};

/**
 * WotLK item tooltip JSON from Wowhead (same source as `item-tooltip.tsx`).
 */
export async function fetchWotlkItemTooltip(
	itemId: number,
): Promise<WotlkItemTooltipData> {
	const res = await fetch(
		`https://nether.wowhead.com/wotlk/tooltip/item/${itemId}`,
	);

	if (!res.ok) {
		throw new Error(`Wowhead API error: ${res.status}`);
	}

	return res.json() as Promise<WotlkItemTooltipData>;
}

export function parseItemLevelFromWowheadTooltipHtml(
	tooltipHtml: string,
): number | null {
	const plain = tooltipHtml.replace(/<[^>]+>/g, " ");
	const m = /Item Level\s+(\d+)/i.exec(plain);
	return m ? Number(m[1]) : null;
}
