# Member detail — Gear overview (Warmane armory + Trigger.dev)

## Overview

Add a **// GEAR OVERVIEW** block on the **member detail** page (`/members/[memberId]`) that shows equipped gear (slot, item name with quality coloring, item level, enchant status, gem status) using **only** the **Warmane armory** as the data source. The implementation follows **Approach A**: armory fetch and parsing run in **Trigger.dev**; results persist in **PostgreSQL**; the app reads from the cache and **auto-enqueues** a refresh when appropriate, with **clear UI feedback** while the background job runs.

**UI reference:** screenshot / frame parity —  
`GearTable-c81d18f0-91c6-427c-aff3-38032d44d21d.png` (workspace assets). Section styling matches existing member-detail blocks (`border-border`, `bg-card`, `// SECTION` titles).

**Relationship to older spec:** `2026-03-17-gear-enchants-design.md` described a dedicated `/gear` page and Next.js `"use cache"` for armory. **This spec supersedes the architecture for gear-on-member-detail:** primary path is **Trigger + Drizzle**, not cache components, so work is durable and observable. Parsing rules for Warmane HTML (`rel` on item links, quality classes, slot order) remain valid and should be reused.

---

## Decisions (locked)

| Topic | Decision |
|--------|-----------|
| Data source | Warmane armory only |
| Where it lives | Member detail page, new section |
| Ingest | **Approach A** — Trigger.dev `schemaTask` + DB cache |
| First load with empty cache | **Auto-fetch** — enqueue task without requiring a manual click |
| UX while job runs | **Visible feedback** that a background job is in progress (and terminal success/failure) |

---

## Armory fetch & parse (unchanged facts)

- **URL:** `https://armory.warmane.com/character/{name}/{realm}/summary` (or equivalent path the armory uses today; verify in implementation). `name` = `members.name`, `realm` = `cores.realm` for the member’s core.
- **Parsing:** Item links expose `rel="item=…&ench=…&gems=…"`; quality from parent CSS classes (e.g. `icon-quality4`). Slot ordering follows WoW/WotLK conventions (see prior gear spec).
- **Wowhead:** Item display names, quality, and ilvl can be resolved via existing `fetchWotlkItemTooltip` / `wotlk_items` where helpful; optional batch after gear snapshot (phase 2).

Enchant/gem **entry IDs** may require static maps (`enchants.ts` / `gems.ts`) for display names; badge columns in the first slice can remain **YES / NO / EMPTY / —** per screenshot even if names are phase 2.

---

## Architecture

```
Member detail loads
  → tRPC members.getArmoryGear(memberId)
      → returns cached rows from DB + sync metadata

If no snapshot (or optional stale policy TBD):
  → same request or follow-up mutation auto-enqueues Trigger task fetch-member-armory-gear
  → returns { gear, runId, runStatus? } or client calls getArmoryRunStatus(runId)

Trigger task
  → HTTP GET armory → parse → upsert member_gear_* tables
  → optional: enqueue fetch-warmane-item-data for missing item ids (later)

Client
  → shows "Syncing gear…" (or similar) while run is RUNNING
  → polls tRPC for status + gear until COMPLETED / FAILED, then shows table or error
```

**Why not only rely on client polling gear rows:** the run may take longer than DB visibility; status should come from **Trigger run state** (or a single tRPC that wraps `runs.retrieve`) so the user sees **running** immediately.

---

## Data model (sketch)

Names are illustrative; use Drizzle + snake_case in DB.

1. **`member_armory_snapshots`** (or one row per member on `members.id` updated in place)
   - `member_id` (FK), `fetched_at`, `source_url` optional, `trigger_run_id` optional (last successful run).

2. **`member_gear_slots`** (normalized for future queries)
   - `member_id`, `slot_key` (enum/text), `item_id`, `item_name` denormalized optional, `item_level`, `quality`, `enchant_status` (enum: `yes` \| `no` \| `na`), `gem_status` (enum: `yes` \| `no` \| `empty` \| `na`), ordering index.

Alternatively one **JSONB** column on a single table per member for v1 — tradeoff: worse “who has item X” queries. **Recommendation:** normalized rows if loot-council queries matter; JSONB acceptable for fastest v1 with a follow-up migration.

---

## tRPC (members router extensions)

- **`getArmoryGear`** — Input: `{ memberId }`. Resolve member + core realm; read DB. If empty and auto-fetch allowed, **enqueue** task and return `{ gear, runId }` (or `needsPolling: true`). Auth: same as member access (protected).
- **`getArmoryRefreshStatus`** — Input: `{ runId: string }`. Server calls Trigger `runs.retrieve` (or equivalent SDK) with server secret; returns `{ status, error? }`. Used for polling.

**Security:** Only allow `runId` for runs that were created for the current user’s core (store `runId` + `memberId` + `coreId` in DB or validate run payload) — design must prevent cross-core run ID probing.

---

## UI — Gear overview table

- Title: `// GEAR OVERVIEW`
- Columns: **SLOT** | **ITEM** | **ILVL** | **ENCHANTED** | **GEMMED**
- Badges: green `[YES]`, red `[NO]`, orange `[EMPTY]`, grey `—` for N/A — use **theme tokens** / existing badge patterns; add `@theme` entries if new semantic colors are needed (no arbitrary bracket classes).
- Item names: quality-colored; wrap with **`ItemTooltip`** where it doesn’t hurt SSR/hydration (client subtree).

**Loading / job states**

- **No data + run queued/running:** show section with skeleton rows **or** a single-line status: “Fetching gear from Warmane…” + optional spinner; use `font-body` / `text-dimmed`.
- **Failed:** message from run error or generic “Couldn’t load armory; try again” + optional retry (retry = enqueue again).
- **Success:** full table.

---

## Trigger.dev

- New **`schemaTask`** e.g. `fetch-member-armory-gear` with payload `{ memberId: string }` (and internal resolution of realm/name).
- **Env:** `DATABASE_URL`, armory fetch may need a sensible User-Agent (match prior investigations).
- **Idempotency:** same member re-fetch overwrites snapshot rows.

---

## Testing & verification

- Manual: member with known armory → auto-fetch → table populated; force failure (bad name) → error UI.
- Lint / typecheck / build as usual.

---

## Out of scope (phase 2)

- Dedicated `/gear` page (may align with older plan later).
- Full enchant/gem **name** resolution maps if badges-only ship first.
- `@trigger.dev/react-hooks` realtime subscription (polling tRPC is enough for v1).

---

## Approval

- **UI:** approved by stakeholder (screenshot parity).
- **Approach A + auto-fetch + run feedback:** approved 2026-04-15.

**Next step:** `writing-plans` implementation plan, then implementation.
