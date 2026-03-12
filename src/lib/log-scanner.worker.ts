import {
	type DateGroup,
	detectRaids,
	parseDateTimestamp,
	type ScanDone,
	type ScanError,
	type ScanProgress,
} from "./log-scanner";

const PROGRESS_INTERVAL_BYTES = 5 * 1024 * 1024; // ~5MB

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
	try {
		const { file } = e.data;
		const totalBytes = file.size;

		const dateMap = new Map<
			string,
			{
				firstTimestamp: Date;
				lastTimestamp: Date;
				players: Map<string, string>;
				npcs: Map<string, string>;
			}
		>();

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
				processLine(line, dateMap);
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
			processLine(buffer, dateMap);
		}

		// Convert map to DateGroup array
		const dateGroups: DateGroup[] = [];
		for (const [date, group] of dateMap) {
			dateGroups.push({
				date,
				firstTimestamp: group.firstTimestamp.toISOString(),
				lastTimestamp: group.lastTimestamp.toISOString(),
				players: group.players,
				npcs: group.npcs,
			});
		}

		// Send final progress so UI reaches 100% before switching to done
		self.postMessage({
			type: "progress",
			bytesRead: totalBytes,
			totalBytes,
		} satisfies ScanProgress);

		const raids = detectRaids(dateGroups);

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
	dateMap: Map<
		string,
		{
			firstTimestamp: Date;
			lastTimestamp: Date;
			players: Map<string, string>;
			npcs: Map<string, string>;
		}
	>,
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

	// Update date group
	let group = dateMap.get(dateStr);
	if (!group) {
		group = {
			firstTimestamp: timestamp,
			lastTimestamp: timestamp,
			players: new Map(),
			npcs: new Map(),
		};
		dateMap.set(dateStr, group);
	} else {
		if (timestamp.getTime() < group.firstTimestamp.getTime()) {
			group.firstTimestamp = timestamp;
		}
		if (timestamp.getTime() > group.lastTimestamp.getTime()) {
			group.lastTimestamp = timestamp;
		}
	}

	// Extract player GUIDs from event fields
	// Minimum 7 fields: EVENT_TYPE, sourceGUID, sourceName, sourceFlags, destGUID, destName, destFlags
	const eventPart = line.slice(doubleSpaceIdx + 2);
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	if (sourceGuid?.startsWith("0x0E") && sourceName) {
		group.players.set(sourceGuid, sourceName);
	}
	if (destGuid?.startsWith("0x0E") && destName && destName !== "nil") {
		group.players.set(destGuid, destName);
	}

	// Collect NPC GUIDs (creatures and game objects)
	if (sourceGuid?.startsWith("0xF130") || sourceGuid?.startsWith("0xF150")) {
		if (sourceName && sourceName !== "nil") {
			group.npcs.set(sourceGuid, sourceName);
		}
	}
	if (destGuid?.startsWith("0xF130") || destGuid?.startsWith("0xF150")) {
		if (destName && destName !== "nil") {
			group.npcs.set(destGuid, destName);
		}
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
