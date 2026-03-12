# Multi-Raid Upload Design

## Problem

A single WoW combat log file can contain events from multiple raid sessions spanning different dates. The current upload flow assumes one file = one raid. We need to detect multiple raids within a file, let the user select which to import, and assign them to a specific core.

## Decisions

- **Raid detection**: client-side pre-scan in a Web Worker. Group events by calendar date, merge adjacent dates sharing >50% player roster overlap (handles midnight-crossing raids).
- **Selection UX**: checklist with select-all, showing date range + member count per raid. Core selector on the same screen.
- **Member preview**: count only ("34 members"), not expandable lists.
- **Parsing split**: client does lightweight scan (dates + player GUIDs). Server receives full file + user selections, does deep parse + DB writes. Server will eventually need the raw file for deeper analysis (spells, damage, etc.).
- **Import endpoint**: keep `POST /api/upload` (not tRPC) since the server needs the raw binary file for future deep parsing.
- **Core selection**: moved into the upload flow. Upload button no longer requires an active core. User picks the target core during the choose step.
- **Mismatch validation**: if <30% of detected players match the selected core's existing members (and core has >0 members), show a warning with override option.

## Flow

```
select -> scanning -> choose -> uploading -> done
                             -> error
```

### State: select

Drag/drop zone or click-to-browse for `.txt` files. Same as current UI.

### State: scanning

Web Worker streams the file and extracts dates + player GUIDs. Posts progress updates (`bytesRead / totalBytes`) for a progress bar. Runs the merge algorithm on completion. Result: array of `DetectedRaid`.

### State: choose

Single screen with:

1. **Core selector** — dropdown of user's cores, defaults to active core (if any). Changing the core triggers the mismatch check.
2. **Mismatch warning** — shown when the union of all detected player names has <30% overlap with the selected core's existing members AND the core has >0 existing members. Text: "Only X of Y members match [Core Name]. This log may belong to a different core." User can dismiss/continue.
3. **Raid checklist** — select-all checkbox (checked by default) + scrollable list of detected raids. Each row: checkbox, auto-generated name (`Raid M/D`), date range (e.g. "Feb 7, 18:29 — 21:36"), member count.
4. **Import Selected** button — disabled if no raids checked or no core selected.

### State: uploading

XHR upload of full file with progress bar. Headers carry metadata:
- `X-Core-Id`: selected core UUID
- `X-Selected-Raids`: JSON array of selected raid date groups (e.g. `[["2/7"],["2/8","2/9"],["2/14"]]`)
- `Content-Type: application/octet-stream`

### State: done

Summary list of imported raids (name, date, member counts). Single "Done" button closes dialog and calls `router.refresh()`.

### State: error

Error message + "Try Again" button (resets to `select`).

## Raid Detection Algorithm

1. Stream file line by line.
2. For each line, extract the date prefix (`M/D`) and any `0x0E` player GUIDs + names.
3. Build a map: `date -> { firstTimestamp, lastTimestamp, players: Set<guid> }`.
4. After streaming, iterate dates in chronological order. For each pair of adjacent dates, compute Jaccard similarity of their player sets: `|A ∩ B| / |A ∪ B|`. If >0.5, merge them into one raid group.
5. Produce an array of `DetectedRaid`:

```ts
type DetectedRaid = {
  dates: string[]        // e.g. ["2/11", "2/12"]
  startTime: Date
  endTime: Date
  playerCount: number
  playerNames: string[]  // for mismatch check
}
```

## Web Worker

File: `src/lib/log-scanner.worker.ts`

Messages:
- **In**: `{ file: File }` — starts scanning
- **Out**: `{ type: 'progress', bytesRead: number, totalBytes: number }`
- **Out**: `{ type: 'done', raids: DetectedRaid[] }`
- **Out**: `{ type: 'error', message: string }`

The worker uses `FileReader` + manual chunked reading (or `file.stream()` where available) to process the file in chunks without loading it entirely into memory.

## Server Changes

`POST /api/upload` modifications:

1. Read `X-Core-Id` header instead of `session.activeOrganizationId`.
2. Validate user is a member of the specified core.
3. Read `X-Selected-Raids` header (JSON array of date group arrays).
4. Stream-parse the file, assigning each event to a date group.
5. Run the same merge algorithm server-side to match detected raids.
6. Only create DB records (raids, members, raidMembers) for selected raid groups.
7. Return `{ raids: [{ raidId, raidName, raidDate, totalMembers, newMembers }] }`.

The existing batch-optimized DB writes (4 queries per raid) apply per selected raid.

## Mismatch Validation

When the user picks a core in the `choose` step:

1. Fetch the core's existing member names via `members.list` tRPC query (already exists).
2. Compute overlap: `matchCount = intersection(detectedPlayerNames, coreMemberNames).size`.
3. If `coreMemberNames.length > 0` AND `matchCount / detectedPlayerNames.length < 0.3`, show warning.
4. Warning is dismissible — user clicks "Continue Anyway" or selects a different core.

## Components Modified

- `upload-log-dialog.tsx` — remove core dependency, dialog can open without active core
- `upload-log-form.tsx` — rewrite with 5-state machine, Web Worker integration, core selector, raid checklist
- `sidebar.tsx` — Upload Log button always visible (not gated on active core)

## New Files

- `src/lib/log-scanner.worker.ts` — Web Worker for client-side file scanning
- `src/lib/log-scanner.ts` — shared types (`DetectedRaid`, worker message types)
