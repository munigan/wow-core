import {
	detectRaids,
	mergeSegmentsByRoster,
	parseDateTimestamp,
	type ScanDone,
	type ScanError,
	type ScanProgress,
	type Segment,
} from "./log-scanner";
import { BOSS_TO_RAID } from "./wow-raids";

const PROGRESS_INTERVAL_BYTES = 5 * 1024 * 1024; // ~5MB
const GAP_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

type WorkerSegment = {
	date: string;
	segmentIndex: number;
	firstTimestamp: Date;
	lastTimestamp: Date;
	players: Map<string, string>;
	npcs: Map<string, string>;
	raidInstance: string | null;
};

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
	try {
		const { file } = e.data;
		const totalBytes = file.size;

		// Track segments per date. When a time gap >30 min is detected,
		// a new segment is created within the same date.
		const segmentsByDate = new Map<string, WorkerSegment[]>();

		const textStream = file
			.stream()
			.pipeThrough(
				new TextDecoderStream() as ReadableWritablePair<string, Uint8Array>,
			);
		const reader = textStream.getReader();

		let buffer = "";
		let bytesRead = 0;
		let lastProgressAt = 0;

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			// Track bytes — combat logs are ASCII, so string length ≈ byte count
			bytesRead += value.length;

			buffer += value;
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";

			for (const line of lines) {
				processLine(line, segmentsByDate);
			}

			if (bytesRead - lastProgressAt >= PROGRESS_INTERVAL_BYTES) {
				lastProgressAt = bytesRead;
				self.postMessage({
					type: "progress",
					bytesRead,
					totalBytes,
				} satisfies ScanProgress);
			}
		}

		// Process remaining buffer
		if (buffer.trim()) {
			processLine(buffer, segmentsByDate);
		}

		// Send final progress so UI reaches 100% before switching to done
		self.postMessage({
			type: "progress",
			bytesRead: totalBytes,
			totalBytes,
		} satisfies ScanProgress);

		// Convert worker segments to Segment type and merge by roster
		let allSegments: Segment[] = [];
		for (const dateSegments of segmentsByDate.values()) {
			const converted: Segment[] = dateSegments.map((ws) => ({
				date: ws.date,
				segmentIndex: ws.segmentIndex,
				firstTimestamp: ws.firstTimestamp.toISOString(),
				lastTimestamp: ws.lastTimestamp.toISOString(),
				players: ws.players,
				npcs: ws.npcs,
				raidInstance: ws.raidInstance,
			}));
			// Merge segments from the same date that have similar rosters
			const merged = mergeSegmentsByRoster(converted);
			allSegments = allSegments.concat(merged);
		}

		const raids = detectRaids(allSegments);

		self.postMessage({ type: "done", raids } satisfies ScanDone);
	} catch (err) {
		self.postMessage({
			type: "error",
			message: String(err),
		} satisfies ScanError);
	}
};

function processLine(
	line: string,
	segmentsByDate: Map<string, WorkerSegment[]>,
): void {
	// Line format: "M/D HH:MM:SS.mmm  EVENT_TYPE,..."
	const spaceIdx = line.indexOf(" ");
	if (spaceIdx === -1) return;

	const doubleSpaceIdx = line.indexOf("  ");
	if (doubleSpaceIdx === -1) return;

	const dateStr = line.slice(0, spaceIdx);
	const timeStr = line.slice(spaceIdx + 1, doubleSpaceIdx);

	// Validate date format (M/D)
	if (!dateStr.includes("/")) return;

	const timestamp = parseDateTimestamp(dateStr, timeStr);

	// Get or create segments for this date
	let dateSegments = segmentsByDate.get(dateStr);
	if (!dateSegments) {
		dateSegments = [];
		segmentsByDate.set(dateStr, dateSegments);
	}

	// Get the current (last) segment for this date, or create the first one
	let currentSegment = dateSegments[dateSegments.length - 1];

	if (!currentSegment) {
		// First event on this date
		currentSegment = {
			date: dateStr,
			segmentIndex: 0,
			firstTimestamp: timestamp,
			lastTimestamp: timestamp,
			players: new Map(),
			npcs: new Map(),
			raidInstance: null,
		};
		dateSegments.push(currentSegment);
	} else {
		// Check for time gap
		const gap = timestamp.getTime() - currentSegment.lastTimestamp.getTime();
		if (gap > GAP_THRESHOLD_MS) {
			// Start a new segment
			currentSegment = {
				date: dateStr,
				segmentIndex: dateSegments.length,
				firstTimestamp: timestamp,
				lastTimestamp: timestamp,
				players: new Map(),
				npcs: new Map(),
				raidInstance: null,
			};
			dateSegments.push(currentSegment);
		} else {
			// Update last timestamp
			if (timestamp.getTime() > currentSegment.lastTimestamp.getTime()) {
				currentSegment.lastTimestamp = timestamp;
			}
		}
	}

	// Extract player and NPC GUIDs from event fields
	const eventPart = line.slice(doubleSpaceIdx + 2);
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	if (sourceGuid?.startsWith("0x0E") && sourceName) {
		currentSegment.players.set(sourceGuid, sourceName);
	}
	if (destGuid?.startsWith("0x0E") && destName && destName !== "nil") {
		currentSegment.players.set(destGuid, destName);
	}

	// Instance-aware splitting: check if source/dest are boss NPCs
	const isSourceNpc =
		sourceGuid?.startsWith("0xF130") || sourceGuid?.startsWith("0xF150");
	const isDestNpc =
		destGuid?.startsWith("0xF130") || destGuid?.startsWith("0xF150");

	const sourceInstance =
		isSourceNpc && sourceName && sourceName !== "nil"
			? BOSS_TO_RAID.get(sourceName)
			: undefined;
	const destInstance =
		isDestNpc && destName && destName !== "nil"
			? BOSS_TO_RAID.get(destName)
			: undefined;
	const bossInstance = sourceInstance ?? destInstance;

	if (bossInstance) {
		if (currentSegment.raidInstance === null) {
			currentSegment.raidInstance = bossInstance;
		} else if (bossInstance !== currentSegment.raidInstance) {
			// Instance changed — create new segment
			currentSegment = {
				date: dateStr,
				segmentIndex: dateSegments.length,
				firstTimestamp: timestamp,
				lastTimestamp: timestamp,
				players: new Map(currentSegment.players),
				npcs: new Map(),
				raidInstance: bossInstance,
			};
			dateSegments.push(currentSegment);
		}
	}

	// Add NPCs to the (possibly new) current segment
	if (isSourceNpc && sourceName && sourceName !== "nil") {
		currentSegment.npcs.set(sourceGuid, sourceName);
	}
	if (isDestNpc && destName && destName !== "nil") {
		currentSegment.npcs.set(destGuid, destName);
	}
}

function parseFields(eventPart: string): string[] {
	const fields: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < eventPart.length; i++) {
		const char = eventPart[i];
		if (char === '"') {
			inQuotes = !inQuotes;
			current += char;
		} else if (char === "," && !inQuotes) {
			fields.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	if (current) fields.push(current.trim());
	return fields;
}

function stripQuotes(s: string): string {
	if (s.startsWith('"') && s.endsWith('"')) {
		return s.slice(1, -1);
	}
	return s;
}
