# R2 Pre-Signed Upload Design

## Problem

Vercel hard-limits request bodies at 4MB. WoW combat log files regularly exceed this. The current upload flow sends the entire file as binary through the Vercel API route, which fails for large logs.

## Solution

Upload files directly to Cloudflare R2 using pre-signed URLs (bypassing Vercel), then have the API route fetch from R2 to parse.

## Approach: Two API Routes

### New Route: `POST /api/upload/presign`

**Purpose:** Generate a pre-signed PUT URL so the client uploads directly to R2.

**Auth:** Same `better-auth` session check as the current upload route.

**Response:**

```json
{
  "url": "https://<account>.r2.cloudflarestorage.com/wow-logs/<key>?X-Amz-...",
  "key": "uploads/<userId>/<uuid>.txt"
}
```

**Logic:**

1. Validate session
2. Generate unique object key: `uploads/<userId>/<uuid>.txt`
3. Use `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` to create a pre-signed PUT URL with 10-minute expiry
4. R2 is S3-compatible — standard AWS SDK works with R2's S3 API endpoint
5. S3Client configured inline in the route (no separate utility file)

### Modified Route: `POST /api/upload`

**Purpose:** Receive the R2 object key + raid selections, fetch the file from R2, parse it, save to DB, then clean up.

**Request body:** Changes from binary `application/octet-stream` to JSON:

```json
{
  "key": "uploads/<userId>/<uuid>.txt",
  "selectedRaids": [{ "raidIndex": 0, "coreId": "..." }]
}
```

**Logic changes:**

1. Validate session (same as now)
2. Validate JSON body with Zod (`key` as string, `selectedRaids` array)
3. Verify the key starts with `uploads/<sessionUserId>/` (prevent accessing other users' files)
4. Fetch the object from R2 using `GetObjectCommand`
5. Pipe `response.Body` (a `ReadableStream<Uint8Array>`) directly into `parseLog(stream, raidSelections)`
6. Same DB transaction logic as today — no changes
7. After successful parse+save, delete the R2 object with `DeleteObjectCommand` (cleanup)
8. On error, still attempt to delete the R2 object (best-effort cleanup in a `finally` block)

**What stays the same:** All database logic, the `parseLog` call signature, the response format, error handling structure.

**What changes:** Input source (fetch from R2 instead of `request.body`), request format (JSON instead of binary), `X-Selected-Raids` header eliminated (moved into body).

### Client-Side Changes: `upload-log-form.tsx`

**Current flow:**

1. User picks raids -> XHR sends file as binary to `/api/upload` with `X-Selected-Raids` header

**New flow:**

1. User picks raids
2. `fetch('/api/upload/presign')` -> get `{ url, key }`
3. XHR PUT to the pre-signed R2 URL with the raw file as body (`application/octet-stream`) — this bypasses Vercel entirely
4. `fetch('/api/upload', { body: JSON.stringify({ key, selectedRaids }) })` -> triggers parse

**Progress tracking:** XHR to R2 still supports `upload.onprogress` — upload progress bar works as before.

**Error handling:**

- Pre-sign fails -> show error, user can retry
- R2 upload fails -> show error, user can retry (no cleanup needed)
- Parse call fails -> show error, server cleans up R2 object in its `finally` block

**What stays the same:** Scanning in Web Worker, raid selection UI, all states (select -> scanning -> choose -> uploading -> done), the redirect on success.

**What changes:** The `uploading` state now does 3 sequential network calls instead of 1 XHR. The progress bar tracks the R2 upload (step 3), which is the slow part. Steps 2 and 4 are fast.

## Cleanup & Orphan Strategy

**Happy path:** The `/api/upload` route deletes the R2 object after successful parsing in a `finally` block.

**Orphaned objects** (user closes tab, parse crashes): Configure an R2 lifecycle rule in Cloudflare dashboard to auto-delete objects older than 24 hours in the `uploads/` prefix. Zero code, set and forget.

## Environment Variables

| Variable | Description |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret key |
| `R2_BUCKET_NAME` | R2 bucket name (e.g., `wow-logs`) |

The S3 endpoint is derived: `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`

## Dependencies

One new package: `@aws-sdk/client-s3` (includes `@aws-sdk/s3-request-presigner`).

## Files Changed

| File | Change |
|---|---|
| `src/app/api/upload/presign/route.ts` | New — pre-sign endpoint |
| `src/app/api/upload/route.ts` | Modified — fetch from R2 instead of `request.body`, JSON input, cleanup |
| `src/components/upload-log-form.tsx` | Modified — 3-step upload flow (presign -> R2 PUT -> parse call) |
| `package.json` | Add `@aws-sdk/client-s3` |
