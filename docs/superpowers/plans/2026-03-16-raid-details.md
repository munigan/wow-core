# Raid Details Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store parsed combat log data in the database and build a raid details page showing boss encounters, metrics, and per-player damage breakdown.

**Architecture:** Extend the existing Drizzle schema with 6 new tables for encounter data. The upload route handler inserts parsed data in a transaction, then the client redirects to `/raids`. The raid details page at `/raids/[raidId]` uses tRPC procedures prefetched in server components and rendered by client components.

**Tech Stack:** Next.js 16 (App Router), tRPC v11, TanStack Query, Drizzle ORM, PostgreSQL, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-03-16-raid-details-design.md`

---

## File Map

### Schema files (create)
- `src/lib/db/schema/encounters.ts` — encounters table definition
- `src/lib/db/schema/encounter-players.ts` — encounter_players table definition
- `src/lib/db/schema/player-deaths.ts` — player_deaths table definition
- `src/lib/db/schema/consumable-uses.ts` — consumable_uses table definition
- `src/lib/db/schema/buff-uptimes.ts` — buff_uptimes table definition
- `src/lib/db/schema/external-buffs.ts` — external_buffs table definition

### Schema files (modify)
- `src/lib/db/schema/raids.ts` — add raidInstance, durationMs columns
- `src/lib/db/schema/index.ts` — export new tables + add to schema object

### Backend (modify)
- `src/app/api/upload/route.ts` — add DB insert transaction after parsing
- `src/lib/trpc/routers/raids.ts` — add getById and getEncounterDetails procedures

### Frontend (modify)
- `src/app/(app)/raids/page.tsx` — render raids list with links
- `src/components/upload-log-form.tsx` — update UploadResult type + redirect on done

### Frontend (create)
- `src/app/(app)/raids/[raidId]/page.tsx` — server component, prefetch raid data
- `src/app/(app)/raids/[raidId]/raid-details.tsx` — client component, metric cards + encounters table
- `src/app/(app)/raids/[raidId]/encounter-row.tsx` — client component, expandable encounter row
- `src/app/(app)/raids/[raidId]/player-breakdown.tsx` — client component, per-player table with filters

---

## Task 1: Extend raids table schema

**Files:**
- Modify: `src/lib/db/schema/raids.ts`

- [ ] **Step 1: Add raidInstance and durationMs columns to raids table**

```typescript
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";

const timestamptz = () => timestamp({ withTimezone: true });

export const raids = pgTable("raids", {
	id: uuid().primaryKey().defaultRandom(),
	coreId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	name: text().notNull(),
	date: timestamptz().notNull(),
	raidInstance: text(),
	durationMs: integer(),
	createdAt: timestamptz().notNull().defaultNow(),
});
```

- [ ] **Step 2: Commit (do NOT run migrations yet — wait until Task 6)**

```bash
git add src/lib/db/schema/raids.ts
git commit -m "feat: add raidInstance and durationMs columns to raids table"
```

---

## Task 2: Create encounters schema

**Files:**
- Create: `src/lib/db/schema/encounters.ts`

- [ ] **Step 1: Create encounters table definition**

```typescript
import { integer, pgTable, smallint, text, uuid } from "drizzle-orm/pg-core";
import { raids } from "./raids";

export const encounters = pgTable("encounters", {
	id: uuid().primaryKey().defaultRandom(),
	raidId: uuid()
		.notNull()
		.references(() => raids.id, { onDelete: "cascade" }),
	bossName: text().notNull(),
	startTime: text().notNull(),
	endTime: text().notNull(),
	durationMs: integer().notNull(),
	result: text().notNull(),
	difficulty: text(),
	order: smallint().notNull(),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db/schema/encounters.ts
git commit -m "feat: add encounters schema"
```

---

## Task 3: Create encounter-players schema

**Files:**
- Create: `src/lib/db/schema/encounter-players.ts`

- [ ] **Step 1: Create encounter_players table definition**

```typescript
import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const encounterPlayers = pgTable("encounter_players", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	playerName: text().notNull(),
	class: text(),
	spec: text(),
	damage: bigint({ mode: "number" }).notNull(),
	damageTaken: bigint({ mode: "number" }).notNull(),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db/schema/encounter-players.ts
git commit -m "feat: add encounter-players schema"
```

---

## Task 4: Create player-deaths schema

**Files:**
- Create: `src/lib/db/schema/player-deaths.ts`

- [ ] **Step 1: Create player_deaths table definition**

```typescript
import { bigint, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const playerDeaths = pgTable("player_deaths", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	playerName: text().notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
	timeIntoEncounter: integer().notNull(),
	killingBlow: jsonb(),
	recap: jsonb().notNull(),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db/schema/player-deaths.ts
git commit -m "feat: add player-deaths schema"
```

---

## Task 5: Create consumable-uses, buff-uptimes, external-buffs schemas

**Files:**
- Create: `src/lib/db/schema/consumable-uses.ts`
- Create: `src/lib/db/schema/buff-uptimes.ts`
- Create: `src/lib/db/schema/external-buffs.ts`

- [ ] **Step 1: Create consumable_uses table**

```typescript
import { boolean, integer, pgTable, smallint, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const consumableUses = pgTable("consumable_uses", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	spellId: integer().notNull(),
	spellName: text().notNull(),
	type: text().notNull(),
	prePot: boolean().notNull(),
	count: smallint().notNull(),
});
```

- [ ] **Step 2: Create buff_uptimes table**

```typescript
import { pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const buffUptimes = pgTable("buff_uptimes", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	flaskUptimePercent: real().notNull(),
	foodUptimePercent: real().notNull(),
});
```

- [ ] **Step 3: Create external_buffs table**

```typescript
import { pgTable, real, integer, smallint, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const externalBuffs = pgTable("external_buffs", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	spellId: integer().notNull(),
	spellName: text().notNull(),
	sourceGuid: text().notNull(),
	sourceName: text().notNull(),
	count: smallint().notNull(),
	uptimePercent: real().notNull(),
});
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema/consumable-uses.ts src/lib/db/schema/buff-uptimes.ts src/lib/db/schema/external-buffs.ts
git commit -m "feat: add consumable-uses, buff-uptimes, external-buffs schemas"
```

---

## Task 6: Update schema barrel export and run migrations

**Files:**
- Modify: `src/lib/db/schema/index.ts`

- [ ] **Step 1: Add all new tables to the barrel export and schema object**

```typescript
import { accounts } from "./accounts";
import { buffUptimes } from "./buff-uptimes";
import { consumableUses } from "./consumable-uses";
import { coreInvitations } from "./core-invitations";
import { coreMembers } from "./core-members";
import { cores } from "./cores";
import { encounterPlayers } from "./encounter-players";
import { encounters } from "./encounters";
import { externalBuffs } from "./external-buffs";
import { members } from "./members";
import { playerDeaths } from "./player-deaths";
import { raidMembers } from "./raid-members";
import { raids } from "./raids";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export { accounts } from "./accounts";
export { buffUptimes } from "./buff-uptimes";
export { consumableUses } from "./consumable-uses";
export { coreInvitations } from "./core-invitations";
export { coreMembers } from "./core-members";
export { cores } from "./cores";
export { encounterPlayers } from "./encounter-players";
export { encounters } from "./encounters";
export { externalBuffs } from "./external-buffs";
export { members } from "./members";
export { playerDeaths } from "./player-deaths";
export { raidMembers } from "./raid-members";
export { raids } from "./raids";
export { sessions } from "./sessions";
export { users } from "./users";
export { verifications } from "./verifications";

export const schema = {
	users,
	sessions,
	accounts,
	verifications,
	cores,
	coreMembers,
	coreInvitations,
	members,
	raids,
	raidMembers,
	encounters,
	encounterPlayers,
	playerDeaths,
	consumableUses,
	buffUptimes,
	externalBuffs,
};
```

- [ ] **Step 2: Generate and run migration for all new tables**

Run: `pnpm drizzle-kit generate && pnpm drizzle-kit migrate`
Expected: Migration file created covering encounters, encounter_players, player_deaths, consumable_uses, buff_uptimes, external_buffs tables. Migration applied successfully.

- [ ] **Step 3: Commit**

```bash
git add src/lib/db/schema/index.ts drizzle/
git commit -m "feat: export new schema tables and run migrations"
```

---

## Task 7: Update upload route to persist parsed data

**Files:**
- Modify: `src/app/api/upload/route.ts`

- [ ] **Step 1: Add database imports and transaction logic**

Replace the existing upload route with the version that persists parsed data. The key changes are:
1. Import `db` and all new schema tables
2. After `parseLog()`, iterate over each parsed raid and insert data in a Drizzle transaction
3. Build a `playerMap` from `ParsedRaid.players` for GUID → metadata lookups
4. Return `raidId` in the response

```typescript
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
```

- [ ] **Step 2: Verify the app builds**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: persist parsed combat log data to database on upload"
```

---

## Task 8: Update upload form to redirect after upload

**Files:**
- Modify: `src/components/upload-log-form.tsx`

- [ ] **Step 1: Update UploadResult type to include raidId**

In `src/components/upload-log-form.tsx`, find the `UploadResult` type (line ~25):

```typescript
// Before
type UploadResult = {
	raidName: string;
	raidDate: string;
	raidInstance: string | null;
	totalMembers: number;
};
```

Replace with:

```typescript
type UploadResult = {
	raidId: string;
	raidName: string;
	raidDate: string;
	raidInstance: string | null;
	totalMembers: number;
};
```

- [ ] **Step 2: Update handleDone to redirect to /raids**

Find the `handleDone` function (line ~428):

```typescript
// Before
const handleDone = () => {
	onDoneAction();
	router.refresh();
};
```

Replace with:

```typescript
const handleDone = () => {
	onDoneAction();
	router.push("/raids");
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/upload-log-form.tsx
git commit -m "feat: redirect to /raids after upload completes"
```

---

## Task 9: Add raids.getById tRPC procedure

**Files:**
- Modify: `src/lib/trpc/routers/raids.ts`

- [ ] **Step 1: Add getById procedure**

Add the following procedure to the `raidsRouter` in `src/lib/trpc/routers/raids.ts`. This queries the raid, its encounters, and aggregates death counts and DPS per encounter.

```typescript
import { and, count, desc, eq, inArray, sql, sum } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const raidsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select()
			.from(raids)
			.where(eq(raids.coreId, ctx.coreId))
			.orderBy(desc(raids.date));
	}),

	listByCores: protectedProcedure
		.input(z.object({ coreIds: z.array(z.string()) }))
		.query(async ({ input }) => {
			if (input.coreIds.length === 0) return [];
			return db
				.select({
					id: raids.id,
					coreId: raids.coreId,
					name: raids.name,
					date: raids.date,
				})
				.from(raids)
				.where(inArray(raids.coreId, input.coreIds))
				.orderBy(desc(raids.date));
		}),

	getById: protectedProcedure
		.input(z.object({ raidId: z.string() }))
		.query(async ({ ctx, input }) => {
			const raid = await db
				.select()
				.from(raids)
				.where(
					and(eq(raids.id, input.raidId), eq(raids.coreId, ctx.coreId)),
				)
				.then((rows) => rows[0]);

			if (!raid) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Raid not found",
				});
			}

			const encounterRows = await db
				.select()
				.from(encounters)
				.where(eq(encounters.raidId, raid.id))
				.orderBy(encounters.order);

			if (encounterRows.length === 0) {
				return {
					...raid,
					uniquePlayerCount: 0,
					encounters: [],
				};
			}

			// Aggregate damage and deaths per encounter in two queries
			const damageByEncounter = await db
				.select({
					encounterId: encounterPlayers.encounterId,
					totalDamage: sum(encounterPlayers.damage),
				})
				.from(encounterPlayers)
				.where(
					inArray(
						encounterPlayers.encounterId,
						encounterRows.map((e) => e.id),
					),
				)
				.groupBy(encounterPlayers.encounterId);

			const deathsByEncounter = await db
				.select({
					encounterId: playerDeaths.encounterId,
					deathCount: count(),
				})
				.from(playerDeaths)
				.where(
					inArray(
						playerDeaths.encounterId,
						encounterRows.map((e) => e.id),
					),
				)
				.groupBy(playerDeaths.encounterId);

			const damageMap = new Map(
				damageByEncounter.map((d) => [d.encounterId, Number(d.totalDamage ?? 0)]),
			);
			const deathMap = new Map(
				deathsByEncounter.map((d) => [d.encounterId, d.deathCount]),
			);

			// Count unique players across all encounters
			const [playerCountResult] = await db
				.select({ uniquePlayers: sql<number>`count(distinct ${encounterPlayers.playerGuid})` })
				.from(encounterPlayers)
				.where(
					inArray(
						encounterPlayers.encounterId,
						encounterRows.map((e) => e.id),
					),
				);

			const encountersWithStats = encounterRows.map((enc) => {
				const totalDamage = damageMap.get(enc.id) ?? 0;
				const raidDps =
					enc.durationMs > 0
						? Math.round((totalDamage / enc.durationMs) * 1000)
						: 0;

				return {
					...enc,
					totalDamage,
					raidDps,
					deathCount: deathMap.get(enc.id) ?? 0,
				};
			});

			return {
				...raid,
				uniquePlayerCount: playerCountResult?.uniquePlayers ?? 0,
				encounters: encountersWithStats,
			};
		}),
});
```

Note: Add `import { TRPCError } from "@trpc/server"` at the top alongside the existing `initTRPC` import, or import it directly in this file. Since `protectedProcedure` is imported from `init.ts`, import `TRPCError` from `@trpc/server` directly in `raids.ts`.

- [ ] **Step 2: Verify the app builds**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/raids.ts
git commit -m "feat: add raids.getById tRPC procedure"
```

---

## Task 10: Add raids.getEncounterDetails tRPC procedure

**Files:**
- Modify: `src/lib/trpc/routers/raids.ts`

- [ ] **Step 1: Add getEncounterDetails procedure to the raids router**

Add this procedure after `getById` in the same router:

```typescript
getEncounterDetails: protectedProcedure
	.input(z.object({ encounterId: z.string() }))
	.query(async ({ ctx, input }) => {
		// Verify the encounter belongs to a raid in the user's core
		const encounter = await db
			.select()
			.from(encounters)
			.innerJoin(raids, eq(encounters.raidId, raids.id))
			.where(
				and(
					eq(encounters.id, input.encounterId),
					eq(raids.coreId, ctx.coreId),
				),
			)
			.then((rows) => rows[0]);

		if (!encounter) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Encounter not found",
			});
		}

		const players = await db
			.select()
			.from(encounterPlayers)
			.where(eq(encounterPlayers.encounterId, input.encounterId));

		const deaths = await db
			.select()
			.from(playerDeaths)
			.where(eq(playerDeaths.encounterId, input.encounterId));

		const deathCountByPlayer = new Map<string, number>();
		for (const death of deaths) {
			deathCountByPlayer.set(
				death.playerGuid,
				(deathCountByPlayer.get(death.playerGuid) ?? 0) + 1,
			);
		}

		const durationMs = encounter.encounters.durationMs;

		const playersWithStats = players
			.map((p) => ({
				...p,
				dps:
					durationMs > 0
						? Math.round((p.damage / durationMs) * 1000)
						: 0,
				deathCount: deathCountByPlayer.get(p.playerGuid) ?? 0,
			}))
			.sort((a, b) => b.dps - a.dps);

		return {
			encounter: encounter.encounters,
			players: playersWithStats,
		};
	}),
```

- [ ] **Step 2: Verify the app builds**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/raids.ts
git commit -m "feat: add raids.getEncounterDetails tRPC procedure"
```

---

## Task 11: Update raids list page

**Files:**
- Modify: `src/app/(app)/raids/page.tsx`

- [ ] **Step 1: Render raids list with links**

Replace the current raids page content. The page is a server component that prefetches `raids.list` and renders a simple list of raids with links to `/raids/[raidId]`.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { RaidsList } from "./raids-list";

export const metadata: Metadata = {
	title: "Raids",
};

export default async function RaidsPage() {
	void trpc.raids.list.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Raids
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Boss encounters and performance metrics"}
					</p>
				</div>
				<RaidsList />
			</div>
		</HydrateClient>
	);
}
```

- [ ] **Step 2: Create RaidsList client component**

Create `src/app/(app)/raids/raids-list.tsx`:

```tsx
"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export function RaidsList() {
	const { data: raids } = trpc.raids.list.useQuery();

	if (!raids || raids.length === 0) {
		return (
			<p className="font-body text-sm text-dimmed">
				No raids uploaded yet. Upload a combat log to get started.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{raids.map((raid) => {
				const dateStr = new Date(raid.date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				});

				return (
					<Link
						key={raid.id}
						href={`/raids/${raid.id}`}
						className="flex items-center justify-between border border-border px-4 py-3 transition-colors hover:border-accent hover:bg-subtle"
					>
						<div className="flex flex-col gap-0.5">
							<span className="font-body text-sm font-semibold text-primary">
								{raid.name}
							</span>
							<span className="font-body text-2xs text-dimmed">
								{raid.raidInstance ? `${raid.raidInstance} — ` : ""}
								{dateStr}
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/raids/page.tsx src/app/(app)/raids/raids-list.tsx
git commit -m "feat: render raids list with links to raid details"
```

---

## Task 12: Create raid details server page

**Files:**
- Create: `src/app/(app)/raids/[raidId]/page.tsx`

- [ ] **Step 1: Create the server component page**

```tsx
import type { Metadata } from "next";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { RaidDetails } from "./raid-details";

type RaidDetailPageProps = {
	params: Promise<{ raidId: string }>;
};

export const metadata: Metadata = {
	title: "Raid Details",
};

export default async function RaidDetailPage({ params }: RaidDetailPageProps) {
	const { raidId } = await params;
	void trpc.raids.getById.prefetch({ raidId });

	return (
		<HydrateClient>
			<RaidDetails raidId={raidId} />
		</HydrateClient>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/raids/[raidId]/page.tsx
git commit -m "feat: add raid details server page with prefetching"
```

---

## Task 13: Create RaidDetails client component

**Files:**
- Create: `src/app/(app)/raids/[raidId]/raid-details.tsx`

- [ ] **Step 1: Build the main raid details component with metric cards and encounters table**

This component renders the page header, four metric cards, and the encounters table. It uses `trpc.raids.getById.useQuery()` to consume the prefetched data.

```tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { EncounterRow } from "./encounter-row";
import { PlayerBreakdown } from "./player-breakdown";

type RaidDetailsProps = {
	raidId: string;
};

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString();
}

export function RaidDetails({ raidId }: RaidDetailsProps) {
	const { data } = trpc.raids.getById.useQuery({ raidId });
	const [selectedEncounterId, setSelectedEncounterId] = useState<
		string | null
	>(null);

	if (!data) return null;

	const { encounters, ...raid } = data;

	const killEncounters = encounters.filter((e) => e.result === "kill");
	const wipeEncounters = encounters.filter((e) => e.result === "wipe");

	// Group encounters by boss name for wipe count
	const wipeCountByBoss = new Map<string, number>();
	for (const enc of wipeEncounters) {
		wipeCountByBoss.set(
			enc.bossName,
			(wipeCountByBoss.get(enc.bossName) ?? 0) + 1,
		);
	}

	// Wipe attempts grouped by boss for expandable rows
	const wipesByBoss = new Map<string, typeof encounters>();
	for (const enc of wipeEncounters) {
		const existing = wipesByBoss.get(enc.bossName) ?? [];
		existing.push(enc);
		wipesByBoss.set(enc.bossName, existing);
	}

	// Metrics — use totalDamage from server to avoid rounding errors
	const totalKillDamage = killEncounters.reduce(
		(sum, e) => sum + e.totalDamage,
		0,
	);
	const totalKillDurationMs = killEncounters.reduce(
		(sum, e) => sum + e.durationMs,
		0,
	);
	const raidDps =
		totalKillDurationMs > 0
			? Math.round((totalKillDamage / totalKillDurationMs) * 1000)
			: 0;

	const uniqueBossKills = new Set(killEncounters.map((e) => e.bossName)).size;
	const difficulties = killEncounters.reduce(
		(acc, e) => {
			const diff = e.difficulty ?? "N/C";
			acc.set(diff, (acc.get(diff) ?? 0) + 1);
			return acc;
		},
		new Map<string, number>(),
	);
	const difficultyText = [...difficulties.entries()]
		.map(([diff, count]) => `${count}x ${diff}`)
		.join(", ");

	const uniquePlayerCount = data.uniquePlayerCount;

	const raidDateStr = new Date(raid.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	// Default selected encounter: first kill
	const activeEncounterId =
		selectedEncounterId ?? killEncounters[0]?.id ?? null;

	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					Raid Details
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// "}
					{raid.name} — {raidDateStr}
					{raid.raidInstance ? ` — ${raid.raidInstance}` : ""}
				</p>
			</div>

			{/* Metric Cards */}
			<div className="grid grid-cols-4 gap-3">
				<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Raid DPS
					</span>
					<span className="font-heading text-2xl font-bold text-accent">
						{formatNumber(raidDps)}
					</span>
				</div>
				<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Duration
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{formatDuration(raid.durationMs ?? 0)}
					</span>
				</div>
				<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Bosses
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{uniqueBossKills}
					</span>
					<span className="font-body text-3xs text-dimmed">
						{difficultyText}
					</span>
				</div>
				<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
					<span className="font-body text-2xs uppercase tracking-wider text-dimmed">
						Players
					</span>
					<span className="font-heading text-2xl font-bold text-primary">
						{uniquePlayerCount}
					</span>
				</div>
			</div>

			{/* Encounters Table */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-dimmed">
					Encounters / Bosses
				</span>
				<div className="overflow-hidden rounded-lg border border-border bg-card">
					{/* Header row */}
					<div className="flex border-b border-border px-4 py-2.5 font-body text-3xs uppercase tracking-wider text-dimmed">
						<div className="flex-[3]">Encounter</div>
						<div className="flex-[1.5]">DPS</div>
						<div className="flex-1">Duration</div>
						<div className="flex-1">Deaths</div>
						<div className="flex-1">Status</div>
					</div>
					{/* Kill rows */}
					{killEncounters.map((enc) => (
						<EncounterRow
							key={enc.id}
							encounter={enc}
							wipeCount={wipeCountByBoss.get(enc.bossName) ?? 0}
							wipes={wipesByBoss.get(enc.bossName) ?? []}
							isSelected={enc.id === activeEncounterId}
							onSelect={() => setSelectedEncounterId(enc.id)}
							formatNumber={formatNumber}
						/>
					))}
				</div>
			</div>

			{/* Per-Player Breakdown */}
			{activeEncounterId && (
				<PlayerBreakdown
					encounterId={activeEncounterId}
					formatNumber={formatNumber}
				/>
			)}
		</div>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/raids/[raidId]/raid-details.tsx
git commit -m "feat: add RaidDetails client component with metric cards and encounters table"
```

---

## Task 14: Create EncounterRow client component

**Files:**
- Create: `src/app/(app)/raids/[raidId]/encounter-row.tsx`

- [ ] **Step 1: Build expandable encounter row component**

```tsx
"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type EncounterData = {
	id: string;
	bossName: string;
	durationMs: number;
	result: string;
	difficulty: string | null;
	totalDamage: number;
	raidDps: number;
	deathCount: number;
};

type EncounterRowProps = {
	encounter: EncounterData;
	wipeCount: number;
	wipes: EncounterData[];
	isSelected: boolean;
	onSelect: () => void;
	formatNumber: (n: number) => string;
};

function formatEncounterDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function EncounterRow({
	encounter,
	wipeCount,
	wipes,
	isSelected,
	onSelect,
	formatNumber,
}: EncounterRowProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasWipes = wipeCount > 0;

	return (
		<>
			<button
				type="button"
				className={`flex w-full items-center border-b border-elevated px-4 py-3 text-left font-body text-sm transition-colors hover:bg-subtle ${isSelected ? "bg-subtle" : ""}`}
				onClick={() => {
					onSelect();
					if (hasWipes) setIsExpanded((prev) => !prev);
				}}
			>
				<div className="flex flex-[3] items-center gap-2">
					{hasWipes && (
						<span className="text-dimmed">
							{isExpanded ? (
								<ChevronDown className="size-3.5" />
							) : (
								<ChevronRight className="size-3.5" />
							)}
						</span>
					)}
					<span className="text-primary">{encounter.bossName}</span>
					{hasWipes && (
						<span className="text-2xs text-danger">
							{wipeCount} {wipeCount === 1 ? "wipe" : "wipes"}
						</span>
					)}
				</div>
				<div className="flex-[1.5] text-accent">
					{formatNumber(encounter.raidDps)}
				</div>
				<div className="flex-1 text-dimmed">
					{formatEncounterDuration(encounter.durationMs)}
				</div>
				<div
					className={`flex-1 ${encounter.deathCount > 0 ? "text-danger" : "text-dimmed"}`}
				>
					{encounter.deathCount}
				</div>
				<div className="flex-1">
					<span className="rounded bg-accent-20 px-2 py-0.5 text-3xs font-semibold uppercase text-accent">
						Kill
					</span>
				</div>
			</button>

			{/* Expanded wipe sub-rows */}
			{isExpanded &&
				wipes.map((wipe, idx) => (
					<div
						key={wipe.id}
						className="flex items-center border-b border-elevated border-l-2 border-l-danger/40 bg-page px-4 py-2 pl-8 font-body text-xs text-secondary"
					>
						<div className="flex-[3]">Attempt {idx + 1}</div>
						<div className="flex-[1.5]">{formatNumber(wipe.raidDps)}</div>
						<div className="flex-1 text-dimmed">
							{formatEncounterDuration(wipe.durationMs)}
						</div>
						<div
							className={`flex-1 ${wipe.deathCount > 0 ? "text-danger" : "text-dimmed"}`}
						>
							{wipe.deathCount}
						</div>
						<div className="flex-1">
							<span className="rounded bg-danger-20 px-2 py-0.5 text-3xs font-semibold uppercase text-danger">
								Wipe
							</span>
						</div>
					</div>
				))}
		</>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/raids/[raidId]/encounter-row.tsx
git commit -m "feat: add EncounterRow component with expandable wipe details"
```

---

## Task 15: Create PlayerBreakdown client component

**Files:**
- Create: `src/app/(app)/raids/[raidId]/player-breakdown.tsx`

- [ ] **Step 1: Build per-player breakdown with filters**

```tsx
"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc/client";

const CLASS_COLORS: Record<string, string> = {
	warrior: "text-class-warrior",
	paladin: "text-class-paladin",
	hunter: "text-class-hunter",
	rogue: "text-class-rogue",
	priest: "text-class-priest",
	"death-knight": "text-class-dk",
	shaman: "text-class-shaman",
	mage: "text-class-mage",
	warlock: "text-class-warlock",
	druid: "text-class-druid",
};

const SPEC_ROLES: Record<string, string> = {
	"warrior-protection": "tank",
	"paladin-protection": "tank",
	"death-knight-blood": "tank",
	"druid-feral": "dps",
	"paladin-holy": "healer",
	"priest-holy": "healer",
	"priest-discipline": "healer",
	"shaman-restoration": "healer",
	"druid-restoration": "healer",
};

function getRole(spec: string | null): string {
	if (!spec) return "dps";
	return SPEC_ROLES[spec] ?? "dps";
}

type PlayerBreakdownProps = {
	encounterId: string;
	formatNumber: (n: number) => string;
};

export function PlayerBreakdown({
	encounterId,
	formatNumber,
}: PlayerBreakdownProps) {
	const { data, isLoading } = trpc.raids.getEncounterDetails.useQuery({
		encounterId,
	});
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [classFilter, setClassFilter] = useState<string>("all");

	const filteredPlayers = useMemo(() => {
		if (!data) return [];
		return data.players.filter((p) => {
			if (roleFilter !== "all" && getRole(p.spec) !== roleFilter)
				return false;
			if (classFilter !== "all" && p.class !== classFilter) return false;
			return true;
		});
	}, [data, roleFilter, classFilter]);

	if (isLoading) {
		return (
			<div className="font-body text-sm text-dimmed">
				Loading player data...
			</div>
		);
	}

	if (!data) return null;

	const uniqueClasses = [
		...new Set(data.players.map((p) => p.class).filter(Boolean)),
	].sort() as string[];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="font-body text-xs uppercase tracking-wider text-dimmed">
					Per-Player Breakdown
				</span>
				<div className="flex gap-2">
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="rounded border border-border bg-elevated px-2 py-1 font-body text-2xs text-secondary"
					>
						<option value="all">All Roles</option>
						<option value="tank">Tank</option>
						<option value="healer">Healer</option>
						<option value="dps">DPS</option>
					</select>
					<select
						value={classFilter}
						onChange={(e) => setClassFilter(e.target.value)}
						className="rounded border border-border bg-elevated px-2 py-1 font-body text-2xs text-secondary capitalize"
					>
						<option value="all">All Classes</option>
						{uniqueClasses.map((cls) => (
							<option key={cls} value={cls} className="capitalize">
								{cls}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-border bg-card">
				{/* Header */}
				<div className="flex border-b border-border px-4 py-2.5 font-body text-3xs uppercase tracking-wider text-dimmed">
					<div className="w-8">#</div>
					<div className="flex-[2]">Player</div>
					<div className="flex-1">Class</div>
					<div className="flex-[1.5]">DPS</div>
					<div className="flex-1">Damage</div>
					<div className="flex-1">Deaths</div>
				</div>
				{/* Rows */}
				{filteredPlayers.map((player, idx) => (
					<div
						key={player.id}
						className="flex items-center border-b border-elevated px-4 py-2.5 font-body text-sm"
					>
						<div className="w-8 text-dimmed">{idx + 1}</div>
						<div className="flex-[2] text-primary">
							{player.playerName}
						</div>
						<div className="flex-1">
							<span
								className={`capitalize ${CLASS_COLORS[player.class ?? ""] ?? "text-secondary"}`}
							>
								{player.class ?? "Unknown"}
							</span>
						</div>
						<div className="flex-[1.5] font-semibold text-accent">
							{formatNumber(player.dps)}
						</div>
						<div className="flex-1 text-secondary">
							{formatNumber(player.damage)}
						</div>
						<div
							className={`flex-1 ${player.deathCount > 0 ? "text-danger" : "text-dimmed"}`}
						>
							{player.deathCount}
						</div>
					</div>
				))}
				{filteredPlayers.length === 0 && (
					<div className="px-4 py-6 text-center font-body text-sm text-dimmed">
						No players match the selected filters.
					</div>
				)}
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/raids/[raidId]/player-breakdown.tsx
git commit -m "feat: add PlayerBreakdown component with role and class filters"
```

---

## Task 16: Verify full flow end-to-end

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`
Expected: App starts without errors.

- [ ] **Step 2: Test upload flow**

1. Sign in and select a core
2. Click Upload in the sidebar
3. Select a combat log file
4. Choose raids and upload
5. Verify "DONE" button redirects to `/raids`
6. Verify the raids list shows the uploaded raids with links

- [ ] **Step 3: Test raid details page**

1. Click a raid link from `/raids`
2. Verify `/raids/[raidId]` loads with:
   - Header showing raid name and date
   - Metric cards (Raid DPS, Duration, Bosses, Players)
   - Encounters table with boss names, DPS, duration, deaths, kill status
3. Click an encounter with wipes to verify expandable sub-rows
4. Verify per-player breakdown updates when selecting an encounter
5. Test role and class filters in the player breakdown

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: end-to-end flow adjustments"
```
