# Parser Library Migration Design

Replace the hand-rolled parsing/scanning system with `@munigan/wow-combatlog-parser`.

## Context

The project currently has four hand-rolled files for combat log processing:

- `src/lib/log-scanner.ts` — scanner types, segment merging, raid detection algorithms
- `src/lib/log-scanner.worker.ts` — Web Worker streaming file scan with instance-aware splitting
- `src/lib/log-parser.ts` — server-side stream parser (`parseLogStream`, `parseLogStreamMulti`)
- `src/lib/wow-raids.ts` — boss-to-raid mapping (89 bosses)

The new library (`@munigan/wow-combatlog-parser`) replaces all of this with a tested, feature-rich API that also provides encounter tracking, combat stats, consumable usage, buff uptime, death recaps, class/spec detection, and difficulty detection.

## Decisions

- **UI stays the same** — same 5-step state machine, same data shown during scanning. Richer data from the library (encounters, combat stats, etc.) will be surfaced in future iterations.
- **Web Worker preserved** — `scanLog()` runs inside a Worker to avoid UI jank on large files.
- **XHR upload preserved** — keeps native upload progress tracking and cancel support.
- **Server streams, no DB** — the upload endpoint uses `parseLogStream()` with streaming callbacks but does not persist to the database yet. Returns parsed results as JSON.
- **Old code deleted** — clean break, no backup files.

## File Changes

### Delete (4 files)

| File | Reason |
|------|--------|
| `src/lib/log-scanner.ts` | Replaced by library's `scanLog()` + types |
| `src/lib/log-scanner.worker.ts` | Replaced by new `scan.worker.ts` |
| `src/lib/log-parser.ts` | Replaced by library's `parseLogStream()` |
| `src/lib/wow-raids.ts` | Replaced by library's built-in boss data |

### Create (1 file)

| File | Purpose |
|------|---------|
| `src/lib/scan.worker.ts` | Thin Worker wrapping `scanLog()` (~25 lines) |

### Modify (2 files)

| File | Changes |
|------|---------|
| `src/components/upload-log-form.tsx` | Adapt types from library, update field name mappings |
| `src/app/api/upload/route.ts` | Replace parser, remove DB writes, return parsed JSON |

### Dependency (1)

Add `@munigan/wow-combatlog-parser` to `package.json`.

## Web Worker Design

**File:** `src/lib/scan.worker.ts`

Message protocol:

- **In:** `{ type: "scan", file: File }`
- **Out (progress):** `{ type: "progress", bytesRead: number }`
- **Out (done):** `{ type: "done", result: ScanResult }`
- **Out (error):** `{ type: "error", message: string }`

The Worker imports `scanLog` from the library, calls `file.stream()`, and passes it through. The `onProgress` callback posts progress messages. On completion, posts the full `ScanResult`.

## Upload Form Adaptation

**File:** `src/components/upload-log-form.tsx`

Type mapping from library `DetectedRaid` to current UI:

| Library field | Current field | Notes |
|---------------|---------------|-------|
| `raidInstance` | `instanceName` | Direct rename |
| `dates` (string[]) | `date` (string) | Use `dates[0]` for display |
| `startTime` (ISO) | `startTime` | Same concept, ISO-8601 string |
| `endTime` (ISO) | `endTime` | Same concept, ISO-8601 string |
| `timeRanges` | `timeRanges` | Same structure |
| `playerCount` | `playerCount` | Same |
| `players` (PlayerInfo[]) | `players` (Set\<string\>) | Extract `.name` for display |

The 5-step state machine, XHR upload, core assignment logic, duplicate detection, drag-and-drop, cancel, and all styling remain unchanged.

Upload payload (`X-Selected-Raids` header) maps `DetectedRaid` fields to `RaidSelection` shape — `dates`, `startTime`, `endTime`, `timeRanges` align directly.

## Server Endpoint Design

**File:** `src/app/api/upload/route.ts`

Flow:

1. Auth check (unchanged)
2. Parse `X-Selected-Raids` header into `RaidSelection[]`
3. Stream `request.body` through `parseLogStream(body, selections, callbacks)`
4. Collect encounter and summary data via callbacks
5. Return parsed results as JSON (no database writes)

Response shape per raid:

```ts
{
  raidInstance: string
  raidDate: string
  players: { name: string, class: string | null, spec: string | null }[]
  encounters: { bossName: string, result: "kill" | "wipe", duration: number }[]
  totalMembers: number
}
```

Error handling:

- `FileTooLargeError` → 413
- Other errors → 500

The backward-compat single-raid flow (no header) is removed.
