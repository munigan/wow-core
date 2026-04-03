# Members Page Consumable Averages

## Problem

The members list page (`/members`) only shows name, class, and raid count. There's no way to compare consumable discipline across members at a glance. Raid leaders need to see which members consistently use potions and engineering items, normalized by raids attended so members with fewer raids aren't penalized.

## Solution

Add 4 new sortable columns to the members list table showing per-raid consumable averages and pre-pot rate, computed over all-time data.

## Design

### Table Layout

Current: **Name | Class | Raids**

New: **Name | Class | Raids | Pots/Raid | Engi/Raid | Other/Raid | Pre-pot %**

### Column Definitions

| Column | Calculation | Consumable Types | Display |
|--------|-------------|------------------|---------|
| Pots/Raid | `SUM(count) / COUNT(DISTINCT raidId)` | `potion`, `mana_potion` | `2.3` |
| Engi/Raid | `SUM(count) / COUNT(DISTINCT raidId)` | `engineering` | `1.1` |
| Other/Raid | `SUM(count) / COUNT(DISTINCT raidId)` | `flame_cap` | `0.4` |
| Pre-pot % | `COUNT(DISTINCT encounters with prePot) / COUNT(DISTINCT encounters) * 100` | Any with `prePot = true` | `85%` |

### Display Rules

- Numbers rounded to 1 decimal place
- `0.0` displayed in `text-dimmed`, values > 0 in `text-primary`
- Pre-pot % color coding (matches member details page pattern):
  - `text-accent` for >= 80%
  - `text-warning` for 50-79%
  - Default color for < 50%
- Members with 0 raids show `—` for all consumable columns
- All 4 new columns are sortable (application-side, matching existing pattern)

### No Time Filter

All averages are computed over all-time data scoped to the active core. No date range filter.

## Data Query

Extend the existing `members.listWithStats` tRPC procedure to join consumable data.

### Join Path

The `members` table has no GUID field. The existing code joins on `playerName`. The `consumable_uses` table only has `playerGuid`, so we bridge through `encounter_players` which has both:

```
members.name = encounter_players.playerName
  → encounter_players.encounterId = encounters.id
  → encounters.raidId = raids.id (core scoping via raids.coreId)
  → consumable_uses (on encounterId + playerGuid from encounter_players)
```

Consumable data is aggregated across all GUIDs for a given `playerName` (a member may have multiple GUIDs across encounters).

### Computed Fields

```
avgPotsPerRaid  = SUM(count WHERE type IN ('potion','mana_potion')) / raidCount
avgEngiPerRaid  = SUM(count WHERE type = 'engineering') / raidCount
avgOtherPerRaid = SUM(count WHERE type = 'flame_cap') / raidCount
prePotRate      = COUNT(DISTINCT encounterId WHERE prePot = true) / COUNT(DISTINCT encounterId) * 100
```

The divisor for per-raid averages is the member's total raid count (from `encounter_players`, already computed as `raidCount`), not the count of raids with consumable data. This avoids inflated averages when some raids have no consumable data parsed.

All divisions use `NULLIF(divisor, 0)` to avoid division by zero (returns null → displayed as `—`).

### Sorting

Add new sort options to the existing Zod enum: `z.enum(["name", "class", "raids", "pots", "engi", "other", "prepot"])`.

The current `listWithStats` procedure computes stats in separate queries and sorts in JavaScript (not SQL `ORDER BY`). The new consumable columns follow the same pattern: a single aggregating query for all members on the page, merged in JS, sorted in JS. Null values sort last (treat as -Infinity for descending, +Infinity for ascending).

### Display Formatting

Numbers returned as raw numbers from the server. Client formats with `toFixed(1)` for the average columns and `Math.round()` for pre-pot %.

## Scope

- `src/lib/trpc/routers/members.ts` — extend `listWithStats` query with consumable joins and computed fields, add sort options
- `src/app/(app)/members/members-list.tsx` — add 4 new columns with sortable headers, display formatting, and color coding

## Out of Scope

- Date range filtering
- Flask/food uptime (from `buff_uptimes` table — explicitly excluded per requirements)
- Consumable tooltips showing individual spell names (keep the members list lightweight)
- Per-encounter breakdown (that's the raid details page's job)
