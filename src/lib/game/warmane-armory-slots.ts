/** DOM order on Warmane profile: item-left (8) + item-right (8) + item-bottom (3). */
export const WARMANE_ARMORY_SLOT_LABELS = [
	"HEAD",
	"NECK",
	"SHOULDERS",
	"BACK",
	"CHEST",
	"SHIRT",
	"TABARD",
	"WRIST",
	"HANDS",
	"WAIST",
	"LEGS",
	"FEET",
	"RING 1",
	"RING 2",
	"TRINKET 1",
	"TRINKET 2",
	"WEAPON",
	"OFF HAND",
	"RANGED",
] as const;

export type WarmaneArmorySlotLabel =
	(typeof WARMANE_ARMORY_SLOT_LABELS)[number];

/** Slots that never show weapon enchants in armory `ench` (column shows —). */
const NON_ENCHANTABLE = new Set<string>([
	"NECK",
	"SHIRT",
	"TABARD",
	"TRINKET 1",
	"TRINKET 2",
	"RANGED",
]);

const GEM_NA_SLOTS = new Set<string>([
	"NECK",
	"SHIRT",
	"TABARD",
	"TRINKET 1",
	"TRINKET 2",
	"RANGED",
]);

export function isArmorySlotEnchantable(slotLabel: string): boolean {
	return !NON_ENCHANTABLE.has(slotLabel);
}

export function isArmorySlotGemColumnApplicable(slotLabel: string): boolean {
	return !GEM_NA_SLOTS.has(slotLabel);
}
