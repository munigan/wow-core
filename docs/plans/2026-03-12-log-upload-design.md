# Log Upload & Member Extraction — Design

## Goal

Upload WoW combat log files (100-200MB .txt), stream-parse them on the server, extract unique player character names, upsert them as core members, and create a raid record. Establish tRPC as the backend RPC layer for all future queries/mutations.

## Decisions

- **Upload endpoint**: Raw Next.js API route (`POST /api/upload`), not tRPC. Gives full control over streaming `ReadableStream` from the request body and allows `XMLHttpRequest` on the client for real upload progress.
- **tRPC for everything else**: Queries (list raids, list members) and future mutations use tRPC with TanStack React Query integration.
- **Members belong to the core**: The `members` table represents WoW characters scoped to a core, distinct from `coreMembers` (the better-auth user-to-core join table for authenticated users).
- **Upsert on name**: If a player name already exists in the core, skip it. New names are inserted. Unique constraint on `(coreId, name)`.
- **Raid participation tracked**: A lightweight `raidMembers` join table records which members were seen in which raid.
- **Names only for now**: WotLK-era logs lack `COMBATANT_INFO` events. Class/spec inference from spells is deferred to a future iteration.

## Database Schema

### `members`

WoW characters belonging to a core.

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, defaultRandom |
| `coreId` | uuid | notNull, FK -> cores (cascade) |
| `name` | text | notNull |
| `class` | text | nullable |
| `spec` | text | nullable |
| `role` | text | nullable |
| `createdAt` | timestamptz | notNull, defaultNow |
| `updatedAt` | timestamptz | notNull, defaultNow |

Unique constraint on `(coreId, name)`.

### `raids`

A raid session created from an uploaded log.

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, defaultRandom |
| `coreId` | uuid | notNull, FK -> cores (cascade) |
| `name` | text | notNull |
| `date` | timestamptz | notNull |
| `createdAt` | timestamptz | notNull, defaultNow |

### `raidMembers`

Which members participated in which raid.

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, defaultRandom |
| `raidId` | uuid | notNull, FK -> raids (cascade) |
| `memberId` | uuid | notNull, FK -> members (cascade) |
| `createdAt` | timestamptz | notNull, defaultNow |

Unique constraint on `(raidId, memberId)`.

## tRPC Setup

### Packages

`@trpc/server`, `@trpc/client`, `@trpc/react-query`

### File structure

```
src/lib/trpc/
  init.ts          — initTRPC, context with auth session, helpers
  server.ts        — server-side caller + HydrateClient for RSC
  client.ts        — "use client" TRPCProvider with splitLink
  routers/
    _app.ts        — root appRouter
    raids.ts       — raids.list, raids.getById
    members.ts     — members.listByCore
```

### Context

`createTRPCContext` calls `auth.api.getSession({ headers })`. Returns `{ session, user, coreId }` where `coreId` is `session.activeOrganizationId`. A `protectedProcedure` middleware validates all three exist.

### Client links

`splitLink` routing:
- `isNonJsonSerializable` inputs -> `httpLink` (single, for future file mutations)
- Everything else -> `httpBatchStreamLink` (batched + streaming)

### Provider integration

The existing `Providers` component wraps children with `TRPCProvider`. The tRPC provider internally wraps `QueryClientProvider`, replacing the current standalone one. The `makeQueryClient` function is shared between server and client.

### API route

`src/app/api/trpc/[...trpc]/route.ts` — `fetchRequestHandler` adapter.

## Upload Endpoint

### `POST /api/upload`

Raw Next.js route handler at `src/app/api/upload/route.ts`.

### Server flow

1. Validate session + active core via `auth.api.getSession({ headers })`
2. Read `Request.body` as `ReadableStream<Uint8Array>`
3. Pipe through `TextDecoderStream` -> line splitter transform
4. For each line: check sourceGUID and destGUID for `0x0E` prefix (player)
5. Collect unique players in `Map<guid, name>`
6. Extract raid date from first line timestamp
7. After stream ends: create raid, upsert members, insert raidMembers
8. Return JSON: `{ raidId, raidName, raidDate, totalMembers, newMembers }`

### Client flow

1. `XMLHttpRequest` to `POST /api/upload` with `Content-Type: application/octet-stream`
2. `xhr.upload.onprogress` fires with `loaded/total` for the progress bar
3. On `xhr.onload`, parse JSON response and show results

## Log Parser

### Module

`src/lib/log-parser.ts` — pure function, no DB or framework dependencies.

### Input

`ReadableStream<Uint8Array>` (raw request body).

### Line format

```
M/D HH:MM:SS.mmm  EVENT_TYPE,sourceGUID,"sourceName",sourceFlags,destGUID,"destName",destFlags,...
```

### Player detection

GUIDs starting with `0x0E` are player characters. All other prefixes (`0xF130` NPCs, `0xF140` pets, `0xF150` bosses) are ignored.

### Output

```ts
type ParseResult = {
  raidDate: Date;
  raidName: string;
  players: Array<{ guid: string; name: string }>;
};
```

### Edge cases

- Empty file -> error
- No player GUIDs -> empty players array, still create raid
- Duplicate GUIDs with different names -> last seen name wins
- Malformed lines -> silently skip

## UI

### Upload Dialog

Triggered by the sidebar "Upload Log" button, which becomes a `DialogTrigger` (using `render={<span />}` to avoid nested buttons).

### Three states

**State 1 — File Selection**: Drop zone with dashed border. Accepts `.txt` files. Drag & drop or click to browse. Selecting a file immediately starts upload.

**State 2 — Uploading**: File name + size displayed. `ProgressBar` component showing upload percentage. "CANCEL" button to abort XHR. On error: `Alert` + "TRY AGAIN" button resets to State 1.

**State 3 — Results**: Success summary with raid name, date, member counts (total found, new added). "DONE" button closes dialog and calls `router.refresh()`.

### Components

- `UploadLogDialog` — client component, dialog open/close state
- `UploadLogForm` — client component, manages three states, owns XHR + progress
