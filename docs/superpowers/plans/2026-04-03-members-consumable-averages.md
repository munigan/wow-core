# Members Consumable Averages Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new sortable columns (Pots/Raid, Engi/Raid, Other/Raid, Pre-pot %) to the members list page showing per-raid consumable averages.

**Architecture:** Extend the existing `members.listWithStats` tRPC procedure with a new consumable aggregation query that joins `encounter_players` → `encounters` → `raids` → `consumable_uses`. Merge results in JS alongside existing raid count and spec enrichment. Add columns to the client-side table with sorting and color coding.

**Tech Stack:** Drizzle ORM (SQL aggregation), tRPC, React, Tailwind CSS, nuqs (URL state)

**Spec:** `docs/superpowers/specs/2026-04-03-members-consumable-averages-design.md`

---

### Task 1: Add consumable aggregation query to `listWithStats`

**Files:**
- Modify: `src/lib/trpc/routers/members.ts:52-166`

- [ ] **Step 1: Add `sum` import from drizzle-orm**

At line 1, add `sum` to the existing drizzle-orm imports:

```typescript
import {
	and,
	asc,
	count,
	countDistinct,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	sum,
} from "drizzle-orm";
```

- [ ] **Step 2: Update sort enum**

Change the Zod enum at line 58 from:
```typescript
sort: z.enum(["name", "class", "raids"]).optional(),
```
to:
```typescript
sort: z.enum(["name", "class", "raids", "pots", "engi", "other", "prepot"]).optional(),
```

- [ ] **Step 3: Add consumable stats query after the `latestSpecs` query**

After the `specMap` construction (after line 151), add a new query that fetches consumable aggregations for all members on the page. This query joins `encounterPlayers` → `encounters` → `raids` → `consumableUses` and groups by `playerName`:

```typescript
// Get consumable stats per member
const consumableStats = await db
	.select({
		playerName: encounterPlayers.playerName,
		type: consumableUses.type,
		totalCount: sum(consumableUses.count).mapWith(Number),
		prePotEncounters: countDistinct(
			// This needs a SQL expression — see step 4
		),
	})
	// ... complex query — see step 4 for full implementation
```

Actually, due to the conditional aggregation needed (sum by type, count distinct encounters with prePot), this is best done as a raw-ish query. Here's the full implementation:

```typescript
// Get consumable stats per member
// We need: total pots, total engi, total other (flame_cap), and pre-pot encounter count
// Plus total encounter count for pre-pot rate denominator
const consumableRows = await db
	.select({
		playerName: encounterPlayers.playerName,
		type: consumableUses.type,
		totalCount: sum(consumableUses.count).mapWith(Number),
		hasPrePot: consumableUses.prePot,
		encounterId: consumableUses.encounterId,
	})
	.from(consumableUses)
	.innerJoin(
		encounterPlayers,
		and(
			eq(consumableUses.encounterId, encounterPlayers.encounterId),
			eq(consumableUses.playerGuid, encounterPlayers.playerGuid),
		),
	)
	.innerJoin(encounters, eq(consumableUses.encounterId, encounters.id))
	.innerJoin(raids, eq(encounters.raidId, raids.id))
	.where(
		and(
			inArray(encounterPlayers.playerName, memberNames),
			eq(raids.coreId, ctx.coreId),
		),
	)
	.groupBy(
		encounterPlayers.playerName,
		consumableUses.type,
		consumableUses.prePot,
		consumableUses.encounterId,
	);
```

Wait — this grouping is too granular. We need two separate queries to get clean aggregations:

**Query A: Consumable totals by type per member**

```typescript
const consumableTotals = await db
	.select({
		playerName: encounterPlayers.playerName,
		type: consumableUses.type,
		totalCount: sum(consumableUses.count).mapWith(Number),
	})
	.from(consumableUses)
	.innerJoin(
		encounterPlayers,
		and(
			eq(consumableUses.encounterId, encounterPlayers.encounterId),
			eq(consumableUses.playerGuid, encounterPlayers.playerGuid),
		),
	)
	.innerJoin(encounters, eq(consumableUses.encounterId, encounters.id))
	.innerJoin(raids, eq(encounters.raidId, raids.id))
	.where(
		and(
			inArray(encounterPlayers.playerName, memberNames),
			eq(raids.coreId, ctx.coreId),
			inArray(consumableUses.type, [
				"potion",
				"mana_potion",
				"engineering",
				"flame_cap",
			]),
		),
	)
	.groupBy(encounterPlayers.playerName, consumableUses.type);
```

**Query B: Pre-pot rate per member**

```typescript
const prePotRows = await db
	.select({
		playerName: encounterPlayers.playerName,
		totalEncounters: countDistinct(encounterPlayers.encounterId),
		prePotEncounters: countDistinct(consumableUses.encounterId),
	})
	.from(encounterPlayers)
	.innerJoin(encounters, eq(encounterPlayers.encounterId, encounters.id))
	.innerJoin(raids, eq(encounters.raidId, raids.id))
	.leftJoin(
		consumableUses,
		and(
			eq(consumableUses.encounterId, encounterPlayers.encounterId),
			eq(consumableUses.playerGuid, encounterPlayers.playerGuid),
			eq(consumableUses.prePot, true),
		),
	)
	.where(
		and(
			inArray(encounterPlayers.playerName, memberNames),
			eq(raids.coreId, ctx.coreId),
		),
	)
	.groupBy(encounterPlayers.playerName);
```

- [ ] **Step 4: Build maps from consumable query results**

After the two queries above, build lookup maps:

```typescript
// Build consumable totals map: playerName -> { pots, engi, other }
const consumableMap = new Map<
	string,
	{ pots: number; engi: number; other: number }
>();
for (const row of consumableTotals) {
	const entry = consumableMap.get(row.playerName) ?? {
		pots: 0,
		engi: 0,
		other: 0,
	};
	if (row.type === "potion" || row.type === "mana_potion") {
		entry.pots += row.totalCount;
	} else if (row.type === "engineering") {
		entry.engi += row.totalCount;
	} else if (row.type === "flame_cap") {
		entry.other += row.totalCount;
	}
	consumableMap.set(row.playerName, entry);
}

// Build pre-pot rate map: playerName -> prePotRate (0-100)
const prePotMap = new Map<string, number>();
for (const row of prePotRows) {
	const rate =
		row.totalEncounters > 0
			? Math.round((row.prePotEncounters / row.totalEncounters) * 100)
			: 0;
	prePotMap.set(row.playerName, rate);
}
```

- [ ] **Step 5: Merge consumable data into items**

Update the `items` mapping (currently at line 153) to include the new fields:

```typescript
let items = memberRows.map((member) => {
	const raidCount = raidCountMap.get(member.name) ?? 0;
	const consumables = consumableMap.get(member.name) ?? {
		pots: 0,
		engi: 0,
		other: 0,
	};
	return {
		...member,
		raidCount,
		latestSpec: specMap.get(member.name) ?? member.spec,
		avgPotsPerRaid: raidCount > 0 ? consumables.pots / raidCount : null,
		avgEngiPerRaid: raidCount > 0 ? consumables.engi / raidCount : null,
		avgOtherPerRaid: raidCount > 0 ? consumables.other / raidCount : null,
		prePotRate: prePotMap.get(member.name) ?? null,
	};
});
```

- [ ] **Step 6: Extend the JS sorting to handle new columns**

Replace the existing sort block (lines 159-163) with:

```typescript
// Sort by computed columns in JS
const computedSortCols = ["raids", "pots", "engi", "other", "prepot"];
if (computedSortCols.includes(sortCol)) {
	const dir = sortDir === "asc" ? 1 : -1;
	const getVal = (item: (typeof items)[0]): number | null => {
		switch (sortCol) {
			case "raids":
				return item.raidCount;
			case "pots":
				return item.avgPotsPerRaid;
			case "engi":
				return item.avgEngiPerRaid;
			case "other":
				return item.avgOtherPerRaid;
			case "prepot":
				return item.prePotRate;
			default:
				return 0;
		}
	};
	items = items.sort((a, b) => {
		const aVal = getVal(a);
		const bVal = getVal(b);
		// Nulls always last
		if (aVal === null && bVal === null) return 0;
		if (aVal === null) return 1;
		if (bVal === null) return -1;
		return dir * (aVal - bVal);
	});
}
```

- [ ] **Step 7: Run the consumable queries in parallel**

For performance, run the two new queries in parallel with the existing `latestSpecs` query. Replace the sequential execution with `Promise.all`. The `raidCounts` query must still run first (since `memberNames` depends on `memberRows`), but `latestSpecs`, `consumableTotals`, and `prePotRows` can all run concurrently:

```typescript
const [latestSpecs, consumableTotals, prePotRows] = await Promise.all([
	// existing latestSpecs query...
	db.select({ ... }).from(encounterPlayers)...,
	// consumableTotals query from step 3...
	db.select({ ... }).from(consumableUses)...,
	// prePotRows query from step 3...
	db.select({ ... }).from(encounterPlayers)...,
]);
```

- [ ] **Step 8: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds with no type errors

- [ ] **Step 9: Commit**

```bash
git add src/lib/trpc/routers/members.ts
git commit -m "feat: add consumable stats to members.listWithStats query"
```

---

### Task 2: Add consumable columns to members list UI

**Files:**
- Modify: `src/app/(app)/members/members-list.tsx`

- [ ] **Step 1: Update the sort type cast**

At line 97, update the type assertion to include new sort values:

```typescript
sort: sortColumn as
	| "name"
	| "class"
	| "raids"
	| "pots"
	| "engi"
	| "other"
	| "prepot",
```

- [ ] **Step 2: Add 4 new SortHeader columns in the thead**

After the existing "Raids" `SortHeader` (line 214-221), add:

```tsx
<SortHeader
	label="Pots/Raid"
	column="pots"
	currentSort={sortColumn}
	currentDirection={sortDir}
	onSortAction={handleSort}
	className="w-24"
/>
<SortHeader
	label="Engi/Raid"
	column="engi"
	currentSort={sortColumn}
	currentDirection={sortDir}
	onSortAction={handleSort}
	className="w-24"
/>
<SortHeader
	label="Other/Raid"
	column="other"
	currentSort={sortColumn}
	currentDirection={sortDir}
	onSortAction={handleSort}
	className="w-24"
/>
<SortHeader
	label="Pre-pot %"
	column="prepot"
	currentSort={sortColumn}
	currentDirection={sortDir}
	onSortAction={handleSort}
	className="w-24 pr-4"
/>
```

Also remove `pr-4` from the "Raids" SortHeader `className` (change `"w-20 pr-4"` to `"w-20"`).

- [ ] **Step 3: Add 4 new td cells in the tbody row**

After the existing Raids `<td>` (line 261-263), add:

```tsx
<td
	className={`py-2.5 ${
		member.avgPotsPerRaid && member.avgPotsPerRaid > 0
			? "text-primary"
			: "text-dimmed"
	}`}
>
	{member.raidCount === 0
		? "—"
		: (member.avgPotsPerRaid ?? 0).toFixed(1)}
</td>
<td
	className={`py-2.5 ${
		member.avgEngiPerRaid && member.avgEngiPerRaid > 0
			? "text-primary"
			: "text-dimmed"
	}`}
>
	{member.raidCount === 0
		? "—"
		: (member.avgEngiPerRaid ?? 0).toFixed(1)}
</td>
<td
	className={`py-2.5 ${
		member.avgOtherPerRaid && member.avgOtherPerRaid > 0
			? "text-primary"
			: "text-dimmed"
	}`}
>
	{member.raidCount === 0
		? "—"
		: (member.avgOtherPerRaid ?? 0).toFixed(1)}
</td>
<td
	className={`py-2.5 pr-4 ${
		member.prePotRate !== null && member.prePotRate >= 80
			? "text-accent"
			: member.prePotRate !== null && member.prePotRate >= 50
				? "text-warning"
				: "text-dimmed"
	}`}
>
	{member.raidCount === 0
		? "—"
		: `${member.prePotRate ?? 0}%`}
</td>
```

- [ ] **Step 4: Update skeleton column count**

In the loading skeleton (lines 126-130), update the existing skeleton to account for the wider table. No change needed since skeletons are full-width `w-full`.

- [ ] **Step 5: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: Both pass with no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/(app)/members/members-list.tsx
git commit -m "feat: add consumable average columns to members list"
```

---

### Task 3: Manual testing and verification

- [ ] **Step 1: Start dev server and test**

Run: `pnpm dev`

Navigate to `http://localhost:3000/members` and verify:
1. All 4 new columns appear with correct headers
2. Numbers show with 1 decimal place (e.g., `2.3`, `0.0`)
3. `0.0` values appear dimmed, positive values appear in primary color
4. Pre-pot % shows color coding (accent ≥80%, warning 50-79%, dimmed <50%)
5. Members with 0 raids show `—` for all consumable columns
6. Clicking each column header sorts correctly (ascending/descending)
7. Sorting handles null values (they go last)

- [ ] **Step 2: Verify no regressions**

Check that existing functionality still works:
1. Name, Class, Raids columns sort correctly
2. Class filter works
3. Search filter works
4. Pagination works
5. Links to member detail pages work
