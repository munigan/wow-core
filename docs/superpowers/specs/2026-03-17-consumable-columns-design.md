# Consumable Columns in Per-Player Breakdown — Design Spec

## Overview

Add four new columns (Flask, Food, Pots, Engi) to the existing per-player breakdown table on the raid details page. Data is already stored in `consumable_uses` and `buff_uptimes` tables — this feature reads and displays it.

## Data Sources

### `buff_uptimes` (per encounter, per player)
- `flaskUptimePercent` — 0-100, flask/elixir uptime during encounter
- `foodUptimePercent` — 0-100, food buff uptime during encounter

### `consumable_uses` (per encounter, per player, per consumable)
- `type` — "potion", "mana_potion", "flame_cap", "engineering"
- `prePot` — whether used before encounter started
- `count` — number of times used
- `spellName` — consumable name (for tooltip, future use)

## New Columns

Added after the Deaths column in the per-player breakdown table.

| Column | Header | Source | Display | Color Logic |
|--------|--------|--------|---------|-------------|
| Flask | FLASK | `buffUptimes.flaskUptimePercent` | "100%", "87%", "0%" | 100% → accent, 80-99% → warning, <80% → danger |
| Food | FOOD | `buffUptimes.foodUptimePercent` | "100%", "87%", "0%" | 100% → accent, 80-99% → warning, <80% → danger |
| Pots | POTS | `consumableUses` where type="potion" or "mana_potion" | Count + "(PP)" if any prePot=true, e.g. "2 (PP)" | accent if has pre-pot, primary if >0 without pre-pot, dimmed if 0 |
| Engi | ENGI | `consumableUses` where type="engineering" | Count, e.g. "3" | primary if >0, dimmed if 0 |

Column widths: all four use `w-16` (fixed narrow).

Full column order: `# | Player | Class | DPS | Damage | Deaths | Flask | Food | Pots | Engi`

## Flask/Food color thresholds

Use data attributes for conditional styling:
- `data-full` (100%) → `text-accent` (#00FF88)
- `data-partial` (80-99%) → `text-warning` (#FF8800)
- Neither (<80%) → `text-danger` (#FF4444)

If no `buff_uptimes` row exists for a player, display "—" in `text-dimmed`.

## Pots aggregation

A player may have multiple `consumable_uses` rows for potions in a single encounter (e.g., one Potion of Speed pre-pot + one Potion of Speed during fight). Aggregate:
- `totalPots` = sum of `count` where type is "potion" or "mana_potion"
- `hasPrePot` = any row where `prePot` is true

Display: `"{totalPots} (PP)"` if hasPrePot, `"{totalPots}"` if not, `"0"` if none.

## Engineering aggregation

- `totalEngi` = sum of `count` where type is "engineering"
- Display: `"{totalEngi}"` or `"0"` if none.

## Backend Changes

### Extend `raids.getEncounterDetails` tRPC procedure

Add two additional queries within the existing procedure:

1. Query `buff_uptimes` for the encounter → build a `Map<playerGuid, { flaskUptimePercent, foodUptimePercent }>`
2. Query `consumable_uses` for the encounter → aggregate per player into `Map<playerGuid, { totalPots, hasPrePot, totalEngi }>`

Merge into the returned `players` array:

```typescript
// Added to each player in the response
flaskUptime: number | null;    // null if no buff_uptimes row
foodUptime: number | null;
totalPots: number;
hasPrePot: boolean;
totalEngi: number;
```

No new tRPC procedures needed.

## Frontend Changes

### `player-breakdown.tsx`

Add four `<th>` columns to the table header and four `<td>` cells to each player row. Use data attributes for color coding (data-full, data-partial for uptimes; data-has-prepot for pots; data-has-value for engineering).

### Skeleton update

The loading skeleton in `player-breakdown.tsx` doesn't need changes since it shows generic rows.

### Loading skeleton in `loading.tsx`

No changes needed — the skeleton already shows a generic table shape.

## Files Modified

- `src/lib/trpc/routers/raids.ts` — extend `getEncounterDetails` to query and return consumable/buff data
- `src/app/(app)/raids/[raidId]/player-breakdown.tsx` — add four columns to header and rows
