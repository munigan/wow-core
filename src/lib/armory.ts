import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod/v4";

// Schema for crawl4ai LLM extraction — uses crawl4ai's simple dict format,
// NOT standard JSON Schema (crawl4ai deserializes "type" fields as class names)
const EXTRACTION_SCHEMA = {
	character: {
		name: "string",
		level: "number",
		race: "string",
		class: "string",
		spec: "string",
		guild: "string or null",
		realm: "string",
	},
	gear: [
		{
			slot: "string",
			itemId: "number",
			itemName: "string",
			itemLevel: "number",
			quality: "string",
			enchant: "string or null",
			gems: ["string"],
			totalSockets: "number",
		},
	],
	professions: [
		{
			name: "string",
			level: "number",
			maxLevel: "number",
		},
	],
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
		const timeout = setTimeout(() => controller.abort(), 120_000);

		const response = await fetch(`${crawl4aiUrl}/crawl`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
			body: JSON.stringify({
				urls: [armoryUrl],
				crawler_config: {
					type: "CrawlerRunConfig",
					params: {
						extraction_strategy: {
							type: "LLMExtractionStrategy",
							params: {
								llm_config: {
									type: "LLMConfig",
									params: {
										provider: "gemini/gemini-2.0-flash",
										api_token: process.env.GEMINI_API_KEY,
									},
								},
								schema: EXTRACTION_SCHEMA,
								instruction:
									"Extract the character's equipped gear, professions, and basic info from this WoW armory page. For each gear slot, extract: the item ID number from the wotlk.cavernoftime.com/item=XXXXX link URL, the item name, item level, quality (poor/common/uncommon/rare/epic/legendary), enchant name if present (null if none), all gem names as an array of strings, and the total number of gem sockets on the item. Use these exact slot names: Head, Neck, Shoulders, Back, Chest, Wrist, Hands, Waist, Legs, Feet, Ring 1, Ring 2, Trinket 1, Trinket 2, Main Hand, Off Hand, Ranged. Do NOT include Shirt or Tabard slots. For professions, extract name, current level, and max level.",
							},
						},
					},
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
