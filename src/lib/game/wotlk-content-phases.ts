/** Internal ids for Overview Quick Stats phase filter (guild labels T8/T9 differ from retail tier names). */
export const WOTLK_PHASE_IDS = ["t8", "t9", "t10", "t11", "t12"] as const;
export type WotlkPhaseId = (typeof WOTLK_PHASE_IDS)[number];

const RAID_INSTANCES_BY_PHASE: Record<WotlkPhaseId, readonly string[]> = {
	t8: ["Naxxramas", "Eye of Eternity", "Obsidian Sanctum"],
	t9: ["Ulduar"],
	t10: ["Trial of the Crusader", "Onyxia's Lair"],
	t11: ["Icecrown Citadel"],
	t12: ["Ruby Sanctum"],
};

const INSTANCE_TO_PHASE = new Map<string, WotlkPhaseId>();
for (const [phaseId, instances] of Object.entries(RAID_INSTANCES_BY_PHASE) as [
	WotlkPhaseId,
	readonly string[],
][]) {
	for (const inst of instances) {
		INSTANCE_TO_PHASE.set(inst, phaseId);
	}
}

export const getPhaseIdForRaidInstance = (
	instance: string | null,
): WotlkPhaseId | null => {
	if (!instance) return null;
	return INSTANCE_TO_PHASE.get(instance) ?? null;
};

export const getRaidInstancesForPhase = (
	phaseId: WotlkPhaseId,
): readonly string[] => RAID_INSTANCES_BY_PHASE[phaseId];

/** Phases used in Quick Stats dropdown: t8/t9 selectable; later tiers disabled until released. */
export type QuickStatsPhaseOption = {
	id: WotlkPhaseId;
	label: string;
	isSelectable: boolean;
};

export const QUICK_STATS_PHASE_OPTIONS: readonly QuickStatsPhaseOption[] = [
	{ id: "t8", label: "T8", isSelectable: true },
	{ id: "t9", label: "T9", isSelectable: true },
	{ id: "t10", label: "T10", isSelectable: false },
	{ id: "t11", label: "T11", isSelectable: false },
	{ id: "t12", label: "T12", isSelectable: false },
];

/** Default Quick Stats phase when no raid maps to t8/t9 in the window. */
export const QUICK_STATS_DEFAULT_PHASE: WotlkPhaseId = "t9";
