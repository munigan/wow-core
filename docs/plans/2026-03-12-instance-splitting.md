# Instance-Aware Raid Splitting — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split raids by instance when the same roster alternates between different raid instances (e.g., OS → EoE → OS) without 30-min gaps.

**Architecture:** Add `raidInstance` field to `Segment`. Worker tracks boss NPCs via `BOSS_TO_RAID` map during scanning — when a boss from a different instance appears, the current segment is split. Merge and grouping logic gain a guard to never combine segments from different instances.

**Tech Stack:** TypeScript, Web Workers, static boss-to-raid map

---

### Task 1: Export `BOSS_TO_RAID` and add `raidInstance` to `Segment`

**Files:**
- Modify: `src/lib/wow-raids.ts:1` (export the map)
- Modify: `src/lib/log-scanner.ts:41-48` (add field to Segment)
- Modify: `src/lib/log-scanner.worker.ts:14-21` (add field to WorkerSegment)

**Step 1: Export `BOSS_TO_RAID` in `wow-raids.ts`**

Change line 1 from:
```ts
const BOSS_TO_RAID: ReadonlyMap<string, string> = new Map([
```
to:
```ts
export const BOSS_TO_RAID: ReadonlyMap<string, string> = new Map([
```

**Step 2: Add `raidInstance` to `Segment` type in `log-scanner.ts`**

Add `raidInstance: string | null;` after the `npcs` field in the `Segment` type (line 47):

```ts
export type Segment = {
	date: string;
	segmentIndex: number;
	firstTimestamp: string;
	lastTimestamp: string;
	players: Map<string, string>;
	npcs: Map<string, string>;
	raidInstance: string | null;
};
```

**Step 3: Add `raidInstance` to `WorkerSegment` in `log-scanner.worker.ts`**

Add `raidInstance: string | null;` after `npcs` in the `WorkerSegment` type:

```ts
type WorkerSegment = {
	date: string;
	segmentIndex: number;
	firstTimestamp: Date;
	lastTimestamp: Date;
	players: Map<string, string>;
	npcs: Map<string, string>;
	raidInstance: string | null;
};
```

**Step 4: Update segment creation sites in `log-scanner.worker.ts`**

Every place that creates a `WorkerSegment` object needs `raidInstance: null`. There are two: the first-event creation (~line 138) and the gap-triggered creation (~line 153).

**Step 5: Update conversion from `WorkerSegment` to `Segment` (~line 83)**

Add `raidInstance: ws.raidInstance` to the mapping:

```ts
const converted: Segment[] = dateSegments.map((ws) => ({
	date: ws.date,
	segmentIndex: ws.segmentIndex,
	firstTimestamp: ws.firstTimestamp.toISOString(),
	lastTimestamp: ws.lastTimestamp.toISOString(),
	players: ws.players,
	npcs: ws.npcs,
	raidInstance: ws.raidInstance,
}));
```

**Step 6: Run build**

Run: `pnpm next build`
Expected: Exit 0 (no type errors)

**Step 7: Commit**

```bash
git add src/lib/wow-raids.ts src/lib/log-scanner.ts src/lib/log-scanner.worker.ts
git commit -m "refactor: add raidInstance to Segment type and export BOSS_TO_RAID"
```

---

### Task 2: Instance-aware splitting in the worker

**Files:**
- Modify: `src/lib/log-scanner.worker.ts` (import BOSS_TO_RAID, split on instance change)

**Step 1: Import `BOSS_TO_RAID` in the worker**

Add to the imports at the top of `log-scanner.worker.ts`:

```ts
import { BOSS_TO_RAID } from "./wow-raids";
```

**Step 2: Add instance-aware splitting logic in `processLine()`**

After the NPC extraction block (after line 196), add boss-instance detection. The logic:

1. For each NPC seen (source and dest), check `BOSS_TO_RAID.get(npcName)`
2. If a boss is found and `currentSegment.raidInstance` is null → tag the segment
3. If a boss is found and instance **differs** → create a new segment tagged with the new instance

The tricky part: the `currentSegment` variable is local to the function scope within the date-segments lookup. The split must create a new segment in `dateSegments` and re-assign. Since `processLine` works with the `segmentsByDate` map by reference, push the new segment to the array.

Here's the code to add after the NPC collection block (after line 196):

```ts
// Instance-aware splitting: check if any NPC is a boss from a known raid instance
const sourceInstance = sourceName ? BOSS_TO_RAID.get(sourceName) : undefined;
const destInstance = destName && destName !== "nil" ? BOSS_TO_RAID.get(destName) : undefined;
const bossInstance = sourceInstance ?? destInstance;

if (bossInstance) {
	if (currentSegment.raidInstance === null) {
		currentSegment.raidInstance = bossInstance;
	} else if (bossInstance !== currentSegment.raidInstance) {
		// Instance changed — split the segment
		const newSegment: WorkerSegment = {
			date: dateStr,
			segmentIndex: dateSegments.length,
			firstTimestamp: timestamp,
			lastTimestamp: timestamp,
			players: new Map(currentSegment.players),
			npcs: new Map(),
			raidInstance: bossInstance,
		};
		// Add the NPC to the new segment instead
		if (sourceInstance && sourceGuid && sourceName) {
			newSegment.npcs.set(sourceGuid, sourceName);
		}
		if (destInstance && destGuid && destName && destName !== "nil") {
			newSegment.npcs.set(destGuid, destName);
		}
		dateSegments.push(newSegment);
	}
}
```

Note: When we split, we copy the current player roster into the new segment (since it's the same group). We also need the NPC that triggered the split to be in the new segment's NPC list, not the old one.

**Important subtlety**: The NPC has already been added to `currentSegment.npcs` earlier in the function. We need to restructure so that NPCs from the new instance go into the new segment. The cleanest approach: move the NPC extraction to happen **after** the instance check, or remove the triggering NPC from the old segment. 

Cleaner approach — restructure `processLine()` to:
1. Parse the line and extract GUIDs/names
2. Add players to current segment (always — same roster)
3. Check for boss instance change → split if needed
4. Add NPCs to the correct segment (current or new)

**Step 3: Restructure NPC handling in `processLine()`**

Refactor the NPC collection to happen after the instance split check. The full refactored flow for NPC handling:

```ts
// 1. Identify if source/dest are NPCs
const isSourceNpc = sourceGuid?.startsWith("0xF130") || sourceGuid?.startsWith("0xF150");
const isDestNpc = destGuid?.startsWith("0xF130") || destGuid?.startsWith("0xF150");

// 2. Check for instance change (before adding NPCs)
const sourceInstance = isSourceNpc && sourceName && sourceName !== "nil"
	? BOSS_TO_RAID.get(sourceName) : undefined;
const destInstance = isDestNpc && destName && destName !== "nil"
	? BOSS_TO_RAID.get(destName) : undefined;
const bossInstance = sourceInstance ?? destInstance;

if (bossInstance) {
	if (currentSegment.raidInstance === null) {
		currentSegment.raidInstance = bossInstance;
	} else if (bossInstance !== currentSegment.raidInstance) {
		// Instance changed — create new segment
		currentSegment = {
			date: dateStr,
			segmentIndex: dateSegments.length,
			firstTimestamp: timestamp,
			lastTimestamp: timestamp,
			players: new Map(currentSegment.players),
			npcs: new Map(),
			raidInstance: bossInstance,
		};
		dateSegments.push(currentSegment);
	}
}

// 3. Add NPCs to the (possibly new) current segment
if (isSourceNpc && sourceName && sourceName !== "nil") {
	currentSegment.npcs.set(sourceGuid, sourceName);
}
if (isDestNpc && destName && destName !== "nil") {
	currentSegment.npcs.set(destGuid, destName);
}
```

This replaces the existing NPC collection block (lines 186–196).

**Step 4: Run build**

Run: `pnpm next build`
Expected: Exit 0

**Step 5: Commit**

```bash
git add src/lib/log-scanner.worker.ts
git commit -m "feat: split segments when boss NPC from different instance appears"
```

---

### Task 3: Prevent merging/grouping across instances

**Files:**
- Modify: `src/lib/log-scanner.ts:111-141` (`mergeSegmentsByRoster`)
- Modify: `src/lib/log-scanner.ts:149-176` (`detectRaids`)

**Step 1: Guard `mergeSegmentsByRoster()` against cross-instance merges**

In the merge condition (line 120–121), add: if both segments have non-null `raidInstance` and they differ, don't merge. Update the `if` condition:

```ts
if (
	last.date === curr.date &&
	!(last.raidInstance && curr.raidInstance && last.raidInstance !== curr.raidInstance) &&
	jaccardSimilarity(last.players, curr.players) >= JACCARD_THRESHOLD
) {
```

Also, when merging, propagate `raidInstance` — if the current segment has a non-null instance and last doesn't, adopt it:

```ts
if (!last.raidInstance && curr.raidInstance) {
	last.raidInstance = curr.raidInstance;
}
```

**Step 2: Guard `detectRaids()` against cross-instance grouping**

In the grouping loop (line 167–170), add the same guard before checking similarity:

```ts
const crossInstance =
	lastSegment.raidInstance &&
	sorted[i].raidInstance &&
	lastSegment.raidInstance !== sorted[i].raidInstance;

if (!crossInstance && similarity > JACCARD_THRESHOLD) {
	currentGroup.push(sorted[i]);
} else {
	raidGroups.push([sorted[i]]);
}
```

**Step 3: Run build**

Run: `pnpm next build`
Expected: Exit 0

**Step 4: Commit**

```bash
git add src/lib/log-scanner.ts
git commit -m "feat: prevent merging and grouping segments from different raid instances"
```

---

### Task 4: Manual verification with test log file

**Files:**
- None (manual testing)

**Step 1: Start dev server**

Run: `pnpm dev`

**Step 2: Upload `WoWCombatLog.txt`**

1. Open the app in browser
2. Open the Upload Log dialog
3. Select `example-logs/WoWCombatLog.txt`
4. Verify the scan produces separate OS and EoE raids instead of a single combined raid

**Expected**: The alternating OS/EoE session on 3/5 and 3/10 should now show as separate raids — one "The Obsidian Sanctum" and one "The Eye of Eternity" (per date that has both).

**Step 3: Take screenshot for verification**

Save screenshot to `test-screenshots/instance-splitting-working.png`

**Step 4: Also verify existing behavior hasn't regressed**

Upload `example-logs/example-multiple-raids.txt` and confirm the 13 raids are still correctly detected. The Naxx, VoA, etc. raids that don't have instance alternation should be unaffected.

---

### Task 5: Build and lint verification

**Step 1: Run build**

Run: `pnpm next build`
Expected: Exit 0

**Step 2: Run lint**

Run: `pnpm biome check src/`
Expected: Clean (no errors)

**Step 3: Commit any fixes if needed**

---
