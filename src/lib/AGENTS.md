# Lib

## Database (Drizzle ORM)

- **Driver**: `postgres` (postgres-js, ESM-native — not `pg`)
- **Casing**: `casing: "snake_case"` in both `drizzle.config.ts` and the client — TS camelCase maps to SQL snake_case automatically
- **Timestamps**: always use `timestamp({ withTimezone: true })` — helper `timestamptz()` defined per schema file
- **Primary keys**: UUID with `uuid().primaryKey().defaultRandom()`
- **Schema files**: one file per table or related group in `src/lib/db/schema/`
- **Barrel export**: `src/lib/db/schema/index.ts` exports individual tables AND a named `schema` object for query usage:

```ts
export const schema = { users, sessions, accounts, verifications };
```

Use `schema.users` in queries, not bare `users`.

## Auth (better-auth)

- **Server config**: `src/lib/auth.ts` — Drizzle adapter with `provider: "pg"`, explicit schema mapping (`user: schema.users`, etc.)
- **Client**: `src/lib/auth-client.ts` — `createAuthClient()` from `better-auth/react`
- **API route**: `src/app/api/auth/[...all]/route.ts` — catch-all with `toNextJsHandler(auth)`
- **ID generation**: `generateId: false` — database handles UUID generation via `defaultRandom()`
- **Table names**: plural (`users`, `sessions`, `accounts`, `verifications`) with `modelName` config on `user` and `session`
- **Session check (server)**: `auth.api.getSession({ headers: await headers() })`
- **Session check (client)**: `authClient.useSession()`

## tRPC

- **Version**: v11 (`@trpc/server`, `@trpc/client`, `@trpc/react-query`)
- **Init**: `src/lib/trpc/init.ts` — `createTRPCContext` (auth-aware), `createTRPCRouter`, `baseProcedure`, `protectedProcedure`
- **Context**: Calls `auth.api.getSession({ headers })` and exposes `{ session, user, coreId }`. `protectedProcedure` validates all three are non-null.
- **Server caller (RSC)**: `src/lib/trpc/server.ts` — exports `trpc` (for server components) and `HydrateClient` (for prefetching). Import from `@/lib/trpc/server`.
- **Client provider**: `src/lib/trpc/client.tsx` — exports `trpc` (for client hooks) and `TRPCProvider`. Uses `splitLink` routing non-JSON to `httpLink`, everything else to `httpBatchStreamLink`.
- **Query client**: `src/lib/trpc/query-client.ts` — shared `makeQueryClient()` factory used by both server and client.
- **Routers**: `src/lib/trpc/routers/_app.ts` merges sub-routers. Each sub-router in its own file (e.g., `raids.ts`, `members.ts`).
- **API route**: `src/app/api/trpc/[...trpc]/route.ts` — fetch adapter handler.
- **Providers**: `src/app/providers.tsx` wraps with `TRPCProvider` which includes `QueryClientProvider` internally.

### Adding a new tRPC procedure

1. Create or modify a router file in `src/lib/trpc/routers/`
2. Use `protectedProcedure` for auth-required endpoints
3. Access `ctx.coreId` for the active core
4. Merge into `_app.ts` if new router

## Upload API

- **Route**: `POST /api/upload` at `src/app/api/upload/route.ts`
- **Not tRPC**: Raw Next.js route handler for streaming binary upload
- **Auth**: Validates session + active core via `auth.api.getSession()`
- **Parser**: `src/lib/log-parser.ts` — `parseLogStream(ReadableStream)` returns `{ raidDate, raidName, players[] }`
- **Flow**: Stream body -> parse players (0x0E GUID prefix) -> create raid -> upsert members -> insert raidMembers -> return JSON
- **Response**: `{ raidId, raidName, raidDate, totalMembers, newMembers }`
