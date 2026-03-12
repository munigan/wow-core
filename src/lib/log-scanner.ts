export type DetectedRaid = {
	dates: string[];
	startTime: string;
	endTime: string;
	playerCount: number;
	playerNames: string[];
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
	firstTimestamp: string;
	lastTimestamp: string;
	players: Map<string, string>;
};

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
function jaccardSimilarity(
	a: Map<string, string>,
	b: Map<string, string>,
): number {
	if (a.size === 0 && b.size === 0) return 1;

	let intersectionSize = 0;
	const smaller = a.size <= b.size ? a : b;
	const larger = a.size <= b.size ? b : a;

	smaller.forEach((_value, key) => {
		if (larger.has(key)) {
			intersectionSize++;
		}
	});

	const unionSize = a.size + b.size - intersectionSize;
	if (unionSize === 0) return 1;

	return intersectionSize / unionSize;
}

/**
 * Detect raids from an array of DateGroups by grouping consecutive dates
 * with similar player rosters (Jaccard similarity > 0.5).
 *
 * Expects dateGroups to be sorted chronologically.
 */
export function detectRaids(dateGroups: DateGroup[]): DetectedRaid[] {
	if (dateGroups.length === 0) return [];

	const raidGroups: DateGroup[][] = [[dateGroups[0]]];

	for (let i = 1; i < dateGroups.length; i++) {
		const currentGroup = raidGroups[raidGroups.length - 1];
		const lastDateGroup = currentGroup[currentGroup.length - 1];
		const similarity = jaccardSimilarity(
			lastDateGroup.players,
			dateGroups[i].players,
		);

		if (similarity > 0.5) {
			currentGroup.push(dateGroups[i]);
		} else {
			raidGroups.push([dateGroups[i]]);
		}
	}

	return raidGroups.map(buildDetectedRaid);
}

function buildDetectedRaid(group: DateGroup[]): DetectedRaid {
	const dates: string[] = [];
	let startTime = group[0].firstTimestamp;
	let endTime = group[0].lastTimestamp;
	const allPlayers = new Map<string, string>();

	for (const dg of group) {
		dates.push(dg.date);

		if (dg.firstTimestamp < startTime) {
			startTime = dg.firstTimestamp;
		}
		if (dg.lastTimestamp > endTime) {
			endTime = dg.lastTimestamp;
		}

		dg.players.forEach((name, guid) => {
			allPlayers.set(guid, name);
		});
	}

	const uniqueNames = Array.from(new Set(Array.from(allPlayers.values())));

	return {
		dates,
		startTime,
		endTime,
		playerCount: uniqueNames.length,
		playerNames: uniqueNames,
	};
}
