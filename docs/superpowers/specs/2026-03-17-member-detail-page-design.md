# Member Detail Page — Enhanced Design

## Overview

Enhance the existing member detail page (currently showing only a consumable usage table) with performance metrics, trend visualization, and a compact consumable compliance heatmap. Focus areas: **Performance** (DPS trends) and **Preparedness** (consumable compliance).

## Layout

Single scrollable page with vertical sections:

1. Header (existing)
2. Stat Cards Row
3. DPS Trend Chart
4. Consumable Compliance Heatmap

---

## Section 1: Stat Cards Row

Four cards in a horizontal row below the member header (name, class icon, spec).

| Card | Label | Data Source | Format |
|------|-------|-------------|--------|
| Avg DPS | `AVG DPS` | `encounterPlayers.damage` / encounter `durationMs`, averaged across all encounters for this member | Number formatted with commas, e.g. "8,421" |
| Raid Attendance | `RAIDS ATTENDED` | Count of distinct `raidMembers` rows for this member | Integer |
| Pre-pot Rate | `PRE-POT RATE` | Encounters with at least one `consumableUses.prePot = true` / total encounters | Percentage, e.g. "87%" |
| Total Deaths | `TOTAL DEATHS` | Count of `playerDeaths` rows for this member (last 8 weeks) | Integer |

### Color logic

- **Avg DPS**: always white (no judgment — varies by class/spec)
- **Pre-pot Rate**: green >= 80%, orange >= 50%, red < 50%
- **Total Deaths**: green = 0, orange 1-5, red > 5
- **Raid Attendance**: always white

### Implementation

Uses the existing `Card` component. Number displayed in `font-heading` large text with conditional color via `data-*` attributes. Label in small uppercase `font-body` secondary text.

---

## Section 2: DPS Trend Chart

### New reusable component: `src/components/ui/area-chart.tsx`

Built with Recharts (consistent with shadcn charts). Designed as a generic, reusable area chart component.

### Component API

```tsx
<AreaChart
  data={[{ label: "Mar 10", value: 8421 }, ...]}
  color="var(--color-accent)"
  tooltipFormatter={(point) => ReactNode}
  height={280}
/>
```

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

`// DPS TREND — LAST 8 WEEKS` — uppercase monospace with `//` prefix, matching existing design file patterns.

---

## Section 3: Consumable Compliance Heatmap

### New reusable component: `src/components/ui/heatmap-grid.tsx`

A generic heatmap grid component reusable for any grid-based visualization.

### Component API

```tsx
<HeatmapGrid
  rows={[{
    label: "Mar 10",
    badge: "10 encounters",
    cells: [
      { value: 98.5, status: "full" },
      { value: 72, status: "partial" },
      { display: "8/10", status: "full" },
    ]
  }]}
  columns={["Flask", "Food", "Consumables"]}
  tooltipFormatter={(row, col, cell) => ReactNode}
/>
```

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

- Denominator: number of encounters on that date
- Numerator: encounters where the player used at least one consumable (potions + pre-pots count individually)
- Color determined by encounter coverage: did the player use at least one consumable on each boss?

### Tooltip on hover

All columns show:
- Date and total encounter count
- **Flask/Food**: exact uptime percentage
- **Consumables**: full breakdown grouped by encounter boss name, listing every consumable used — spell name, count, type (potion/engineering/flame cap), and pre-pot flag. Example: "Festergut: Potion of Speed (pre-pot) + Potion of Speed, Saronite Bomb x2"

### Section header

`// CONSUMABLE COMPLIANCE` — same `//` prefix pattern.

---

## Data Requirements

### Updated tRPC query: `members.getById`

The existing query returns member info + raid consumable data. It needs to additionally return:

**For stat cards:**
- Average DPS across all encounters (compute from `encounterPlayers.damage` / `encounters.durationMs`)
- Raid attendance count (count distinct raids from `raidMembers`)
- Pre-pot rate (encounters with prePot / total encounters from `consumableUses`)
- Death count from `playerDeaths` (last 8 weeks)

**For DPS trend chart:**
- Per-date average DPS: group `encounterPlayers` by `raids.date` (truncated to date), compute avg DPS per date
- Last 8 weeks of data

**For consumable heatmap:**
- Per-date rows with encounter count
- Flask/food average uptimes per date from `buffUptimes`
- Per-encounter consumable details from `consumableUses` (for tooltip breakdown and coverage calculation)

### Query structure recommendation

Keep the existing query for basic member info. Add a second query or extend the existing one to return the new aggregated data. The data should come pre-grouped by date from the server to avoid client-side aggregation of large datasets.

---

## New Reusable UI Components

### `src/components/ui/area-chart.tsx`

- Generic area chart built on Recharts
- Props: `data` (label/value pairs), `color`, `height`, `tooltipFormatter`
- Handles: ResponsiveContainer, gradient fill, dark theme axis styling, dot hover states
- No external dependencies beyond Recharts

### `src/components/ui/heatmap-grid.tsx`

- Generic heatmap grid
- Props: `rows` (label, badge, cells array), `columns` (header labels), `tooltipFormatter`
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
