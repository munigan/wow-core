import { cacheLife, cacheTag } from "next/cache";

const SLOT_NAMES = [
	"Head", "Neck", "Shoulders", "Back", "Chest",
	"Shirt", "Tabard", "Wrist", "Hands", "Waist",
	"Legs", "Feet", "Ring 1", "Ring 2",
	"Trinket 1", "Trinket 2", "Main Hand", "Off Hand", "Ranged",
] as const;

const EXCLUDED_SLOTS = new Set(["Tabard", "Shirt"]);

export type RawGearSlot = {
	slot: string;
	itemId: number;
	quality: number;
	enchantId: number | null;
	gemIds: number[];
};

export type RawProfession = {
	name: string;
	level: number;
	maxLevel: number;
};

export type ArmoryResult =
	| { success: true; gear: RawGearSlot[]; professions: RawProfession[] }
	| { success: false; error: "CHARACTER_NOT_FOUND" | "ARMORY_UNAVAILABLE" };

export async function fetchArmoryGear(
	name: string,
	realm: string,
): Promise<ArmoryResult> {
	"use cache";
	cacheLife("armory");
	cacheTag("armory-gear", name);

	try {
		const capitalizedRealm = realm.charAt(0).toUpperCase() + realm.slice(1).toLowerCase();
		const url = `https://armory.warmane.com/character/${encodeURIComponent(name)}/${encodeURIComponent(capitalizedRealm)}/summary`;
		const res = await fetch(url, {
			headers: { "User-Agent": "WowRaidTools/1.0" },
		});

		if (!res.ok) {
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const html = await res.text();

		// Check if character exists
		if (html.includes("does not exist") || html.includes("does not meet the minimum")) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		// Parse gear slots from rel attributes
		const gear = parseGearFromHtml(html);
		const professions = parseProfessionsFromHtml(html);

		return { success: true, gear, professions };
	} catch {
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}
}

function parseGearFromHtml(html: string): RawGearSlot[] {
	const gear: RawGearSlot[] = [];

	// Match ALL icon-quality div elements (including empty slots) to keep slot index in sync.
	// Each slot has: <div class="icon-quality ..."><a ...>
	// Empty slots: class="icon-quality tooltip", <a href="#self"> (no rel)
	// Equipped slots: class="icon-quality icon-qualityN", <a rel="item=...">
	const slotPattern = /class="icon-quality[^"]*"[^>]*>/g;

	let slotMatch: RegExpExecArray | null;
	let slotIndex = 0;

	slotMatch = slotPattern.exec(html);
	while (slotMatch !== null) {
		const slotName = SLOT_NAMES[slotIndex] ?? `Slot ${slotIndex}`;

		// Extract quality from class name
		const qualityMatch = slotMatch[0].match(/icon-quality(\d+)/);
		const quality = qualityMatch ? Number.parseInt(qualityMatch[1], 10) : 0;

		// Look ahead for the rel attribute in the next <a> tag
		const remaining = html.substring(slotMatch.index, slotMatch.index + 500);
		const relMatch = remaining.match(/rel="([^"]*)"/);
		// Decode HTML entities — raw HTML has &amp; instead of &
		const rel = relMatch?.[1]?.replaceAll("&amp;", "&");

		if (rel && rel.startsWith("item=") && !EXCLUDED_SLOTS.has(slotName)) {
			const params = new URLSearchParams(rel);
			const itemId = Number.parseInt(params.get("item") ?? "0", 10);
			const enchantId = params.get("ench")
				? Number.parseInt(params.get("ench") as string, 10)
				: null;
			const gemIds = (params.get("gems") ?? "")
				.split(":")
				.map((g) => Number.parseInt(g, 10))
				.filter((g) => !Number.isNaN(g));

			if (itemId > 0) {
				gear.push({
					slot: slotName,
					itemId,
					quality,
					enchantId,
					gemIds,
				});
			}
		}

		slotIndex++;
		slotMatch = slotPattern.exec(html);
	}

	return gear;
}

function parseProfessionsFromHtml(html: string): RawProfession[] {
	const professions: RawProfession[] = [];

	// Professions section contains text like "Engineering 435 / 450"
	const profPattern = /(?:Engineering|Blacksmithing|Jewelcrafting|Alchemy|Enchanting|Tailoring|Leatherworking|Inscription|Mining|Herbalism|Skinning)\s+(\d+)\s*\/\s*(\d+)/g;

	let match: RegExpExecArray | null;
	match = profPattern.exec(html);
	while (match !== null) {
		const fullMatch = match[0];
		const name = fullMatch.split(/\s+\d/)[0];
		professions.push({
			name,
			level: Number.parseInt(match[1], 10),
			maxLevel: Number.parseInt(match[2], 10),
		});
		match = profPattern.exec(html);
	}

	return professions;
}
