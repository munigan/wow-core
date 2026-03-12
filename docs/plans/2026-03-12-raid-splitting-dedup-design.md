# Raid Splitting, Duplicate Detection & Member Matching

## Problem

1. **Same-date raids lumped together** — A single calendar date can contain multiple distinct raids (e.g., a late-night pug at 01:00 and a guild run at 20:00). Current scanner groups by date only, producing "raids" with 80+ players that are actually 2-3 separate groups.

2. **No duplicate upload prevention** — The `raids` table has no dedup mechanism. Uploading the same file twice creates duplicate raid records.

3. **Member matching untested** — The smart core assignment (Jaccard overlap between detected players and existing core members) hasn't been tested with real multi-core scenarios.

## Solution

### 1. Same-Date Segment Splitting (Worker)

Within each calendar date, split events into segments:

**Step A — Time-gap splitting:** Track the timestamp of each combat event. When there's a gap of >30 minutes between consecutive events on the same date, start a new segment. This catches the common case of distinct sessions (01:00 group vs 20:00 group).

**Step B — Roster-change splitting:** For each pair of adjacent segments on the same date, compute Jaccard similarity on player GUIDs. If similarity < 0.5, they stay separate (different raid groups). If >= 0.5, merge them (same group with a break, e.g., bio break mid-raid).

**Output:** Multiple `DateGroup`-like objects per calendar date, each with its own players, NPCs, and time range. These feed into the existing `detectRaids()` cross-date Jaccard merging, which may further combine segments from adjacent dates if rosters overlap (midnight-spanning raids).

**Key data structure change:** The worker produces an array of `Segment` objects instead of one `DateGroup` per date. Each segment has `{ date, segmentIndex, firstTimestamp, lastTimestamp, players, npcs }`. The `detectRaids()` function receives these segments instead of date groups.

### 2. Duplicate Warning (Choose Step)

**New tRPC query:** `raids.listByCores({ coreIds })` — Returns existing raids for the relevant cores, with `{ id, name, date, coreId }`.

**Match detection:** For each detected raid in the choose step, check if an existing raid in the assigned core has:
- Date within ±1 day tolerance
- Same raid instance name (case-insensitive)

**UI treatment:**
- Show an orange "Likely duplicate" text/badge next to matching raid rows
- Tooltip explaining: "A raid named 'Naxxramas' on February 7th already exists in this core"
- Likely-duplicate raids are **unchecked by default** but the user can re-check them
- Reuses the existing `AlertTriangle` icon pattern already used for member mismatch warnings

### 3. Member Matching Testing (Manual)

After implementing the above:
1. Create a new user account
2. Create two cores with manually-inserted members matching subsets of the log file
3. Upload the multi-raid file and verify smart core assignment picks the right core

## Files Changed

### Worker & Scanner
- `src/lib/log-scanner.worker.ts` — Split date groups into segments using time gaps + roster Jaccard
- `src/lib/log-scanner.ts` — Accept segments in `detectRaids()`, add segment types

### tRPC
- `src/lib/trpc/routers/raids.ts` — Add `listByCores` query

### Upload Form
- `src/components/upload-log-form.tsx` — Query existing raids, detect duplicates, uncheck by default, show warning badge

### Server Route
- `src/app/api/upload/route.ts` — No changes needed (already handles per-raid core IDs)
