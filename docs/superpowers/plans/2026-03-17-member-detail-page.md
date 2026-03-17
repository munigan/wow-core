# Member Detail Page Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the member detail page with stat cards, a DPS trend area chart, and a consumable compliance heatmap — replacing the existing consumable table.

**Architecture:** Extend the existing `members.getById` tRPC query to return additional aggregated data (DPS, deaths, pre-pot rate) scoped to 8 weeks. Build two new reusable UI components (`AreaChart`, `HeatmapGrid`) under `src/components/ui/`. Rewrite the `member-details.tsx` client component to render the new sections.

**Tech Stack:** Next.js 16 (App Router), Recharts (new dependency), Tailwind CSS v4, tRPC v11, Drizzle ORM, `@base-ui/react` (existing Tooltip)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add `recharts` dependency |
| `src/lib/trpc/routers/members.ts` | Modify | Extend `getById` to return stat card aggregates, DPS trend data, and heatmap data grouped by date |
| `src/components/ui/area-chart.tsx` | Create | Reusable area chart built on Recharts |
| `src/components/ui/heatmap-grid.tsx` | Create | Reusable heatmap grid with colored cells and tooltips |
| `src/app/(app)/members/[memberId]/member-details.tsx` | Rewrite | Render stat cards, DPS chart, and heatmap instead of old table |
| `src/app/(app)/members/[memberId]/loading.tsx` | Modify | Update skeleton to match new layout |

---

### Task 1: Install Recharts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install recharts**

```bash
pnpm add recharts
```

- [ ] **Step 2: Verify installation**

```bash
pnpm ls recharts
```

Expected: `recharts` version listed in output.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add recharts dependency for chart components"
```

---

### Task 2: Extend `getById` tRPC Query

**Files:**
- Modify: `src/lib/trpc/routers/members.ts:124-291`

The existing `getById` query fetches encounter data and aggregates consumables per raid. We need to:
1. Add an 8-week date filter
2. Compute stat card aggregates (avg DPS, raid attendance, pre-pot rate, death count)
3. Return DPS trend data grouped by date
4. Return heatmap data grouped by date with per-encounter consumable breakdowns

**Important references:**
- `encounterPlayers` schema: `src/lib/db/schema/encounter-players.ts` — columns: `encounterId`, `playerGuid`, `playerName`, `class`, `spec`, `damage` (bigint/number), `damageTaken` (bigint/number)
- `encounters` schema: `src/lib/db/schema/encounters.ts` — columns: `id`, `raidId`, `bossName`, `durationMs` (integer), `result`, `difficulty`, `order`
- `playerDeaths` schema: `src/lib/db/schema/player-deaths.ts` — columns: `encounterId`, `playerGuid`, `playerName`, `timestamp`, `timeIntoEncounter`, `killingBlow`, `recap`
- `buffUptimes` schema: `src/lib/db/schema/buff-uptimes.ts` — columns: `encounterId`, `playerGuid`, `flaskUptimePercent` (real), `foodUptimePercent` (real)
- `consumableUses` schema: `src/lib/db/schema/consumable-uses.ts` — columns: `encounterId`, `playerGuid`, `spellId`, `spellName`, `type`, `prePot` (boolean), `count` (smallint)

**Join strategy:** Match `encounterPlayers.playerName` to `member.name` scoped via `encounters` → `raids` → `raids.coreId = ctx.coreId`. Collect `playerGuid` values from those rows. Use those GUIDs to query `consumableUses`, `buffUptimes`, `playerDeaths`.

- [ ] **Step 1: Add `playerDeaths` import and 8-week filter**

At the top of `src/lib/trpc/routers/members.ts`, add the import:

```ts
import { playerDeaths } from "@/lib/db/schema/player-deaths";
```

Also add `gte` to the drizzle-orm import:

```ts
import { and, asc, countDistinct, desc, eq, gte, ilike, inArray } from "drizzle-orm";
```

- [ ] **Step 2: Add date filter to the `getById` query**

Inside the `getById` procedure, after fetching the member (after line 140), add the 8-week cutoff date:

```ts
const eightWeeksAgo = new Date();
eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
```

Then modify the `playerEncounters` query to add the date filter. Add `gte(raids.date, eightWeeksAgo)` to the `where` clause:

```ts
const playerEncounters = await db
  .select({
    encounterId: encounterPlayers.encounterId,
    playerGuid: encounterPlayers.playerGuid,
    damage: encounterPlayers.damage,
    raidId: encounters.raidId,
    raidName: raids.name,
    raidDate: raids.date,
    spec: encounterPlayers.spec,
    durationMs: encounters.durationMs,
    bossName: encounters.bossName,
  })
  .from(encounterPlayers)
  .innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
  .innerJoin(raids, eq(encounters.raidId, raids.id))
  .where(
    and(
      eq(encounterPlayers.playerName, member.name),
      eq(raids.coreId, ctx.coreId),
      gte(raids.date, eightWeeksAgo),
    ),
  )
  .orderBy(desc(raids.date));
```

Note we added `damage`, `durationMs`, and `bossName` to the select — these are needed for DPS calculations and heatmap tooltips.

- [ ] **Step 3: Add death count query (parallel with existing batch queries)**

The existing code runs `uptimes` and `consumables` queries sequentially. Combine them with the new `deaths` query into a single `Promise.all` for better performance:

```ts
const [uptimes, consumables, deaths] = await Promise.all([
  db
    .select()
    .from(buffUptimes)
    .where(
      and(
        inArray(buffUptimes.encounterId, allEncounterIds),
        inArray(buffUptimes.playerGuid, allGuids),
      ),
    ),
  db
    .select()
    .from(consumableUses)
    .where(
      and(
        inArray(consumableUses.encounterId, allEncounterIds),
        inArray(consumableUses.playerGuid, allGuids),
      ),
    ),
  db
    .select()
    .from(playerDeaths)
    .where(
      and(
        inArray(playerDeaths.encounterId, allEncounterIds),
        inArray(playerDeaths.playerGuid, allGuids),
      ),
    ),
]);
```

This replaces the two sequential `await` calls for `uptimes` and `consumables` with a parallel batch.

- [ ] **Step 4: Compute stat card aggregates**

After the existing `raidResults` aggregation, compute the stat card data:

```ts
// Stat cards
const totalEncounters = playerEncounters.length;
const totalDps = totalEncounters > 0
  ? Math.round(
      playerEncounters.reduce((sum, pe) => {
        const dps = pe.durationMs > 0 ? (pe.damage / pe.durationMs) * 1000 : 0;
        return sum + dps;
      }, 0) / totalEncounters,
    )
  : 0;

const uniqueRaidIds = new Set(playerEncounters.map((pe) => pe.raidId));
const raidAttendance = uniqueRaidIds.size;

// Pre-pot rate: encounters where at least one consumable has prePot=true
const encounterIdsWithPrePot = new Set<string>();
for (const c of consumables) {
  if (c.prePot) {
    encounterIdsWithPrePot.add(c.encounterId);
  }
}
const prePotRate = totalEncounters > 0
  ? Math.round((encounterIdsWithPrePot.size / totalEncounters) * 100)
  : 0;

const totalDeaths = deaths.length;
```

- [ ] **Step 5: Compute DPS trend data grouped by date**

```ts
// DPS trend: group by date
const dpsByDate = new Map<string, { totalDps: number; count: number }>();
for (const pe of playerEncounters) {
  const dateKey = new Date(pe.raidDate).toISOString().split("T")[0];
  const entry = dpsByDate.get(dateKey) ?? { totalDps: 0, count: 0 };
  const dps = pe.durationMs > 0 ? (pe.damage / pe.durationMs) * 1000 : 0;
  entry.totalDps += dps;
  entry.count++;
  dpsByDate.set(dateKey, entry);
}

const dpsTrend = [...dpsByDate.entries()]
  .map(([date, { totalDps, count }]) => ({
    date,
    avgDps: Math.round(totalDps / count),
    encounters: count,
  }))
  .sort((a, b) => a.date.localeCompare(b.date));
```

- [ ] **Step 6: Compute heatmap data grouped by date**

Replace the existing `raidResults` aggregation with a date-grouped version for the heatmap. The existing per-raid aggregation is no longer needed since we're replacing the table with a heatmap.

```ts
// Heatmap: group encounters by date
const encountersByDate = new Map<
  string,
  {
    encounters: {
      encounterId: string;
      playerGuid: string;
      bossName: string;
    }[];
  }
>();
for (const pe of playerEncounters) {
  const dateKey = new Date(pe.raidDate).toISOString().split("T")[0];
  const entry = encountersByDate.get(dateKey) ?? { encounters: [] };
  entry.encounters.push({
    encounterId: pe.encounterId,
    playerGuid: pe.playerGuid,
    bossName: pe.bossName,
  });
  encountersByDate.set(dateKey, entry);
}

const heatmapData = [...encountersByDate.entries()]
  .map(([date, { encounters: encs }]) => {
    let flaskTotal = 0;
    let foodTotal = 0;
    let uptimeCount = 0;
    let encountersWithConsumable = 0;

    const consumablesByBoss: Record<
      string,
      { spellName: string; count: number; type: string; isPrePot: boolean }[]
    > = {};

    for (const enc of encs) {
      const key = `${enc.encounterId}:${enc.playerGuid}`;

      const uptime = uptimeByEncGuid.get(key);
      if (uptime) {
        flaskTotal += uptime.flaskUptimePercent;
        foodTotal += uptime.foodUptimePercent;
        uptimeCount++;
      }

      const cons = consumablesByEncGuid.get(key) ?? [];
      const hasConsumable = cons.length > 0;
      if (hasConsumable) encountersWithConsumable++;

      if (!consumablesByBoss[enc.bossName]) {
        consumablesByBoss[enc.bossName] = [];
      }
      for (const c of cons) {
        consumablesByBoss[enc.bossName].push({
          spellName: c.spellName,
          count: c.count,
          type: c.type,
          isPrePot: c.prePot,
        });
      }
    }

    return {
      date,
      encounterCount: encs.length,
      flaskUptime: uptimeCount > 0 ? Math.round(flaskTotal / uptimeCount) : null,
      foodUptime: uptimeCount > 0 ? Math.round(foodTotal / uptimeCount) : null,
      consumableCoverage: { covered: encountersWithConsumable, total: encs.length },
      consumablesByBoss,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date)); // newest first
```

- [ ] **Step 7: Update the return value**

Replace the existing return statement with:

```ts
const latestSpec = playerEncounters[0]?.spec ?? member.spec;

return {
  member: { ...member, latestSpec },
  stats: {
    avgDps: totalDps,
    raidAttendance,
    prePotRate,
    totalDeaths,
  },
  dpsTrend,
  heatmapData,
};
```

The old `raids` array is removed since the consumable table is replaced by the heatmap.

- [ ] **Step 8: Update the empty state return**

Update the early return for empty data (line 163-164):

```ts
if (playerEncounters.length === 0) {
  return {
    member: { ...member, latestSpec: member.spec },
    stats: { avgDps: 0, raidAttendance: 0, prePotRate: 0, totalDeaths: 0 },
    dpsTrend: [],
    heatmapData: [],
  };
}
```

- [ ] **Step 9: Verify the server starts without errors**

```bash
pnpm dev
```

Open the app, navigate to a member detail page. The page will show errors since the client component still expects the old data shape — that's expected and we'll fix it in Task 5.

- [ ] **Step 10: Commit**

```bash
git add src/lib/trpc/routers/members.ts
git commit -m "feat: extend getById query with stats, DPS trend, and heatmap data"
```

---

### Task 3: Create `AreaChart` Reusable Component

**Files:**
- Create: `src/components/ui/area-chart.tsx`

**Docs reference:** Check Recharts docs for `AreaChart`, `ResponsiveContainer`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `defs`/`linearGradient` for fill gradient. Use `@context7` MCP to look up recharts docs if needed.

- [ ] **Step 1: Create the AreaChart component**

Create `src/components/ui/area-chart.tsx`:

```tsx
"use client";

import { type ReactNode, useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AreaChartDataPoint<T = Record<string, unknown>> = {
  label: string;
  value: number;
  meta?: T;
};

type AreaChartProps<T = Record<string, unknown>> = {
  data: AreaChartDataPoint<T>[];
  color?: string;
  height?: number;
  tooltipFormatter?: (point: AreaChartDataPoint<T>) => ReactNode;
};

type CustomTooltipProps<T> = {
  active?: boolean;
  payload?: { payload: AreaChartDataPoint<T> }[];
  formatter?: (point: AreaChartDataPoint<T>) => ReactNode;
};

function ChartTooltip<T>({ active, payload, formatter }: CustomTooltipProps<T>) {
  if (!active || !payload?.length || !formatter) return null;
  // Mirrors TooltipContent styling from src/components/ui/tooltip.tsx
  return (
    <div className="border border-accent bg-sidebar px-3.5 py-2.5">
      {formatter(payload[0].payload)}
    </div>
  );
}

export function AreaChart<T = Record<string, unknown>>({
  data,
  color = "var(--color-accent)",
  height = 280,
  tooltipFormatter,
}: AreaChartProps<T>) {
  const gradientId = useId();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
          width={48}
        />
        <Tooltip
          content={<ChartTooltip formatter={tooltipFormatter} />}
          cursor={{ stroke: "var(--color-border)", strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 3, fill: color, stroke: "var(--color-card)", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: color, stroke: "var(--color-card)", strokeWidth: 2 }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/area-chart.tsx
git commit -m "feat: add reusable AreaChart component built on Recharts"
```

---

### Task 4: Create `HeatmapGrid` Reusable Component

**Files:**
- Create: `src/components/ui/heatmap-grid.tsx`

This component uses the existing Tooltip compound component from `src/components/ui/tooltip.tsx`.

- [ ] **Step 1: Create the HeatmapGrid component**

Create `src/components/ui/heatmap-grid.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type HeatmapCellStatus = "full" | "partial" | "empty";

export type HeatmapCell = {
  value?: number;
  display?: string;
  status: HeatmapCellStatus;
};

export type HeatmapRow = {
  label: string;
  badge?: string;
  cells: HeatmapCell[];
};

type HeatmapGridProps = {
  rows: HeatmapRow[];
  columns: string[];
  tooltipFormatter?: (row: HeatmapRow, colIndex: number, cell: HeatmapCell) => ReactNode;
};

function formatCellValue(cell: HeatmapCell): string {
  if (cell.display) return cell.display;
  if (cell.value !== undefined) return String(Math.round(cell.value));
  return "—";
}

export function HeatmapGrid({ rows, columns, tooltipFormatter }: HeatmapGridProps) {
  if (rows.length === 0) return null;

  return (
    <div className="border border-border bg-card">
      {/* Header */}
      <div
        className="grid items-center border-b border-border px-4 py-2.5 font-body text-2xs uppercase tracking-wider text-dimmed"
        style={{ gridTemplateColumns: `1fr auto repeat(${columns.length}, 80px)` }}
      >
        <span>Date</span>
        <span className="w-28 text-center">Encounters</span>
        {columns.map((col) => (
          <span key={col} className="text-center">{col}</span>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid items-center border-b border-elevated px-4 py-2.5 font-body text-sm"
          style={{ gridTemplateColumns: `1fr auto repeat(${columns.length}, 80px)` }}
        >
          <span className="text-primary">{row.label}</span>
          <span className="w-28 text-center text-2xs text-dimmed">
            {row.badge}
          </span>
          {row.cells.map((cell, colIndex) => (
            <div key={colIndex} className="flex justify-center">
              {tooltipFormatter ? (
                <TooltipRoot>
                  <TooltipTrigger render={<span />}>
                    <span
                      data-full={cell.status === "full" || undefined}
                      data-partial={cell.status === "partial" || undefined}
                      className="cursor-default text-center text-danger data-full:text-accent data-partial:text-warning"
                    >
                      {formatCellValue(cell)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {tooltipFormatter(row, colIndex, cell)}
                  </TooltipContent>
                </TooltipRoot>
              ) : (
                <span
                  data-full={cell.status === "full" || undefined}
                  data-partial={cell.status === "partial" || undefined}
                  className="text-center text-danger data-full:text-accent data-partial:text-warning"
                >
                  {formatCellValue(cell)}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/heatmap-grid.tsx
git commit -m "feat: add reusable HeatmapGrid component with tooltip support"
```

---

### Task 5: Rewrite `member-details.tsx` Client Component

**Files:**
- Modify: `src/app/(app)/members/[memberId]/member-details.tsx`

This is a full rewrite of the client component. The header stays the same. The consumable table is removed and replaced with: stat cards, DPS trend chart, and consumable heatmap.

**Existing imports to keep:** Image, class icons, class colors, Skeleton, trpc client, `formatSpec` helper. (`Link` is no longer needed since the consumable table with raid links is removed.)

**New imports needed:** `Card`, `AreaChart`, `HeatmapGrid`, `TooltipLabel`.

> **WARNING:** This task changes the client component to expect the new data shape from Task 2. The page will be broken between Task 2 commit and Task 5 commit. This is expected during development.

- [ ] **Step 1: Rewrite the component**

Replace the entire content of `src/app/(app)/members/[memberId]/member-details.tsx` with:

```tsx
"use client";

import Image from "next/image";
import dkIcon from "@/assets/classes/dk.png";
import druidIcon from "@/assets/classes/druid.png";
import hunterIcon from "@/assets/classes/hunter.png";
import mageIcon from "@/assets/classes/mage.png";
import paladinIcon from "@/assets/classes/paladin.png";
import priestIcon from "@/assets/classes/priest.png";
import rogueIcon from "@/assets/classes/rogue.png";
import shamanIcon from "@/assets/classes/shaman.png";
import warlockIcon from "@/assets/classes/warlock.png";
import warriorIcon from "@/assets/classes/warrior.png";
import { AreaChart } from "@/components/ui/area-chart";
import { Card } from "@/components/ui/card";
import { HeatmapGrid } from "@/components/ui/heatmap-grid";
import type { HeatmapCell, HeatmapRow } from "@/components/ui/heatmap-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipLabel } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

const CLASS_ICONS: Record<string, typeof dkIcon> = {
  warrior: warriorIcon,
  paladin: paladinIcon,
  hunter: hunterIcon,
  rogue: rogueIcon,
  priest: priestIcon,
  "death-knight": dkIcon,
  shaman: shamanIcon,
  mage: mageIcon,
  warlock: warlockIcon,
  druid: druidIcon,
};

const CLASS_COLORS: Record<string, string> = {
  warrior: "text-class-warrior",
  paladin: "text-class-paladin",
  hunter: "text-class-hunter",
  rogue: "text-class-rogue",
  priest: "text-class-priest",
  "death-knight": "text-class-dk",
  shaman: "text-class-shaman",
  mage: "text-class-mage",
  warlock: "text-class-warlock",
  druid: "text-class-druid",
};

function formatSpec(spec: string | null, playerClass: string | null): string | null {
  if (!spec || !playerClass) return null;
  const classPrefix = playerClass === "death-knight" ? "death-knight-" : `${playerClass}-`;
  if (!spec.startsWith(classPrefix)) return null;
  const specName = spec.slice(classPrefix.length);
  return specName.charAt(0).toUpperCase() + specName.slice(1);
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function getStatAttrs(
  type: "dps" | "attendance" | "prepot" | "deaths",
  value: number,
): Record<string, boolean | undefined> {
  switch (type) {
    case "prepot":
      if (value >= 80) return { "data-good": true };
      if (value >= 50) return { "data-warn": true };
      return {};
    case "deaths":
      if (value === 0) return { "data-good": true };
      if (value <= 5) return { "data-warn": true };
      return {};
    default:
      return { "data-neutral": true };
  }
}

function getUptimeStatus(value: number | null): "full" | "partial" | "empty" {
  if (value === null) return "empty";
  if (value >= 95) return "full";
  if (value >= 80) return "partial";
  return "empty";
}

function getCoverageStatus(covered: number, total: number): "full" | "partial" | "empty" {
  if (total === 0) return "empty";
  const ratio = covered / total;
  if (ratio >= 1) return "full";
  if (ratio >= 0.5) return "partial";
  return "empty";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type MemberDetailsProps = {
  memberId: string;
};

export function MemberDetails({ memberId }: MemberDetailsProps) {
  const { data, isLoading } = trpc.members.getById.useQuery({ memberId });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-8 p-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16" />
            </Card>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-70" />
        </div>
        {/* Heatmap skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const { member, stats, dpsTrend, heatmapData } = data;
  const playerClass = member.class;
  const spec = formatSpec(member.latestSpec, playerClass);

  const hasData = dpsTrend.length > 0 || heatmapData.length > 0;

  // Transform DPS trend for chart
  const chartData = dpsTrend.map((d) => ({
    label: formatDate(d.date),
    value: d.avgDps,
    meta: { encounters: d.encounters, date: d.date },
  }));

  // Transform heatmap data
  const heatmapRows: HeatmapRow[] = heatmapData.map((d) => ({
    label: formatDate(d.date),
    badge: `${d.encounterCount}`,
    cells: [
      {
        value: d.flaskUptime ?? undefined,
        display: d.flaskUptime !== null ? `${Math.round(d.flaskUptime)}%` : "—",
        status: getUptimeStatus(d.flaskUptime),
      },
      {
        value: d.foodUptime ?? undefined,
        display: d.foodUptime !== null ? `${Math.round(d.foodUptime)}%` : "—",
        status: getUptimeStatus(d.foodUptime),
      },
      {
        display: `${d.consumableCoverage.covered}/${d.consumableCoverage.total}`,
        status: getCoverageStatus(d.consumableCoverage.covered, d.consumableCoverage.total),
      },
    ] satisfies HeatmapCell[],
  }));

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-4xl font-bold uppercase text-primary">
          {member.name}
        </h1>
        <div className="flex items-center gap-2 font-body text-sm">
          {playerClass && CLASS_ICONS[playerClass] && (
            <Image
              src={CLASS_ICONS[playerClass]}
              alt={playerClass}
              width={16}
              height={16}
            />
          )}
          <span
            className={`capitalize ${CLASS_COLORS[playerClass ?? ""] ?? "text-secondary"}`}
          >
            {playerClass ?? "Unknown"}
            {spec && (
              <span className="text-dimmed"> ({spec})</span>
            )}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <span
            {...getStatAttrs("dps", stats.avgDps)}
            className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
          >
            {hasData ? formatNumber(stats.avgDps) : "—"}
          </span>
          <span className="font-body text-2xs uppercase tracking-wider text-secondary">
            Avg DPS
          </span>
        </Card>
        <Card>
          <span
            {...getStatAttrs("attendance", stats.raidAttendance)}
            className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
          >
            {hasData ? stats.raidAttendance : "—"}
          </span>
          <span className="font-body text-2xs uppercase tracking-wider text-secondary">
            Raids Attended
          </span>
        </Card>
        <Card>
          <span
            {...getStatAttrs("prepot", stats.prePotRate)}
            className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
          >
            {hasData ? `${stats.prePotRate}%` : "—"}
          </span>
          <span className="font-body text-2xs uppercase tracking-wider text-secondary">
            Pre-pot Rate
          </span>
        </Card>
        <Card>
          <span
            {...getStatAttrs("deaths", stats.totalDeaths)}
            className="font-heading text-3xl font-bold text-danger data-good:text-accent data-neutral:text-primary data-warn:text-warning"
          >
            {hasData ? stats.totalDeaths : "—"}
          </span>
          <span className="font-body text-2xs uppercase tracking-wider text-secondary">
            Total Deaths
          </span>
        </Card>
      </div>

      {/* DPS Trend Chart */}
      <div className="flex flex-col gap-3">
        <span className="font-body text-xs uppercase tracking-wider text-secondary">
          // DPS Trend — Last 8 Weeks
        </span>
        {chartData.length > 0 ? (
          <AreaChart
            data={chartData}
            color="var(--color-accent)"
            height={280}
            tooltipFormatter={(point) => (
              <div className="flex flex-col gap-1">
                <TooltipLabel>{point.meta?.date ?? point.label}</TooltipLabel>
                <div className="flex items-center justify-between gap-6 font-body text-xs">
                  <span className="text-secondary">Avg DPS</span>
                  <span className="font-semibold text-accent">
                    {formatNumber(point.value)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6 font-body text-xs">
                  <span className="text-secondary">Encounters</span>
                  <span className="text-primary">{point.meta?.encounters}</span>
                </div>
              </div>
            )}
          />
        ) : (
          <div className="flex h-70 items-center justify-center border border-border bg-card">
            <span className="font-body text-sm text-dimmed">
              No encounter data in the last 8 weeks
            </span>
          </div>
        )}
      </div>

      {/* Consumable Compliance Heatmap */}
      <div className="flex flex-col gap-3">
        <span className="font-body text-xs uppercase tracking-wider text-secondary">
          // Consumable Compliance
        </span>
        {heatmapRows.length > 0 ? (
          <HeatmapGrid
            rows={heatmapRows}
            columns={["Flask", "Food", "Consumables"]}
            tooltipFormatter={(row, colIndex, cell) => {
              const dateData = heatmapData.find((d) => formatDate(d.date) === row.label);
              if (!dateData) return null;

              if (colIndex === 0) {
                return (
                  <div className="flex flex-col gap-1">
                    <TooltipLabel>Flask Uptime</TooltipLabel>
                    <span className="font-body text-xs text-primary">
                      {dateData.flaskUptime !== null ? `${Math.round(dateData.flaskUptime)}%` : "No data"}
                    </span>
                    <span className="font-body text-2xs text-dimmed">
                      {dateData.encounterCount} encounters
                    </span>
                  </div>
                );
              }

              if (colIndex === 1) {
                return (
                  <div className="flex flex-col gap-1">
                    <TooltipLabel>Food Uptime</TooltipLabel>
                    <span className="font-body text-xs text-primary">
                      {dateData.foodUptime !== null ? `${Math.round(dateData.foodUptime)}%` : "No data"}
                    </span>
                    <span className="font-body text-2xs text-dimmed">
                      {dateData.encounterCount} encounters
                    </span>
                  </div>
                );
              }

              // Consumables column — show per-boss breakdown
              return (
                <div className="flex flex-col gap-2">
                  <TooltipLabel>Consumables</TooltipLabel>
                  <span className="font-body text-2xs text-dimmed">
                    {dateData.consumableCoverage.covered}/{dateData.consumableCoverage.total} encounters covered
                  </span>
                  {Object.entries(dateData.consumablesByBoss).map(([boss, items]) => (
                    <div key={boss} className="flex flex-col gap-0.5">
                      <span className="font-body text-2xs font-bold text-primary">{boss}</span>
                      {items.length > 0 ? (
                        items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-6 font-body text-xs">
                            <span className="text-accent">
                              {item.spellName}
                              {item.isPrePot && (
                                <span className="text-warning"> (PP)</span>
                              )}
                            </span>
                            <span className="text-secondary">x{item.count}</span>
                          </div>
                        ))
                      ) : (
                        <span className="font-body text-2xs text-dimmed">None</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            }}
          />
        ) : (
          <div className="flex h-32 items-center justify-center border border-border bg-card">
            <span className="font-body text-sm text-dimmed">
              No consumable data in the last 8 weeks
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/members/[memberId]/member-details.tsx
git commit -m "feat: rewrite member details with stat cards, DPS chart, and heatmap"
```

---

### Task 6: Update Loading Skeleton

**Files:**
- Modify: `src/app/(app)/members/[memberId]/loading.tsx`

- [ ] **Step 1: Update the loading skeleton to match new layout**

Replace the content of `loading.tsx`:

```tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetailLoading() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>
      {/* Chart */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-70" />
      </div>
      {/* Heatmap */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/members/[memberId]/loading.tsx
git commit -m "feat: update member detail loading skeleton for new layout"
```

---

### Task 7: Integration Verification

- [ ] **Step 1: Start the dev server and verify**

```bash
pnpm dev
```

Navigate to a member detail page in the browser. Verify:
1. Stat cards render with correct values (Avg DPS, Raids Attended, Pre-pot Rate, Total Deaths)
2. DPS trend area chart renders with gradient fill and tooltips
3. Consumable heatmap shows dates with Flask/Food/Consumables columns
4. Heatmap tooltips show per-boss consumable breakdowns
5. Color coding works: green/orange/red for uptimes and coverage
6. Loading skeleton appears briefly on navigation
7. Empty state renders if a member has no data

- [ ] **Step 2: Test responsive layout**

Resize the browser to mobile width. Verify:
1. Stat cards collapse to 2x2 grid
2. Chart remains full width
3. Heatmap scrolls horizontally if needed

- [ ] **Step 3: Test edge cases**

Navigate to a member who:
- Has no raid data → should show "—" on all stat cards, empty states on chart and heatmap
- Has raids from only 1 date → chart shows single dot, heatmap shows 1 row
- Has many raids → data displays correctly without layout overflow

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address integration issues in member detail page"
```

Only run this if fixes were needed. Skip if everything worked in steps 1-3.
