// WoW item quality number → hex color
// Used in both ItemTooltip (client) and gear table (client)
export const QUALITY_COLORS: Record<number, string> = {
	0: "#9d9d9d",
	1: "#ffffff",
	2: "#1eff00",
	3: "#0070dd",
	4: "#a335ee",
	5: "#ff8000",
	6: "#e6cc80",
	7: "#00ccff",
};

// Quality name (from Gemini extraction) → quality number (for QUALITY_COLORS lookup)
export const QUALITY_NAME_TO_NUMBER: Record<string, number> = {
	poor: 0,
	common: 1,
	uncommon: 2,
	rare: 3,
	epic: 4,
	legendary: 5,
	artifact: 6,
	heirloom: 7,
};
