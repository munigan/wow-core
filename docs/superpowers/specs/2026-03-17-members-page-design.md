# Members Page — Design Spec

## Overview

Build the members page with a roster listing at `/members` and a member detail page at `/members/[memberId]` showing per-raid consumable usage.

## `/members` — Member List

### Header
- Title: "MEMBERS"
- Subtitle: "// Consumable usage & member analytics"

### Filters
- Class filter: Select component (`size="sm"`, "All Classes" default)
- Search: text input for name search
- Both synced to URL via nuqs (`?class=warrior&search=Arthás`)

### Table
Sorted alphabetically by name.

| Column | Source | Width | Display |
|--------|--------|-------|---------|
| Name | `members.name` | auto | text-primary, font-semibold, linked to `/members/[memberId]` |
| Class | `members.class` | auto | class icon + class name with WoW class color, spec in parentheses |
| Raids | count distinct raids via encounter_players | w-20 | text-primary |

### Data
New `members.listWithStats` tRPC procedure:
- Fetches all members for the active core
- For each member, counts distinct raids attended by joining: encounters → encounter_players where `encounter_players.playerName = members.name`, then counting distinct `encounters.raidId`
- Accepts optional `class` and `search` string inputs for server-side filtering
- Returns: member fields + `raidCount` + latest `spec` from encounter_players

### Empty states
- No members at all: "No members yet. Upload a combat log to populate the roster."
- No members matching filters: "No members match the selected filters."

### Loading
- `loading.tsx` with skeleton matching filter bar + table layout
- Client skeleton while query loads

## `/members/[memberId]` — Member Detail

### Header
- Member name (text-primary, font-heading, text-4xl)
- Subtitle: class icon + "Class (Spec)" with WoW class color

### Table
Raids the member participated in, newest first.

| Column | Source | Width | Display |
|--------|--------|-------|---------|
| Raid | `raids.name` | auto | text-primary, linked to `/raids/[raidId]` |
| Date | `raids.date` | w-28 | text-secondary, formatted "Mar 3, 2026" |
| Flask | avg `buff_uptimes.flaskUptimePercent` across encounters in that raid | w-20 | percentage with color coding (100% green, 80-99% orange, <80% red) |
| Food | avg `buff_uptimes.foodUptimePercent` across encounters in that raid | w-20 | same color coding |
| Pots | sum of consumable_uses count where type="potion" or "mana_potion" across encounters | w-20 | count with pre-pot indicator, tooltip with items |
| Engi | sum of consumable_uses count where type="engineering" across encounters | w-20 | count, tooltip with items |

Flask/Food color thresholds use data attributes (data-full, data-partial) same as player breakdown.
Pots/Engi have dashed underline + tooltip showing individual consumable names and counts.

### Data
New `members.getById` tRPC procedure:
- Input: `{ memberId: string }`
- Validates member belongs to `ctx.coreId`
- Fetches the member row
- Finds all encounter_players rows where `playerName = member.name` and the encounter's raid belongs to `ctx.coreId`
- Groups by raid, aggregates:
  - Avg flask/food uptime from buff_uptimes
  - Sum pots/engi from consumable_uses
  - Individual consumable items for tooltips
- Returns: member info + array of raid rows with aggregated consumable data
- Ordered by raid date descending

### Member-to-encounter linking
Members are linked to encounter data by **name** (not GUID). The `members` table stores `name` and `encounter_players` stores `playerName`. A player's GUID can change across raids but their character name stays consistent within a core.

### Loading
- `loading.tsx` with skeleton for header + table
- Client skeleton in the detail component

## Routing

```
src/app/(app)/members/
├── page.tsx              # Server component, prefetch members.listWithStats
├── loading.tsx           # Skeleton
├── members-list.tsx      # "use client", table with filters
└── [memberId]/
    ├── page.tsx          # Server component, prefetch members.getById
    ├── loading.tsx       # Skeleton
    └── member-details.tsx # "use client", raid consumable table
```

## Files Modified/Created

### Backend
- `src/lib/trpc/routers/members.ts` — add `listWithStats` and `getById` procedures

### Frontend (create)
- `src/app/(app)/members/members-list.tsx` — client component with filters and table
- `src/app/(app)/members/loading.tsx` — skeleton
- `src/app/(app)/members/[memberId]/page.tsx` — server component
- `src/app/(app)/members/[memberId]/loading.tsx` — skeleton
- `src/app/(app)/members/[memberId]/member-details.tsx` — client component

### Frontend (modify)
- `src/app/(app)/members/page.tsx` — add prefetching and render members-list
