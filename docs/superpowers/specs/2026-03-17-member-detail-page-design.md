# Member Detail Page — Enhanced Design

## Overview

Enhance the existing member detail page (currently showing only a consumable usage table) with performance metrics, trend visualization, and a compact consumable compliance heatmap. Focus areas: **Performance** (DPS trends) and **Preparedness** (consumable compliance).

The existing consumable usage table is **removed** and replaced by the heatmap in Section 3.

## Layout

Single scrollable page with vertical sections:

1. Header (existing)
2. Stat Cards Row
3. DPS Trend Chart
4. Consumable Compliance Heatmap

**Responsive:** Stat cards row uses a 2x2 grid on mobile (`< md`), 4 columns on desktop.

---

## Section 1: Stat Cards Row

Four cards in a horizontal row below the member header (name, class icon, spec). **All metrics are scoped to the last 8 weeks** for consistency with the chart and heatmap.

| Card | Label | Data Source | Format |
|------|-------|-------------|--------|
| Avg DPS | `AVG DPS` | `encounterPlayers.damage` / encounter `durationMs`, averaged across all encounters (8 weeks) | Number formatted with commas, e.g. "8,421" |
| Raid Attendance | `RAIDS ATTENDED` | Count of distinct raids via `raidMembers` (8 weeks) | Integer |
| Pre-pot Rate | `PRE-POT RATE` | Encounters where player has at least one `consumableUses.prePot = true` / total encounters player participated in (8 weeks) | Percentage, e.g. "87%" |
| Total Deaths | `TOTAL DEATHS` | Count of `playerDeaths` rows (8 weeks) | Integer |

### Color logic

- **Avg DPS**: always white (no judgment — varies by class/spec)
- **Pre-pot Rate**: green >= 80%, orange >= 50%, red < 50%
- **Total Deaths**: green = 0, orange 1-5, red > 5
- **Raid Attendance**: always white

### Implementation

Uses the existing `Card` component. Number displayed in `font-heading` large text with conditional color via `data-*` attributes. Label in small uppercase `font-body` secondary text.

### Loading skeleton

Four skeleton cards matching the card dimensions — a large rectangular pulse for the number, a smaller one for the label.

### Empty state

If the member has no encounters in the last 8 weeks, show all cards with "—" in secondary text.

---

## Section 2: DPS Trend Chart

### New reusable component: `src/components/ui/area-chart.tsx`

Built with Recharts (consistent with shadcn charts). Designed as a generic, reusable area chart component.

### Component API

```tsx
type AreaChartDataPoint<T = Record<string, unknown>> = {
  label: string
  value: number
  meta?: T
}

<AreaChart
  data={[{ label: "Mar 10", value: 8421, meta: { encounters: 10 } }, ...]}
  color="var(--color-accent)"
  tooltipFormatter={(point: AreaChartDataPoint) => ReactNode}
  height={280}
/>
```

The `meta` field allows passing arbitrary data (e.g., encounter count) to the tooltip formatter without coupling the chart to specific data shapes.

### Data

- **X-axis**: Dates (last 8 weeks)
- **Y-axis**: Average DPS for that date
- **Grouping**: When multiple raids happen on the same date, average the DPS across all encounters from that date
- **Source**: `encounterPlayers.damage` joined through `encounters` and `raids`, grouped by `raids.date` truncated to date

### Visual style

- Filled area with gradient: `#00FF88` (accent) at top fading to transparent
- Thin solid accent green stroke on top edge
- Dots on each data point, larger on hover
- Tooltip on hover: date, avg DPS value, number of encounters that day
- Grid lines: subtle horizontal dashes in `--color-border`
- Axis labels in `font-body` secondary text, small uppercase

### Section header

`// DPS TREND — LAST 8 WEEKS` — uses `font-body text-xs uppercase tracking-wider text-secondary` (matching existing section label pattern in the codebase). The `//` prefix is part of the text content.

### Loading skeleton

A rectangular skeleton matching the chart height (280px).

### Empty state

If no DPS data exists, show a centered message: "No encounter data in the last 8 weeks" in secondary text within the chart area.

---

## Section 3: Consumable Compliance Heatmap

### New reusable component: `src/components/ui/heatmap-grid.tsx`

A generic heatmap grid component reusable for any grid-based visualization.

### Component API

```tsx
type HeatmapCellStatus = "full" | "partial" | "empty"

type HeatmapCell = {
  value?: number
  display?: string  // overrides value for rendering (e.g. "8/10")
  status: HeatmapCellStatus
}

type HeatmapRow = {
  label: string
  badge?: string
  cells: HeatmapCell[]
}

<HeatmapGrid
  rows={rows}
  columns={["Flask", "Food", "Consumables"]}
  tooltipFormatter={(row: HeatmapRow, colIndex: number, cell: HeatmapCell) => ReactNode}
/>
```

Cell rendering: if `display` is provided, render it as-is. Otherwise render `value` (formatted as a number). Color is determined by `status`: `data-full` (accent green), `data-partial` (warning orange), `data-empty` (danger red or dimmed gray for no data).

### Layout

- **Rows** = raid dates (last 8 weeks, newest on top)
- **Columns** = Flask, Food, Consumables
- Each row has an encounter count badge on the left: `[10 encounters]`

### Cell logic

| Column | Cell display | Color logic |
|--------|-------------|-------------|
| Flask | Uptime % averaged across encounters that date | Green >= 95%, orange >= 80%, red < 80% |
| Food | Uptime % averaged across encounters that date | Green >= 95%, orange >= 80%, red < 80% |
| Consumables | Fraction "N/M" (encounters with at least 1 consumable / total encounters) | Green = all encounters covered, orange >= 50%, red < 50% |

### Consumables column details

- Denominator: number of encounters the player participated in on that date
- Numerator: encounters where the player used at least one consumable (types: `potion`, `mana_potion`, `flame_cap`, `engineering` — all count toward coverage)
- Color determined by encounter coverage: did the player use at least one consumable on each boss?

### Tooltip on hover

All columns show:
- Date and total encounter count
- **Flask/Food**: exact uptime percentage
- **Consumables**: full breakdown grouped by encounter boss name, listing every consumable used — spell name, count, type (potion/engineering/flame cap), and pre-pot flag. Example: "Festergut: Potion of Speed (pre-pot) + Potion of Speed, Saronite Bomb x2"

### Section header

`// CONSUMABLE COMPLIANCE` — same styling as Section 2 header.

### Loading skeleton

A grid-shaped skeleton matching the expected row/column layout.

### Empty state

If no consumable data exists, show a centered message: "No consumable data in the last 8 weeks" in secondary text.

---

## Data Requirements

### Member-to-encounter join strategy

The combat data tables (`encounterPlayers`, `consumableUses`, `buffUptimes`, `playerDeaths`) do not have a `memberId` foreign key. They use `playerGuid` and `playerName`. The join strategy (matching the existing `getById` implementation) is:

1. Find all `encounterPlayers` rows matching `member.name` within the core's raids (join `encounters` → `raids` → filter by `coreId`)
2. Collect the `playerGuid` values from step 1
3. Use those `playerGuid` values to query `consumableUses`, `buffUptimes`, and `playerDeaths` (scoped to the same encounters)

This ensures correct scoping to the core and handles potential name collisions across different cores.

### Updated tRPC query: `members.getById`

Extend the existing `getById` query to return the additional aggregated data. Do **not** add a second query — this avoids a client-side waterfall. The data should come pre-grouped by date from the server.

**For stat cards (all scoped to last 8 weeks):**
- Average DPS: compute from `encounterPlayers.damage` / `encounters.durationMs`, averaged across all encounters
- Raid attendance: count distinct raids from `raidMembers`
- Pre-pot rate: count encounters with at least one `consumableUses.prePot = true` / total encounters the player participated in
- Death count: count from `playerDeaths`

**For DPS trend chart:**
- Per-date average DPS: group `encounterPlayers` by `raids.date` (truncated to date), compute avg DPS per date
- Last 8 weeks of data

**For consumable heatmap:**
- Per-date rows with encounter count
- Flask/food average uptimes per date from `buffUptimes`
- Per-encounter consumable details from `consumableUses` (for tooltip breakdown and coverage calculation)

---

## New Reusable UI Components

### `src/components/ui/area-chart.tsx`

- Generic area chart built on Recharts
- Props: `data` (array of `{ label, value, meta? }`), `color`, `height`, `tooltipFormatter`
- Handles: ResponsiveContainer, gradient fill, dark theme axis styling, dot hover states
- No external dependencies beyond Recharts

### `src/components/ui/heatmap-grid.tsx`

- Generic heatmap grid
- Props: `rows` (array of `{ label, badge?, cells }`), `columns` (header labels), `tooltipFormatter`
- Cell type: `{ value?, display?, status: "full" | "partial" | "empty" }`
- Handles: grid layout, cell color via `data-*` attributes, tooltip integration
- Uses existing Tooltip component from the UI library

---

## Design Tokens

All colors use existing theme variables:
- `--color-accent` (#00FF88) for positive/full states
- `--color-warning` for partial states
- `--color-danger` for bad states
- `--color-secondary` for labels and axes
- `--color-border` for grid lines
- `--color-card` for card backgrounds

No new arbitrary Tailwind values needed.
