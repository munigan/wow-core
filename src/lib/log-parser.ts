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

function extractDateKey(line: string): string | null {
	const match = line.match(/^(\d{1,2})\/(\d{1,2})\s/);
	if (!match) return null;
	return `${Number.parseInt(match[1], 10)}/${Number.parseInt(match[2], 10)}`;
}

type DateBucket = {
	players: Map<string, string>;
	firstLine: Date;
	raidDate: Date;
};

export async function parseLogStreamMulti(
	stream: ReadableStream<Uint8Array>,
	selectedDateGroups: string[][],
): Promise<ParseResultMulti> {
	const dateBuckets = new Map<string, DateBucket>();

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
			processMultiLine(line, dateBuckets);
		}
	}

	if (buffer.trim()) {
		processMultiLine(buffer, dateBuckets);
	}

	const raids: ParseResultMulti["raids"] = [];

	for (const dateGroup of selectedDateGroups) {
		const combinedPlayers = new Map<string, string>();
		let raidDate: Date | null = null;

		for (const dateKey of dateGroup) {
			const bucket = dateBuckets.get(dateKey);
			if (!bucket) continue;

			for (const [guid, name] of bucket.players) {
				combinedPlayers.set(guid, name);
			}

			if (raidDate === null) {
				raidDate = bucket.raidDate;
			}
		}

		const firstDate = dateGroup[0];
		const lastDate = dateGroup[dateGroup.length - 1];
		const raidName =
			dateGroup.length === 1
				? `Raid ${firstDate}`
				: `Raid ${firstDate} - ${lastDate}`;

		raids.push({
			raidDate: raidDate ?? new Date(),
			raidName,
			players: Array.from(combinedPlayers.entries()).map(([guid, name]) => ({
				guid,
				name,
			})),
		});
	}

	return { raids };
}

function processMultiLine(
	line: string,
	dateBuckets: Map<string, DateBucket>,
): void {
	const dateKey = extractDateKey(line);
	if (!dateKey) return;

	let bucket = dateBuckets.get(dateKey);
	if (!bucket) {
		const parsedDate = extractDate(line);
		if (!parsedDate) return;
		bucket = {
			players: new Map(),
			firstLine: parsedDate,
			raidDate: parsedDate,
		};
		dateBuckets.set(dateKey, bucket);
	}

	const doubleSpaceIdx = line.indexOf("  ");
	if (doubleSpaceIdx === -1) return;

	const eventPart = line.slice(doubleSpaceIdx + 2);
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	if (sourceGuid?.startsWith("0x0E") && sourceName) {
		bucket.players.set(sourceGuid, sourceName);
	}
	if (destGuid?.startsWith("0x0E") && destName && destName !== "nil") {
		bucket.players.set(destGuid, destName);
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
