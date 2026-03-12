const BOSS_TO_RAID: ReadonlyMap<string, string> = new Map([
	// Naxxramas
	["Anub'Rekhan", "Naxxramas"],
	["Grand Widow Faerlina", "Naxxramas"],
	["Maexxna", "Naxxramas"],
	["Noth the Plaguebringer", "Naxxramas"],
	["Heigan the Unclean", "Naxxramas"],
	["Loatheb", "Naxxramas"],
	["Instructor Razuvious", "Naxxramas"],
	["Gothik the Harvester", "Naxxramas"],
	["Thane Korth'azz", "Naxxramas"],
	["Lady Blaumeux", "Naxxramas"],
	["Sir Zeliek", "Naxxramas"],
	["Baron Rivendare", "Naxxramas"],
	["Patchwerk", "Naxxramas"],
	["Grobbulus", "Naxxramas"],
	["Gluth", "Naxxramas"],
	["Thaddius", "Naxxramas"],
	["Feugen", "Naxxramas"],
	["Stalagg", "Naxxramas"],
	["Sapphiron", "Naxxramas"],
	["Kel'Thuzad", "Naxxramas"],

	// Vault of Archavon
	["Archavon the Stone Watcher", "Vault of Archavon"],
	["Emalon the Storm Watcher", "Vault of Archavon"],
	["Koralon the Flame Watcher", "Vault of Archavon"],
	["Toravon the Ice Watcher", "Vault of Archavon"],

	// The Obsidian Sanctum
	["Sartharion", "The Obsidian Sanctum"],
	["Shadron", "The Obsidian Sanctum"],
	["Tenebron", "The Obsidian Sanctum"],
	["Vesperon", "The Obsidian Sanctum"],

	// The Eye of Eternity
	["Malygos", "The Eye of Eternity"],

	// Ulduar
	["Flame Leviathan", "Ulduar"],
	["Ignis the Furnace Master", "Ulduar"],
	["Razorscale", "Ulduar"],
	["XT-002 Deconstructor", "Ulduar"],
	["Assembly of Iron", "Ulduar"],
	["Steelbreaker", "Ulduar"],
	["Runemaster Molgeim", "Ulduar"],
	["Stormcaller Brundir", "Ulduar"],
	["Kologarn", "Ulduar"],
	["Auriaya", "Ulduar"],
	["Hodir", "Ulduar"],
	["Thorim", "Ulduar"],
	["Freya", "Ulduar"],
	["Mimiron", "Ulduar"],
	["General Vezax", "Ulduar"],
	["Yogg-Saron", "Ulduar"],
	["Algalon the Observer", "Ulduar"],

	// Trial of the Crusader
	["Gormok the Impaler", "Trial of the Crusader"],
	["Acidmaw", "Trial of the Crusader"],
	["Dreadscale", "Trial of the Crusader"],
	["Icehowl", "Trial of the Crusader"],
	["Lord Jaraxxus", "Trial of the Crusader"],
	["Eydis Darkbane", "Trial of the Crusader"],
	["Fjola Lightbane", "Trial of the Crusader"],
	["Anub'arak", "Trial of the Crusader"],

	// Onyxia's Lair
	["Onyxia", "Onyxia's Lair"],

	// Icecrown Citadel
	["Lord Marrowgar", "Icecrown Citadel"],
	["Lady Deathwhisper", "Icecrown Citadel"],
	["Deathbringer Saurfang", "Icecrown Citadel"],
	["Festergut", "Icecrown Citadel"],
	["Rotface", "Icecrown Citadel"],
	["Professor Putricide", "Icecrown Citadel"],
	["Blood-Queen Lana'thel", "Icecrown Citadel"],
	["Blood Prince Council", "Icecrown Citadel"],
	["Prince Valanar", "Icecrown Citadel"],
	["Prince Taldaram", "Icecrown Citadel"],
	["Prince Keleseth", "Icecrown Citadel"],
	["Valithria Dreamwalker", "Icecrown Citadel"],
	["Sindragosa", "Icecrown Citadel"],
	["The Lich King", "Icecrown Citadel"],

	// The Ruby Sanctum
	["Halion", "The Ruby Sanctum"],
]);

/**
 * Identify the raid instance from a list of NPC names seen in the combat log.
 * Counts boss matches per instance, returns the one with the most hits.
 * Returns null if no bosses matched.
 */
export function identifyRaidInstance(npcNames: string[]): string | null {
	const counts = new Map<string, number>();

	for (const name of npcNames) {
		const raid = BOSS_TO_RAID.get(name);
		if (raid) {
			counts.set(raid, (counts.get(raid) ?? 0) + 1);
		}
	}

	if (counts.size === 0) return null;

	let bestRaid = "";
	let bestCount = 0;
	for (const [raid, count] of counts) {
		if (count > bestCount) {
			bestRaid = raid;
			bestCount = count;
		}
	}

	return bestRaid;
}
