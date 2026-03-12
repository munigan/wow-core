import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
import { raidMembers } from "@/lib/db/schema/raid-members";
import { raids } from "@/lib/db/schema/raids";
import { parseLogStream, parseLogStreamMulti } from "@/lib/log-parser";

type SelectedRaidPayload = {
	dates: string[];
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

	try {
		// Multi-raid flow
		if (selectedRaidsHeader) {
			const selectedRaids: SelectedRaidPayload[] =
				JSON.parse(selectedRaidsHeader);

			const selectedDateGroups = selectedRaids.map((r) => r.dates);
			const multiResult = await parseLogStreamMulti(body, selectedDateGroups);

			if (multiResult.raids.length === 0) {
				return Response.json(
					{ error: "No raids found in log file" },
					{ status: 400 },
				);
			}

			// Group player names by coreId for per-core batch upserts
			const playersByCore = new Map<string, Set<string>>();
			for (let i = 0; i < multiResult.raids.length; i++) {
				const raidCoreId = selectedRaids[i].coreId;
				let nameSet = playersByCore.get(raidCoreId);
				if (!nameSet) {
					nameSet = new Set();
					playersByCore.set(raidCoreId, nameSet);
				}
				for (const player of multiResult.raids[i].players) {
					nameSet.add(player.name);
				}
			}

			// Per-core member upserts + lookups
			const memberByCoreAndName = new Map<string, Map<string, string>>();
			const newMembersByCore = new Map<string, number>();

			for (const [raidCoreId, playerNames] of playersByCore) {
				const names = Array.from(playerNames);
				if (names.length === 0) continue;

				const inserted = await db
					.insert(members)
					.values(names.map((name) => ({ coreId: raidCoreId, name })))
					.onConflictDoNothing()
					.returning({ id: members.id });

				newMembersByCore.set(raidCoreId, inserted.length);

				const coreMembers = await db
					.select({ id: members.id, name: members.name })
					.from(members)
					.where(
						and(eq(members.coreId, raidCoreId), inArray(members.name, names)),
					);

				memberByCoreAndName.set(
					raidCoreId,
					new Map(coreMembers.map((m) => [m.name, m.id])),
				);
			}

			// Create raid records with per-raid coreId and payload raidName
			const results = [];

			for (let i = 0; i < multiResult.raids.length; i++) {
				const raidData = multiResult.raids[i];
				const raidPayload = selectedRaids[i];
				const raidCoreId = raidPayload.coreId;
				const memberMap =
					memberByCoreAndName.get(raidCoreId) ?? new Map<string, string>();

				const [raid] = await db
					.insert(raids)
					.values({
						coreId: raidCoreId,
						name: raidPayload.raidName,
						date: raidData.raidDate,
					})
					.returning();

				const raidMemberIds = raidData.players
					.map((p) => memberMap.get(p.name))
					.filter((id): id is string => id != null);

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
					newMembers: newMembersByCore.get(raidCoreId) ?? 0,
				});
			}

			return Response.json(results);
		}

		// Single-raid flow (backward compat)
		const coreId = session.session.activeOrganizationId;
		if (!coreId) {
			return Response.json({ error: "No active core" }, { status: 400 });
		}

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
