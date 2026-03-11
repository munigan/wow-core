# Project Rules

## Stack

Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Biome (lint/format), pnpm, TypeScript, better-auth, Drizzle ORM, postgres-js, React Hook Form, Zod v4

## Naming

- **Booleans** — always prefix with `is`, `has`, `should`, `can`, `was`, `will` (e.g. `isLoading`, `isPasswordVisible`, `hasError`)
- **Named exports only** — use `export const` / `export type`, no default exports (exception: Next.js page/layout files which require `export default`)
- **Conventional commits** — `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`

## Design

- **Dark-only** theme. Page bg `#0C0C0C`, primary accent `#00FF88`
- **Fonts**: Space Grotesk (`font-heading`) + JetBrains Mono (`font-body`)
- **Design source**: Pencil MCP file at `/Users/diegofernandes/Documents/wow-raid-tools-2.pen`
- **No arbitrary Tailwind values** — define `@theme` variables in `globals.css` instead

## Forms

- **React Hook Form + Zod** for all forms — define a Zod schema, infer the TS type, use `zodResolver`
- **Zod v4 syntax** — use `z.email()` not `z.string().email()` (top-level validators)
- Server errors go to `setError("root", { message })`, displayed separately from field errors
