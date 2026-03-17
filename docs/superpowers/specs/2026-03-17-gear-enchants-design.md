# Gear & Enchants Page — Design Spec

## Overview

Add a gear inspection page that fetches live character data from the Warmane armory website. The page shows each member's equipped gear with item names, item level, enchant status, and gem status. Data is fetched on-demand and cached for 24 hours using Next.js 16 cache components (`"use cache"` + `cacheLife`).

## Data Source: Warmane Armory

**URL pattern:** `https://armory.warmane.com/character/{name}/{realm}/summary`

The armory embeds gear data in `rel` attributes on item link elements:

```
rel="item=49623&ench=3368&gems=3552:3552:3552&transmog=22691"
```

- `item` — WoW item ID (resolvable via Wowhead tooltip API)
- `ench` — enchantment entry ID (NOT a spell or item ID — requires static lookup)
- `gems` — colon-separated enchantment entry IDs for each socket (0 = empty socket)
- `transmog` — cosmetic override item ID (ignored for our purposes)

**Item quality** is encoded in parent element class: `icon-quality4` = epic, `icon-quality5` = legendary, etc. Quality-to-color mapping already exists in `globals.css`.

**Slot order** is fixed (WoW standard): Head, Neck, Shoulders, Back, Chest, Tabard, Shirt, Wrist, Hands, Waist, Legs, Feet, Ring1, Ring2, Trinket1, Trinket2, MainHand, OffHand.

**Professions** are visible on the same page with name and level (e.g., "Engineering 435 / 450").

**No Cloudflare blocking** — the page loads with a standard server-side HTTP fetch (verified via Playwright).

## ID Resolution

### Items
Resolved via the existing Wowhead tooltip API: `https://nether.wowhead.com/wotlk/tooltip/item/{id}`. Returns JSON with `name`, `quality` (0-7), `icon`, and `tooltip` (HTML). Already used in the project (`src/components/item-tooltip.tsx`).

**Item level parsing:** Extract from Wowhead tooltip HTML using regex: `/Item Level (\d+)/`. The tooltip field contains a string like `"...Item Level 277..."`.

### Enchants & Gems
The enchant entry IDs from the `rel` attribute (e.g., `ench=3368`, `gems=3552`) are NOT item IDs or spell IDs — they are a separate WoW ID space. Wowhead has no tooltip endpoint for these. **Resolution: static lookup map.**

WotLK is a frozen expansion (~200 gear enchants, ~50 gem enchant entries). We ship a static TypeScript map:

```ts
// Enchant entry ID → display name
const ENCHANT_MAP: Record<number, string> = {
  3368: "Rune of the Fallen Crusader",
  3795: "Arcanum of Torment",
  3793: "Inscription of Triumph",
  // ...
}

// Gem enchant entry ID → { name, color }
const GEM_MAP: Record<number, { name: string; color: "red" | "blue" | "yellow" | "meta" | "prismatic" }> = {
  3552: { name: "Delicate Cardinal Ruby", color: "red" },
  3535: { name: "Bold Cardinal Ruby", color: "red" },
  3643: { name: "Chaotic Skyflare Diamond", color: "meta" },
  // ...
}
```

These maps live in `src/lib/wow-data/enchants.ts` and `src/lib/wow-data/gems.ts`. If an ID is not found in the map, display "Unknown Enchant" / "Unknown Gem" as a fallback.

**Note:** These are external API utility files, not Drizzle DB queries. The project rule "keep DB queries inline" applies only to Drizzle ORM queries, not to external API fetching or static data maps.

## Caching Strategy

### Next.js 16 Cache Components

**Config changes** in `next.config.ts`:

```ts
cacheComponents: true,
cacheLife: {
  armory: {
    stale: 86400,      // 24 hours — serve cached for a day
    revalidate: 86400,  // 24 hours — revalidate after a day
    expire: 604800,     // 7 days — hard expire after a week
  },
}
```

**Note:** `"use cache"` works in any async function on the server, including functions called from API route handlers and tRPC procedures. Verified in Next.js 16 docs — a Route Handler `GET` function can call a `"use cache"` function and the cache is respected.

**Cached functions:**

1. `fetchArmoryGear(name, realm)` — fetches and parses the Warmane HTML. Marked with `"use cache"`, `cacheLife('armory')`, `cacheTag('armory-gear', name)`. Returns parsed gear array with item/enchant/gem IDs, quality numbers, and professions.

2. `fetchItemTooltip(itemId)` — fetches item data from Wowhead. Marked with `"use cache"`, `cacheLife('max')` (infinite — item data never changes). Returns `{ name, quality, icon, tooltip }`.

### Data Flow

```
Page load → tRPC gear.getByMember(memberId)
  → fetchArmoryGear(name, realm)  [cached 24h]
    → HTTP GET armory.warmane.com/character/{name}/{realm}/summary
    → Parse rel attributes → extract item/ench/gem IDs + quality from CSS class
    → Return raw parsed data (no Wowhead calls here)
  → Promise.all: fetchItemTooltip(itemId) for all items [cached forever, parallel]
  → Resolve ench/gem IDs via static maps
  → Generate actionable notes
  → Return structured gear data to client
```

**Parallelization:** All Wowhead tooltip fetches (up to 16 items) run in parallel via `Promise.all`. The armory fetch returns raw IDs, and the tRPC procedure resolves them concurrently.

### Error Handling

- **Character not found** (armory returns 404 or "does not exist" text): Return `{ error: "CHARACTER_NOT_FOUND" }`. UI shows "Character not found on Warmane armory".
- **Armory unavailable** (network error, 500, timeout): Return `{ error: "ARMORY_UNAVAILABLE" }`. UI shows "Warmane armory is currently unavailable. Try again later."
- **Wowhead tooltip fails** for a single item: Use fallback `{ name: "Unknown Item", quality: 0 }`. Don't fail the whole page.

## tRPC Procedure

### `gear.getByMember`

**Input:** `{ memberId: string }`

**Logic:**
1. Fetch member by ID (get `name` from `members` table)
2. Fetch core by `coreId` (get `realm` from `cores` table)
3. Call `fetchArmoryGear(name, realm)` — returns raw parsed slots with IDs
4. `Promise.all`: call `fetchItemTooltip(itemId)` for each slot to get item name/quality/ilvl
5. Resolve enchant and gem IDs via static maps
6. Generate actionable notes (missing enchants, empty sockets)

**Response shape:**

```ts
{
  member: { id, name, class },
  gear: {
    slot: string,               // "Head", "Neck", etc.
    itemId: number,
    itemName: string,
    itemQuality: number,        // 0-7
    itemLevel: number,          // parsed from Wowhead tooltip HTML via /Item Level (\d+)/
    itemIcon: string,
    enchant: string | null,     // resolved enchant name or null
    gems: {
      name: string | null,      // resolved gem name or null (null = empty socket)
      color: string,
    }[],
    isEnchantable: boolean,     // whether this slot can have an enchant
    hasAllGems: boolean,        // true if no empty sockets (or no sockets at all)
  }[],
  professions: {
    name: string,
    level: number,
    maxLevel: number,
  }[],
  notes: {
    severity: "error" | "warning" | "info",
    message: string,
  }[],
}
```

## Page UI

### Route: `/gear`

Already in the sidebar navigation. Server component page with tRPC prefetch, client component for interactivity.

### Filter Row
- **Member dropdown** — `Select` component listing all core members. Populated via existing `members.list` tRPC query (already defined in the members router). Default: first member alphabetically. URL param via `nuqs` for shareable links (`?member={memberId}`).
- **"View Armory" button** — `ButtonSecondary` with external-link icon, opens `armory.warmane.com/character/{name}/{realm}/summary` in new tab.

### Gear Table
- Section header: `// GEAR OVERVIEW`
- Columns: Slot (100px), Item (fill), iLvl (60px), Enchanted (100px), Gemmed (100px)
- **Slot** column: uppercase text (HEAD, NECK, etc.)
- **Item** column: item name colored by quality (uses existing WoW quality-to-color mapping). Wrapped in `ItemTooltip` component for hover details.
- **iLvl** column: item level number
- **Enchanted** column: Badge `success` variant with `[YES]` if enchanted, Badge `error` variant with `[NO]` if enchantable slot has no enchant. No badge for non-enchantable slots. Tooltip on hover shows enchant name. Badge component already uses `tailwind-variants` for variant styling.
- **Gemmed** column: Badge `success` variant with `[YES]` if all sockets filled, Badge `error` variant with `[NO]` if has empty sockets. No badge if item has no sockets.
- **Excluded slots:** Tabard and Shirt are not shown (not enchantable/gemmable).

### Actionable Notes Section
- Card with header `// ACTIONABLE NOTES` and "Copy to Send" button
- Auto-generated from gear data:
  - `error` (red): Missing enchant on enchantable slot — "Missing enchant on {Slot} ({Item Name})"
  - `warning` (orange): Empty gem socket — "Empty gem socket in {Slot} ({Item Name})"
- Each note has an icon (triangle-alert for error/warning, info for info) + colored text
- "Copy to Send" copies all notes as plain text to clipboard, format:
  ```
  Missing enchant on Weapon (Shadowmourne)
  Empty gem socket in Ring 1 (Ashen Band of Endless Might)
  ```

### Professions Section
- Card with header `// PROFESSIONS`, fixed 320px width, beside the notes section
- Each profession: name + level string (e.g., "Engineering — 435/450"), no icons (text-only)
- Badge: `[MAX]` success variant if at max level (450/450)

### Loading Skeleton
- Skeleton for filter row
- Skeleton for table (header + 16 rows)
- Skeleton for notes and professions cards

### Empty/Error States
- Character not found: "Character not found on Warmane armory" in dimmed text
- Armory unavailable: "Warmane armory is currently unavailable. Try again later." in dimmed text

## Enchantable Slots

Not all gear slots can have enchants. The enchantable slots in WotLK are:

Head, Shoulders, Back, Chest, Wrist, Hands, Legs, Feet, MainHand, OffHand (if weapon), Ring1, Ring2 (if enchanter)

Neck, Trinket1, Trinket2 are never enchantable. Waist is not traditionally enchantable (Belt Buckle adds a socket, not an enchant — tracked via gem status instead). The "Enchanted" badge should only show `[NO]` for enchantable slots — non-enchantable slots show no badge.

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `next.config.ts` | Modify | Add `cacheComponents: true` and `armory` cache profile |
| `src/lib/wow-data/enchants.ts` | Create | Static enchant entry ID → name map |
| `src/lib/wow-data/gems.ts` | Create | Static gem entry ID → { name, color } map |
| `src/lib/armory.ts` | Create | `fetchArmoryGear()` — HTTP fetch + HTML parse with `"use cache"` |
| `src/lib/wow-data/items.ts` | Create | `fetchItemTooltip()` — Wowhead API with `"use cache"` |
| `src/lib/trpc/routers/gear.ts` | Create | `gear.getByMember` tRPC procedure |
| `src/lib/trpc/routers/_app.ts` | Modify | Register gear router |
| `src/app/(app)/gear/page.tsx` | Create | Server component with tRPC prefetch |
| `src/app/(app)/gear/gear-inspector.tsx` | Create | Client component with member selector + table + notes |
| `src/app/(app)/gear/loading.tsx` | Create | Loading skeleton |

## Design Tokens

All colors use existing theme variables. Item quality colors already defined in `globals.css` for the Wowhead tooltip system. No new arbitrary Tailwind values needed.
