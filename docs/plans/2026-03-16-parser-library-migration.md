# Parser Library Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace hand-rolled combat log parsing/scanning with `@munigan/wow-combatlog-parser` library.

**Architecture:** Two-pass system stays the same — client-side `scanLog()` in a Web Worker detects raids, server-side `parseLog()` extracts full data. The library handles all parsing internally via streaming pipelines. No database writes on the server for now.

**Tech Stack:** `@munigan/wow-combatlog-parser`, Next.js 16 App Router, Web Workers, XHR upload

---

### Task 1: Install the library

**Files:**
- Modify: `package.json`

**Step 1: Add the dependency**

Run: `pnpm add @munigan/wow-combatlog-parser`

**Step 2: Verify installation**

Run: `pnpm ls @munigan/wow-combatlog-parser`
Expected: Shows the installed version

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @munigan/wow-combatlog-parser dependency"
```

---

### Task 2: Create the new Web Worker

**Files:**
- Create: `src/lib/scan.worker.ts`

**Step 1: Write the Worker**

```ts
import { scanLog, type ScanResult } from "@munigan/wow-combatlog-parser";

type ScanProgress = {
	type: "progress";
	bytesRead: number;
	totalBytes: number;
};

type ScanDone = {
	type: "done";
	result: ScanResult;
};

type ScanError = {
	type: "error";
	message: string;
};

export type ScanMessage = ScanProgress | ScanDone | ScanError;

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
	try {
		const { file } = e.data;
		const totalBytes = file.size;

		const result = await scanLog(file.stream(), {
			onProgress: (bytesRead) => {
				self.postMessage({
					type: "progress",
					bytesRead,
					totalBytes,
				} satisfies ScanProgress);
			},
		});

		// Send final progress so UI reaches 100% before switching to done
		self.postMessage({
			type: "progress",
			bytesRead: totalBytes,
			totalBytes,
		} satisfies ScanProgress);

		self.postMessage({ type: "done", result } satisfies ScanDone);
	} catch (err) {
		self.postMessage({
			type: "error",
			message: err instanceof Error ? err.message : String(err),
		} satisfies ScanError);
	}
};
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit src/lib/scan.worker.ts` (or just check for errors in editor)

**Step 3: Commit**

```bash
git add src/lib/scan.worker.ts
git commit -m "feat: add new scan worker using @munigan/wow-combatlog-parser"
```

---

### Task 3: Update the upload form component

**Files:**
- Modify: `src/components/upload-log-form.tsx`

**Step 1: Update imports**

Replace:
```ts
import type { DetectedRaid, ScanMessage } from "@/lib/log-scanner";
```

With:
```ts
import type { DetectedRaid } from "@munigan/wow-combatlog-parser";
import type { ScanMessage } from "@/lib/scan.worker";
```

**Step 2: Update Worker URL**

In `handleScan`, replace:
```ts
const worker = new Worker(
    new URL("../lib/log-scanner.worker.ts", import.meta.url),
);
```

With:
```ts
const worker = new Worker(
    new URL("../lib/scan.worker.ts", import.meta.url),
);
```

**Step 3: Update Worker message handler for "done" case**

The library's `ScanResult` is `{ raids: DetectedRaid[] }`, so the `done` message now contains `result: ScanResult`. Update the `onmessage` handler:

Replace the `case "done"` block:
```ts
case "done": {
    worker.terminate();
    workerRef.current = null;

    if (msg.raids.length === 0) {
        setState({
            step: "error",
            message: "No raids detected in this log file.",
        });
        return;
    }

    const defaultCoreId = activeCoreId ?? cores[0]?.id ?? "";
    setState({
        step: "choose",
        raids: msg.raids,
        raidConfigs: msg.raids.map(() => ({
            isSelected: true,
            coreId: defaultCoreId,
        })),
    });
    break;
}
```

With:
```ts
case "done": {
    worker.terminate();
    workerRef.current = null;

    const { raids } = msg.result;

    if (raids.length === 0) {
        setState({
            step: "error",
            message: "No raids detected in this log file.",
        });
        return;
    }

    const defaultCoreId = activeCoreId ?? cores[0]?.id ?? "";
    setState({
        step: "choose",
        raids,
        raidConfigs: raids.map(() => ({
            isSelected: true,
            coreId: defaultCoreId,
        })),
    });
    break;
}
```

**Step 4: Update `computeOverlap` to use `PlayerInfo[]`**

The library's `DetectedRaid` has `players: PlayerInfo[]` (with `{ guid, name, class, spec }`) instead of `playerNames: string[]`. Update the places that reference `raid.playerNames` to use `raid.players.map(p => p.name)`.

In the `computeOverlap` calls inside the `useEffect` (smart core assignment), replace:
```ts
const overlap = computeOverlap(raid.playerNames, coreMembers);
```

With:
```ts
const overlap = computeOverlap(raid.players.map(p => p.name), coreMembers);
```

**Step 5: Update the choose step UI**

In the JSX for the "choose" step, update the player display:

Replace `raid.playerNames.slice(0, 3).join(", ")` with:
```ts
raid.players.slice(0, 3).map(p => p.name).join(", ")
```

Replace `raid.playerNames.map((name) => (` with:
```ts
raid.players.map((player) => (
```

And update the corresponding `key` and inner text from `name` to `player.name`.

**Step 6: Update `UploadResult` type**

Since the server will no longer return DB-generated fields, update `UploadResult`:

```ts
type UploadResult = {
	raidName: string;
	raidDate: string;
	raidInstance: string | null;
	totalMembers: number;
};
```

**Step 7: Update the "done" step UI**

The result no longer has `raidId`, so update the key in the results map from `result.raidId` to `result.raidName` or the index. Also `newMembers` is removed.

**Step 8: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`

**Step 9: Commit**

```bash
git add src/components/upload-log-form.tsx
git commit -m "feat: update upload form to use @munigan/wow-combatlog-parser types"
```

---

### Task 4: Replace the server upload endpoint

**Files:**
- Modify: `src/app/api/upload/route.ts`

**Step 1: Rewrite the endpoint**

Replace the entire file with:

```ts
import { headers } from "next/headers";
import { parseLog, FileTooLargeError, type RaidSelection } from "@munigan/wow-combatlog-parser";
import { auth } from "@/lib/auth";

type SelectedRaidPayload = {
	dates: string[];
	startTime: string;
	endTime: string;
	timeRanges?: { startTime: string; endTime: string }[];
	coreId: string;
	raidName: string;
};

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = request.body;
	if (!body) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	const selectedRaidsHeader = requestHeaders.get("X-Selected-Raids");
	if (!selectedRaidsHeader) {
		return Response.json({ error: "Missing X-Selected-Raids header" }, { status: 400 });
	}

	try {
		const selectedRaids: SelectedRaidPayload[] = JSON.parse(selectedRaidsHeader);

		const raidSelections: RaidSelection[] = selectedRaids.map((r) => ({
			dates: r.dates,
			startTime: r.startTime,
			endTime: r.endTime,
			timeRanges: r.timeRanges,
		}));

		const { raids } = await parseLog(body, raidSelections);

		const results = raids.map((raid, i) => ({
			raidName: selectedRaids[i].raidName,
			raidDate: raid.raidDate.toISOString(),
			raidInstance: raid.raidInstance,
			totalMembers: raid.players.length,
		}));

		return Response.json(results);
	} catch (error) {
		if (error instanceof FileTooLargeError) {
			return Response.json(
				{ error: "File too large" },
				{ status: 413 },
			);
		}
		console.error("Upload error:", error);
		return Response.json(
			{ error: "Failed to process log file" },
			{ status: 500 },
		);
	}
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: replace server parser with @munigan/wow-combatlog-parser"
```

---

### Task 5: Delete old parsing files

**Files:**
- Delete: `src/lib/log-scanner.ts`
- Delete: `src/lib/log-scanner.worker.ts`
- Delete: `src/lib/log-parser.ts`
- Delete: `src/lib/wow-raids.ts`

**Step 1: Verify no other imports reference these files**

Run: `grep -r "log-scanner\|log-parser\|wow-raids" src/ --include="*.ts" --include="*.tsx" -l`

Expected: No files (all references should have been updated in Tasks 3 and 4). If any files still reference these, update them first.

**Step 2: Delete the files**

```bash
rm src/lib/log-scanner.ts src/lib/log-scanner.worker.ts src/lib/log-parser.ts src/lib/wow-raids.ts
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove hand-rolled parsing files replaced by library"
```

---

### Task 6: Build and manual test

**Step 1: Verify build succeeds**

Run: `pnpm build`
Expected: Build completes without errors.

**Step 2: Start the dev server**

Run: `pnpm dev`

**Step 3: Manual test with Playwright**

Use Playwright MCP to:
1. Navigate to the app
2. Sign in (or use existing session)
3. Open the upload dialog
4. Upload a test log file from `~/www/wow-combatlog-parser/tests/example-logs/` (use a smaller one like `example-log-3.txt` at 44MB first)
5. Verify scanning completes and shows detected raids
6. Verify raid names, dates, player counts look correct
7. Select raids and click Import
8. Verify upload completes and shows results

**Step 4: Commit any fixes if needed**

---

### Task 7: Update AGENTS.md lib documentation

**Files:**
- Modify: `src/lib/AGENTS.md`

**Step 1: Update the Upload API section**

Replace the `log-parser.ts` reference with `@munigan/wow-combatlog-parser`:

```markdown
## Upload API

- **Route**: `POST /api/upload` at `src/app/api/upload/route.ts`
- **Not tRPC**: Raw Next.js route handler for streaming binary upload
- **Auth**: Validates session via `auth.api.getSession()`
- **Parser**: `@munigan/wow-combatlog-parser` — `parseLog(ReadableStream, RaidSelection[])` returns `ParseResult` with `ParsedRaid[]`
- **Flow**: Stream body -> parseLog() extracts players, encounters, combat stats -> return JSON (no DB writes currently)
- **Response**: `{ raidName, raidDate, raidInstance, totalMembers }[]`
- **Scanner**: Client-side `scanLog()` runs in Web Worker (`src/lib/scan.worker.ts`) to detect raids before upload
```

**Step 2: Commit**

```bash
git add src/lib/AGENTS.md
git commit -m "docs: update AGENTS.md for parser library migration"
```
