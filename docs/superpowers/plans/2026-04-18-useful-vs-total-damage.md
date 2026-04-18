# Useful vs Total Encounter Damage — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist and display **useful** (uwu-style whitelist) and **total** (all hostile NPC) damage per player per encounter, with matching encounter/raid DPS and nullable semantics for legacy rows, per the approved spec.

**Architecture:** Extend `CombatTracker` to accumulate `damage` (useful) and `damageTotal` in one pass. Add nullable `damage_total` on `encounter_players`, validate on upload, extend tRPC with the normative DTO (`usefulDamage`, `totalDamage`, `raidDpsUseful`, `raidDpsTotal`), and update raid UI + companion. **Deploy order:** apply DB migration (or `db:push` in dev) before deploying code that INSERTs `damage_total`.

**Tech Stack:** `wow-combatlog-parser` (TypeScript, Vitest), `wow-core` (Next.js 16, Drizzle, tRPC v11, Biome), `wow-companion` (Electron/renderer).

**Authoritative spec:** `docs/superpowers/specs/2026-04-18-useful-vs-total-damage-design.md`

---

## File map (creates / modifies)


| Package   | Path                                                                | Role                                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parser    | `wow-combatlog-parser/src/types.ts`                                 | Add `damageTotal` to `PlayerCombatStats`.                                                                                                                                                       |
| Parser    | `wow-combatlog-parser/src/state/combat-tracker.ts`                  | Dual accumulation, merge in end/summaries/active.                                                                                                                                               |
| Parser    | `wow-combatlog-parser/src/parser.ts`, `stream-parser.ts`            | Usually **no edits** once `CombatTracker` returns full `PlayerCombatStats`—fix only if `tsc` reports incomplete literals.                                                                       |
| Parser    | `wow-combatlog-parser/src/realtime-parser.ts`                       | Pass through `damageTotal`; DPS may stay useful-only or expose both (match product need).                                                                                                       |
| Parser    | `wow-combatlog-parser/tests/unit/combat-tracker.test.ts`            | New + updated expectations.                                                                                                                                                                     |
| Parser    | `wow-combatlog-parser/tests/integration/parse-combat-stats.test.ts` | Extend fixture types; optional assert `damageTotal` exists.                                                                                                                                     |
| Parser    | `wow-combatlog-parser/scripts/parse-log-7.ts`                       | Spread/copy new field when remapping stats.                                                                                                                                                     |
| Parser    | `wow-combatlog-parser/CLAUDE.md`                                    | Clarify useful vs total vs overkill wording if needed.                                                                                                                                          |
| Core      | `wow-core/src/lib/db/schema/encounter-players.ts`                   | `damageTotal` column nullable.                                                                                                                                                                  |
| Core      | `wow-core/drizzle/*.sql` + `drizzle/meta/`*                         | Generated migration for `damage_total`.                                                                                                                                                         |
| Core      | `wow-core/src/app/api/upload/route.ts`                              | Insert both columns; validate; 400 on missing `damageTotal`.                                                                                                                                    |
| Core      | `wow-core/src/lib/trpc/routers/raids.ts`                            | `getById`, `getEncounterDetails`, `getRaidKillPlayerBreakdownAggregated`, `getInstanceAverageStats`.                                                                                            |
| Core      | `wow-core/src/lib/trpc/routers/members.ts`                          | Any encounter player selects exposing damage.                                                                                                                                                   |
| Core      | `wow-core/src/lib/trpc/routers/overview.ts`                         | Headline top DPS stays **useful** only (spec); add `damageTotal` to facts select only if a surface needs it later—YAGNI default: no overview API change unless you add a visible second metric. |
| Core      | `wow-core/src/app/(app)/raids/[raidId]/encounter-row.tsx`           | Props + two DPS / damage columns.                                                                                                                                                               |
| Core      | `wow-core/src/app/(app)/raids/[raidId]/raid-details.tsx`            | Sort uses `raidDpsUseful`; rollups for footer null rules.                                                                                                                                       |
| Core      | `wow-core/src/app/(app)/raids/[raidId]/player-breakdown.tsx`        | Columns + sort keys for useful vs total.                                                                                                                                                        |
| Core      | `wow-core/package.json`                                             | Bump `@munigan/wow-combatlog-parser` ref after parser commit is published (or document workspace `file:` for local dev).                                                                        |
| Companion | `wow-companion/src/renderer/src/app.tsx`                            | Tolerate or display `damageTotal`.                                                                                                                                                              |
| Companion | `wow-companion/tests/integration/watcher-parser.test.ts`            | Assertions on new field if needed.                                                                                                                                                              |


---

### Task 1: Parser — types and `CombatTracker`

**Files:**

- Modify: `wow-combatlog-parser/src/types.ts`
- Modify: `wow-combatlog-parser/src/state/combat-tracker.ts`
- Test: `wow-combatlog-parser/tests/unit/combat-tracker.test.ts`
- **Step 1:** Add `damageTotal: number` to `PlayerCombatStats` (required in parser output; both fields always set together after this change).
- **Step 2:** In `CombatTracker.processEvent`, after passing non-player-dest, non-friendly, and player-source checks, compute `hit = amount - max(0, overkill)` (skip if `hit <= 0`). **Total path:** add `hit` to the player’s `damageTotal` for every such hostile NPC hit. **Useful path:** add `hit` to `damage` only if the whitelist check passes (or `_validNpcs === null`, same as today). Use one `_accumulate` helper with two counters or two maps merged at encounter end.
- **Step 3:** Update `onEncounterEnd` / `getActiveStats` / `getPlayerSummaries` to merge `damage` and `damageTotal` for every GUID in the union of keys (mirror `damageTaken` merge pattern).
- **Step 4:** Write a failing unit test: boss name mapped in `encounter-npcs.ts` with damage to **excluded** NPC ID → `damageTotal > damage`. Run:

```bash
cd wow-combatlog-parser && pnpm exec vitest run tests/unit/combat-tracker.test.ts -t "your new test name"
```

Expected: FAIL until implementation complete.

- **Step 5:** Add test: unmapped boss name (`_validNpcs === null`) → `damageTotal === damage` for the same events.
- **Step 6:** Update existing tests that construct `PlayerCombatStats` literals or assert object shape to include `damageTotal`.
- **Step 7:** Run full parser tests:

```bash
cd wow-combatlog-parser && pnpm run test
```

Expected: PASS.

- **Step 8:** Commit parser package:

```bash
cd wow-combatlog-parser && git add src/types.ts src/state/combat-tracker.ts tests/unit/combat-tracker.test.ts && git commit -m "feat: track useful and total damage in CombatTracker"
```

---

### Task 2: Parser — integration, scripts, realtime

**Files:**

- Modify: `wow-combatlog-parser/tests/integration/parse-combat-stats.test.ts` (types `{ damage: number }` → include `damageTotal`)
- Modify: `wow-combatlog-parser/scripts/parse-log-7.ts`
- Modify: `wow-combatlog-parser/src/realtime-parser.ts`
- **Step 1:** Extend integration test types and add at least one assertion that `stats.damageTotal` is defined and `>= stats.damage` for a mapped fight (e.g. Patchwerk may be equal; pick Razuvious or another fight with adds if the log shows `>`).
- **Step 2:** In `realtime-parser.ts`, where `dps` is derived from `stats.damage`, keep **useful** DPS as default; optionally add `dpsTotal` in the payload if the companion UI needs it—minimum is to read `damageTotal` without type errors.
- **Step 3:** `pnpm run test` and `pnpm run typecheck` in `wow-combatlog-parser`.
- **Step 4:** Commit.

---

### Task 3: wow-core — schema and migration

**Files:**

- Modify: `wow-core/src/lib/db/schema/encounter-players.ts`
- Create: new Drizzle migration under `wow-core/drizzle/`
- **Step 1:** Add `damageTotal: bigint({ mode: "number" })` **nullable** (no `.notNull()`), column name `damage_total`.
- **Step 2:** Run:

```bash
cd wow-core && pnpm db:generate
```

Review generated SQL: `ALTER TABLE ... ADD COLUMN damage_total bigint;` with **no** `NOT NULL DEFAULT` for existing rows.

- **Step 3:** Apply locally:

```bash
cd wow-core && pnpm db:migrate
```

(or `pnpm db:push` per team practice).

- **Step 4:** Commit schema + migration only.

**Rule:** Migration merged/applied **before** production deploy of upload code that writes `damage_total`.

---

### Task 4: wow-core — upload validation

**Files:**

- Modify: `wow-core/src/app/api/upload/route.ts`
- **Step 1:** When mapping `enc.combatStats` to rows, set `damageTotal: stats.damageTotal` (and keep `damage: stats.damage`).
- **Step 2:** Before insert, for every stats object: if `typeof stats.damageTotal !== "number"` or `Number.isNaN(stats.damageTotal)`, abort the transaction and return **400** JSON with a clear `message` (parser version mismatch). Do not coerce.
- **Step 3:** Manual test: run upload with a log against dev DB; confirm rows have `damage_total` populated.
- **Step 4:** Commit.

---

### Task 5: wow-core — `raids.getById` encounter aggregates

**Files:**

- Modify: `wow-core/src/lib/trpc/routers/raids.ts` (`getById` only first)

**SQL note:** PostgreSQL `sum(damage_total)` skips nulls and would **lie** after partial nulls. Use a grouped subquery or two aggregates per encounter:

- `usefulSum = sum(damage)`
- `nullCount = sum(case when damage_total is null then 1 else 0 end)` (or `count(*) filter`)
- `totalSum = sum(damage_total)` only meaningful when `nullCount === 0`

Implement in Drizzle + TS or raw `sql` fragment.

- **Step 1:** Replace encounter payload fields: remove legacy `totalDamage` and `raidDps`. Add `usefulDamage`, `totalDamage` (number | null), `raidDpsUseful`, `raidDpsTotal` (number | null) per spec rounding.
- **Step 2:** Run `pnpm exec tsc --noEmit` or project typecheck; fix call sites until `getById` consumers compile (next task).
- **Step 3:** Commit.

---

### Task 6: wow-core — remaining `raids` procedures + rollups

**Files:**

- Modify: `wow-core/src/lib/trpc/routers/raids.ts`
- **Step 1:** `getEncounterDetails`: ensure select includes `damageTotal`; add `dpsUseful` and `dpsTotal` (nullable) per player using same `durationMs` and rounding as today’s `dps` for useful.
- **Step 2:** `getRaidKillPlayerBreakdownAggregated`: extend `Acc` with `damageTotal` sum and a boolean `encounterHasLegacyTotal` per encounter (true if any `p.damageTotal === null` for that `encounterId`). For each player, if they participated in any legacy encounter in this raid’s kill set, output `damageTotal: null` at aggregate; else sum totals. Keep `damage` as useful sum. Revisit `dps` naming: expose `dpsUseful` (current behavior) + `dpsTotal` nullable or document that displayed DPS stays useful-average—align with spec “show both” where the table shows damage columns.
- **Step 3:** `getInstanceAverageStats`: spec rollup—if **any** kill encounter for that instance scope would have `totalDamage === null`, set nullable **instance** total-DPS aggregate or omit; **keep `avgDps` as useful-only** to match spec headline unless product requests otherwise (document in PR).
- **Step 4:** Grep `wow-core/src` for `totalDamage` / `raidDps` on encounter types from `getById`; fix all references.
- **Step 5:** `pnpm lint` in `wow-core`.
- **Step 6:** Commit.

---

### Task 7: wow-core — `members` router (and optional `overview`)

**Files:**

- Modify: `wow-core/src/lib/trpc/routers/members.ts`
- **Step 1:** Any procedure returning per-encounter `damage` for charts or tables: include `damageTotal` from DB; document null in UI.
- **Step 2:** `overview.ts`: **default** — leave “Top DPS” calculation on `row.damage` (useful) only per spec § “Prefer useful for headline”. If you add a second leaderboard line, gate it on null-safe rollups.
- **Step 3:** Commit.

---

### Task 8: wow-core — raid UI

**Files:**

- Modify: `wow-core/src/app/(app)/raids/[raidId]/encounter-row.tsx`
- Modify: `wow-core/src/app/(app)/raids/[raidId]/raid-details.tsx`
- Modify: `wow-core/src/app/(app)/raids/[raidId]/player-breakdown.tsx`
- **Step 1:** Update encounter row props to `usefulDamage`, `totalDamage`, `raidDpsUseful`, `raidDpsTotal`. Render two DPS cells or a combined cell with accessible labels, e.g. “Useful DPS” / “Total DPS”. When `raidDpsTotal === null`, show em dash + tooltip per spec.
- **Step 2:** `raid-details.tsx`: default sort `encSort === "dps"` must use `**raidDpsUseful`**. Raid footer aggregates: sum `usefulDamage` for useful raid DPS; for **total** raid DPS across kills, if **any** selected encounter has `totalDamage === null`, show null / em dash for total metrics (spec multi-encounter rollups).
- **Step 3:** `player-breakdown.tsx`: add total damage column and sort option; handle null aggregate totals.
- **Step 4:** `pnpm lint` and smoke-test `/raids/[raidId]` in dev.
- **Step 5:** Commit.

---

### Task 9: wow-companion

**Files:**

- Modify: `wow-companion/src/renderer/src/app.tsx`
- Modify: `wow-companion/tests/integration/watcher-parser.test.ts`
- **Step 1:** Ensure TypeScript accepts `damageTotal` on combat stats; display optional second number or ignore for overlay MVP.
- **Step 2:** Run companion tests / build per package README.
- **Step 3:** Commit in `wow-companion` repo.

---

### Task 10: Dependency bump and cross-repo verification

- **Step 1:** Publish or tag `wow-combatlog-parser` with the parser changes; update `wow-core/package.json` `@munigan/wow-combatlog-parser` to that ref (or use `file:../wow-combatlog-parser` temporarily—do not commit `file:` unless that is repo standard).
- **Step 2:** From `wow-core`: `pnpm install && pnpm build` (or `pnpm exec tsc --noEmit` if build blocked by env).
- **Step 3:** Final commits on each repo with conventional messages.

---

## Spec cross-check (acceptance)


| #   | Criterion                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | New upload: every `encounter_players` row from `combatStats` has non-null `damage_total`; zeros allowed.                    |
| 2   | Legacy rows: `damage_total` stays SQL `NULL`; encounter `totalDamage` and `raidDpsTotal` are `null`; UI explains re-upload. |
| 3   | Mapped boss with padding: `damageTotal >= damage`.                                                                          |
| 4   | Rollup: if any encounter in set has null encounter-level total, raid rollup total is null (no partial sum).                 |


---

## Consumer checklist (grep)

Run before PR:

```bash
rg "totalDamage|raidDps[^U]" wow-core/src --glob "*.tsx"
rg "encounterPlayers\.damage" wow-core/src
rg "combatStats" wow-companion wow-core/src/app/api/upload
```

Fix any stale encounter field names or assumptions that `totalDamage` meant useful-only.