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

## Caching Strategy

### Next.js 16 Cache Components

**Custom cache profile** in `next.config.ts`:

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

**Cached functions:**

1. `fetchArmoryGear(name, realm)` — fetches and parses the Warmane HTML. Marked with `"use cache"`, `cacheLife('armory')`, `cacheTag('armory-gear', name)`. Returns parsed gear array with item/enchant/gem IDs and professions.

2. `fetchItemTooltip(itemId)` — fetches item data from Wowhead. Marked with `"use cache"`, `cacheLife('max')` (infinite — item data never changes). Returns `{ name, quality, icon, tooltip }`.

### Data Flow

```
Page load → tRPC gear.getByMember(memberName)
  → fetchArmoryGear(name, realm)  [cached 24h]
    → HTTP GET armory.warmane.com/character/{name}/{realm}/summary
    → Parse rel attributes → extract item/ench/gem IDs
    → For each item: fetchItemTooltip(itemId) [cached forever]
    → Resolve ench/gem IDs via static maps
  → Return structured gear data to client
```

## tRPC Procedure

### `gear.getByMember`

**Input:** `{ memberId: string }`

**Logic:**
1. Fetch member by ID (get `name` from `members` table)
2. Fetch core by `coreId` (get `realm` from `cores` table)
3. Call `fetchArmoryGear(name, realm)`
4. For each gear slot, call `fetchItemTooltip(itemId)` to get item name/quality
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
    itemLevel: number,          // parsed from Wowhead tooltip HTML
    itemIcon: string,
    enchant: string | null,     // resolved enchant name or null
    gems: {
      name: string | null,      // resolved gem name or null (null = empty socket)
      color: string,
    }[],
    hasAllEnchants: boolean,
    hasAllGems: boolean,
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
- **Member dropdown** — `Select` component listing all core members. Default: first member alphabetically. URL param via `nuqs` for shareable links.
- **"View Armory" button** — `ButtonSecondary` with external-link icon, opens `armory.warmane.com/character/{name}/{realm}/summary` in new tab.

### Gear Table
- Section header: `// GEAR OVERVIEW`
- Columns: Slot (100px), Item (fill), iLvl (60px), Enchanted (100px), Gemmed (100px)
- **Slot** column: uppercase text (HEAD, NECK, etc.)
- **Item** column: item name colored by quality (uses existing WoW quality-to-color mapping). Wrapped in `ItemTooltip` component for hover details.
- **iLvl** column: item level number
- **Enchanted** column: Badge `success` with `[YES]` if enchanted, Badge `error` with `[NO]` if enchantable slot has no enchant. Tooltip on hover shows enchant name.
- **Gemmed** column: Badge `success` with `[YES]` if all sockets filled, Badge `error` with `[NO]` if has empty sockets. No badge if item has no sockets.
- **Excluded slots:** Tabard and Shirt are not shown (not enchantable/gemmable).

### Actionable Notes Section
- Card with header `// ACTIONABLE NOTES` and "Copy to Send" button
- Auto-generated from gear data:
  - `error` (red): Missing enchant on enchantable slot
  - `warning` (orange): Empty gem socket
  - `info` (gray): Profession recommendations (e.g., "Consider Engineering for Hyperspeed Accelerators")
- Each note has an icon (triangle-alert for error/warning, info for info) + colored text
- "Copy to Send" copies all notes as plain text to clipboard

### Professions Section
- Card with header `// PROFESSIONS`, fixed 320px width, beside the notes section
- Each profession: icon + name + level string (e.g., "Engineering — 435/450")
- Badge: `[MAX]` in green if at max level

### Loading Skeleton
- Skeleton for filter row
- Skeleton for table (header + 16 rows)
- Skeleton for notes and professions cards

### Empty State
- If member has no armory data (character not found): "Character not found on Warmane armory" in secondary text

## Enchantable Slots

Not all gear slots can have enchants. The enchantable slots in WotLK are:

Head, Shoulders, Back, Chest, Wrist, Hands, Legs, Feet, MainHand, OffHand (if weapon), Ring1, Ring2 (if enchanter)

Neck, Trinket1, Trinket2 are never enchantable. The "Enchanted" badge should only show `[NO]` for enchantable slots — non-enchantable slots show no badge.

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
