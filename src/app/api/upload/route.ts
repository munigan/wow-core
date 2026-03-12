import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
import { raidMembers } from "@/lib/db/schema/raid-members";
import { raids } from "@/lib/db/schema/raids";
import { parseLogStream } from "@/lib/log-parser";

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const coreId = session.session.activeOrganizationId;
	if (!coreId) {
		return Response.json({ error: "No active core" }, { status: 400 });
	}

	const body = request.body;
	if (!body) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	try {
		const result = await parseLogStream(body);

		if (result.players.length === 0) {
			return Response.json(
				{ error: "No players found in log file" },
				{ status: 400 },
			);
		}

		// Create raid record
		const [raid] = await db
			.insert(raids)
			.values({
				coreId,
				name: result.raidName,
				date: result.raidDate,
			})
			.returning();

		// Upsert members and collect their IDs
		let newMemberCount = 0;
		const memberIds: string[] = [];

		for (const player of result.players) {
			// Try to find existing member
			const [existing] = await db
				.select()
				.from(members)
				.where(and(eq(members.coreId, coreId), eq(members.name, player.name)))
				.limit(1);

			if (existing) {
				memberIds.push(existing.id);
			} else {
				const [inserted] = await db
					.insert(members)
					.values({ coreId, name: player.name })
					.returning();
				memberIds.push(inserted.id);
				newMemberCount++;
			}
		}

		// Insert raid members
		if (memberIds.length > 0) {
			await db
				.insert(raidMembers)
				.values(memberIds.map((memberId) => ({ raidId: raid.id, memberId })))
				.onConflictDoNothing();
		}

		return Response.json({
			raidId: raid.id,
			raidName: raid.name,
			raidDate: raid.date,
			totalMembers: result.players.length,
			newMembers: newMemberCount,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return Response.json(
			{ error: "Failed to process log file" },
			{ status: 500 },
		);
	}
}
