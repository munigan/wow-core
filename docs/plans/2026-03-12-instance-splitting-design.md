# Instance-Aware Raid Splitting — Design

## Problem

When the same group of players alternates between different raid instances (e.g., Obsidian Sanctum → Eye of Eternity → OS → EoE) within a single session, the current system produces **one** combined raid because:

1. Time gaps between encounters are <30 min (often 8–26 min) — won't trigger segment splits
2. Roster is identical throughout — Jaccard similarity = 1.0, so merge/grouping logic combines everything

**Real example**: `WoWCombatLog.txt` contains a 2.5-hour session (19:31–22:01) where the same 25-player group alternates OS and EoE. Contains 4 Sartharion kills and 3 Malygos kills, all lumped into one "Obsidian Sanctum" raid.

## Approach: Encounter-Level Splitting in the Worker

Split segments in the worker whenever a boss NPC from a **different** raid instance appears. The `BOSS_TO_RAID` static map (already in `wow-raids.ts`) identifies which instance a boss belongs to.

## Changes

### 1. Segment type (`log-scanner.ts`)

Add `raidInstance: string | null` to the `Segment` type. Null when no boss has been seen yet.

### 2. Worker scanning (`log-scanner.worker.ts`)

In `processLine()`, after extracting NPC GUIDs, check if any NPC is a known boss:

- Look up NPC name in `BOSS_TO_RAID`
- If found and `currentSegment.raidInstance` is null → tag the segment
- If found and instance **differs** from current → end the segment, start a new one tagged with the new instance
- If NPC is not in `BOSS_TO_RAID` (trash, pets, etc.) → no effect on splitting

Import `BOSS_TO_RAID` from `wow-raids.ts` into the worker (static Map, ESM import).

### 3. Merge logic (`mergeSegmentsByRoster()`)

Add guard: never merge two segments when **both** have non-null `raidInstance` values that differ. This prevents re-combining what was just split.

### 4. Grouping logic (`detectRaids()`)

Same guard: don't group segments from different instances into the same raid group, regardless of roster similarity.

### 5. `buildDetectedRaid()`

No changes needed — already calls `identifyRaidInstance()` on the NPC list, which will now correctly return a single instance per raid.

## Edge Cases

- **Trash between instances**: No boss NPC → no instance change. Trash events stay in the current segment.
- **Wipes on same boss**: Same instance, no split. Multiple Sartharion attempts stay in one segment.
- **Unknown NPCs**: Ignored for splitting (not in `BOSS_TO_RAID`).
- **Null raidInstance**: Segments without any boss NPCs follow existing merge/grouping rules (roster similarity only).

## Expected Result

The 2.5-hour OS/EoE session should split into ~7 segments → 2 detected raids:

| Raid                   | Kills | Time Range     |
|------------------------|-------|----------------|
| The Obsidian Sanctum   | 4     | ~19:31–22:01   |
| The Eye of Eternity    | 3     | ~20:00–21:43   |

(Time ranges will be non-contiguous since the encounters interleave.)

## Unchanged

- `DetectedRaid` type
- Upload flow (`startTime`/`endTime` time ranges)
- Server parser (`parseLogStreamMulti`)
- Upload UI
- Database schema
