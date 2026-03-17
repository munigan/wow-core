export type GemColor = "red" | "blue" | "yellow" | "meta" | "prismatic" | "orange" | "green" | "purple";

export type GemData = {
	name: string;
	color: GemColor;
};

// Gem enchant entry ID → gem data
// These are gem enchantment entry IDs (gems= parameter in Warmane armory rel attributes).
// This is a SEPARATE ID namespace from gear enchant entries — some IDs may numerically
// match enchant IDs but refer to completely different things.
export const GEM_MAP: Record<number, GemData> = {
	// Meta gems
	3627: { name: "Relentless Earthsiege Diamond", color: "meta" },
	3621: { name: "Chaotic Skyflare Diamond", color: "meta" },
	3628: { name: "Austere Earthsiege Diamond", color: "meta" },
	3632: { name: "Ember Skyflare Diamond", color: "meta" },
	3631: { name: "Forlorn Skyflare Diamond", color: "meta" },
	3622: { name: "Destructive Skyflare Diamond", color: "meta" },
	3624: { name: "Enigmatic Skyflare Diamond", color: "meta" },
	3626: { name: "Revitalizing Skyflare Diamond", color: "meta" },
	3629: { name: "Eternal Earthsiege Diamond", color: "meta" },
	3630: { name: "Powerful Earthsiege Diamond", color: "meta" },
	3633: { name: "Trenchant Earthsiege Diamond", color: "meta" },
	3623: { name: "Swift Skyflare Diamond", color: "meta" },
	3625: { name: "Impassive Skyflare Diamond", color: "meta" },
	3634: { name: "Thundering Skyflare Diamond", color: "meta" },
	3635: { name: "Insightful Earthsiege Diamond", color: "meta" },
	3636: { name: "Beaming Earthsiege Diamond", color: "meta" },
	3643: { name: "Chaotic Skyflare Diamond", color: "meta" },

	// Red gems (Cardinal Ruby)
	3552: { name: "Delicate Cardinal Ruby", color: "red" },
	3535: { name: "Bold Cardinal Ruby", color: "red" },
	3546: { name: "Bright Cardinal Ruby", color: "red" },
	3547: { name: "Fractured Cardinal Ruby", color: "red" },
	3548: { name: "Precise Cardinal Ruby", color: "red" },
	3549: { name: "Subtle Cardinal Ruby", color: "red" },
	3550: { name: "Flashing Cardinal Ruby", color: "red" },
	3551: { name: "Runed Cardinal Ruby", color: "red" },

	// Blue gems (Majestic Zircon)
	3553: { name: "Solid Majestic Zircon", color: "blue" },
	3554: { name: "Sparkling Majestic Zircon", color: "blue" },
	3555: { name: "Lustrous Majestic Zircon", color: "blue" },
	3556: { name: "Stormy Majestic Zircon", color: "blue" },

	// Yellow gems (King's Amber)
	3557: { name: "Thick King's Amber", color: "yellow" },
	3558: { name: "Mystic King's Amber", color: "yellow" },
	3559: { name: "Quick King's Amber", color: "yellow" },
	3560: { name: "Smooth King's Amber", color: "yellow" },
	3561: { name: "Rigid King's Amber", color: "yellow" },

	// Orange gems (Ametrine)
	3562: { name: "Accurate Ametrine", color: "orange" },
	3563: { name: "Champion's Ametrine", color: "orange" },
	3564: { name: "Deadly Ametrine", color: "orange" },
	3565: { name: "Deft Ametrine", color: "orange" },
	3566: { name: "Fierce Ametrine", color: "orange" },
	3567: { name: "Inscribed Ametrine", color: "orange" },
	3568: { name: "Lucent Ametrine", color: "orange" },
	3569: { name: "Luminous Ametrine", color: "orange" },
	3570: { name: "Potent Ametrine", color: "orange" },
	3571: { name: "Pristine Ametrine", color: "orange" },
	3572: { name: "Reckless Ametrine", color: "orange" },
	3573: { name: "Resolute Ametrine", color: "orange" },
	3574: { name: "Resplendent Ametrine", color: "orange" },
	3575: { name: "Stalwart Ametrine", color: "orange" },
	3576: { name: "Veiled Ametrine", color: "orange" },
	3577: { name: "Wicked Ametrine", color: "orange" },
	3578: { name: "Willful Ametrine", color: "orange" },

	// Green gems (Eye of Zul)
	3579: { name: "Energized Eye of Zul", color: "green" },
	3580: { name: "Forceful Eye of Zul", color: "green" },
	3581: { name: "Intricate Eye of Zul", color: "green" },
	3582: { name: "Jagged Eye of Zul", color: "green" },
	3583: { name: "Lambent Eye of Zul", color: "green" },
	3584: { name: "Misty Eye of Zul", color: "green" },
	3585: { name: "Opaque Eye of Zul", color: "green" },
	3586: { name: "Radiant Eye of Zul", color: "green" },
	3587: { name: "Shattered Eye of Zul", color: "green" },
	3588: { name: "Steady Eye of Zul", color: "green" },
	3589: { name: "Sundered Eye of Zul", color: "green" },
	3590: { name: "Tense Eye of Zul", color: "green" },
	3591: { name: "Turbid Eye of Zul", color: "green" },
	3592: { name: "Vivid Eye of Zul", color: "green" },

	// Purple gems (Dreadstone)
	3593: { name: "Balanced Dreadstone", color: "purple" },
	3530: { name: "Shifting Dreadstone", color: "purple" },
	3595: { name: "Defender's Dreadstone", color: "purple" },
	3596: { name: "Glowing Dreadstone", color: "purple" },
	3597: { name: "Guardian's Dreadstone", color: "purple" },
	3598: { name: "Infused Dreadstone", color: "purple" },
	3599: { name: "Mysterious Dreadstone", color: "purple" },
	3600: { name: "Puissant Dreadstone", color: "purple" },
	3601: { name: "Regal Dreadstone", color: "purple" },
	3602: { name: "Royal Dreadstone", color: "purple" },
	3603: { name: "Tenuous Dreadstone", color: "purple" },

	// Prismatic gems
	3544: { name: "Nightmare Tear", color: "prismatic" },

	// Jewelcrafter-only gems (Dragon's Eye)
	3536: { name: "Bold Dragon's Eye", color: "prismatic" },
	3537: { name: "Delicate Dragon's Eye", color: "prismatic" },
	3538: { name: "Runed Dragon's Eye", color: "prismatic" },
	3539: { name: "Bright Dragon's Eye", color: "prismatic" },
	3540: { name: "Solid Dragon's Eye", color: "prismatic" },
	3541: { name: "Sparkling Dragon's Eye", color: "prismatic" },
	3542: { name: "Rigid Dragon's Eye", color: "prismatic" },
	3543: { name: "Smooth Dragon's Eye", color: "prismatic" },
	3545: { name: "Mystic Dragon's Eye", color: "prismatic" },

	// Lower-tier gems (Scarlet Ruby, Autumn's Glow, etc.)
	3461: { name: "Delicate Scarlet Ruby", color: "red" },
	3459: { name: "Bold Scarlet Ruby", color: "red" },
	3468: { name: "Runed Scarlet Ruby", color: "red" },
	3744: { name: "Nightmare Tear", color: "prismatic" },
};
