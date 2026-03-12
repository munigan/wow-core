import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
import { raidMembers } from "@/lib/db/schema/raid-members";
import { raids } from "@/lib/db/schema/raids";
import { parseLogStream, parseLogStreamMulti } from "@/lib/log-parser";

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const coreId =
		requestHeaders.get("X-Core-Id") ?? session.session.activeOrganizationId;
	if (!coreId) {
		return Response.json({ error: "No active core" }, { status: 400 });
	}

	const body = request.body;
	if (!body) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	const selectedRaidsHeader = requestHeaders.get("X-Selected-Raids");

	try {
		// Multi-raid flow
		if (selectedRaidsHeader) {
			const selectedDateGroups: string[][] = JSON.parse(selectedRaidsHeader);
			const multiResult = await parseLogStreamMulti(body, selectedDateGroups);

			if (multiResult.raids.length === 0) {
				return Response.json(
					{ error: "No raids found in log file" },
					{ status: 400 },
				);
			}

			// Collect all unique player names across all raids for a single batch upsert
			const allPlayerNames = new Set<string>();
			for (const raid of multiResult.raids) {
				for (const player of raid.players) {
					allPlayerNames.add(player.name);
				}
			}

			const uniqueNames = Array.from(allPlayerNames);

			if (uniqueNames.length === 0) {
				return Response.json(
					{ error: "No players found in log file" },
					{ status: 400 },
				);
			}

			// Query 1: Batch upsert all members across all raids
			const inserted = await db
				.insert(members)
				.values(uniqueNames.map((name) => ({ coreId, name })))
				.onConflictDoNothing()
				.returning({ id: members.id });

			const newMemberCount = inserted.length;

			// Query 2: Fetch all member IDs + names for linking
			const allMembers = await db
				.select({ id: members.id, name: members.name })
				.from(members)
				.where(
					and(eq(members.coreId, coreId), inArray(members.name, uniqueNames)),
				);

			const memberByName = new Map(allMembers.map((m) => [m.name, m.id]));

			// Process each raid
			const results = [];

			for (const raidData of multiResult.raids) {
				// Query 3 (per raid): Create raid record
				const [raid] = await db
					.insert(raids)
					.values({
						coreId,
						name: raidData.raidName,
						date: raidData.raidDate,
					})
					.returning();

				// Resolve member IDs for this raid's players
				const raidMemberIds: string[] = [];
				for (const player of raidData.players) {
					const memberId = memberByName.get(player.name);
					if (memberId) {
						raidMemberIds.push(memberId);
					}
				}

				// Query 4 (per raid): Batch insert raid members
				if (raidMemberIds.length > 0) {
					await db
						.insert(raidMembers)
						.values(
							raidMemberIds.map((memberId) => ({
								raidId: raid.id,
								memberId,
							})),
						)
						.onConflictDoNothing();
				}

				results.push({
					raidId: raid.id,
					raidName: raid.name,
					raidDate: raid.date,
					totalMembers: raidMemberIds.length,
					newMembers: newMemberCount,
				});
			}

			return Response.json(results);
		}

		// Single-raid flow (backward compat)
		const result = await parseLogStream(body);

		if (result.players.length === 0) {
			return Response.json(
				{ error: "No players found in log file" },
				{ status: 400 },
			);
		}

		const playerNames = result.players.map((p) => p.name);

		// Query 1: Create raid record
		const [raid] = await db
			.insert(raids)
			.values({
				coreId,
				name: result.raidName,
				date: result.raidDate,
			})
			.returning();

		// Query 2: Batch insert new members
		const inserted = await db
			.insert(members)
			.values(playerNames.map((name) => ({ coreId, name })))
			.onConflictDoNothing()
			.returning({ id: members.id });

		const newMemberCount = inserted.length;

		// Query 3: Fetch all member IDs
		const allMembers = await db
			.select({ id: members.id })
			.from(members)
			.where(
				and(eq(members.coreId, coreId), inArray(members.name, playerNames)),
			);

		// Query 4: Batch insert raid members
		if (allMembers.length > 0) {
			await db
				.insert(raidMembers)
				.values(allMembers.map((m) => ({ raidId: raid.id, memberId: m.id })))
				.onConflictDoNothing();
		}

		return Response.json({
			raidId: raid.id,
			raidName: raid.name,
			raidDate: raid.date,
			totalMembers: allMembers.length,
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
