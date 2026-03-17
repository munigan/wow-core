# Raid Details Page — Design Spec

## Overview

After uploading a combat log, users are redirected to `/raids` where they see a list of uploaded raids for their active core. Each raid links to `/raids/[raidId]`, a detailed page showing boss encounters, per-player damage stats, and expandable wipe attempts.

All backend features use tRPC (v11) integrated with Next.js Server Components and TanStack Query for prefetching.

## Database Schema

### Extended table: `raids`

Add two columns to the existing `raids` table:

| Column | Type | Notes |
|--------|------|-------|
| raidInstance | text | nullable, instance name from parser |
| durationMs | integer | total raid duration in ms |

### New table: `encounters`

One row per boss attempt (kills and wipes).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| raidId | uuid FK→raids | cascade delete |
| bossName | text | not null |
| startTime | timestamptz | not null |
| endTime | timestamptz | not null |
| durationMs | integer | not null |
| result | text | "kill" or "wipe", not null |
| difficulty | text | "10N", "10H", "25N", "25H", nullable |
| order | smallint | preserves encounter sequence, not null |

### New table: `encounter_players`

Per-player stats for each encounter attempt.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| encounterId | uuid FK→encounters | cascade delete |
| playerGuid | text | not null |
| playerName | text | not null |
| class | text | nullable |
| spec | text | nullable |
| damage | bigint | not null, raw damage done |
| damageTaken | bigint | not null, raw damage taken |

### New table: `player_deaths`

Each death event within an encounter.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| encounterId | uuid FK→encounters | cascade delete |
| playerGuid | text | not null |
| playerName | text | not null |
| timestamp | bigint | not null, raw timestamp |
| timeIntoEncounter | integer | not null, ms from encounter start |
| killingBlow | jsonb | nullable, DeathRecapEvent object |
| recap | jsonb | not null, DeathRecapEvent[] array |

### New table: `consumable_uses`

Per-encounter consumable usage.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| encounterId | uuid FK→encounters | cascade delete |
| playerGuid | text | not null |
| spellId | integer | not null |
| spellName | text | not null |
| type | text | "potion", "mana_potion", "flame_cap", "engineering", not null |
| prePot | boolean | not null |
| count | smallint | not null |

### New table: `buff_uptimes`

Per-encounter flask/food uptime.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| encounterId | uuid FK→encounters | cascade delete |
| playerGuid | text | not null |
| flaskUptimePercent | real | not null, 0-100 |
| foodUptimePercent | real | not null, 0-100 |

### New table: `external_buffs`

Per-encounter external buff tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| encounterId | uuid FK→encounters | cascade delete |
| playerGuid | text | not null, target |
| spellId | integer | not null |
| spellName | text | not null |
| sourceGuid | text | not null, caster |
| sourceName | text | not null |
| count | smallint | not null |
| uptimePercent | real | not null |

### Schema conventions

- All tables use `uuid().primaryKey().defaultRandom()`
- All timestamps use `timestamp({ withTimezone: true })`
- All foreign keys use `onDelete: "cascade"`
- One schema file per table in `src/lib/db/schema/`
- Barrel export in `src/lib/db/schema/index.ts`

## Upload Flow

### Current behavior

Upload → `parseLog()` → return JSON summary → no DB writes

### New behavior

1. Client uploads file with `X-Selected-Raids` header (unchanged)
2. Server parses with `parseLog(body, raidSelections)` (unchanged)
3. Server inserts all parsed data into the database in a single Drizzle transaction, directly in the upload route handler
4. Server returns created raid IDs in the response
5. Client receives response → closes upload dialog → redirects to `/raids`

### Insert order within transaction

1. Insert `raids` row (with new `raidInstance` and `durationMs` fields)
2. Insert `encounters` rows for the raid
3. For each encounter, insert:
   - `encounter_players` (from encounter's `combatStats`)
   - `player_deaths` (from encounter's `deaths`)
   - `consumable_uses` (from encounter's `consumables`)
   - `buff_uptimes` (from encounter's `buffUptime`)
   - `external_buffs` (from encounter's `externals`)

### Response format change

```typescript
// Before
{ raidName, raidDate, raidInstance, totalMembers }[]

// After
{ raidId, raidName, raidDate, raidInstance, totalMembers }[]
```

## tRPC Procedures

### `raids.list` (existing, no changes needed)

Already returns all raids for the active core, ordered by date desc.

### `raids.getById` (new)

- **Input:** `{ raidId: z.string() }`
- **Auth:** `protectedProcedure`, verifies raid belongs to `ctx.coreId`
- **Returns:** Raid metadata + encounters array, where each encounter includes:
  - Boss name, duration, result, difficulty
  - Aggregated raid DPS for the encounter (sum of all player damage / encounter duration)
  - Death count for the encounter
  - Wipe count for the same boss (count of other attempts with result "wipe" and same bossName)
- **Used by:** Raid Details page server component for prefetching

### `raids.getEncounterDetails` (new)

- **Input:** `{ encounterId: z.string() }`
- **Auth:** `protectedProcedure`, verifies encounter's raid belongs to `ctx.coreId`
- **Returns:** Encounter data + all `encounter_players` rows with:
  - playerName, class, spec, damage, damageTaken
  - Computed DPS (damage / encounter durationMs * 1000)
  - Death count per player (from `player_deaths`)
- **Used by:** Per-player breakdown section (client component)

## Routing & Pages

### `/raids` — Raids list page

- Server component prefetches `raids.list` via `trpc.raids.list.prefetch()`
- Renders a simple unstyled list of raids for the current core
- Each item shows: raid name, date, instance name, player count
- Each item links to `/raids/[raidId]`
- File: `src/app/(app)/raids/page.tsx`

### `/raids/[raidId]` — Raid details page (new)

- Server component at `src/app/(app)/raids/[raidId]/page.tsx`
- Prefetches `raids.getById` with the route param
- Renders `<RaidDetails>` client component

## UI Components

### Raid Details page (`src/app/(app)/raids/[raidId]/`)

#### Metric cards section

Four cards in a horizontal row:
- **Raid DPS** — sum of all player damage across all kill encounters / total kill encounter duration
- **Duration** — formatted `raidDurationMs` as HH:MM:SS
- **Bosses** — count of unique boss kills, with difficulty breakdown (e.g., "4 Heroic, 1x Normal")
- **Players** — total unique player count from encounters

#### Encounters table

| Column | Source |
|--------|--------|
| Encounter (boss name) | `encounters.bossName` |
| DPS | sum of `encounter_players.damage` / `encounters.durationMs` * 1000 |
| Duration | `encounters.durationMs` formatted as MM:SS |
| Deaths | count of `player_deaths` for the encounter |
| Status | `encounters.result` rendered as KILL (green badge) or WIPE (red badge) |

- Only kill attempts shown as main rows
- If a boss has wipe attempts, show "N wipes" text next to the boss name in red
- Clicking a row with wipes expands to show each wipe attempt as sub-rows with a red left border
- Rows sorted by `encounters.order`

#### Per-player breakdown

Shown below the encounters table. Displays player stats for a selected encounter (default: first kill encounter).

| Column | Source |
|--------|--------|
| # | Rank by DPS descending |
| Player | `encounter_players.playerName` |
| Class | `encounter_players.class` with WoW class color |
| DPS | `encounter_players.damage` / encounter `durationMs` * 1000 |
| Damage | `encounter_players.damage` formatted (e.g., 2.4M) |
| Deaths | count from `player_deaths` for this player in this encounter |

- Filterable by role (tank/healer/dps, derived from spec) and class
- Sorted by DPS descending

### File structure

```
src/app/(app)/raids/
├── page.tsx                    # Server component, raids list
└── [raidId]/
    ├── page.tsx                # Server component, prefetches raid data
    ├── raid-details.tsx        # "use client", metric cards + encounters table
    ├── encounter-row.tsx       # "use client", expandable encounter row
    └── player-breakdown.tsx    # "use client", per-player table with filters
```

## Data not displayed (stored for future use)

The following data is stored in the database but not rendered in this iteration:
- `consumable_uses` — potion/engineering usage per encounter
- `buff_uptimes` — flask/food uptime percentages
- `external_buffs` — Bloodlust, Power Infusion, etc.
- `player_deaths.killingBlow` and `player_deaths.recap` — death recap details
- `encounter_players.damageTaken` — damage taken stats
- `encounter_players.spec` — stored but only class is shown in the table

## Columns explicitly excluded

- **HPS** — parser does not track healing done
- **iLvl** — not available from combat logs
- **Parse** — requires external percentile dataset, not applicable
- **Notable Mechanics** — no parser data, replaced by Deaths column
