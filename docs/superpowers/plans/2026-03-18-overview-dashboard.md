# Overview Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an accountability-focused overview dashboard with metric cards, attendance table, consumable compliance charts, and deaths/performance charts.

**Architecture:** New `overview` tRPC router with 4 procedures providing aggregated data over an 8-week rolling window. Four colocated client components render each section independently. Server component prefetches all queries for instant hydration. Three new reusable chart components (horizontal bar chart, stacked bar chart, multi-series area chart) built on Recharts.

**Tech Stack:** Next.js 16 App Router, tRPC v11, Drizzle ORM, Recharts v3, Tailwind CSS v4, nuqs

**Spec:** `docs/superpowers/specs/2026-03-18-overview-dashboard-design.md`

---

## Conventions Checklist

These project conventions MUST be followed in every task:

- **Named exports only** — `export const`, not `export function` or `export default` (exception: Next.js pages)
- **`data-[attr]` for conditional styles** — never use ternary className strings for conditional styling
- **No arbitrary Tailwind values** — define CSS variables in `globals.css` instead
- **`inArray()` for IN clauses** — never use `sql` template literals for IN queries
- **Zod v4 syntax** — `z.email()` not `z.string().email()`
- **Inline DB queries** — no separate utility files for queries

---

## File Structure

### New files
| File | Responsibility |
|------|---------------|
| `src/lib/trpc/routers/overview.ts` | tRPC router with 4 procedures |
| `src/lib/wow/class-colors.ts` | Shared WoW class color map |
| `src/app/(app)/overview-metrics.tsx` | Client component — 5 metric cards |
| `src/app/(app)/overview-attendance.tsx` | Client component — attendance table |
| `src/app/(app)/overview-consumables.tsx` | Client component — stacked bar + multi-series area chart |
| `src/app/(app)/overview-deaths-performance.tsx` | Client component — deaths bar chart + performance trend + attention chips |
| `src/components/ui/bar-chart.tsx` | Reusable horizontal bar chart (Recharts) |
| `src/components/ui/stacked-bar-chart.tsx` | Reusable horizontal stacked bar chart (Recharts) |
| `src/components/ui/multi-series-area-chart.tsx` | Reusable multi-series area chart (Recharts) |
| `src/app/(app)/loading.tsx` | Skeleton loading state |

### Modified files
| File | Change |
|------|--------|
| `src/lib/trpc/routers/_app.ts` | Register `overview` router |
| `src/app/(app)/page.tsx` | Add prefetch calls, `HydrateClient`, render section components |
| `src/app/globals.css` | Add chart color CSS variables |

---

## Task 1: Theme Variables + Shared Utilities

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/wow/class-colors.ts`

- [ ] **Step 1: Add chart color CSS variables to globals.css**

Add to the `@theme` block in `src/app/globals.css`:

```css
--color-chart-food: #66bbff;
```

- [ ] **Step 2: Create shared class colors utility**

Create `src/lib/wow/class-colors.ts`:

```ts
export const CLASS_COLORS: Record<string, string> = {
	"Death-Knight": "#C41E3A",
	"Demon-Hunter": "#A330C9",
	Druid: "#FF7C0A",
	Evoker: "#33937F",
	Hunter: "#AAD372",
	Mage: "#3FC7EB",
	Monk: "#00FF98",
	Paladin: "#F48CBA",
	Priest: "#FFFFFF",
	Rogue: "#FFF468",
	Shaman: "#0070DD",
	Warlock: "#8788EE",
	Warrior: "#C69B6D",
};
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/lib/wow/class-colors.ts
git commit -m "feat: add chart color variables and shared WoW class colors"
```

---

## Task 2: Overview tRPC Router — `getMetrics`

**Files:**
- Create: `src/lib/trpc/routers/overview.ts`
- Modify: `src/lib/trpc/routers/_app.ts`

- [ ] **Step 1: Create overview router with `getMetrics` procedure**

Create `src/lib/trpc/routers/overview.ts`:

```ts
import {
	and,
	avg,
	count,
	eq,
	gte,
	inArray,
	lt,
	sql,
	sum,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const getTimeWindows = () => {
	const now = new Date();
	const currentStart = new Date(now);
	currentStart.setDate(currentStart.getDate() - 56); // 8 weeks
	const prevStart = new Date(currentStart);
	prevStart.setDate(prevStart.getDate() - 56);
	return { now, currentStart, prevStart };
};

const computePeriodMetrics = async (
	coreId: string,
	periodStart: Date,
	periodEnd: Date,
) => {
	const raidRows = await db
		.select({ id: raids.id, durationMs: raids.durationMs })
		.from(raids)
		.where(
			and(
				eq(raids.coreId, coreId),
				gte(raids.date, periodStart),
				lt(raids.date, periodEnd),
			),
		);

	const totalRaids = raidRows.length;
	if (totalRaids === 0) {
		return { totalRaids: 0, avgRaidDps: 0, avgDurationMs: 0, avgDeathsPerRaid: 0, consumableScore: 0 };
	}

	const raidIds = raidRows.map((r) => r.id);
	const durationsWithValue = raidRows.filter((r) => r.durationMs !== null);
	const avgDurationMs =
		durationsWithValue.length > 0
			? durationsWithValue.reduce((s, r) => s + r.durationMs!, 0) / durationsWithValue.length
			: 0;

	// Raid DPS from kill encounters
	const killEncounters = await db
		.select({ id: encounters.id, durationMs: encounters.durationMs })
		.from(encounters)
		.where(and(inArray(encounters.raidId, raidIds), eq(encounters.result, "kill")));

	let avgRaidDps = 0;
	if (killEncounters.length > 0) {
		const killEncounterIds = killEncounters.map((e) => e.id);
		const [{ totalDamage }] = await db
			.select({ totalDamage: sum(encounterPlayers.damage) })
			.from(encounterPlayers)
			.where(inArray(encounterPlayers.encounterId, killEncounterIds));

		const totalKillDurationMs = killEncounters.reduce((s, e) => s + e.durationMs, 0);
		avgRaidDps = totalKillDurationMs > 0 ? (Number(totalDamage ?? 0) / totalKillDurationMs) * 1000 : 0;
	}

	// Deaths per raid
	const allEncounterRows = await db
		.select({ id: encounters.id })
		.from(encounters)
		.where(inArray(encounters.raidId, raidIds));

	let avgDeathsPerRaid = 0;
	if (allEncounterRows.length > 0) {
		const encIds = allEncounterRows.map((e) => e.id);
		const [{ deathCount }] = await db
			.select({ deathCount: count() })
			.from(playerDeaths)
			.where(inArray(playerDeaths.encounterId, encIds));
		avgDeathsPerRaid = deathCount / totalRaids;
	}

	// Consumable score = (avg flask + avg food + pre-pot rate) / 3
	let consumableScore = 0;
	if (allEncounterRows.length > 0) {
		const encIds = allEncounterRows.map((e) => e.id);

		const [uptimeAvgs] = await db
			.select({
				avgFlask: avg(buffUptimes.flaskUptimePercent),
				avgFood: avg(buffUptimes.foodUptimePercent),
			})
			.from(buffUptimes)
			.where(inArray(buffUptimes.encounterId, encIds));

		const [{ totalPairs }] = await db
			.select({
				totalPairs: sql<number>`count(distinct (${encounterPlayers.encounterId}, ${encounterPlayers.playerGuid}))`,
			})
			.from(encounterPlayers)
			.where(inArray(encounterPlayers.encounterId, encIds));

		const [{ prePotPairs }] = await db
			.select({
				prePotPairs: sql<number>`count(distinct (${consumableUses.encounterId}, ${consumableUses.playerGuid}))`,
			})
			.from(consumableUses)
			.where(and(inArray(consumableUses.encounterId, encIds), eq(consumableUses.prePot, true)));

		const avgFlask = Number(uptimeAvgs?.avgFlask ?? 0);
		const avgFood = Number(uptimeAvgs?.avgFood ?? 0);
		const prePotRate = totalPairs > 0 ? (prePotPairs / totalPairs) * 100 : 0;
		consumableScore = (avgFlask + avgFood + prePotRate) / 3;
	}

	return { totalRaids, avgRaidDps, avgDurationMs, avgDeathsPerRaid, consumableScore };
};

export const overviewRouter = createTRPCRouter({
	getMetrics: protectedProcedure.query(async ({ ctx }) => {
		const { now, currentStart, prevStart } = getTimeWindows();
		const [current, prev] = await Promise.all([
			computePeriodMetrics(ctx.coreId, currentStart, now),
			computePeriodMetrics(ctx.coreId, prevStart, currentStart),
		]);

		return {
			totalRaids: current.totalRaids,
			prevTotalRaids: prev.totalRaids,
			avgRaidDps: current.avgRaidDps,
			prevAvgRaidDps: prev.avgRaidDps,
			avgDurationMs: current.avgDurationMs,
			prevAvgDurationMs: prev.avgDurationMs,
			avgDeathsPerRaid: current.avgDeathsPerRaid,
			prevAvgDeathsPerRaid: prev.avgDeathsPerRaid,
			consumableScore: current.consumableScore,
			prevConsumableScore: prev.consumableScore,
		};
	}),
});
```

- [ ] **Step 2: Register overview router in `_app.ts`**

Add to `src/lib/trpc/routers/_app.ts`:

```ts
import { overviewRouter } from "@/lib/trpc/routers/overview";

export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
	overview: overviewRouter,
});
```

- [ ] **Step 3: Verify dev server compiles**

- [ ] **Step 4: Commit**

```bash
git add src/lib/trpc/routers/overview.ts src/lib/trpc/routers/_app.ts
git commit -m "feat: add overview tRPC router with getMetrics procedure"
```

---

## Task 3: Overview tRPC Router — `getAttendance`

**Files:**
- Modify: `src/lib/trpc/routers/overview.ts`

- [ ] **Step 1: Add `getAttendance` procedure to overviewRouter**

All queries use `inArray()` for IN clauses. Group by player name, match to `members` by name string (no FK exists). Return `startDate`/`endDate` for subtitle display.

Key data flow:
1. Get raids in window
2. Get roster members for core
3. Join `encounterPlayers` → `encounters` → `raids` to count distinct raidIds per player
4. Map to roster members by name, compute attendance rate
5. Sort by attendance rate descending

Refer to spec Section 2 for exact output shape.

- [ ] **Step 2: Verify compilation**

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/overview.ts
git commit -m "feat: add getAttendance procedure to overview router"
```

---

## Task 4: Overview tRPC Router — `getConsumableCompliance`

**Files:**
- Modify: `src/lib/trpc/routers/overview.ts`

- [ ] **Step 1: Add `getConsumableCompliance` procedure**

Two aggregations:
- **byPlayer**: avg flask uptime, avg food uptime, pre-pot rate per roster member. Map `playerGuid` to `playerName` via `encounterPlayers`. Sort by overall compliance descending.
- **byRaid**: avg flask uptime, avg food uptime, avg pre-pot rate per raid date. Sort by date ascending.

All IN clauses use `inArray()`. All player matching via `guidToName` map from `encounterPlayers`.

Refer to spec Section 3 for exact output shape.

- [ ] **Step 2: Verify compilation**

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/overview.ts
git commit -m "feat: add getConsumableCompliance procedure to overview router"
```

---

## Task 5: Overview tRPC Router — `getDeathsAndPerformance`

**Files:**
- Modify: `src/lib/trpc/routers/overview.ts`

- [ ] **Step 1: Add `getDeathsAndPerformance` procedure**

Three aggregations:
- **deathsByPlayer**: total deaths, deaths per raid, top killing source (from `killingBlow->>'sourceName'` JSONB, cast as `{ sourceName?: string }`, grouped by source name, pick highest count). Sort by total deaths descending.
- **performanceTrend**: per-raid DPS (sum kill encounter damage / kill encounter duration * 1000) and total deaths. Sort by date ascending.
- **attentionNeeded**: avg DPS per player across all encounters, grouped by `members.role` (or `members.class` if role is null). Flag bottom 20th percentile per group (skip groups < 3 members). Sort by pctDiff ascending, limit 5.

All IN clauses use `inArray()`.

Refer to spec Section 4 for exact output shape.

- [ ] **Step 2: Verify compilation**

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/overview.ts
git commit -m "feat: add getDeathsAndPerformance procedure to overview router"
```

---

## Task 6: Reusable Chart Components

**Files:**
- Create: `src/components/ui/bar-chart.tsx`
- Create: `src/components/ui/stacked-bar-chart.tsx`
- Create: `src/components/ui/multi-series-area-chart.tsx`

- [ ] **Step 1: Create horizontal bar chart component**

Create `src/components/ui/bar-chart.tsx`. Key requirements:
- `export const BarChart = <T,>(props) => { ... }` (generic arrow function with trailing comma for TSX)
- No `useId` import (not needed here)
- Props: `data: BarChartDataPoint<T>[]`, `color`, `height`, `layout` ("horizontal"), `tooltipFormatterAction`
- Each `BarChartDataPoint` has `{ label, value, color?, meta? }`
- Per-bar color via `<Cell fill={entry.color ?? color} />`
- Tooltip: `border border-accent bg-sidebar px-3.5 py-2.5`
- Axes: `fill: "var(--color-secondary)"`, `fontSize: 11`, `fontFamily: "var(--font-body)"`
- Grid: `strokeDasharray="4 4"`, `stroke="var(--color-border)"`

- [ ] **Step 2: Create stacked bar chart component**

Create `src/components/ui/stacked-bar-chart.tsx`. Key requirements:
- `export const StackedBarChart = <T,>(props) => { ... }`
- Props: `data: T[]`, `bars: { dataKey, color, name }[]`, `categoryKey: string`, `height`, `tooltipFormatterAction`
- Horizontal layout with `layout="horizontal"`
- Multiple `<Bar>` elements, one per `bars` entry, with `stackId="stack"`
- Gradient support not needed for stacked bars — use solid fills
- Same axis/grid/tooltip styling as BarChart

- [ ] **Step 3: Create multi-series area chart component**

Create `src/components/ui/multi-series-area-chart.tsx`. Key requirements:
- `export const MultiSeriesAreaChart = <T,>(props) => { ... }`
- Uses `useId()` for gradient IDs
- Props: `data: T[]`, `series: MultiSeriesConfig[]`, `xAxisKey`, `height`, `dualAxis?`, `yAxisFormatter?`, `yAxisRightFormatter?`, `tooltipFormatterAction`
- `MultiSeriesConfig`: `{ dataKey, color, name, yAxisId?, type?: "area" | "line" }`
- Gradient fills for area type (30% → 0% opacity), no fill for line type
- Dual axis support: `yAxisId="left"` (default) and `yAxisId="right"` (optional)
- Same axis/grid/tooltip styling as other charts

- [ ] **Step 4: Verify compilation**

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/bar-chart.tsx src/components/ui/stacked-bar-chart.tsx src/components/ui/multi-series-area-chart.tsx
git commit -m "feat: add BarChart, StackedBarChart, and MultiSeriesAreaChart components"
```

---

## Task 7: Overview Metrics Component

**Files:**
- Create: `src/app/(app)/overview-metrics.tsx`

- [ ] **Step 1: Create metrics component**

Create `src/app/(app)/overview-metrics.tsx`:
- `"use client"` directive
- `export const OverviewMetrics = () => { ... }`
- Uses `trpc.overview.getMetrics.useQuery()` from `@/lib/trpc/client`
- Skeleton: 5 cards in `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`
- Local `MetricCard` component with `data-[attr]` conditional styling:

```tsx
<span
  data-good={goodPct >= 5 || undefined}
  data-warn={(goodPct >= -5 && goodPct < 5) || undefined}
  data-bad={goodPct < -5 || undefined}
  className="font-heading text-3xl font-bold text-primary data-bad:text-danger data-good:text-accent data-warn:text-warning"
>
```

- Same pattern for trend icon color
- Helper functions: `formatNumber`, `formatDuration`, `computePctChange`
- 5 cards: Total Raids, Raid DPS, Avg Duration, Deaths/Raid, Consumable Score

- [ ] **Step 2: Verify rendering in browser**

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/overview-metrics.tsx
git commit -m "feat: add OverviewMetrics component with 5 metric cards"
```

---

## Task 8: Overview Attendance Component

**Files:**
- Create: `src/app/(app)/overview-attendance.tsx`

- [ ] **Step 1: Create attendance table component**

Create `src/app/(app)/overview-attendance.tsx`:
- `"use client"` directive
- `export const OverviewAttendance = () => { ... }`
- Uses `trpc.overview.getAttendance.useQuery()`
- Import `CLASS_COLORS` from `@/lib/wow/class-colors`
- Skeleton: section header + table with 8 placeholder rows
- Table columns: #, Player, Class (with `style={{ color: classColor }}`), Raids (X/Y), Attendance %, Last Seen
- Attendance % color via `data-[attr]`:

```tsx
<td
  data-high={member.attendanceRate >= 80 || undefined}
  data-mid={(member.attendanceRate >= 50 && member.attendanceRate < 80) || undefined}
  data-low={member.attendanceRate < 50 || undefined}
  className="... text-danger data-high:text-accent data-mid:text-warning"
>
```

- Subtitle shows date range from `data.startDate` to `data.endDate`

- [ ] **Step 2: Verify rendering**

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/overview-attendance.tsx
git commit -m "feat: add OverviewAttendance component with roster table"
```

---

## Task 9: Overview Consumables Component

**Files:**
- Create: `src/app/(app)/overview-consumables.tsx`

- [ ] **Step 1: Create consumables compliance component**

Create `src/app/(app)/overview-consumables.tsx`:
- `"use client"` directive
- `export const OverviewConsumables = () => { ... }`
- Uses `trpc.overview.getConsumableCompliance.useQuery()`
- Skeleton: section header + 2 chart placeholders in `grid-cols-1 lg:grid-cols-2`

**Left chart — StackedBarChart "Compliance by Player":**
- Transform `byPlayer` data into rows with `flask`, `food`, `prePot` values
- Bars config: `[{ dataKey: "flask", color: "var(--color-accent)", name: "Flask" }, { dataKey: "food", color: "var(--color-chart-food)", name: "Food" }, { dataKey: "prePot", color: "var(--color-warning)", name: "Pre-Pot" }]`
- Stack order: flask, food, pre-pot (left to right)
- Dynamic height based on player count: `Math.max(300, playerCount * 32)`

**Right chart — MultiSeriesAreaChart "Raid Compliance Trend":**
- Transform `byRaid` data with formatted dates
- 3 series: flask (accent), food (chart-food), prePot (warning)
- Y-axis formatter: `(v) => \`${v}%\``

Tooltip for both charts shows exact percentages per metric. Use `var(--color-chart-food)` not hardcoded `#66bbff`.

- [ ] **Step 2: Verify both charts render**

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/overview-consumables.tsx
git commit -m "feat: add OverviewConsumables component with compliance charts"
```

---

## Task 10: Overview Deaths & Performance Component

**Files:**
- Create: `src/app/(app)/overview-deaths-performance.tsx`

- [ ] **Step 1: Create deaths & performance component**

Create `src/app/(app)/overview-deaths-performance.tsx`:
- `"use client"` directive
- `export const OverviewDeathsPerformance = () => { ... }`
- Uses `trpc.overview.getDeathsAndPerformance.useQuery()`
- Import `CLASS_COLORS` from `@/lib/wow/class-colors`
- Skeleton: section header + 2 chart placeholders + 3 chip skeletons

**Left chart — BarChart "Deaths per Player":**
- Color per bar based on relative deaths vs average, using `data-[attr]` pattern or computed at data-transform time (colors are per-bar, so compute color string in `useMemo` — this is acceptable since it's chart data, not DOM styling)
- Tooltip: total deaths, deaths per raid, top killing source

**Right chart — MultiSeriesAreaChart "Raid Performance Trend":**
- Dual axis: left = DPS (accent green area), right = Deaths (danger red line)
- `dualAxis={true}`

**Bottom — Attention Needed chips:**
- Only render if `data.attentionNeeded.length > 0`
- Each chip: player name (class-colored), class, avg DPS, pct diff vs role avg
- Border color via data attributes:

```tsx
<div
  data-severe={player.pctDiff <= -30 || undefined}
  data-moderate={player.pctDiff > -30 || undefined}
  className="... border border-warning data-severe:border-danger"
>
```

- [ ] **Step 2: Verify full section renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/overview-deaths-performance.tsx
git commit -m "feat: add OverviewDeathsPerformance component with charts and attention chips"
```

---

## Task 11: Server Page + Loading Skeleton

**Files:**
- Modify: `src/app/(app)/page.tsx`
- Create: `src/app/(app)/loading.tsx`

**Note:** This task comes AFTER all components are created (Tasks 7-10) to avoid import errors.

- [ ] **Step 1: Create loading skeleton**

Create `src/app/(app)/loading.tsx`:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-40" />
				<div className="flex flex-col border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-full border-t border-border" />
					))}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-64" />
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-80 w-full" />
					<Skeleton className="h-80 w-full" />
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-56" />
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-80 w-full" />
					<Skeleton className="h-80 w-full" />
				</div>
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Update server page**

Modify `src/app/(app)/page.tsx`:

```tsx
import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { OverviewMetrics } from "./overview-metrics";
import { OverviewAttendance } from "./overview-attendance";
import { OverviewConsumables } from "./overview-consumables";
import { OverviewDeathsPerformance } from "./overview-deaths-performance";

export const metadata: Metadata = {
	title: "Overview",
};

export default async function DashboardPage() {
	await connection();
	void trpc.overview.getMetrics.prefetch();
	void trpc.overview.getAttendance.prefetch();
	void trpc.overview.getConsumableCompliance.prefetch();
	void trpc.overview.getDeathsAndPerformance.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Overview
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Raid Core Analyzer"}
					</p>
				</div>
				<OverviewMetrics />
				<OverviewAttendance />
				<OverviewConsumables />
				<OverviewDeathsPerformance />
			</div>
		</HydrateClient>
	);
}
```

- [ ] **Step 3: Verify the full page loads in browser**

Navigate to the overview page. All 4 sections should render with data or skeletons.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/page.tsx src/app/\(app\)/loading.tsx
git commit -m "feat: wire up overview page with prefetch and loading skeleton"
```

---

## Task 12: Visual Verification and Polish

**Files:**
- May modify: any of the above files

- [ ] **Step 1: Verify all sections render correctly**

Check in browser:
1. 5 metric cards with values, trend icons, and correct colors
2. Attendance table with roster, sorted by attendance %, color-coded
3. Consumable stacked bars show 3 segments per player, area chart shows 3 trend lines
4. Deaths bar chart with color-coded bars, dual-axis performance trend
5. Attention chips for low-performing players
6. Loading skeletons display during data fetch

- [ ] **Step 2: Fix any visual issues**

- [ ] **Step 3: Test empty states**

Verify sections handle empty data gracefully (no crashes, appropriate "no data" display).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: polish overview dashboard visual issues"
```
