# R2 Pre-Signed Upload Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the direct file upload through Vercel with a Cloudflare R2 pre-signed URL flow to bypass Vercel's 4MB request body limit.

**Architecture:** Client-side scan stays the same. After raid selection, the client gets a pre-signed PUT URL from a new `/api/upload/presign` route, uploads the file directly to R2, then calls the modified `/api/upload` with the R2 object key + raid selections as JSON. The upload route fetches from R2, parses, saves to DB, and deletes the R2 object.

**Tech Stack:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, Cloudflare R2 (S3-compatible), Next.js App Router, Zod v4

**Spec:** `docs/superpowers/specs/2026-03-21-r2-presigned-upload-design.md`

---

## Task 1: Install AWS SDK Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

Run:
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

- [ ] **Step 2: Verify installation**

Run:
```bash
pnpm ls @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```
Expected: Both packages listed with versions.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner"
```

---

## Task 2: Add R2 Environment Variables to `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add R2 env vars**

Append to `.env.example`:
```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add R2 environment variables to .env.example"
```

---

## Task 3: Create `POST /api/upload/presign` Route

**Files:**
- Create: `src/app/api/upload/presign/route.ts`

- [ ] **Step 1: Create the presign route**

Create `src/app/api/upload/presign/route.ts`:

```ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function POST() {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const key = `uploads/${session.user.id}/${crypto.randomUUID()}.txt`;

	const url = await getSignedUrl(
		r2,
		new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: key,
			ContentType: "application/octet-stream",
		}),
		{ expiresIn: 600 },
	);

	return Response.json({ url, key });
}
```

- [ ] **Step 2: Verify the file compiles**

Run:
```bash
pnpm exec tsc --noEmit --pretty 2>&1 | head -20
```
Expected: No errors related to `src/app/api/upload/presign/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/upload/presign/route.ts
git commit -m "feat: add POST /api/upload/presign route for R2 pre-signed URLs"
```

---

## Task 4: Modify `POST /api/upload` Route to Fetch from R2

**Files:**
- Modify: `src/app/api/upload/route.ts`

This task modifies the existing upload route to:
1. Accept JSON body (`{ key, selectedRaids }`) instead of binary
2. Validate with Zod
3. Verify the key belongs to the authenticated user
4. Fetch the file from R2 using `GetObjectCommand`
5. Stream the R2 response body into `parseLog()`
6. Delete the R2 object after parsing (in a `finally` block)

- [ ] **Step 1: Update imports and add R2 client + Zod schema**

Replace the current imports and add the R2 client and Zod schema at the top of `src/app/api/upload/route.ts`. The new imports section:

```ts
import {
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { ParsedRaid, RaidSelection } from "@munigan/wow-combatlog-parser";
import { FileTooLargeError, parseLog } from "@munigan/wow-combatlog-parser";
import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buffUptimes } from "@/lib/db/schema/buff-uptimes";
import { consumableUses } from "@/lib/db/schema/consumable-uses";
import { encounterPlayers } from "@/lib/db/schema/encounter-players";
import { encounters } from "@/lib/db/schema/encounters";
import { externalBuffs } from "@/lib/db/schema/external-buffs";
import { members } from "@/lib/db/schema/members";
import { playerDeaths } from "@/lib/db/schema/player-deaths";
import { raids } from "@/lib/db/schema/raids";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const uploadBodySchema = z.object({
	key: z.string(),
	selectedRaids: z.array(
		z.object({
			dates: z.array(z.string()),
			startTime: z.string(),
			endTime: z.string(),
			timeRanges: z
				.array(z.object({ startTime: z.string(), endTime: z.string() }))
				.optional(),
			coreId: z.string(),
			raidName: z.string(),
		}),
	),
});
```

Note: The `SelectedRaidPayload` type can be removed — it's now inferred from the Zod schema.

- [ ] **Step 2: Rewrite the POST handler**

Replace the existing `POST` function with:

```ts
export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = uploadBodySchema.safeParse(await request.json());
	if (!parsed.success) {
		return Response.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { key, selectedRaids } = parsed.data;

	// Verify the key belongs to this user
	const expectedPrefix = `uploads/${session.user.id}/`;
	if (!key.startsWith(expectedPrefix)) {
		return Response.json({ error: "Invalid file key" }, { status: 403 });
	}

	// Verify all selected raids target the user's active core
	const activeCoreId = session.session.activeOrganizationId;
	const hasInvalidCore = selectedRaids.some((r) => r.coreId !== activeCoreId);
	if (!activeCoreId || hasInvalidCore) {
		return Response.json(
			{ error: "Invalid core selection" },
			{ status: 403 },
		);
	}

	const bucket = process.env.R2_BUCKET_NAME!;

	try {
		// Fetch file from R2
		const r2Response = await r2.send(
			new GetObjectCommand({ Bucket: bucket, Key: key }),
		);

		if (!r2Response.Body) {
			return Response.json(
				{ error: "File not found in storage" },
				{ status: 404 },
			);
		}

		const stream = r2Response.Body.transformToWebStream();

		const raidSelections: RaidSelection[] = selectedRaids.map((r) => ({
			dates: r.dates,
			startTime: r.startTime,
			endTime: r.endTime,
			timeRanges: r.timeRanges,
		}));

		const { raids: parsedRaids } = await parseLog(stream, raidSelections);

		const results = await db.transaction(async (tx) => {
			const raidResults = [];
			for (let i = 0; i < parsedRaids.length; i++) {
				const result = await saveRaidToDb(
					tx,
					parsedRaids[i],
					selectedRaids[i],
				);
				raidResults.push(result);
			}
			return raidResults;
		});

		return Response.json(results);
	} catch (error) {
		if (error instanceof FileTooLargeError) {
			return Response.json({ error: "File too large" }, { status: 413 });
		}
		console.error("Upload error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to process log file";
		return Response.json({ error: message }, { status: 500 });
	} finally {
		// Best-effort cleanup: delete the R2 object
		await r2
			.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
			.catch(() => {});
	}
}
```

The `saveRaidToDb` function stays completely unchanged.

- [ ] **Step 3: Verify the file compiles**

Run:
```bash
pnpm exec tsc --noEmit --pretty 2>&1 | head -20
```
Expected: No errors related to `src/app/api/upload/route.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: switch upload route to fetch from R2 instead of request body"
```

---

## Task 5: Update Client Upload Flow in `upload-log-form.tsx`

**Files:**
- Modify: `src/components/upload-log-form.tsx`

This task modifies the `handleUpload` callback to perform 3 sequential network calls instead of 1:
1. `POST /api/upload/presign` → get `{ url, key }`
2. XHR PUT to R2 pre-signed URL (with progress tracking)
3. `POST /api/upload` with `{ key, selectedRaids }` as JSON

- [ ] **Step 1: Rewrite the `handleUpload` callback**

Replace the existing `handleUpload` callback (lines 347-422) with:

```ts
const handleUpload = useCallback(() => {
	if (state.step !== "choose") return;

	const file = fileRef.current;
	if (!file) return;

	const hasSelected = state.raidConfigs.some((c) => c.isSelected);
	if (!hasSelected) return;

	setState({
		step: "uploading",
		fileName: file.name,
		fileSize: file.size,
		progress: 0,
	});

	const selectedPayload = state.raids
		.map((raid, i) => ({ raid, config: state.raidConfigs[i] }))
		.filter(({ config }) => config?.isSelected)
		.map(({ raid, config }) => ({
			dates: raid.dates,
			startTime: raid.startTime,
			endTime: raid.endTime,
			timeRanges: raid.timeRanges,
			coreId: config.coreId,
			raidName: formatRaidLabel(raid),
		}));

	const run = async () => {
		// Step 1: Get pre-signed URL
		const presignRes = await fetch("/api/upload/presign", {
			method: "POST",
		});

		if (!presignRes.ok) {
			const data = await presignRes.json();
			throw new Error(data.error ?? "Failed to get upload URL");
		}

		const { url, key } = await presignRes.json();

		// Step 2: Upload file directly to R2 via XHR (for progress tracking)
		await new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhrRef.current = xhr;

			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					const progress = Math.round((e.loaded / e.total) * 100);
					setState((prev) =>
						prev.step === "uploading" ? { ...prev, progress } : prev,
					);
				}
			};

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve();
				} else {
					reject(new Error("Failed to upload file to storage"));
				}
			};

			xhr.onerror = () => reject(new Error("Network error during upload"));
			xhr.onabort = () => reject(new Error("Upload cancelled"));

			xhr.open("PUT", url);
			xhr.setRequestHeader("Content-Type", "application/octet-stream");
			xhr.send(file);
		});

		// Step 3: Tell server to parse the uploaded file
		const parseRes = await fetch("/api/upload", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ key, selectedRaids: selectedPayload }),
		});

		const data = await parseRes.json();

		if (!parseRes.ok) {
			throw new Error(data.error ?? "Failed to process log file");
		}

		const results: UploadResult[] = Array.isArray(data) ? data : [data];
		setState({ step: "done", results });
	};

	run().catch((error) => {
		if (error instanceof Error && error.message === "Upload cancelled") {
			setState({ step: "select" });
		} else {
			setState({
				step: "error",
				message:
					error instanceof Error ? error.message : "Upload failed",
			});
		}
	});
}, [state]);
```

- [ ] **Step 2: Verify the file compiles**

Run:
```bash
pnpm exec tsc --noEmit --pretty 2>&1 | head -20
```
Expected: No errors related to `src/components/upload-log-form.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/upload-log-form.tsx
git commit -m "feat: switch client upload to R2 pre-signed URL flow"
```

---

## Task 6: Verify Full Build

**Files:** None (verification only)

- [ ] **Step 1: Run type check**

Run:
```bash
pnpm exec tsc --noEmit --pretty
```
Expected: No errors.

- [ ] **Step 2: Run lint**

Run:
```bash
pnpm biome check src/app/api/upload/ src/components/upload-log-form.tsx
```
Expected: No errors (or fix any that appear).

- [ ] **Step 3: Run build**

Run:
```bash
pnpm build
```
Expected: Build succeeds.

- [ ] **Step 4: Final commit (if lint/build required fixes)**

Only if fixes were needed:
```bash
git add -A
git commit -m "fix: address lint/build issues from R2 upload migration"
```
