import { identifyRaidInstance } from "./wow-raids";

export type DetectedRaid = {
	dates: string[];
	startTime: string;
	endTime: string;
	/** Per-segment time ranges for interleaved raids (e.g., OS → EoE → OS). */
	timeRanges: { startTime: string; endTime: string }[];
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

export type Segment = {
	date: string;
	segmentIndex: number;
	firstTimestamp: string;
	lastTimestamp: string;
	players: Map<string, string>;
	npcs: Map<string, string>;
	raidInstance: string | null;
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
 * Merge adjacent segments from the same date when their player rosters
 * have high Jaccard similarity (same raid with a break).
 */
export function mergeSegmentsByRoster(segments: Segment[]): Segment[] {
	if (segments.length <= 1) return segments;

	const merged: Segment[] = [segments[0]];

	for (let i = 1; i < segments.length; i++) {
		const last = merged[merged.length - 1];
		const curr = segments[i];

		const crossInstance =
			last.raidInstance !== null &&
			curr.raidInstance !== null &&
			last.raidInstance !== curr.raidInstance;
		if (
			last.date === curr.date &&
			!crossInstance &&
			jaccardSimilarity(last.players, curr.players) >= JACCARD_THRESHOLD
		) {
			// Merge: union players/npcs, extend time range
			for (const [guid, name] of curr.players) {
				last.players.set(guid, name);
			}
			for (const [guid, name] of curr.npcs) {
				last.npcs.set(guid, name);
			}
			if (!last.raidInstance && curr.raidInstance) {
				last.raidInstance = curr.raidInstance;
			}
			const currEnd = new Date(curr.lastTimestamp);
			if (currEnd.getTime() > new Date(last.lastTimestamp).getTime()) {
				last.lastTimestamp = curr.lastTimestamp;
			}
		} else {
			merged.push(curr);
		}
	}

	return merged;
}

/**
 * Detect raids from an array of Segments by grouping segments
 * with similar player rosters (Jaccard similarity > threshold).
 *
 * When segments have a known raidInstance, segments from the same instance
 * are consolidated into a single raid group even if they're non-consecutive
 * (e.g., OS → EoE → OS → EoE interleaving).
 *
 * Sorts segments chronologically before processing.
 */
export function detectRaids(segments: Segment[]): DetectedRaid[] {
	if (segments.length === 0) return [];

	const sorted = [...segments].sort(
		(a, b) =>
			new Date(a.firstTimestamp).getTime() -
			new Date(b.firstTimestamp).getTime(),
	);

	const raidGroups: Segment[][] = [[sorted[0]]];

	for (let i = 1; i < sorted.length; i++) {
		const seg = sorted[i];
		let placed = false;

		// If this segment has a known instance, try to find an existing group
		// with the same instance on the same date (consolidate interleaved runs
		// like OS → EoE → OS → EoE). No roster check needed — same instance +
		// same date is sufficient since these are from the same logging session.
		if (seg.raidInstance) {
			for (const group of raidGroups) {
				const representative = group[0];
				if (
					representative.raidInstance === seg.raidInstance &&
					representative.date === seg.date
				) {
					group.push(seg);
					placed = true;
					break;
				}
			}
		}

		if (!placed) {
			// Fall back to consecutive grouping: check last group
			const currentGroup = raidGroups[raidGroups.length - 1];
			const lastSegment = currentGroup[currentGroup.length - 1];
			const similarity = jaccardSimilarity(lastSegment.players, seg.players);

			const crossInstance =
				lastSegment.raidInstance !== null &&
				seg.raidInstance !== null &&
				lastSegment.raidInstance !== seg.raidInstance;

			if (!crossInstance && similarity > JACCARD_THRESHOLD) {
				currentGroup.push(seg);
			} else {
				raidGroups.push([seg]);
			}
		}
	}

	return raidGroups.map(buildDetectedRaid);
}

function buildDetectedRaid(group: Segment[]): DetectedRaid {
	const dateSet = new Set<string>();
	let startTime = new Date(group[0].firstTimestamp);
	let endTime = new Date(group[0].lastTimestamp);
	const timeRanges: { startTime: string; endTime: string }[] = [];

	const allPlayers = new Map<string, string>();
	// Track player lists per segment for multi-segment raids
	const segmentPlayerLists: Map<string, string>[] = [];

	for (const seg of group) {
		dateSet.add(seg.date);

		const segStart = new Date(seg.firstTimestamp);
		const segEnd = new Date(seg.lastTimestamp);

		timeRanges.push({
			startTime: segStart.toISOString(),
			endTime: segEnd.toISOString(),
		});

		if (segStart.getTime() < startTime.getTime()) {
			startTime = segStart;
		}
		if (segEnd.getTime() > endTime.getTime()) {
			endTime = segEnd;
		}

		for (const [guid, name] of seg.players) {
			allPlayers.set(guid, name);
		}

		segmentPlayerLists.push(seg.players);
	}

	// For multi-segment raids (interleaved instances), some segments accumulate
	// bystander players from between encounters. Use the smallest segment as the
	// representative — smaller segments are cleaner (actual raid participants only)
	// since they don't include long inter-encounter gaps with bystander events.
	let representativePlayers: Map<string, string>;
	if (group.length > 1) {
		const sorted = [...segmentPlayerLists].sort((a, b) => a.size - b.size);
		representativePlayers = sorted[0];
	} else {
		representativePlayers = allPlayers;
	}
	const uniqueNames = [...new Set(representativePlayers.values())];

	const allNpcs = new Map<string, string>();
	for (const seg of group) {
		for (const [guid, name] of seg.npcs) {
			allNpcs.set(guid, name);
		}
	}
	const uniqueNpcNames = [...new Set(allNpcs.values())];
	const raidInstance = identifyRaidInstance(uniqueNpcNames);

	return {
		dates: [...dateSet],
		startTime: startTime.toISOString(),
		endTime: endTime.toISOString(),
		timeRanges,
		playerCount: uniqueNames.length,
		playerNames: uniqueNames,
		npcNames: uniqueNpcNames,
		raidInstance,
	};
}
