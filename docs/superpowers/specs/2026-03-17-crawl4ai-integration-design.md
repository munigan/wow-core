# Crawl4AI Integration for Armory Data — Design Spec

## Overview

Replace the brittle regex-based Warmane armory HTML parser with a crawl4ai Docker service that uses Gemini LLM extraction to return structured JSON. This eliminates the static enchant/gem ID lookup maps and produces human-readable names directly from the rendered page.

## Architecture

```
Next.js App → POST /crawl → crawl4ai Docker container
                               ↓
                         Playwright renders page
                               ↓
                         Converts to markdown
                               ↓
                         Sends to Gemini 2.0 Flash
                               ↓
                         Returns structured JSON
                               ↓
Next.js App ← JSON response with gear/enchants/gems/professions
```

## Docker Infrastructure

Add `crawl4ai` service to the existing `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: wow
      POSTGRES_PASSWORD: wow
      POSTGRES_DB: wow_core
    volumes:
      - pgdata:/var/lib/postgresql/data

  crawl4ai:
    image: unclecode/crawl4ai:0.8.0
    ports:
      - "11235:11235"
    environment:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    shm_size: 2g
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11235/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

volumes:
  pgdata:
```

**Notes:**
- `shm_size: 2g` — Playwright/Chromium needs sufficient shared memory; 2GB is a safe default.
- `healthcheck` — crawl4ai may take 10-30s to start Playwright. The health check prevents premature requests.
- **Security:** Port 11235 should NOT be exposed publicly in production. In production, only map it on the internal Docker network (remove `ports` mapping and use Docker service discovery: `http://crawl4ai:11235`).

**Environment variables** (added to `.env`):
```
GEMINI_API_KEY=<key>
CRAWL4AI_URL=http://localhost:11235
```

## Extraction Schema

A single crawl4ai call extracts all character data. The schema includes `itemId` (for client-side Wowhead tooltip hover) and `totalSockets` (for accurate gem detection):

```ts
type CrawledCharacter = {
  character: {
    name: string;
    level: number;
    race: string;
    class: string;
    spec: string;
    guild: string | null;
    realm: string;
  };
  gear: {
    slot: string;           // "Head", "Neck", "Shoulders", etc.
    itemId: number;          // WoW item ID (from the wotlk.cavernoftime.com link)
    itemName: string;        // "Sanctified Scourgelord Helmet"
    itemLevel: number;       // 264
    quality: string;         // "epic", "legendary", "rare", "uncommon", "common"
    enchant: string | null;  // "Arcanum of Torment" or null
    gems: string[];          // ["Chaotic Skyflare Diamond", "Delicate Cardinal Ruby"]
    totalSockets: number;    // total gem sockets on the item
  }[];
  professions: {
    name: string;
    level: number;
    maxLevel: number;
  }[];
};
```

**LLM instruction** tells Gemini to extract `itemId` from the `wotlk.cavernoftime.com/item=XXXXX` links on the page.

## Response Validation

The crawl4ai response is validated at runtime with a Zod schema before use. This guards against LLM non-determinism (missing fields, wrong types, unexpected values):

```ts
const crawledCharacterSchema = z.object({
  character: z.object({
    name: z.string(),
    level: z.number(),
    race: z.string(),
    class: z.string(),
    spec: z.string(),
    guild: z.string().nullable(),
    realm: z.string(),
  }),
  gear: z.array(z.object({
    slot: z.string(),
    itemId: z.number(),
    itemName: z.string(),
    itemLevel: z.number(),
    quality: z.string(),
    enchant: z.string().nullable(),
    gems: z.array(z.string()),
    totalSockets: z.number(),
  })),
  professions: z.array(z.object({
    name: z.string(),
    level: z.number(),
    maxLevel: z.number(),
  })),
});
```

If validation fails, return `ARMORY_UNAVAILABLE` with a logged warning.

## crawl4ai API Call

```ts
const response = await fetch(`${process.env.CRAWL4AI_URL}/crawl`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    urls: [`https://armory.warmane.com/character/${name}/${realm}/summary`],
    extraction_strategy: {
      type: "llm",
      provider: "gemini/gemini-2.0-flash",
      api_token: process.env.GEMINI_API_KEY,
      schema: crawledCharacterSchema,
      instruction: "Extract the character's equipped gear, professions, and basic info. For each gear slot extract the item ID from the wotlk.cavernoftime.com/item=XXXXX link, the item name, enchant name if present, all gem names, and total socket count. Skip Shirt and Tabard slots."
    }
  })
});
```

**crawl4ai response structure:** The extracted JSON is in `response.results[0].extracted_content` (stringified JSON). Parse it with `JSON.parse`, then validate with the Zod schema.

The function remains wrapped in `"use cache"` with `cacheLife("armory")` (24h stale, 7d expire) so Gemini is only called once per member per day.

## LLM Model Choice

**Gemini 2.0 Flash** — cheapest model with a generous free tier:
- 15 requests per minute
- 1 million tokens per minute
- Free tier is sufficient for a guild of 25-40 members with 24h caching
- With 24h cache, concurrent rate limit hits are extremely unlikely. If a 429 occurs, return `ARMORY_UNAVAILABLE` and the cached stale response is served.

## Changes to Existing Code

### Files to modify

| File | Change |
|------|--------|
| `docker-compose.yml` | Add `crawl4ai` service with healthcheck |
| `.env` | Add `GEMINI_API_KEY` and `CRAWL4AI_URL` |
| `src/lib/armory.ts` | Rewrite to call crawl4ai REST API instead of HTML fetch + regex |
| `src/lib/trpc/routers/gear.ts` | Simplify — remove Wowhead resolution loop, remove enchant/gem map lookups |
| `src/lib/wow-data/constants.ts` | Add `QUALITY_NAME_TO_NUMBER` map |
| `src/app/(app)/gear/gear-inspector.tsx` | Minor — update to handle `totalSockets` for gem badge logic |

### Files to delete

| File | Reason |
|------|--------|
| `src/lib/wow-data/enchants.ts` | No longer needed — Gemini returns enchant names |
| `src/lib/wow-data/gems.ts` | No longer needed — Gemini returns gem names |
| `src/lib/wow-data/items.ts` | No longer needed — Gemini returns item names, quality, iLvl |

### Files unchanged

| File | Reason |
|------|--------|
| `src/app/(app)/gear/page.tsx` | Server component unchanged |
| `src/app/(app)/gear/loading.tsx` | Skeleton unchanged |
| `src/components/item-tooltip.tsx` | Still uses Wowhead client-side for hover tooltips (uses `itemId` from crawl4ai) |

## Updated Types

### New `RawGearSlot` (replaces the old one)

```ts
export type RawGearSlot = {
  slot: string;
  itemId: number;         // preserved for ItemTooltip hover
  itemName: string;
  itemLevel: number;
  quality: string;        // "epic", "rare", etc.
  enchant: string | null; // human-readable name or null
  gems: string[];         // human-readable gem names
  totalSockets: number;   // for empty socket detection
};
```

The tRPC response shape stays compatible — `itemId` is still present for `ItemTooltip`, `enchant` is already a string (was resolved from map before, now comes directly from Gemini), `gems` is now `string[]` of names instead of `{ name, color }[]` (gem color is dropped — it was not used in the UI for display, only the name was rendered).

## Updated Data Flow

```
Page load → tRPC gear.getByMember(memberId)
  → Fetch member name + core realm from DB
  → fetchArmoryGear(name, realm) [cached 24h]
    → POST crawl4ai /crawl with Warmane URL + schema
    → crawl4ai renders page, sends to Gemini, returns structured JSON
    → Validate with Zod schema
    → Return RawGearSlot[] + RawProfession[]
  → Map quality string → number via QUALITY_NAME_TO_NUMBER for coloring
  → Generate actionable notes
  → Return structured gear data to client
```

## Updated armory.ts

The rewritten `fetchArmoryGear` function:

1. Calls `POST ${CRAWL4AI_URL}/crawl` with the Warmane URL and LLM extraction config
2. Extracts `results[0].extracted_content` from the crawl4ai response
3. Parses and validates with Zod schema
4. Maps to `RawGearSlot[]` + `RawProfession[]`
5. Handles errors: crawl4ai down → `ARMORY_UNAVAILABLE`, character not found → `CHARACTER_NOT_FOUND`, validation failure → `ARMORY_UNAVAILABLE`

## Updated gear.ts tRPC Procedure

Simplified flow:
1. Fetch member + core (unchanged)
2. Call `fetchArmoryGear(name, realm)` — now returns fully resolved data with names
3. Map `quality` string → number via `QUALITY_NAME_TO_NUMBER` for item coloring
4. `enchant` is already a string name (or null) — no lookup needed
5. `gems` is already an array of name strings — no lookup needed
6. Generate actionable notes:
   - Missing enchant: `slot.enchant === null` on an enchantable slot
   - Empty sockets: `slot.gems.length < slot.totalSockets`
7. Return to client

## Quality Name Mapping

Add to `src/lib/wow-data/constants.ts`:

```ts
export const QUALITY_NAME_TO_NUMBER: Record<string, number> = {
  poor: 0,
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  artifact: 6,
  heirloom: 7,
};
```

## Error Handling

- **crawl4ai service down**: `fetch` to `/crawl` fails → return `ARMORY_UNAVAILABLE`
- **Gemini API error / 429 rate limit**: crawl4ai returns error → return `ARMORY_UNAVAILABLE` (stale cache served)
- **Character not found**: Gemini extracts empty/null gear data → return `CHARACTER_NOT_FOUND`
- **Zod validation failure**: LLM returned unexpected shape → log warning, return `ARMORY_UNAVAILABLE`
