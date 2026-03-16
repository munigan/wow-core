import {
	FileTooLargeError,
	parseLog,
	type RaidSelection,
} from "@munigan/wow-combatlog-parser";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type SelectedRaidPayload = {
	dates: string[];
	startTime: string;
	endTime: string;
	timeRanges?: { startTime: string; endTime: string }[];
	coreId: string;
	raidName: string;
};

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = request.body;
	if (!body) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	const selectedRaidsHeader = requestHeaders.get("X-Selected-Raids");
	if (!selectedRaidsHeader) {
		return Response.json(
			{ error: "Missing X-Selected-Raids header" },
			{ status: 400 },
		);
	}

	try {
		const selectedRaids: SelectedRaidPayload[] =
			JSON.parse(selectedRaidsHeader);

		const raidSelections: RaidSelection[] = selectedRaids.map((r) => ({
			dates: r.dates,
			startTime: r.startTime,
			endTime: r.endTime,
			timeRanges: r.timeRanges,
		}));

		const { raids } = await parseLog(body, raidSelections);

		const results = raids.map((raid, i) => ({
			raidName: selectedRaids[i].raidName,
			raidDate: raid.raidDate.toISOString(),
			raidInstance: raid.raidInstance,
			totalMembers: raid.players.length,
		}));

		return Response.json(results);
	} catch (error) {
		if (error instanceof FileTooLargeError) {
			return Response.json({ error: "File too large" }, { status: 413 });
		}
		console.error("Upload error:", error);
		return Response.json(
			{ error: "Failed to process log file" },
			{ status: 500 },
		);
	}
}
