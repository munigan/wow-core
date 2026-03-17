# Raids Listing Page — Design Spec

## Overview

Redesign the `/raids` page from a plain list of links into a rich, filterable table with aggregate stats per raid, grouped by date.

## Filters

Positioned below the page header, above the table.

### Instance filter
- Select component (`SelectRoot`/`SelectTrigger`/`SelectItem`) with `size="sm"`
- Default: "All Instances"
- Options: unique `raidInstance` values from the user's raids for the active core
- Null instances excluded from the dropdown (shown as "Unknown" in the table)

### Date range filter
- Preset buttons: "Last 7 days", "Last 30 days", "Last 90 days", "All time"
- Default: "All time"
- Styled as a button group — active button gets `bg-accent-10 text-accent`, inactive gets `bg-elevated text-secondary`
- Use data attributes for active state styling

### Filter behavior
- Filter state managed via URL search params using `nuqs` library (`useQueryState`)
- URL format: `/raids?instance=Naxxramas&range=30d` — filters are shareable/bookmarkable
- `instance` param: `parseAsString` with default `null` (no filter)
- `dateRange` param: `parseAsStringEnum(["7d", "30d", "90d", "all"])` with default `"all"`
- Both filters passed as tRPC query input, applied server-side
- Changing a filter updates the URL and triggers a new query (TanStack Query handles caching)
- Uses `keepPreviousData` to avoid flash when switching filters

### Dependencies
- Install `nuqs` package: `pnpm add nuqs`
- Wrap app with `NuqsAdapter` from `nuqs/adapters/next/app` in the providers or layout

## Table

### Grouping
- Raids grouped by date (day), newest first
- Date group headers rendered as a row spanning the full table width
- Header text format: "March 3, 2026" — `font-body text-xs uppercase tracking-wider text-secondary`

### Columns

| Column | Source | Width | Display |
|--------|--------|-------|---------|
| Raid Name | `raids.name` | auto | text-primary, font-semibold, clickable link to `/raids/[raidId]` |
| Instance | `raids.raidInstance` | auto | text-secondary, "—" if null |
| Duration | `raids.durationMs` | w-24 | formatted HH:MM:SS, text-secondary, "—" if null |
| Bosses | count kills from encounters | w-20 | text-primary |
| Players | count distinct playerGuid from encounter_players | w-20 | text-primary |
| Deaths | count from player_deaths | w-20 | text-dimmed, text-danger if > 0 |

### Row behavior
- Entire row is clickable, links to `/raids/[raidId]`
- Hover: `hover:bg-subtle`
- Border: `border-b border-elevated`

## Backend Changes

### Extend `raids.list` tRPC procedure

Add optional input params:

```typescript
.input(
  z.object({
    instance: z.string().optional(),
    dateRange: z.enum(["7d", "30d", "90d", "all"]).optional(),
  }).optional()
)
```

Default: no instance filter, "all" date range.

Query changes:
1. Add `where` clauses for instance filter (`eq(raids.raidInstance, input.instance)`) and date range (`gte(raids.date, cutoffDate)`)
2. Join and aggregate per raid:
   - Boss kills: `count(distinct encounters.bossName)` where `encounters.result = 'kill'`
   - Player count: `count(distinct encounterPlayers.playerGuid)`
   - Death count: `count(playerDeaths.id)`
3. Return enriched raid objects with `bossKills`, `playerCount`, `deathCount` alongside existing fields

### Unique instances query

Add a new procedure `raids.listInstances` that returns distinct `raidInstance` values for the active core:

```typescript
raids.listInstances: protectedProcedure.query(...)
```

Returns `string[]` of unique non-null instance names, used to populate the instance filter dropdown.

## Frontend Changes

### `src/app/(app)/raids/page.tsx`
- Server component, prefetches `raids.list` (default params) and `raids.listInstances`

### `src/app/(app)/raids/raids-list.tsx`
- Rewrite to render filters + grouped table
- Manages filter state via nuqs `useQueryState` hooks synced to URL search params
- Passes filters as input to `trpc.raids.list.useQuery({ instance, dateRange })`
- Uses `keepPreviousData` when switching filters
- Groups raids by date for rendering (using local timezone for date grouping)

### `src/app/(app)/raids/loading.tsx`
- Update skeleton to match new layout: filter bar skeleton + grouped table skeleton

## Empty States

- No raids at all (unfiltered): "No raids uploaded yet. Upload a combat log to get started."
- No raids matching filters: "No raids match the selected filters."

## Files Modified

- `src/lib/trpc/routers/raids.ts` — extend `raids.list` with filters and aggregation, add `raids.listInstances`
- `src/lib/trpc/routers/_app.ts` — no changes needed (raids router already merged)
- `src/app/(app)/raids/page.tsx` — add `listInstances` prefetch
- `src/app/(app)/raids/raids-list.tsx` — full rewrite with filters, grouped table, loading states
- `src/app/(app)/raids/loading.tsx` — update skeleton layout
- `src/app/providers.tsx` or `src/app/(app)/layout.tsx` — wrap with `NuqsAdapter`
- `package.json` — add `nuqs` dependency
