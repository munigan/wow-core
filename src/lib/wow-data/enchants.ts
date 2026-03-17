// Enchant entry ID → display name
// These are enchantment entry IDs (ench= parameter in Warmane armory rel attributes).
// This is a SEPARATE ID namespace from gem enchant entries — some IDs may numerically
// match gem IDs but refer to completely different things.
export const ENCHANT_MAP: Record<number, string> = {
	// Head
	3795: "Arcanum of Torment",
	3797: "Arcanum of Burning Mysteries",
	3819: "Arcanum of Blissful Mending",
	3842: "Arcanum of the Stalwart Protector",

	// Shoulders
	3793: "Inscription of Triumph",
	3794: "Inscription of Dominance",
	3808: "Greater Inscription of the Axe",
	3809: "Greater Inscription of the Crag",
	3810: "Greater Inscription of the Pinnacle",
	3811: "Greater Inscription of the Storm",
	3852: "Greater Inscription of the Gladiator",
	3875: "Master's Inscription of the Axe",
	3876: "Master's Inscription of the Crag",
	3835: "Master's Inscription of the Pinnacle",
	3836: "Master's Inscription of the Storm",

	// Back
	3243: "Spell Piercing",
	3256: "Shadow Armor",
	3294: "Mighty Armor",
	3831: "Greater Speed",
	3605: "Flexweave Underlay",
	3859: "Springy Arachnoweave",
	3722: "Scroll of Enchant Cloak - Superior Arcane Resistance",
	3825: "Enchant Cloak - Titanweave",

	// Chest
	3245: "Exceptional Resilience",
	3252: "Super Stats",
	3832: "Powerful Stats",
	3297: "Super Health",
	3233: "Exceptional Mana",

	// Wrist
	3845: "Greater Assault",
	3850: "Major Stamina",
	2332: "Superior Spellpower",
	3758: "Fur Lining - Attack Power",
	3757: "Fur Lining - Spell Power",
	3756: "Fur Lining - Stamina",
	3760: "Fur Lining - Arcane Resist",
	3763: "Socket Bracer",

	// Hands
	3604: "Hyperspeed Accelerators",
	3253: "Armsman",
	3246: "Exceptional Spellpower",
	3234: "Crusher",
	3603: "Hand-Mounted Pyro Rocket",
	3860: "Reticulated Armor Webbing",

	// Legs
	3853: "Earthen Leg Armor",
	3822: "Frosthide Leg Armor",
	3823: "Icescale Leg Armor",
	3325: "Brilliant Spellthread",
	3326: "Sapphire Spellthread",
	3827: "Nerubian Leg Reinforcements",

	// Feet
	3606: "Nitro Boosts",
	3232: "Tuskarr's Vitality",
	3826: "Icewalker",
	1597: "Greater Assault",
	3824: "Greater Fortitude",
	983: "Superior Agility",

	// Weapons
	3368: "Rune of the Fallen Crusader",
	3369: "Rune of Cinderglacier",
	3370: "Rune of Razorice",
	3365: "Rune of Swordshattering",
	3594: "Rune of Spellshattering",
	3595: "Rune of Spellbreaking",
	3366: "Rune of Swordbreaking",
	3847: "Rune of the Stoneskin Gargoyle",
	3883: "Rune of the Nerubian Carapace",
	3790: "Black Magic",
	3789: "Berserking",
	3788: "Accuracy",
	3834: "Mighty Spellpower",
	3833: "Superior Potency",
	3830: "Exceptional Spellpower",
	3844: "Greater Savagery",
	3225: "Executioner",
	3869: "Blade Ward",
	3870: "Blood Draining",
	3241: "Titanium Weapon Chain",
	1103: "Greater Agility",

	// Shield
	1952: "Defense",
	3748: "Titanium Plating",
	3849: "Titanium Shield Spike",

	// Rings (enchanter only)
	3839: "Assault",
	3840: "Greater Spellpower",
	3838: "Stamina",
	3791: "SP",
};
