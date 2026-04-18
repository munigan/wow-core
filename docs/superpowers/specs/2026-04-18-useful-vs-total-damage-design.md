# Useful vs Total Encounter Damage — Design Spec

## Overview

Users should see **two** encounter damage metrics: **useful damage** (aligned with uwu-logs-style important targets) and **total damage** (all relevant hostile damage in the encounter window). Today the pipeline already computes and persists only the useful number under `encounter_players.damage`; total is never stored. This spec adds a second counter end-to-end and surfaces both in the app.

**Scope:** `wow-combatlog-parser` (combat aggregation + types), `wow-core` (schema, migrations, upload API, tRPC, raid/member/overview UI that shows encounter damage). **Out of scope:** re-syncing every uwu NPC table entry (existing `encounter-npcs.ts` remains the source of truth), changing encounter detection, or retroactively reconstructing totals for logs uploaded before this change without re-upload.

## Background

- `CombatTracker` (`wow-combatlog-parser/src/state/combat-tracker.ts`) applies the same rules as today for “damage done”: pet attribution, `amount - max(0, overkill)`, skip damage to players, skip friendly-reaction `destFlags` (`0x0010`), and—when `getEncounterValidNpcs(bossName)` returns a set—**only** damage to NPC IDs in that whitelist.
- `encounter-npcs.ts` is explicitly ported from uwu-logs; unlisted bosses use a fallback where **all** hostile NPC damage counts (so useful and total coincide).
- `PlayerCombatStats.damage` in `types.ts` is already documented as useful damage; the database column `encounter_players.damage` stores that value.

## Definitions

### Useful damage (existing semantics)

Per player, per encounter:

1. Event types: `SWING_DAMAGE`, `SPELL_DAMAGE`, `SPELL_PERIODIC_DAMAGE`, `RANGE_DAMAGE`, `DAMAGE_SHIELD`.
2. Exclude targets that are players (`isPlayer(dest)`).
3. Exclude targets with friendly reaction in unit flags (`isFriendly(destFlags)`).
4. Resolve attacking unit: pet → owner via `_petOwners` (same as today).
5. Only count if resolved **source** is a player.
6. **Whitelist:** If `getEncounterValidNpcs(bossName)` is non-null, count only when `getNpcId(destGuid)` is in that set. If null (unmapped boss), count all hostile NPC damage that passed prior filters.
7. Amount: `amount - max(0, overkill)`; skip if result ≤ 0.

### Total damage (new)

Same steps **1–6** as useful, **except** step 6 is replaced with: count **all** hostile NPC damage (no NPC-ID whitelist). Still exclude player targets and friendly-flagged targets; still require player (or attributed pet) source.

**Corollary:** For unmapped encounters, useful damage equals total damage for every player and at every aggregate.

### DPS

For an encounter with `durationMs > 0`:

- `raidDpsUseful = round((sum(player useful) / durationMs) * 1000)`
- `raidDpsTotal = round((sum(player total) / durationMs) * 1000)`

Use the **same** encounter duration for both. If duration is zero, both DPS are zero (match existing guards).

## Parser Changes (`wow-combatlog-parser`)

### Types

Extend `PlayerCombatStats`:

- Keep `damage` as **useful** damage (backward-compatible name; comment stays explicit).
- Add `damageTotal: number` — total damage per definitions above.
- `damageTaken` unchanged.

Raid-wide `PlayerInfo.combatStats` aggregates must sum **both** useful and total across encounters (same pattern as today for `damage`).

### `CombatTracker`

- Maintain parallel accumulation: on each qualifying damage-done event, always add to the total bucket after steps 1–5; add to the useful bucket only after whitelist check (or full hostile allow when map is null).
- `onEncounterEnd`, `getActiveStats`, `getPlayerSummaries`: include both fields for every player GUID that appears in either bucket (mirror current merge behavior with damage taken).

### Callers and tests

- Update `state-machine`, `stream-parser`, `parser`, `realtime-parser` only if they need to satisfy types or serialize payloads (likely type-only).
- Add unit tests in `combat-tracker.test.ts`: (a) mapped boss where whitelist excludes an NPC—assert `damageTotal > damage`; (b) unmapped boss—assert equal; (c) regression on existing cases for useful damage.
- Update integration tests and any fixture expectations that assert `combatStats` shape.

### Consumers outside wow-core

- **`wow-companion`:** If it reads `combatStats` for display or IPC, extend types/UI minimally so builds pass (show total only if product needs it; at minimum tolerate new field).

## Database (`wow-core`)

### `encounter_players`

| Column | Type | Notes |
|--------|------|-------|
| `damage` | bigint, not null | **Useful** damage (unchanged meaning). |
| `damageTotal` | bigint, **nullable** | Total damage. `NULL` for rows created before this feature (no backfill from stored data). New inserts always set both. |

**Rationale for nullable:** Pre-migration rows never had total computed; setting `damageTotal = damage` would under-report total on padded fights and mislead users.

### Migration

- Drizzle migration: add `damage_total` column nullable, no default for existing rows.
- New uploads: always populate `damage` and `damageTotal`.

## Upload Path (`wow-core/src/app/api/upload/route.ts`)

When building `encounter_players` rows from `enc.combatStats`, set both `damage` (useful) and `damageTotal` from parser output. If an older parser version omits `damageTotal` (should not happen once shipped), treat omission as a deployment bug—**do not** silently coerce to useful for totals in application code long term; parser must always emit both after release.

## API and Aggregations (`wow-core` tRPC)

### Naming

Expose **explicit** names in JSON/DTOs to avoid confusion with legacy `totalDamage` (which today means sum of **useful** damage):

- Encounter list/detail: e.g. `usefulDamage` + `totalDamage` at encounter level (sums over players), plus `raidDpsUseful` and `raidDpsTotal` (or equivalent clear names).
- Per-player encounter rows: `damageUseful` / `damageTotal` or align with DB column names in selects.

Audit and update every router that reads `encounterPlayers.damage` for DPS or damage charts: at minimum `raids`, `members`, `overview`, and any encounter-detail or player-breakdown procedures. Decide per surface:

- **Raid encounter table / raid summary:** Show both totals and both DPS where the UI currently shows one; default **sort** remains driven by **useful** DPS so rankings stay uwu-comparable unless the user chooses otherwise.
- **Member profile / overview quick stats:** Prefer useful for headline “top DPS” style metrics unless product explicitly wants a toggle; document choice in implementation plan.

### Null handling

When `damageTotal` is `NULL` for all players in an encounter (legacy data), UI shows an em dash or tooltip: “Total damage not recorded — re-upload the log to compute it.” When some players null (should not occur), treat as data error; implementation may coalesce per row for display only after confirming invariants.

## UI (`wow-core`)

- **Encounter rows / player breakdown:** Display useful and total side by side (or stacked) with clear labels. When useful equals total (unmapped boss or no padding difference), showing both numbers is acceptable for consistency; optional micro-copy if identical is product choice during implementation.
- **Formatting:** Reuse existing number formatting helpers.
- **Accessibility:** Ensure both values are labeled (not color-only).

## Testing Checklist

| Layer | Tests |
|-------|--------|
| Parser | Unit tests for dual accumulation; integration parse on a fixture with excluded adds if available. |
| wow-core | Migration applies; upload inserts both columns; tRPC returns expected sums for a synthetic or dev DB fixture. |
| UI | Manual or component test: legacy encounter shows missing total state; new upload shows both. |

## Maintenance

- When uwu-logs updates encounter target lists, update `encounter-npcs.ts` using the same sourcing process as today. No separate mapping file beyond that module.

## Success Criteria

1. New uploads produce non-null `damageTotal` on every `encounter_players` row that has combat stats, with `damageTotal >= damage` for mapped bosses where extra hostile damage exists.
2. UI shows useful and total (and derived DPS) on primary encounter views agreed during implementation.
3. Legacy rows remain interpretable without false totals.
4. Parser package tests and wow-core build pass.
