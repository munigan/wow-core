import type {
	ParsedRaid,
	RaidSelection,
} from "@munigan/wow-combatlog-parser";
import {
	FileTooLargeError,
	parseLog,
} from "@munigan/wow-combatlog-parser";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { externalBuffs } from "@/lib/db/schema/external-buffs";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";

type SelectedRaidPayload = {
	dates: string[];
	startTime: string;
	endTime: string;
	timeRanges?: { startTime: string; endTime: string }[];
	coreId: string;
	raidName: string;
};

async function saveRaidToDb(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	parsedRaid: ParsedRaid,
	selectedRaid: SelectedRaidPayload,
) {
	const playerMap = new Map(
		parsedRaid.players.map((p) => [p.guid, p]),
	);

	const [raidRow] = await tx
		.insert(raids)
		.values({
			coreId: selectedRaid.coreId,
			name: selectedRaid.raidName,
			date: parsedRaid.raidDate,
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
				durationMs: enc.duration,
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
					timeIntoEncounter: d.timeIntoEncounter,
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
		raidDate: parsedRaid.raidDate.toISOString(),
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

		// Verify all selected raids target the user's active core
		const activeCoreId = session.session.activeOrganizationId;
		const hasInvalidCore = selectedRaids.some(
			(r) => r.coreId !== activeCoreId,
		);
		if (!activeCoreId || hasInvalidCore) {
			return Response.json(
				{ error: "Invalid core selection" },
				{ status: 403 },
			);
		}

		const raidSelections: RaidSelection[] = selectedRaids.map((r) => ({
			dates: r.dates,
			startTime: r.startTime,
			endTime: r.endTime,
			timeRanges: r.timeRanges,
		}));

		const { raids: parsedRaids } = await parseLog(body, raidSelections);

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
		return Response.json(
			{ error: "Failed to process log file" },
			{ status: 500 },
		);
	}
}
