import { identifyRaidInstance } from "./wow-raids";

export type DetectedRaid = {
	dates: string[];
	startTime: string;
	endTime: string;
	playerCount: number;
	playerNames: string[];
	npcNames: string[];
	raidInstance: string | null;
};

export type ScanProgress = {
	type: "progress";
	bytesRead: number;
	totalBytes: number;
};

export type ScanDone = {
	type: "done";
	raids: DetectedRaid[];
};

export type ScanError = {
	type: "error";
	message: string;
};

export type ScanMessage = ScanProgress | ScanDone | ScanError;

export type DateGroup = {
	date: string;
	/** ISO-8601 string (e.g. "2026-02-11T20:00:00.000Z"). Must be ISO for correct comparison. */
	firstTimestamp: string;
	/** ISO-8601 string (e.g. "2026-02-12T01:30:00.000Z"). Must be ISO for correct comparison. */
	lastTimestamp: string;
	players: Map<string, string>;
	npcs: Map<string, string>;
};

const JACCARD_THRESHOLD = 0.5;

/**
 * Parse a WoW combat log date ("M/D") into a Date at midnight,
 * using the current year.
 */
export function parseDateKey(dateStr: string): Date {
	return parseDateTimestamp(dateStr, "00:00:00.000");
}

/**
 * Parse a WoW combat log date ("M/D") and time ("HH:MM:SS.mmm") into a Date
 * using the current year, consistent with the approach in log-parser.ts.
 */
export function parseDateTimestamp(dateStr: string, timeStr: string): Date {
	const dateParts = dateStr.split("/");
	const month = Number.parseInt(dateParts[0], 10) - 1;
	const day = Number.parseInt(dateParts[1], 10);

	const timeParts = timeStr.split(":");
	const hours = Number.parseInt(timeParts[0], 10);
	const minutes = Number.parseInt(timeParts[1], 10);

	const secParts = timeParts[2].split(".");
	const seconds = Number.parseInt(secParts[0], 10);
	const ms = secParts.length > 1 ? Number.parseInt(secParts[1], 10) : 0;

	const now = new Date();
	return new Date(now.getFullYear(), month, day, hours, minutes, seconds, ms);
}

/**
 * Compute the Jaccard similarity between two sets of player GUIDs.
 * Returns a value between 0 and 1.
 */
export function jaccardSimilarity(
	a: Map<string, string>,
	b: Map<string, string>,
): number {
	if (a.size === 0 && b.size === 0) return 1;

	let intersectionSize = 0;
	const smaller = a.size <= b.size ? a : b;
	const larger = a.size <= b.size ? b : a;

	for (const key of smaller.keys()) {
		if (larger.has(key)) {
			intersectionSize++;
		}
	}

	const unionSize = a.size + b.size - intersectionSize;
	if (unionSize === 0) return 1;

	return intersectionSize / unionSize;
}

/**
 * Detect raids from an array of DateGroups by grouping consecutive dates
 * with similar player rosters (Jaccard similarity > threshold).
 *
 * Sorts dateGroups chronologically before processing.
 */
export function detectRaids(dateGroups: DateGroup[]): DetectedRaid[] {
	if (dateGroups.length === 0) return [];

	const sorted = [...dateGroups].sort(
		(a, b) => parseDateKey(a.date).getTime() - parseDateKey(b.date).getTime(),
	);

	const raidGroups: DateGroup[][] = [[sorted[0]]];

	for (let i = 1; i < sorted.length; i++) {
		const currentGroup = raidGroups[raidGroups.length - 1];
		const lastDateGroup = currentGroup[currentGroup.length - 1];
		const similarity = jaccardSimilarity(
			lastDateGroup.players,
			sorted[i].players,
		);

		if (similarity > JACCARD_THRESHOLD) {
			currentGroup.push(sorted[i]);
		} else {
			raidGroups.push([sorted[i]]);
		}
	}

	return raidGroups.map(buildDetectedRaid);
}

function buildDetectedRaid(group: DateGroup[]): DetectedRaid {
	const dates: string[] = [];
	let startTime = new Date(group[0].firstTimestamp);
	let endTime = new Date(group[0].lastTimestamp);
	const allPlayers = new Map<string, string>();

	for (const dg of group) {
		dates.push(dg.date);

		const dgStart = new Date(dg.firstTimestamp);
		const dgEnd = new Date(dg.lastTimestamp);

		if (dgStart.getTime() < startTime.getTime()) {
			startTime = dgStart;
		}
		if (dgEnd.getTime() > endTime.getTime()) {
			endTime = dgEnd;
		}

		for (const [guid, name] of dg.players) {
			allPlayers.set(guid, name);
		}
	}

	const uniqueNames = [...new Set(allPlayers.values())];

	const allNpcs = new Map<string, string>();
	for (const dg of group) {
		for (const [guid, name] of dg.npcs) {
			allNpcs.set(guid, name);
		}
	}
	const uniqueNpcNames = [...new Set(allNpcs.values())];
	const raidInstance = identifyRaidInstance(uniqueNpcNames);

	return {
		dates,
		startTime: startTime.toISOString(),
		endTime: endTime.toISOString(),
		playerCount: uniqueNames.length,
		playerNames: uniqueNames,
		npcNames: uniqueNpcNames,
		raidInstance,
	};
}
