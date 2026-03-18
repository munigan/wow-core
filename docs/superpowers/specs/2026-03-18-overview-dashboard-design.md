# Overview Dashboard Design

## Context

The overview page (`src/app/(app)/page.tsx`) is currently empty — just a title. This spec defines a chart-driven accountability dashboard for raid leaders, covering the last 8 weeks of data.

**Primary audience:** Core/raid leader who needs to quickly assess player accountability — attendance, consumable prep, deaths, and performance.

**Time window:** Last 8 weeks (rolling), with comparisons against the previous 8-week period for metric cards.

**Chart library:** Recharts v3 (already installed). Style inspired by shadcn/ui charts and Evil Charts — clean dark theme, gradient area fills, accent-colored bars. Reuse existing `AreaChart` component pattern and extend with new chart components as needed.

---

## Page Layout

```
Header (title + subtitle)
Metric Cards Row (5 cards)
Attendance Section (table)
Consumable Compliance Section (2 charts side by side)
Deaths & Performance Section (2 charts + attention chips)
```

---

## Section 1: Header + Metric Cards

### Header
- Title: "OVERVIEW" (Space Grotesk, 4xl, bold, uppercase)
- Subtitle: `// {coreName} — Raid Core Analyzer` (JetBrains Mono, sm, text-secondary)

### Metric Cards Row
5 cards in a responsive grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`). Same card style as the raid details page — border, bg-card, label/value/trend icon.

| Card | Value | Source | Comparison |
|------|-------|--------|------------|
| Total Raids | Count of raids in 8-week window | `raids` table, filtered by `date >= 8 weeks ago` and `coreId` | vs. previous 8-week period count |
| Raid DPS | Average raid DPS across all kill encounters | `encounterPlayers.damage` summed per encounter where `encounters.result = 'kill'` / encounter duration | vs. previous period avg |
| Avg Duration | Average raid duration (exclude raids where `durationMs` is null) | `raids.durationMs` averaged, nulls excluded | vs. previous period avg (lower is better) |
| Deaths / Raid | Average deaths per raid | `playerDeaths` count / raid count | vs. previous period avg (lower is better) |
| Consumable Score | (avg flask uptime + avg food uptime + pre-pot rate) / 3 | Flask/food from `buffUptimes` (0-100%), pre-pot rate = count of encounter-player pairs with at least one `consumableUses` row where `prePot = true` / total encounter-player pairs | vs. previous period % |

Each card shows:
- Label (text-dimmed, uppercase, 2xs)
- Big number (font-heading, 3xl, bold, color from `getValueColor`)
- Trending icon + percentage change (icon colored, text dimmed)

### Data Query: `overview.getMetrics`
```
Input: coreId, current 8-week window, previous 8-week window
Output: {
  totalRaids: number,
  prevTotalRaids: number,
  avgRaidDps: number,
  prevAvgRaidDps: number,
  avgDurationMs: number,
  prevAvgDurationMs: number,
  avgDeathsPerRaid: number,
  prevAvgDeathsPerRaid: number,
  consumableScore: number,
  prevConsumableScore: number
}
```

---

## Section 2: Attendance

### Title
- "ATTENDANCE" (font-heading, 2xl, bold, uppercase)
- Subtitle: `// Last 8 weeks — {startDate} to {endDate}` (text-secondary)

### Table
One row per roster member (from `members` table), sorted by attendance rate descending.

| Column | Description | Style |
|--------|-------------|-------|
| # | Rank | text-dimmed |
| Player | Member name | text-primary |
| Class | Class + latest spec, with class color icon | class-colored |
| Raids Attended | "X / Y" format | text-primary |
| Attendance % | Percentage | Color-coded: green >= 80%, warning >= 50% and < 80%, red < 50% |
| Last Seen | Date of most recent raid | text-dimmed |

### Data Source
- Total raids in period: `count(raids)` where `coreId` and `date` in window
- Per-member attendance: `countDistinct(encounters.raidId)` from `encounterPlayers` joined through `encounters` to `raids`, grouped by player, matched to `members` by name (string match — `encounterPlayers` has no FK to `members`)
- Last seen: `max(raids.date)` per member

### Data Query: `overview.getAttendance`
```
Input: coreId, 8-week window
Output: {
  totalRaids: number,
  members: [{
    memberId: string,
    name: string,
    class: string | null,
    spec: string | null,
    raidsAttended: number,
    attendanceRate: number,
    lastSeenDate: string | null
  }]
}
```

---

## Section 3: Consumable & Prep Compliance

### Title
- "CONSUMABLE COMPLIANCE" (font-heading, 2xl, bold, uppercase)
- Subtitle: `// Average across all encounters — last 8 weeks` (text-secondary)

### Layout
Two charts side by side in a 2-column grid (`grid-cols-2`).

### Left — Horizontal Stacked Bar Chart: "Compliance by Player"
- One horizontal bar per roster member, sorted by overall compliance descending
- Each bar stacked with 3 segments in order (left-to-right): Flask Uptime %, Food Uptime %, Pre-Pot Rate %
- Colors: accent green (`#00ff88`) for flask, a blue tone (`#66bbff`) for food, warning orange (`#ff8800`) for pre-pot
- Hover tooltip shows exact percentages for each metric
- Y-axis: player names (JetBrains Mono, 11px)
- X-axis: 0-100% scale

### Right — Multi-Series Area Chart: "Raid Compliance Trend"
- X-axis: raid dates over 8 weeks
- Y-axis: 0-100%
- 3 overlapping area series:
  - Avg Flask Uptime per raid (accent green)
  - Avg Food Uptime per raid (blue `#66bbff`)
  - Avg Pre-Pot Rate per raid (warning orange)
- Gradient fills with low opacity (matching existing AreaChart style)
- Hover tooltip shows all 3 values for that raid date

### Data Query: `overview.getConsumableCompliance`
```
Input: coreId, 8-week window
Output: {
  byPlayer: [{
    memberId: string,
    name: string,
    class: string | null,
    avgFlaskUptime: number,
    avgFoodUptime: number,
    prePotRate: number
  }],
  byRaid: [{
    raidId: string,
    date: string,
    avgFlaskUptime: number,
    avgFoodUptime: number,
    avgPrePotRate: number
  }]
}
```

---

## Section 4: Deaths & Performance

### Title
- "DEATHS & PERFORMANCE" (font-heading, 2xl, bold, uppercase)
- Subtitle: `// Outliers and trends — last 8 weeks` (text-secondary)

### Layout
Two charts side by side in a 2-column grid, plus an attention row below.

### Left — Horizontal Bar Chart: "Deaths per Player"
- One horizontal bar per roster member, sorted by death count descending
- Bar color based on relative performance: green for low deaths (below avg), warning for moderate (near avg), red for high (above avg)
- Hover tooltip shows: total deaths, deaths per raid average, most common killing blow source (extracted from `killingBlow->>'sourceName'` JSONB field, grouped by source name, pick highest count)
- Y-axis: player names
- X-axis: death count

### Right — Dual-Series Area Chart: "Raid Performance Trend"
- X-axis: raid dates over 8 weeks
- Left Y-axis: DPS
- Right Y-axis: Deaths count
- Series 1: Average raid DPS per session (accent green area with gradient fill)
- Series 2: Total deaths per raid (danger red line, no fill)
- Shows correlation between DPS improvement and death reduction

### Bottom — "Attention Needed" Chips
- Horizontal row of small cards highlighting performance outliers
- Players with DPS significantly below the average of other members with the same `members.role` (Tank/DPS/Healer). If `role` is null, compare by `members.class` instead. Flag players in the bottom 20th percentile.
- Each chip: `{PlayerName} . {Class} . {avgDps} avg DPS . {pctDiff}% vs role avg`
- Styled with border-warning or border-danger, compact layout
- Max 5 shown

### Data Query: `overview.getDeathsAndPerformance`
```
Input: coreId, 8-week window
Output: {
  deathsByPlayer: [{
    memberId: string,
    name: string,
    class: string | null,
    totalDeaths: number,
    deathsPerRaid: number,
    topKillingSource: string | null
  }],
  performanceTrend: [{
    raidId: string,
    date: string,
    avgRaidDps: number,
    totalDeaths: number
  }],
  attentionNeeded: [{
    memberId: string,
    name: string,
    class: string | null,
    avgDps: number,
    classDpsAvg: number,
    pctDiff: number
  }]
}
```

---

## Architecture

### tRPC Router
New `overview` router added to `src/lib/trpc/routers/overview.ts` with 4 procedures:
- `overview.getMetrics` — metric card data
- `overview.getAttendance` — attendance table
- `overview.getConsumableCompliance` — compliance charts
- `overview.getDeathsAndPerformance` — deaths/performance charts + attention list

All procedures filter by `coreId` (from session) and accept no additional input — the 8-week window is calculated server-side.

### Component Structure
```
src/app/(app)/
  page.tsx                      # Server component, metadata, prefetches queries, renders sections
  overview-metrics.tsx          # "use client" — metric cards row
  overview-attendance.tsx       # "use client" — attendance table
  overview-consumables.tsx      # "use client" — consumable compliance charts
  overview-deaths-performance.tsx # "use client" — deaths/performance charts + attention chips
```

Chart components (new, reusable):
```
src/components/ui/
  area-chart.tsx              # Existing — extend to support multiple series
  bar-chart.tsx               # New — horizontal bar chart wrapper (Recharts)
  stacked-bar-chart.tsx       # New — horizontal stacked bar chart wrapper (Recharts)
```

### Loading States
- Each section component shows its own skeleton while its tRPC query loads
- Metric cards: 5 skeleton rectangles matching card dimensions
- Attendance: table skeleton with 10 placeholder rows
- Charts: skeleton rectangles matching chart container dimensions (height ~300px)
- Attention chips: 3 skeleton pill shapes

### Data Flow
1. `page.tsx` (server component) prefetches all 4 queries via `trpc.overview.*.prefetch()` and wraps children with `HydrateClient` for instant hydration
2. Each section component (`overview-metrics.tsx`, etc.) calls its respective `useQuery` — data is already cached from prefetch
3. Each section renders independently with its own loading skeleton as fallback
4. All 4 queries run in parallel

---

## Styling Rules

- Dark-only theme, all colors from CSS variables (no arbitrary Tailwind values)
- Chart gradient fills: accent color at 30% opacity fading to 0%
- Chart grid lines: dashed, `var(--color-border)`
- Axis labels: JetBrains Mono, 11px, `var(--color-secondary)`
- Tooltips: `bg-sidebar`, `border-accent`, same pattern as existing AreaChart
- Color thresholds use `data-[attr]` Tailwind styling per project conventions
- Class colors for WoW classes follow standard game colors

---

## Out of Scope

- Upload tracking / recent uploads table (no data source exists)
- Gear/enchant compliance (removed feature)
- HPS tracking (not stored in encounterPlayers — only damage)
- Filtering by raid instance or custom date range (future enhancement)
- Export/print functionality
