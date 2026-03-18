import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod/v4";

// JSON Schema for crawl4ai LLM extraction (sent in REST API body)
// crawl4ai expects plain JSON Schema, not Zod.
const EXTRACTION_JSON_SCHEMA = {
	type: "object",
	properties: {
		character: {
			type: "object",
			properties: {
				name: { type: "string" },
				level: { type: "number" },
				race: { type: "string" },
				class: { type: "string" },
				spec: { type: "string" },
				guild: { type: ["string", "null"] },
				realm: { type: "string" },
			},
			required: ["name", "level", "race", "class", "spec", "realm"],
		},
		gear: {
			type: "array",
			items: {
				type: "object",
				properties: {
					slot: { type: "string" },
					itemId: { type: "number" },
					itemName: { type: "string" },
					itemLevel: { type: "number" },
					quality: { type: "string" },
					enchant: { type: ["string", "null"] },
					gems: { type: "array", items: { type: "string" } },
					totalSockets: { type: "number" },
				},
				required: ["slot", "itemId", "itemName", "itemLevel", "quality", "gems", "totalSockets"],
			},
		},
		professions: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					level: { type: "number" },
					maxLevel: { type: "number" },
				},
				required: ["name", "level", "maxLevel"],
			},
		},
	},
	required: ["character", "gear", "professions"],
};

// Zod schema for runtime validation of crawl4ai response
const crawledCharacterSchema = z.object({
	character: z.object({
		name: z.string(),
		level: z.number(),
		race: z.string(),
		class: z.string(),
		spec: z.string(),
		guild: z.string().nullable(),
		realm: z.string(),
	}),
	gear: z.array(
		z.object({
			slot: z.string(),
			itemId: z.number(),
			itemName: z.string(),
			itemLevel: z.number(),
			quality: z.string(),
			enchant: z.string().nullable(),
			gems: z.array(z.string()),
			totalSockets: z.number(),
		}),
	),
	professions: z.array(
		z.object({
			name: z.string(),
			level: z.number(),
			maxLevel: z.number(),
		}),
	),
});

export type CrawledCharacter = z.infer<typeof crawledCharacterSchema>;

export type RawGearSlot = {
	slot: string;
	itemId: number;
	itemName: string;
	itemLevel: number;
	quality: string;
	enchant: string | null;
	gems: string[];
	totalSockets: number;
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

	const crawl4aiUrl = process.env.CRAWL4AI_URL;
	if (!crawl4aiUrl) {
		console.error("CRAWL4AI_URL not configured");
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}

	const capitalizedRealm =
		realm.charAt(0).toUpperCase() + realm.slice(1).toLowerCase();
	const armoryUrl = `https://armory.warmane.com/character/${encodeURIComponent(name)}/${encodeURIComponent(capitalizedRealm)}/summary`;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 60_000);

		const response = await fetch(`${crawl4aiUrl}/crawl`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
			body: JSON.stringify({
				urls: [armoryUrl],
				extraction_strategy: {
					type: "llm",
					provider: "gemini/gemini-2.0-flash",
					api_token: process.env.GEMINI_API_KEY,
					schema: EXTRACTION_JSON_SCHEMA,
					instruction:
						"Extract the character's equipped gear, professions, and basic info from this WoW armory page. For each gear slot, extract: the item ID from the wotlk.cavernoftime.com/item=XXXXX link, the item name, item level, quality (poor/common/uncommon/rare/epic/legendary), enchant name if present (null if none), all gem names as an array of strings, and the total number of gem sockets on the item. Skip Shirt and Tabard slots. For professions, extract name, current level, and max level.",
				},
			}),
		});

		clearTimeout(timeout);

		if (!response.ok) {
			console.error(`crawl4ai returned ${response.status}`);
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const crawlResponse = await response.json();

		// crawl4ai returns results array with extracted_content as stringified JSON
		const extractedContent = crawlResponse?.results?.[0]?.extracted_content;
		if (!extractedContent) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		const parsed =
			typeof extractedContent === "string"
				? JSON.parse(extractedContent)
				: extractedContent;

		// Handle case where Gemini returns an array
		const data = Array.isArray(parsed) ? parsed[0] : parsed;

		const validated = crawledCharacterSchema.safeParse(data);
		if (!validated.success) {
			console.error("crawl4ai response validation failed:", validated.error);
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const character = validated.data;

		if (character.gear.length === 0) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		return {
			success: true,
			gear: character.gear.map((slot) => ({
				slot: slot.slot,
				itemId: slot.itemId,
				itemName: slot.itemName,
				itemLevel: slot.itemLevel,
				quality: slot.quality,
				enchant: slot.enchant,
				gems: slot.gems,
				totalSockets: slot.totalSockets,
			})),
			professions: character.professions,
		};
	} catch (err) {
		console.error("crawl4ai fetch error:", err);
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}
}
