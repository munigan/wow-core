# Raid Splitting & Duplicate Detection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split same-date combat log events into separate raids using time gaps + roster changes, and warn users about duplicate raids before import.

**Architecture:** The worker detects time-gap segments within each calendar date, then applies Jaccard roster similarity to decide which segments belong together. A new tRPC query fetches existing raids so the choose step can detect and flag likely duplicates. No schema changes needed.

**Tech Stack:** TypeScript, Web Worker, tRPC, Drizzle ORM, React

---

### Task 1: Refactor scanner to produce segments within date groups

**Files:**
- Modify: `src/lib/log-scanner.worker.ts`
- Modify: `src/lib/log-scanner.ts`

The worker currently stores one entry per calendar date in `dateMap`. Refactor to detect time gaps within each date and produce multiple segments.

**Step 1: Add `Segment` type to `log-scanner.ts`**

Add this type alongside the existing `DateGroup`:

```ts
export type Segment = {
  date: string;
  segmentIndex: number;
  firstTimestamp: string;
  lastTimestamp: string;
  players: Map<string, string>;
  npcs: Map<string, string>;
};
```

**Step 2: Add `splitDateIntoSegments()` to `log-scanner.ts`**

This function takes a date's events (sorted by time) and splits them when there's a >30 min gap:

```ts
const GAP_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export function splitDateIntoSegments(
  date: string,
  events: { timestamp: Date; sourceGuid: string; sourceName: string; destGuid: string; destName: string }[],
): Segment[]
```

- Sort events by timestamp.
- Walk through events. When `events[i].timestamp - events[i-1].timestamp > GAP_THRESHOLD_MS`, start a new segment.
- For each segment, collect players (0x0E GUIDs) and NPCs (0xF130/0xF150) into Maps.
- Return array of `Segment` objects.

**Step 3: Add `mergeSegmentsByRoster()` to `log-scanner.ts`**

After gap-splitting, check adjacent segments on the same date. If Jaccard similarity >= 0.5, merge them (same raid with a break). If < 0.5, keep separate:

```ts
export function mergeSegmentsByRoster(segments: Segment[]): Segment[]
```

- Walk adjacent pairs. If `jaccardSimilarity(a.players, b.players) >= JACCARD_THRESHOLD`, merge into one segment (union players/npcs, extend time range).
- Return merged segments.

**Step 4: Update `detectRaids()` to accept `Segment[]` instead of `DateGroup[]`**

The function signature changes from `detectRaids(dateGroups: DateGroup[])` to `detectRaids(segments: Segment[])`. Internally, sort by `firstTimestamp` (not just by date key), then apply the existing cross-segment Jaccard merging logic. The rest of the function stays the same — it already merges consecutive groups with similar rosters.

**Step 5: Update the worker to produce segments**

In `log-scanner.worker.ts`, change the `processLine` to collect raw events per date (with timestamps), then after scanning:

1. For each date in `dateMap`, call `splitDateIntoSegments()`
2. Call `mergeSegmentsByRoster()` on segments from the same date
3. Pass all segments to `detectRaids()`

Note: Storing raw events per date would use too much memory for 4M+ line files. Instead, use a chunked approach: track the current segment's `lastTimestamp` and start a new segment map entry when the gap exceeds 30 min. This is an online algorithm — no need to store individual events.

**Implementation detail for the worker:**

Replace the single `dateMap` with a structure that tracks segments:

```ts
type WorkerSegment = {
  date: string;
  segmentIndex: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
  players: Map<string, string>;
  npcs: Map<string, string>;
};

// Key: "date#segmentIndex", e.g., "2/11#0", "2/11#1"
const segmentMap = new Map<string, WorkerSegment>();
const currentSegmentByDate = new Map<string, { key: string; lastTimestamp: Date }>();
```

In `processLine`:
- Extract date and timestamp from the line.
- Look up `currentSegmentByDate.get(date)`. If the new timestamp is >30 min after `lastTimestamp`, increment segment index and create a new segment.
- Otherwise, update the existing segment's `lastTimestamp`, players, and NPCs.

After processing all lines:
- Group segments by date and call `mergeSegmentsByRoster()`.
- Pass merged segments to `detectRaids()`.

**Step 6: Verify build**

Run: `pnpm build`
Expected: No errors.

**Step 7: Commit**

```
feat: split same-date combat events into segments by time gap and roster
```

---

### Task 2: Add `raids.listByCores` tRPC query

**Files:**
- Modify: `src/lib/trpc/routers/raids.ts`

**Step 1: Add the query**

```ts
listByCores: protectedProcedure
  .input(z.object({ coreIds: z.array(z.string()) }))
  .query(async ({ input }) => {
    if (input.coreIds.length === 0) return [];
    return db
      .select({
        id: raids.id,
        coreId: raids.coreId,
        name: raids.name,
        date: raids.date,
      })
      .from(raids)
      .where(inArray(raids.coreId, input.coreIds))
      .orderBy(desc(raids.date));
  }),
```

Add `inArray` to the drizzle-orm imports.

**Step 2: Verify build**

Run: `pnpm build`

**Step 3: Commit**

```
feat: add raids.listByCores batch tRPC query
```

---

### Task 3: Add duplicate detection and UI warnings in choose step

**Files:**
- Modify: `src/components/upload-log-form.tsx`

**Step 1: Add existing raids query**

In the `UploadLogForm` component, add a tRPC query for existing raids alongside the existing `membersQuery`:

```ts
const existingRaidsQuery = trpc.raids.listByCores.useQuery(
  { coreIds: cores.map((c) => c.id) },
  { enabled: state.step === "choose" },
);
```

**Step 2: Add duplicate detection helper**

```ts
function isLikelyDuplicate(
  raid: DetectedRaid,
  coreId: string,
  existingRaids: { coreId: string; name: string; date: Date | string }[],
): { isDuplicate: boolean; existingName?: string; existingDate?: string } {
  const raidInstance = raid.raidInstance;
  if (!raidInstance) return { isDuplicate: false };

  const raidStartDate = new Date(raid.startTime);

  for (const existing of existingRaids) {
    if (existing.coreId !== coreId) continue;

    // Check if same raid instance name
    const existingName = existing.name.toLowerCase();
    if (!existingName.includes(raidInstance.toLowerCase())) continue;

    // Check if within ±1 day
    const existingDate = new Date(existing.date);
    const dayDiff = Math.abs(raidStartDate.getTime() - existingDate.getTime()) / (1000 * 60 * 60 * 24);
    if (dayDiff <= 1) {
      return {
        isDuplicate: true,
        existingName: existing.name,
        existingDate: existingDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      };
    }
  }

  return { isDuplicate: false };
}
```

**Step 3: Set initial selection state based on duplicate status**

When the worker completes and `existingRaidsQuery.data` is available, mark likely-duplicate raids as unchecked by default. This should happen in the `useEffect` that applies smart defaults (the existing `hasAppliedDefaultsRef` effect), or in a new effect that runs when `existingRaidsQuery.data` arrives.

Since the worker `done` handler sets initial `raidConfigs` with `isSelected: true`, add a second effect that runs when `existingRaidsQuery.data` arrives and unchecks duplicates:

```ts
const hasAppliedDuplicateDefaultsRef = useRef(false);

useEffect(() => {
  if (state.step !== "choose") return;
  if (hasAppliedDuplicateDefaultsRef.current) return;
  if (!existingRaidsQuery.data) return;

  hasAppliedDuplicateDefaultsRef.current = true;

  setState((prev) => {
    if (prev.step !== "choose") return prev;
    const updatedConfigs = prev.raidConfigs.map((config, i) => {
      const raid = prev.raids[i];
      if (!raid) return config;
      const { isDuplicate } = isLikelyDuplicate(raid, config.coreId, existingRaidsQuery.data);
      if (isDuplicate) return { ...config, isSelected: false };
      return config;
    });
    return { ...prev, raidConfigs: updatedConfigs };
  });
}, [state.step, existingRaidsQuery.data]);
```

Reset `hasAppliedDuplicateDefaultsRef` to `false` alongside `hasAppliedDefaultsRef` when starting a new scan.

**Step 4: Show duplicate warning in the raid row UI**

In the choose step's raid row rendering, after computing `isMismatch`, also compute duplicate status:

```tsx
const duplicateInfo = existingRaidsQuery.data
  ? isLikelyDuplicate(raid, config.coreId, existingRaidsQuery.data)
  : { isDuplicate: false };
```

Show a warning badge if duplicate:

```tsx
{duplicateInfo.isDuplicate && (
  <TooltipRoot>
    <TooltipTrigger render={<span />}>
      <span className="font-body text-2xs text-warning">
        Likely duplicate
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      <span className="font-body text-2xs text-primary">
        "{duplicateInfo.existingName}" on {duplicateInfo.existingDate} already exists in this core
      </span>
    </TooltipContent>
  </TooltipRoot>
)}
```

Place this below the member preview line or next to the mismatch warning icon.

**Step 5: Verify build**

Run: `pnpm build`

**Step 6: Commit**

```
feat: warn about likely duplicate raids in choose step
```

---

### Task 4: Manual testing — clean database and test segment splitting

**Step 1: Clean existing raid data**

Delete all existing raids and members from the test database so we start fresh:

```sql
DELETE FROM raid_members;
DELETE FROM raids;
DELETE FROM members;
```

**Step 2: Upload multi-raid log file**

Open the app, upload `example-logs/example-multiple-raids.txt`. Verify that:

- Feb 11 is split into 2+ segments (01:xx group separate from 20-23:xx group)
- Feb 12 is split similarly
- No raid has more than ~30 players (25-man + a few extras is reasonable, but not 80+)
- Raid instance detection still works (Naxxramas, VoA, etc.)

**Step 3: Screenshot results for verification**

---

### Task 5: Manual testing — member matching with multiple cores

**Step 1: Create a second user**

Sign up a new user account (e.g., "testing2@test.com").

**Step 2: Create two cores with pre-seeded members**

Using direct SQL, create two cores and insert members:

- **Core A**: Insert ~10 member names that appear in Feb 7th raid data (e.g., Alexdk, Caffeiine, Jbetao, etc.)
- **Core B**: Insert ~10 member names that appear in Feb 11th evening raid data (different set)

**Step 3: Upload the multi-raid file as the new user**

Verify that:
- The smart core assignment detects Core A as best match for Feb 7th raid
- The smart core assignment detects Core B as best match for Feb 11th evening raid
- The mismatch warning icon does NOT appear for well-matched cores
- The mismatch warning icon DOES appear if a raid is assigned to the wrong core

**Step 4: Test duplicate detection**

Upload the same file again. Verify:
- Previously imported raids show "Likely duplicate" badge
- They are unchecked by default
- User can still check and re-import if desired

---

### Task 6: Build verification and commit

**Step 1: Run full build**

```
pnpm build
```

**Step 2: Fix any issues found during testing**

**Step 3: Final commit with all fixes**

```
fix: address issues found during manual testing
```
