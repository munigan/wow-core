import { load } from "cheerio";
import {
	isArmorySlotEnchantable,
	isArmorySlotGemColumnApplicable,
	WARMANE_ARMORY_SLOT_LABELS,
} from "@/lib/game/warmane-armory-slots";

export type ParsedArmoryRel = {
	itemId: number;
	enchId: number | null;
	gemParts: string[];
};

export type ParsedArmorySlot = {
	sortOrder: number;
	slotLabel: string;
	rel: ParsedArmoryRel | null;
	qualityFromClass: number | null;
};

function parseRelAttribute(rel: string | undefined): ParsedArmoryRel | null {
	if (!rel) return null;
	const itemMatch = /item=(\d+)/.exec(rel);
	if (!itemMatch) return null;
	const itemId = Number(itemMatch[1]);
	const enchMatch = /ench=(\d+)/.exec(rel);
	const enchId = enchMatch ? Number(enchMatch[1]) : null;
	const gemsMatch = /gems=([^&"]*)/.exec(rel);
	const gemParts = gemsMatch?.[1]?.split(":").filter((s) => s.length > 0) ?? [];
	return { itemId, enchId, gemParts };
}

function qualityFromIconDiv(classAttr: string | undefined): number | null {
	if (!classAttr) return null;
	const m = /icon-quality(\d+)/.exec(classAttr);
	return m ? Number(m[1]) : null;
}

/**
 * Parse Warmane character profile HTML (`/character/{name}/{realm}/profile`).
 */
export function parseWarmaneArmoryProfileHtml(
	html: string,
): ParsedArmorySlot[] {
	const $ = load(html);
	const slots: ParsedArmorySlot[] = [];
	$("#character-profile .item-model .item-slot").each((index, el) => {
		const label = WARMANE_ARMORY_SLOT_LABELS[index];
		if (!label) return;

		const anchor = $(el).find("a[rel]").first();
		const relRaw = anchor.attr("rel") ?? undefined;
		const rel = parseRelAttribute(relRaw);
		const iconDiv = $(el).find(".icon-quality").first();
		const qualityFromClass = qualityFromIconDiv(iconDiv.attr("class"));

		slots.push({
			sortOrder: index,
			slotLabel: label,
			rel,
			qualityFromClass,
		});
	});

	return slots;
}

export function computeEnchantGemStatus(
	slotLabel: string,
	rel: ParsedArmoryRel | null,
): {
	enchantStatus: "yes" | "no" | "na";
	gemStatus: "yes" | "no" | "empty" | "na";
} {
	if (!rel) {
		return { enchantStatus: "na", gemStatus: "na" };
	}

	const enchantable = isArmorySlotEnchantable(slotLabel);
	let enchantStatus: "yes" | "no" | "na";
	if (!enchantable) {
		enchantStatus = "na";
	} else if (rel.enchId !== null && rel.enchId > 0) {
		enchantStatus = "yes";
	} else {
		enchantStatus = "no";
	}

	let gemStatus: "yes" | "no" | "empty" | "na";
	if (!isArmorySlotGemColumnApplicable(slotLabel)) {
		gemStatus = "na";
	} else if (rel.gemParts.length === 0) {
		gemStatus = "na";
	} else if (rel.gemParts.some((p) => p === "0")) {
		gemStatus = "empty";
	} else {
		gemStatus = "yes";
	}

	return { enchantStatus, gemStatus };
}

export function buildWarmaneProfileUrl(
	characterName: string,
	realm: string,
): string {
	const encName = encodeURIComponent(characterName);
	const encRealm = encodeURIComponent(realm);
	return `https://armory.warmane.com/character/${encName}/${encRealm}/profile`;
}
