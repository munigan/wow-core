export type ParsedPlayer = {
	guid: string;
	name: string;
};

export type ParseResult = {
	raidDate: Date;
	raidName: string;
	players: ParsedPlayer[];
};

export type ParseResultMulti = {
	raids: {
		raidDate: Date;
		raidName: string;
		players: ParsedPlayer[];
	}[];
};

export async function parseLogStream(
	stream: ReadableStream<Uint8Array>,
): Promise<ParseResult> {
	const players = new Map<string, string>();
	let raidDate: Date | null = null;
	let raidName = "Unnamed Raid";

	const textStream = stream.pipeThrough(
		new TextDecoderStream() as ReadableWritablePair<string, Uint8Array>,
	);
	const reader = textStream.getReader();

	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += value;
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";

		for (const line of lines) {
			processLine(line, players, raidDate === null);

			if (raidDate === null) {
				raidDate = extractDate(line);
				if (raidDate) {
					const month = raidDate.getMonth() + 1;
					const day = raidDate.getDate();
					raidName = `Raid ${month}/${day}`;
				}
			}
		}
	}

	// Process remaining buffer
	if (buffer.trim()) {
		processLine(buffer, players, raidDate === null);
		if (raidDate === null) {
			raidDate = extractDate(buffer);
			if (raidDate) {
				const month = raidDate.getMonth() + 1;
				const day = raidDate.getDate();
				raidName = `Raid ${month}/${day}`;
			}
		}
	}

	return {
		raidDate: raidDate ?? new Date(),
		raidName,
		players: Array.from(players.entries()).map(([guid, name]) => ({
			guid,
			name,
		})),
	};
}

export type RaidTimeRange = {
	dates: string[];
	startTime: string;
	endTime: string;
	/** Per-segment time ranges for interleaved raids (more precise than startTime/endTime). */
	timeRanges?: { startTime: string; endTime: string }[];
};

export async function parseLogStreamMulti(
	stream: ReadableStream<Uint8Array>,
	raidTimeRanges: RaidTimeRange[],
): Promise<ParseResultMulti> {
	// Build a set of all relevant dates for fast line filtering
	const relevantDates = new Set<string>();
	for (const range of raidTimeRanges) {
		for (const d of range.dates) {
			relevantDates.add(d);
		}
	}

	// Per-raid player buckets with time-range filtering.
	// When timeRanges is provided (interleaved raids), use those for precise filtering.
	// Otherwise fall back to the single startTime/endTime range.
	const raidBuckets: {
		players: Map<string, string>;
		raidDate: Date | null;
		ranges: { startMs: number; endMs: number }[];
	}[] = raidTimeRanges.map((range) => {
		const ranges =
			range.timeRanges && range.timeRanges.length > 0
				? range.timeRanges.map((tr) => ({
						startMs: new Date(tr.startTime).getTime(),
						endMs: new Date(tr.endTime).getTime(),
					}))
				: [
						{
							startMs: new Date(range.startTime).getTime(),
							endMs: new Date(range.endTime).getTime(),
						},
					];
		return { players: new Map(), raidDate: null, ranges };
	});

	const textStream = stream.pipeThrough(
		new TextDecoderStream() as ReadableWritablePair<string, Uint8Array>,
	);
	const reader = textStream.getReader();

	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += value;
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";

		for (const line of lines) {
			processMultiLineWithTimeRange(line, relevantDates, raidBuckets);
		}
	}

	if (buffer.trim()) {
		processMultiLineWithTimeRange(buffer, relevantDates, raidBuckets);
	}

	const raids: ParseResultMulti["raids"] = [];

	for (let i = 0; i < raidTimeRanges.length; i++) {
		const range = raidTimeRanges[i];
		const bucket = raidBuckets[i];

		const firstDate = range.dates[0];
		const lastDate = range.dates[range.dates.length - 1];
		const raidName =
			range.dates.length === 1
				? `Raid ${firstDate}`
				: `Raid ${firstDate} - ${lastDate}`;

		raids.push({
			raidDate: bucket.raidDate ?? new Date(),
			raidName,
			players: Array.from(bucket.players.entries()).map(([guid, name]) => ({
				guid,
				name,
			})),
		});
	}

	return { raids };
}

function processMultiLineWithTimeRange(
	line: string,
	relevantDates: Set<string>,
	raidBuckets: {
		players: Map<string, string>;
		raidDate: Date | null;
		ranges: { startMs: number; endMs: number }[];
	}[],
): void {
	const spaceIdx = line.indexOf(" ");
	if (spaceIdx === -1) return;

	const dateStr = line.slice(0, spaceIdx);
	if (!relevantDates.has(dateStr)) return;

	const doubleSpaceIdx = line.indexOf("  ");
	if (doubleSpaceIdx === -1) return;

	const timestamp = extractDate(line);
	if (!timestamp) return;
	const timestampMs = timestamp.getTime();

	const eventPart = line.slice(doubleSpaceIdx + 2);
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	// Assign this line's players to all matching raid buckets by time range
	for (const bucket of raidBuckets) {
		const isInRange = bucket.ranges.some(
			(r) => timestampMs >= r.startMs && timestampMs <= r.endMs,
		);
		if (!isInRange) continue;

		if (bucket.raidDate === null) {
			bucket.raidDate = timestamp;
		}

		if (sourceGuid?.startsWith("0x0E") && sourceName) {
			bucket.players.set(sourceGuid, sourceName);
		}
		if (destGuid?.startsWith("0x0E") && destName && destName !== "nil") {
			bucket.players.set(destGuid, destName);
		}
	}
}

function processLine(
	line: string,
	players: Map<string, string>,
	_isFirst: boolean,
): void {
	// Format: M/D HH:MM:SS.mmm  EVENT_TYPE,sourceGUID,"sourceName",sourceFlags,destGUID,"destName",destFlags,...
	const doubleSpaceIdx = line.indexOf("  ");
	if (doubleSpaceIdx === -1) return;

	const eventPart = line.slice(doubleSpaceIdx + 2);
	// Parse comma-separated fields, respecting quoted strings
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	// fields[0] = EVENT_TYPE
	// fields[1] = sourceGUID, fields[2] = "sourceName", fields[3] = sourceFlags
	// fields[4] = destGUID, fields[5] = "destName", fields[6] = destFlags

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	if (sourceGuid?.startsWith("0x0E") && sourceName) {
		players.set(sourceGuid, sourceName);
	}
	if (destGuid?.startsWith("0x0E") && destName && destName !== "nil") {
		players.set(destGuid, destName);
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

function extractDate(line: string): Date | null {
	// Format: M/D HH:MM:SS.mmm
	const match = line.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})/);
	if (!match) return null;

	const month = Number.parseInt(match[1], 10) - 1;
	const day = Number.parseInt(match[2], 10);
	const hours = Number.parseInt(match[3], 10);
	const minutes = Number.parseInt(match[4], 10);
	const seconds = Number.parseInt(match[5], 10);

	const now = new Date();
	return new Date(now.getFullYear(), month, day, hours, minutes, seconds);
}

function stripQuotes(s: string): string {
	if (s.startsWith('"') && s.endsWith('"')) {
		return s.slice(1, -1);
	}
	return s;
}
