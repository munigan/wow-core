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
    shm_size: 1g

volumes:
  pgdata:
```

**Environment variables** (added to `.env`):
```
GEMINI_API_KEY=<key>
CRAWL4AI_URL=http://localhost:11235
```

## Extraction Schema

A single crawl4ai call extracts all character data. The schema sent to the LLM extraction strategy:

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
    slot: string;
    itemName: string;
    itemLevel: number;
    quality: string;       // "epic", "legendary", "rare", "uncommon", "common"
    enchant: string | null;
    gems: string[];
  }[];
  professions: {
    name: string;
    level: number;
    maxLevel: number;
  }[];
};
```

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
      schema: characterJsonSchema,
      instruction: "Extract the character's equipped gear with enchants and gems, professions, and basic character info. For each gear slot, include the enchant name if present and all gem names. Skip Shirt and Tabard slots."
    }
  })
});
```

The function remains wrapped in `"use cache"` with `cacheLife("armory")` (24h stale, 7d expire) so Gemini is only called once per member per day.

## LLM Model Choice

**Gemini 2.0 Flash** — cheapest model with a generous free tier:
- 15 requests per minute
- 1 million tokens per minute
- Free tier is sufficient for a guild of 25-40 members with 24h caching

## Changes to Existing Code

### Files to modify

| File | Change |
|------|--------|
| `docker-compose.yml` | Add `crawl4ai` service |
| `.env` | Add `GEMINI_API_KEY` and `CRAWL4AI_URL` |
| `src/lib/armory.ts` | Rewrite to call crawl4ai REST API instead of HTML fetch + regex |
| `src/lib/trpc/routers/gear.ts` | Simplify — remove Wowhead resolution loop, remove enchant/gem map lookups |
| `src/lib/wow-data/constants.ts` | Add `QUALITY_NAME_TO_NUMBER` map |

### Files to delete

| File | Reason |
|------|--------|
| `src/lib/wow-data/enchants.ts` | No longer needed — Gemini returns enchant names |
| `src/lib/wow-data/gems.ts` | No longer needed — Gemini returns gem names |
| `src/lib/wow-data/items.ts` | No longer needed — Gemini returns item names, quality, iLvl |

### Files unchanged

| File | Reason |
|------|--------|
| `src/app/(app)/gear/gear-inspector.tsx` | UI stays the same — same data shape |
| `src/app/(app)/gear/page.tsx` | Server component unchanged |
| `src/app/(app)/gear/loading.tsx` | Skeleton unchanged |
| `src/components/item-tooltip.tsx` | Still uses Wowhead client-side for hover tooltips |

## Updated Data Flow

```
Page load → tRPC gear.getByMember(memberId)
  → Fetch member name + core realm from DB
  → fetchArmoryGear(name, realm) [cached 24h]
    → POST crawl4ai /crawl with Warmane URL + schema
    → crawl4ai renders page, sends to Gemini, returns structured JSON
    → Parse response into RawGearSlot[] + RawProfession[]
  → Map quality strings to numbers for coloring
  → Generate actionable notes (missing enchants = slot.enchant is null, empty gems = gems array shorter than expected)
  → Return structured gear data to client
```

## Updated armory.ts

The rewritten `fetchArmoryGear` function:

1. Calls `POST ${CRAWL4AI_URL}/crawl` with the Warmane URL and LLM extraction config
2. Parses the crawl4ai response (which contains the extracted JSON)
3. Maps the `CrawledCharacter` type to the existing `RawGearSlot[]` + `RawProfession[]` return shape
4. Handles errors: crawl4ai down → `ARMORY_UNAVAILABLE`, character not found → `CHARACTER_NOT_FOUND`

## Updated gear.ts tRPC Procedure

Simplified flow:
1. Fetch member + core (unchanged)
2. Call `fetchArmoryGear(name, realm)` — now returns fully resolved data
3. Map `quality` string → number via `QUALITY_NAME_TO_NUMBER` for item coloring
4. The `enchant` field is already a string name (or null) — no lookup needed
5. The `gems` field is already an array of gem name strings — no lookup needed
6. Generate actionable notes:
   - Missing enchant: `slot.enchant === null` on an enchantable slot
   - Empty sockets: compare actual gems count vs expected (item sockets info from Gemini)
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
- **Gemini API error**: crawl4ai returns error in response → return `ARMORY_UNAVAILABLE`
- **Character not found**: Gemini extracts empty/null data or crawl4ai reports page error → return `CHARACTER_NOT_FOUND`
- **Malformed response**: JSON parsing fails → return `ARMORY_UNAVAILABLE`

## Gem Socket Detection

With LLM extraction, we can ask Gemini to include the number of sockets per item in the schema. This lets us detect empty sockets accurately:

```ts
gear: {
  // ... existing fields
  totalSockets: number;  // total gem sockets on the item
  gems: string[];        // filled gems (length may be less than totalSockets)
}
```

`hasAllGems = gems.length >= totalSockets`

This is more accurate than the current approach which relies on `0` entries in the `gems` array from the `rel` attribute.
