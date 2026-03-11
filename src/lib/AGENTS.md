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
