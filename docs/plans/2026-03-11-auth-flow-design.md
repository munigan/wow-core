# Auth Flow Design

## Infrastructure

**Postgres** via Docker Compose (dev only). Single `docker-compose.yml` at project root with a `postgres` service, persisted volume. Connection string in `.env`.

**Drizzle ORM** with `drizzle-kit` for migrations. Config uses `casing: "snake_case"` so TypeScript `createdAt` maps to `created_at` automatically.

## better-auth Configuration

**Plural table names** via `modelName` on each core model:

```ts
user:         { modelName: "users" }
session:      { modelName: "sessions" }
account:      { modelName: "accounts" }
verification: { modelName: "verifications" }
```

**ID generation disabled** — we define `id` columns ourselves in the Drizzle schema as `uuid` with `defaultRandom()`:

```ts
advanced: {
  database: {
    generateId: false
  }
}
```

Each schema table defines its own `id: uuid("id").primaryKey().defaultRandom()`.

**Auth methods**: `emailAndPassword: { enabled: true }` + `socialProviders.discord`.

**Drizzle adapter**: `drizzleAdapter(db, { provider: "pg", schema })`.

## Route Protection — Next.js 16 Proxy

Next.js 16 renamed `middleware.ts` to `proxy.ts`. Same concept, same location (`src/`), but the exported function is named `proxy` instead of `middleware`.

Uses `auth.api.getSession({ headers: await headers() })` for session validation:

```ts
// src/proxy.ts
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  // redirect logic based on session + route matching
}
```

- Protected routes (`/` and everything under `(app)/`) → redirect to `/sign-in` if no session
- Auth routes (`/sign-in`, `/sign-up`) → redirect to `/` if already authenticated
- Skip: `api`, `_next/static`, `_next/image`, `dev`

## File Structure

```
docker-compose.yml
.env                              # DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
                                  # DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
drizzle.config.ts                 # Drizzle Kit config (pg, snake_case casing)
src/
├── proxy.ts                      # Next.js 16 proxy (was middleware.ts)
├── lib/
│   ├── db/
│   │   ├── index.ts              # drizzle() client with postgres-js driver
│   │   └── schema/
│   │       ├── index.ts          # barrel export
│   │       └── auth.ts           # users, sessions, accounts, verifications tables
│   ├── auth.ts                   # betterAuth server config
│   └── auth-client.ts            # createAuthClient() exports (signIn, signUp, useSession)
├── app/
│   ├── api/auth/[...all]/
│   │   └── route.ts             # toNextJsHandler(auth) catch-all
│   ├── (auth)/
│   │   ├── layout.tsx           # Centered layout for auth pages
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   └── (app)/
│       ├── layout.tsx           # Authenticated app shell (future)
│       └── page.tsx             # Dashboard placeholder
```

## Pages

**Sign In** (`/sign-in`): Logo, "SIGN IN TO YOUR ACCOUNT" subtitle, email input, password input (with "FORGOT?" placeholder link), "SIGN IN" button, "OR" divider, "SIGN IN WITH DISCORD" button, footer link to `/sign-up`.

**Sign Up** (`/sign-up`): Logo, "CREATE YOUR ACCOUNT" subtitle, email input, password input, character name input (maps to better-auth `name` field), "CREATE ACCOUNT" button, "OR" divider, "SIGN UP WITH DISCORD" button, footer link to `/sign-in`.

Both use client-side `authClient.signIn.email()` / `authClient.signUp.email()` / `authClient.signIn.social({ provider: "discord" })`. On success redirect to `/`.

## Not in scope

- Forgot password flow (visual placeholder only)
- Email verification
- Profile/settings
- Role-based access
- Character name as a separate entity (just maps to `name`)
