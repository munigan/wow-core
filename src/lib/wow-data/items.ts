import { cacheLife, cacheTag } from "next/cache";

export type ItemData = {
	itemId: number;
	name: string;
	quality: number;
	icon: string;
	itemLevel: number;
};

export async function fetchItemData(itemId: number): Promise<ItemData> {
	"use cache";
	cacheLife("max");
	cacheTag("wowhead-item", String(itemId));

	try {
		const res = await fetch(
			`https://nether.wowhead.com/wotlk/tooltip/item/${itemId}`,
		);
		if (!res.ok) {
			return { itemId, name: "Unknown Item", quality: 0, icon: "", itemLevel: 0 };
		}

		const data = await res.json();
		const itemLevelMatch = data.tooltip?.match(/Item Level\s*(?:<!--\w*-->)?\s*(\d+)/);
		const itemLevel = itemLevelMatch ? Number.parseInt(itemLevelMatch[1], 10) : 0;

		return {
			itemId,
			name: data.name ?? "Unknown Item",
			quality: data.quality ?? 0,
			icon: data.icon ?? "",
			itemLevel,
		};
	} catch {
		return { itemId, name: "Unknown Item", quality: 0, icon: "", itemLevel: 0 };
	}
}
