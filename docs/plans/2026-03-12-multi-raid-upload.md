# Multi-Raid Upload Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the upload flow so a single combat log file with multiple raids is detected client-side, the user picks a core and selects which raids to import, and only selected raids are written to the DB.

**Architecture:** Client-side Web Worker pre-scans the file to detect raid boundaries (date grouping + roster overlap merge). A "choose" step shows a core selector and raid checklist. On confirm, the full file + selections are uploaded to the server for deep parse and DB writes.

**Tech Stack:** Next.js 16, Web Workers (Turbopack), Drizzle ORM, better-auth, Base UI, Tailwind CSS v4

**Design doc:** `docs/plans/2026-03-12-multi-raid-upload-design.md`

---

### Task 1: Shared types and raid detection algorithm

**Files:**
- Create: `src/lib/log-scanner.ts`

Create the shared types and the pure detection algorithm (no worker, no DOM — pure functions that can be tested and reused).

**Types:**

```ts
export type DetectedRaid = {
  dates: string[];       // ["2/11", "2/12"]
  startTime: string;     // ISO string (serializable for worker postMessage)
  endTime: string;       // ISO string
  playerCount: number;
  playerNames: string[];
};

export type ScanProgress = {
  type: "progress";
  bytesRead: number;
  totalBytes: number;
};

export type ScanDone = {
  type: "done";
  raids: DetectedRaid[];
};

export type ScanError = {
  type: "error";
  message: string;
};

export type ScanMessage = ScanProgress | ScanDone | ScanError;
```

**Detection algorithm** — `detectRaids(dateMap: Map<string, DateGroup>): DetectedRaid[]`:

1. Sort date keys chronologically (parse `M/D` into comparable values).
2. Initialize raid groups: first date is its own group.
3. For each subsequent date, compute Jaccard similarity with the last date in the current group. If >0.5, merge into current group. Otherwise, start a new group.
4. For each group, produce a `DetectedRaid` with the union of all player names, earliest start time, latest end time.

Also export a helper `parseDateKey(dateStr: string): Date` that parses `M/D` into a Date using the current year (same logic as existing `extractDate` in `log-parser.ts`).

**Commit:** `feat: add log scanner types and raid detection algorithm`

---

### Task 2: Web Worker for client-side file scanning

**Files:**
- Create: `src/lib/log-scanner.worker.ts`

The worker receives a `File` via `postMessage`, streams it using `file.stream()`, and:

1. Pipes through `TextDecoderStream`, reads line by line (same buffer approach as `log-parser.ts`).
2. For each line: extracts the date prefix (`M/D`) and any `0x0E` player GUIDs + names. Builds a `Map<string, { firstTimestamp: string, lastTimestamp: string, players: Map<guid, name> }>`.
3. Posts `ScanProgress` messages periodically (every ~5MB of data read) with `bytesRead` and `totalBytes`.
4. After streaming, calls `detectRaids()` from `log-scanner.ts` and posts `ScanDone`.
5. On error, posts `ScanError`.

**Worker entry point:**

```ts
self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  try {
    const { file } = e.data;
    // ... stream and parse ...
    self.postMessage({ type: "done", raids } satisfies ScanDone);
  } catch (err) {
    self.postMessage({ type: "error", message: String(err) } satisfies ScanError);
  }
};
```

**Note on Turbopack:** Next.js 16 with Turbopack supports `new Worker(new URL('./path.worker.ts', import.meta.url))` for bundling workers. No special config needed.

**Commit:** `feat: add Web Worker for client-side log file scanning`

---

### Task 3: Checkbox UI component

**Files:**
- Create: `src/components/ui/checkbox.tsx`

Simple checkbox using Base UI's Checkbox primitive (`@base-ui/react/checkbox`). Follows existing component patterns (named exports, `className` support via tailwind-merge).

Exports: `CheckboxRoot`, `CheckboxIndicator`.

Visual style: dark theme, accent border when checked, small check icon inside. Used for the raid selection checklist and select-all toggle.

**Commit:** `feat: add Checkbox UI component`

---

### Task 4: Add `members.listByCore` tRPC query

**Files:**
- Modify: `src/lib/trpc/routers/members.ts`

Add a new procedure `listByCore` that accepts a `coreId` input. This is needed because the mismatch check queries members for a core that may not be the user's active core. The procedure should validate the user is a member of the requested core (via better-auth's organization membership check).

```ts
listByCore: protectedProcedure
  .input(z.object({ coreId: z.string() }))
  .query(async ({ input }) => {
    return db
      .select({ name: members.name })
      .from(members)
      .where(eq(members.coreId, input.coreId));
  }),
```

**Note:** We skip the org membership validation for now — the user already sees only their own cores in the dropdown. We can add validation later if needed.

**Commit:** `feat: add members.listByCore tRPC query for mismatch validation`

---

### Task 5: Rewrite `UploadLogDialog` to pass cores

**Files:**
- Modify: `src/components/upload-log-dialog.tsx`
- Modify: `src/components/sidebar.tsx`

The dialog needs to receive the cores list and active core ID so it can render the core selector in the choose step.

**`sidebar.tsx` change:** Pass `cores` and `activeCoreId` props to `<UploadLogDialog>`.

**`upload-log-dialog.tsx` change:** Accept `cores` and `activeCoreId` props, forward them to `<UploadLogForm>`.

```tsx
type UploadLogDialogProps = {
  cores: { id: string; name: string }[];
  activeCoreId: string | null;
};

export function UploadLogDialog({ cores, activeCoreId }: UploadLogDialogProps) {
  // ... same dialog structure, pass cores/activeCoreId to UploadLogForm
}
```

**Commit:** `refactor: pass cores data through upload dialog to form`

---

### Task 6: Rewrite `UploadLogForm` with multi-step flow

**Files:**
- Modify: `src/components/upload-log-form.tsx`

This is the biggest task. Rewrite the form with the 5-state machine:

**State machine:**

```ts
type UploadState =
  | { step: "select" }
  | { step: "scanning"; progress: number }
  | { step: "choose"; raids: DetectedRaid[]; selectedCoreId: string | null; selectedRaidIndices: Set<number>; isMismatchWarning: boolean }
  | { step: "uploading"; fileName: string; fileSize: number; progress: number }
  | { step: "error"; message: string }
  | { step: "done"; results: UploadResult[] };
```

**Step: select** — Same drag/drop zone as current.

**Step: scanning** — Instantiate Web Worker via `new Worker(new URL('../lib/log-scanner.worker.ts', import.meta.url))`. Pass the file. Listen for progress and done messages. Show progress bar with "Scanning file..." label.

**Step: choose** — Render:
1. Core selector dropdown (use existing `SelectRoot`/`SelectTrigger`/`SelectPopup`/`SelectItem` components). Default to `activeCoreId` prop.
2. When core changes, fetch that core's members via `trpc.members.listByCore.useQuery({ coreId })` and compute mismatch. Show warning `Alert` if overlap <30% and core has members.
3. Select-all checkbox + raid list with individual checkboxes. Each row: checkbox, `Raid M/D`, date range formatted, `N members`.
4. "Import Selected" button, disabled if no core or no raids selected.

**Step: uploading** — XHR upload with `X-Core-Id` and `X-Selected-Raids` headers. Progress bar.

**Step: done** — List of imported raids (map over results array). Single "Done" button.

**Step: error** — Alert + "Try Again" resets to `select`.

**Commit:** `feat: rewrite upload form with multi-step raid selection flow`

---

### Task 7: Update server `POST /api/upload` for multi-raid

**Files:**
- Modify: `src/app/api/upload/route.ts`
- Modify: `src/lib/log-parser.ts`

**`log-parser.ts` changes:**

Replace `parseLogStream` with a new `parseLogStreamMulti` that:
1. Accepts a `ReadableStream` and a `selectedDateGroups: string[][]` parameter.
2. Streams the file, grouping events by date.
3. Runs the same merge algorithm to form raid groups.
4. Filters to only the groups matching `selectedDateGroups`.
5. Returns `ParseResultMulti`:

```ts
type ParseResultMulti = {
  raids: {
    raidDate: Date;
    raidName: string;
    players: ParsedPlayer[];
  }[];
};
```

Keep the old `parseLogStream` for backward compatibility (or remove it if nothing else uses it).

**`route.ts` changes:**

1. Read `X-Core-Id` header. Validate user is a member of that core via `auth.api.listOrganizations()` check.
2. Read `X-Selected-Raids` header (JSON `string[][]`).
3. Call `parseLogStreamMulti(body, selectedDateGroups)`.
4. For each raid in results, run the existing batch-optimized DB writes (insert raid, batch upsert members, select member IDs, batch insert raidMembers) using the core ID from the header.
5. Return `{ raids: [{ raidId, raidName, raidDate, totalMembers, newMembers }] }`.

**Commit:** `feat: update upload route and parser for multi-raid support`

---

### Task 8: Build verification and E2E testing

**Steps:**

1. Run `pnpm next build` — must exit 0.
2. Run `pnpm biome check src/` — must report no errors.
3. E2E test via Playwright:
   - Navigate to app, click Upload Log.
   - Select `example-logs/example-multiple-raids.txt`.
   - Verify scanning step shows progress.
   - Verify choose step shows multiple detected raids with correct date ranges and player counts.
   - Verify core selector defaults to active core.
   - Uncheck one raid, click Import Selected.
   - Verify uploading step shows progress.
   - Verify done step shows results for selected raids only.
   - Query DB to verify correct raid/member/raidMember records.
4. Test single-raid file (`WoWCombatLog3.txt`) still works — should show 1 detected raid in choose step.

**Commit:** `docs: update AGENTS.md with multi-raid upload documentation`

---

### Task summary

| # | Description | Estimated size |
|---|-------------|----------------|
| 1 | Shared types + detection algorithm | Small |
| 2 | Web Worker for file scanning | Medium |
| 3 | Checkbox UI component | Small |
| 4 | `members.listByCore` tRPC query | Small |
| 5 | Dialog + sidebar prop threading | Small |
| 6 | Rewrite `UploadLogForm` (biggest task) | Large |
| 7 | Server route + parser multi-raid | Medium |
| 8 | Build verification + E2E | Medium |
