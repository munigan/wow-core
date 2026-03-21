import {
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { ParsedRaid, RaidSelection } from "@munigan/wow-combatlog-parser";
import { FileTooLargeError, parseLog } from "@munigan/wow-combatlog-parser";
import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { externalBuffs } from "@/lib/db/schema/external-buffs";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const uploadBodySchema = z.object({
	key: z.string(),
	selectedRaids: z.array(
		z.object({
			dates: z.array(z.string()),
			startTime: z.string(),
			endTime: z.string(),
			timeRanges: z
				.array(z.object({ startTime: z.string(), endTime: z.string() }))
				.optional(),
			coreId: z.string(),
			raidName: z.string(),
		}),
	),
});

type SelectedRaidPayload = z.infer<typeof uploadBodySchema>["selectedRaids"][number];

async function saveRaidToDb(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	parsedRaid: ParsedRaid,
	selectedRaid: SelectedRaidPayload,
) {
	const playerMap = new Map(parsedRaid.players.map((p) => [p.guid, p]));

	// Upsert members from raid players (always, even for duplicates)
	if (parsedRaid.players.length > 0) {
		await tx
			.insert(members)
			.values(
				parsedRaid.players.map((p) => ({
					coreId: selectedRaid.coreId,
					name: p.name,
					class: p.class,
					spec: p.spec,
				})),
			)
			.onConflictDoUpdate({
				target: [members.coreId, members.name],
				set: {
					class: sql`excluded.class`,
					spec: sql`excluded.spec`,
					updatedAt: sql`now()`,
				},
			});
	}

	// Use the actual start time from the combat log (selectedRaid.startTime)
	// instead of parsedRaid.raidDate which is date-only (midnight).
	const raidStartTime = new Date(selectedRaid.startTime);

	// Skip if raid with same core + start time + instance already exists
	const [existingRaid] = await tx
		.select({ id: raids.id })
		.from(raids)
		.where(
			and(
				eq(raids.coreId, selectedRaid.coreId),
				eq(raids.date, raidStartTime),
				parsedRaid.raidInstance
					? eq(raids.raidInstance, parsedRaid.raidInstance)
					: isNull(raids.raidInstance),
			),
		)
		.limit(1);

	if (existingRaid) {
		return {
			raidId: existingRaid.id,
			raidName: selectedRaid.raidName,
			raidDate: raidStartTime.toISOString(),
			raidInstance: parsedRaid.raidInstance,
			totalMembers: parsedRaid.players.length,
			isDuplicate: true,
		};
	}

	const [raidRow] = await tx
		.insert(raids)
		.values({
			coreId: selectedRaid.coreId,
			name: selectedRaid.raidName,
			date: raidStartTime,
			raidInstance: parsedRaid.raidInstance,
			durationMs: parsedRaid.raidDurationMs,
		})
		.returning({ id: raids.id });

	for (let i = 0; i < parsedRaid.encounters.length; i++) {
		const enc = parsedRaid.encounters[i];

		const [encRow] = await tx
			.insert(encounters)
			.values({
				raidId: raidRow.id,
				bossName: enc.bossName,
				startTime: enc.startTime,
				endTime: enc.endTime,
				durationMs: Math.round(enc.duration * 1000),
				result: enc.result,
				difficulty: enc.difficulty,
				order: i,
			})
			.returning({ id: encounters.id });

		// encounter_players from combatStats
		if (enc.combatStats) {
			const playerRows = Object.entries(enc.combatStats).map(
				([guid, stats]) => {
					const player = playerMap.get(guid);
					return {
						encounterId: encRow.id,
						playerGuid: guid,
						playerName: player?.name ?? guid,
						class: player?.class ?? null,
						spec: player?.spec ?? null,
						damage: stats.damage,
						damageTaken: stats.damageTaken,
					};
				},
			);
			if (playerRows.length > 0) {
				await tx.insert(encounterPlayers).values(playerRows);
			}
		}

		// player_deaths
		if (enc.deaths && enc.deaths.length > 0) {
			await tx.insert(playerDeaths).values(
				enc.deaths.map((d) => ({
					encounterId: encRow.id,
					playerGuid: d.playerGuid,
					playerName: d.playerName,
					timestamp: d.timestamp,
					timeIntoEncounter: Math.round(d.timeIntoEncounter),
					killingBlow: d.killingBlow ?? null,
					recap: d.recap,
				})),
			);
		}

		// consumable_uses
		if (enc.consumables) {
			const consumableRows = Object.entries(enc.consumables).flatMap(
				([guid, uses]) =>
					uses.map((u) => ({
						encounterId: encRow.id,
						playerGuid: guid,
						spellId: u.spellId,
						spellName: u.spellName,
						type: u.type,
						prePot: u.prePot,
						count: u.count,
					})),
			);
			if (consumableRows.length > 0) {
				await tx.insert(consumableUses).values(consumableRows);
			}
		}

		// buff_uptimes
		if (enc.buffUptime) {
			const uptimeRows = Object.entries(enc.buffUptime).map(
				([guid, uptime]) => ({
					encounterId: encRow.id,
					playerGuid: guid,
					flaskUptimePercent: uptime.flaskUptimePercent,
					foodUptimePercent: uptime.foodUptimePercent,
				}),
			);
			if (uptimeRows.length > 0) {
				await tx.insert(buffUptimes).values(uptimeRows);
			}
		}

		// external_buffs
		if (enc.externals) {
			const externalRows = Object.entries(enc.externals).flatMap(
				([guid, buffs]) =>
					buffs.map((b) => ({
						encounterId: encRow.id,
						playerGuid: guid,
						spellId: b.spellId,
						spellName: b.spellName,
						sourceGuid: b.sourceGuid,
						sourceName: b.sourceName,
						count: b.count,
						uptimePercent: b.uptimePercent,
					})),
			);
			if (externalRows.length > 0) {
				await tx.insert(externalBuffs).values(externalRows);
			}
		}
	}

	return {
		raidId: raidRow.id,
		raidName: selectedRaid.raidName,
		raidDate: raidStartTime.toISOString(),
		raidInstance: parsedRaid.raidInstance,
		totalMembers: parsedRaid.players.length,
	};
}

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = uploadBodySchema.safeParse(await request.json());
	if (!parsed.success) {
		return Response.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { key, selectedRaids } = parsed.data;

	// Verify the key belongs to this user
	const expectedPrefix = `uploads/${session.user.id}/`;
	if (!key.startsWith(expectedPrefix)) {
		return Response.json({ error: "Invalid file key" }, { status: 403 });
	}

	// Verify all selected raids target the user's active core
	const activeCoreId = session.session.activeOrganizationId;
	const hasInvalidCore = selectedRaids.some((r) => r.coreId !== activeCoreId);
	if (!activeCoreId || hasInvalidCore) {
		return Response.json(
			{ error: "Invalid core selection" },
			{ status: 403 },
		);
	}

	const bucket = process.env.R2_BUCKET_NAME!;

	try {
		// Fetch file from R2
		const r2Response = await r2.send(
			new GetObjectCommand({ Bucket: bucket, Key: key }),
		);

		if (!r2Response.Body) {
			return Response.json(
				{ error: "File not found in storage" },
				{ status: 404 },
			);
		}

		const stream = r2Response.Body.transformToWebStream();

		const raidSelections: RaidSelection[] = selectedRaids.map((r) => ({
			dates: r.dates,
			startTime: r.startTime,
			endTime: r.endTime,
			timeRanges: r.timeRanges,
		}));

		const { raids: parsedRaids } = await parseLog(stream, raidSelections);

		const results = await db.transaction(async (tx) => {
			const raidResults = [];
			for (let i = 0; i < parsedRaids.length; i++) {
				const result = await saveRaidToDb(
					tx,
					parsedRaids[i],
					selectedRaids[i],
				);
				raidResults.push(result);
			}
			return raidResults;
		});

		return Response.json(results);
	} catch (error) {
		if (error instanceof FileTooLargeError) {
			return Response.json({ error: "File too large" }, { status: 413 });
		}
		console.error("Upload error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to process log file";
		return Response.json({ error: message }, { status: 500 });
	} finally {
		// Best-effort cleanup: delete the R2 object
		await r2
			.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
			.catch(() => {});
	}
}
