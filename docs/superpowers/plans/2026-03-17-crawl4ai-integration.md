# Crawl4AI Integration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the regex-based Warmane armory parser with a crawl4ai Docker service that uses Gemini LLM extraction to return structured JSON with item names, enchants, gems, and professions.

**Architecture:** Add crawl4ai as a Docker Compose service. Rewrite `armory.ts` to POST to crawl4ai's `/crawl` endpoint with an LLM extraction schema. Validate the response with Zod. Simplify the gear tRPC router by removing Wowhead resolution and static lookup maps. Delete the now-unused enchant/gem/item data files.

**Tech Stack:** crawl4ai 0.8.0 (Docker), Gemini 2.0 Flash, Zod v4, Next.js 16 cache components

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `docker-compose.yml` | Modify | Add `crawl4ai` service |
| `.env.example` | Modify | Add `GEMINI_API_KEY` and `CRAWL4AI_URL` |
| `.env` | Modify | Add actual env values |
| `src/lib/wow-data/constants.ts` | Modify | Add `QUALITY_NAME_TO_NUMBER` map |
| `src/lib/armory.ts` | Rewrite | Call crawl4ai REST API with LLM extraction + Zod validation |
| `src/lib/trpc/routers/gear.ts` | Simplify | Remove Wowhead/map lookups, use crawl4ai data directly |
| `src/app/(app)/gear/gear-inspector.tsx` | Modify | Update gem display to use `string[]` instead of `{ name, color }[]` |
| `src/lib/wow-data/enchants.ts` | Delete | No longer needed |
| `src/lib/wow-data/gems.ts` | Delete | No longer needed |
| `src/lib/wow-data/items.ts` | Delete | No longer needed |

---

### Task 1: Add crawl4ai to Docker Compose & Environment

**Files:**
- Modify: `docker-compose.yml`
- Modify: `.env.example`
- Modify: `.env`

- [ ] **Step 1: Update docker-compose.yml**

Replace the entire file with:

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

- [ ] **Step 2: Update .env.example**

Add to the end of `.env.example`:

```
GEMINI_API_KEY=
CRAWL4AI_URL=http://localhost:11235
```

- [ ] **Step 3: Update .env**

Add to the end of `.env` (paste your actual Gemini API key):

```
GEMINI_API_KEY=<your-gemini-api-key>
CRAWL4AI_URL=http://localhost:11235
```

- [ ] **Step 4: Start crawl4ai container**

```bash
docker compose up -d crawl4ai
```

Wait for the container to be healthy (may take 30s for Playwright to initialize):

```bash
docker compose ps
```

Expected: `crawl4ai` shows as `healthy`.

- [ ] **Step 5: Verify crawl4ai is running**

```bash
curl http://localhost:11235/health
```

Expected: `200 OK` response.

- [ ] **Step 6: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "chore: add crawl4ai service to docker compose"
```

**Note:** Do NOT commit `.env` — it contains the API key and should be in `.gitignore`.

---

### Task 2: Add Quality Name Mapping to Constants

**Files:**
- Modify: `src/lib/wow-data/constants.ts`

- [ ] **Step 1: Add `QUALITY_NAME_TO_NUMBER` to constants**

Add to the end of `src/lib/wow-data/constants.ts`:

```ts
// Quality name (from Gemini extraction) → quality number (for QUALITY_COLORS lookup)
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

- [ ] **Step 2: Commit**

```bash
git add src/lib/wow-data/constants.ts
git commit -m "feat: add quality name to number mapping for crawl4ai integration"
```

---

### Task 3: Rewrite armory.ts to Use crawl4ai

**Files:**
- Rewrite: `src/lib/armory.ts`

This is the core change. The file is completely rewritten — the regex parsing, slot detection, and HTML entity decoding are all replaced by a single HTTP call to crawl4ai.

**Key references:**
- crawl4ai REST API: `POST /crawl` at `http://localhost:11235`
- Response structure: `response.results[0].extracted_content` contains stringified JSON
- LLM provider: `gemini/gemini-2.0-flash`
- Zod v4 for validation: import from `"zod/v4"` (project convention)
- `"use cache"` + `cacheLife("armory")` for 24h caching (unchanged)
- The Gemini API key is passed in the request body to crawl4ai (it forwards to Gemini)

- [ ] **Step 1: Rewrite armory.ts**

Replace the entire file with:

```ts
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod/v4";

// JSON Schema for crawl4ai LLM extraction (sent in REST API body)
// This is separate from the Zod schema — crawl4ai expects plain JSON Schema, not Zod.
const EXTRACTION_JSON_SCHEMA = {
	type: "object",
	properties: {
		character: {
			type: "object",
			properties: {
				name: { type: "string" },
				level: { type: "number" },
				race: { type: "string" },
				class: { type: "string" },
				spec: { type: "string" },
				guild: { type: ["string", "null"] },
				realm: { type: "string" },
			},
			required: ["name", "level", "race", "class", "spec", "realm"],
		},
		gear: {
			type: "array",
			items: {
				type: "object",
				properties: {
					slot: { type: "string" },
					itemId: { type: "number" },
					itemName: { type: "string" },
					itemLevel: { type: "number" },
					quality: { type: "string" },
					enchant: { type: ["string", "null"] },
					gems: { type: "array", items: { type: "string" } },
					totalSockets: { type: "number" },
				},
				required: ["slot", "itemId", "itemName", "itemLevel", "quality", "gems", "totalSockets"],
			},
		},
		professions: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					level: { type: "number" },
					maxLevel: { type: "number" },
				},
				required: ["name", "level", "maxLevel"],
			},
		},
	},
	required: ["character", "gear", "professions"],
};

// Zod schema for runtime validation of crawl4ai response
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
	gear: z.array(
		z.object({
			slot: z.string(),
			itemId: z.number(),
			itemName: z.string(),
			itemLevel: z.number(),
			quality: z.string(),
			enchant: z.string().nullable(),
			gems: z.array(z.string()),
			totalSockets: z.number(),
		}),
	),
	professions: z.array(
		z.object({
			name: z.string(),
			level: z.number(),
			maxLevel: z.number(),
		}),
	),
});

export type CrawledCharacter = z.infer<typeof crawledCharacterSchema>;

export type RawGearSlot = {
	slot: string;
	itemId: number;
	itemName: string;
	itemLevel: number;
	quality: string;
	enchant: string | null;
	gems: string[];
	totalSockets: number;
};

export type RawProfession = {
	name: string;
	level: number;
	maxLevel: number;
};

export type ArmoryResult =
	| { success: true; gear: RawGearSlot[]; professions: RawProfession[] }
	| { success: false; error: "CHARACTER_NOT_FOUND" | "ARMORY_UNAVAILABLE" };

export async function fetchArmoryGear(
	name: string,
	realm: string,
): Promise<ArmoryResult> {
	"use cache";
	cacheLife("armory");
	cacheTag("armory-gear", name);

	const crawl4aiUrl = process.env.CRAWL4AI_URL;
	if (!crawl4aiUrl) {
		console.error("CRAWL4AI_URL not configured");
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}

	const capitalizedRealm =
		realm.charAt(0).toUpperCase() + realm.slice(1).toLowerCase();
	const armoryUrl = `https://armory.warmane.com/character/${encodeURIComponent(name)}/${encodeURIComponent(capitalizedRealm)}/summary`;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 60_000);

		const response = await fetch(`${crawl4aiUrl}/crawl`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
			body: JSON.stringify({
				urls: [armoryUrl],
				extraction_strategy: {
					type: "llm",
					provider: "gemini/gemini-2.0-flash",
					api_token: process.env.GEMINI_API_KEY,
					schema: EXTRACTION_JSON_SCHEMA,
					instruction:
						"Extract the character's equipped gear, professions, and basic info from this WoW armory page. For each gear slot, extract: the item ID from the wotlk.cavernoftime.com/item=XXXXX link, the item name, item level, quality (poor/common/uncommon/rare/epic/legendary), enchant name if present (null if none), all gem names as an array of strings, and the total number of gem sockets on the item. Skip Shirt and Tabard slots. For professions, extract name, current level, and max level.",
				},
			}),
		});

		clearTimeout(timeout);

		if (!response.ok) {
			console.error(`crawl4ai returned ${response.status}`);
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const crawlResponse = await response.json();

		// crawl4ai returns results array with extracted_content as stringified JSON
		const extractedContent = crawlResponse?.results?.[0]?.extracted_content;
		if (!extractedContent) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		const parsed =
			typeof extractedContent === "string"
				? JSON.parse(extractedContent)
				: extractedContent;

		// Handle case where Gemini returns an array
		const data = Array.isArray(parsed) ? parsed[0] : parsed;

		const validated = crawledCharacterSchema.safeParse(data);
		if (!validated.success) {
			console.error("crawl4ai response validation failed:", validated.error);
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const character = validated.data;

		if (character.gear.length === 0) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		return {
			success: true,
			gear: character.gear.map((slot) => ({
				slot: slot.slot,
				itemId: slot.itemId,
				itemName: slot.itemName,
				itemLevel: slot.itemLevel,
				quality: slot.quality,
				enchant: slot.enchant,
				gems: slot.gems,
				totalSockets: slot.totalSockets,
			})),
			professions: character.professions,
		};
	} catch (err) {
		console.error("crawl4ai fetch error:", err);
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/armory.ts
git commit -m "feat: rewrite armory parser to use crawl4ai with Gemini LLM extraction"
```

---

### Task 4: Simplify Gear tRPC Router

**Files:**
- Modify: `src/lib/trpc/routers/gear.ts`

Remove the Wowhead item resolution loop, the `ENCHANT_MAP` / `GEM_MAP` imports, and the `fetchItemData` import. The crawl4ai response already has fully resolved names.

**Behavioral changes from old code:**
- `itemIcon` field is dropped (was unused by `gear-inspector.tsx` — confirmed by grep)
- `gems` type changes from `{ name: string; color: string }[]` to `{ name: string }[]` (color dropped — was never displayed in the UI, only `gem.name` was rendered)
- `hasAllGems` logic changes from `!hasEmptySocket || gemIds.length === 0` to `gems.length >= totalSockets` (cleaner, same behavior for zero-socket items since `0 >= 0` is true)
- `Ring 1` / `Ring 2` remain in `ENCHANTABLE_SLOTS` — technically only Enchanters can enchant rings, but filtering by profession is a follow-up improvement

- [ ] **Step 1: Rewrite gear.ts**

Replace the entire file with:

```ts
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { fetchArmoryGear } from "@/lib/armory";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { members } from "@/lib/db/schema/members";
import { QUALITY_NAME_TO_NUMBER } from "@/lib/wow-data/constants";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const ENCHANTABLE_SLOTS = new Set([
	"Head",
	"Shoulders",
	"Back",
	"Chest",
	"Wrist",
	"Hands",
	"Legs",
	"Feet",
	"Main Hand",
	"Off Hand",
	"Ring 1",
	"Ring 2",
]);

export const gearRouter = createTRPCRouter({
	getByMember: protectedProcedure
		.input(z.object({ memberId: z.string() }))
		.query(async ({ ctx, input }) => {
			const member = await db
				.select()
				.from(members)
				.where(
					and(eq(members.id, input.memberId), eq(members.coreId, ctx.coreId)),
				)
				.then((rows) => rows[0]);

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Member not found",
				});
			}

			const core = await db
				.select({ realm: cores.realm })
				.from(cores)
				.where(eq(cores.id, ctx.coreId))
				.then((rows) => rows[0]);

			if (!core) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Core not found",
				});
			}

			const armoryResult = await fetchArmoryGear(member.name, core.realm);

			if (!armoryResult.success) {
				return {
					member: {
						id: member.id,
						name: member.name,
						class: member.class,
					},
					gear: [],
					professions: [],
					notes: [],
					error: armoryResult.error,
				};
			}

			// Build gear response — data is already resolved by crawl4ai
			const gear = armoryResult.gear.map((slot) => {
				const isEnchantable = ENCHANTABLE_SLOTS.has(slot.slot);
				const qualityNumber =
					QUALITY_NAME_TO_NUMBER[slot.quality.toLowerCase()] ?? 0;

				return {
					slot: slot.slot,
					itemId: slot.itemId,
					itemName: slot.itemName,
					itemQuality: qualityNumber,
					itemLevel: slot.itemLevel,
					enchant: slot.enchant,
					gems: slot.gems.map((name) => ({ name })),
					isEnchantable,
					hasAllGems: slot.gems.length >= slot.totalSockets,
				};
			});

			// Generate actionable notes
			const notes: {
				severity: "error" | "warning" | "info";
				message: string;
			}[] = [];
			for (const slot of gear) {
				if (slot.isEnchantable && !slot.enchant) {
					notes.push({
						severity: "error",
						message: `Missing enchant on ${slot.slot} (${slot.itemName})`,
					});
				}
				if (!slot.hasAllGems) {
					notes.push({
						severity: "warning",
						message: `Empty gem socket in ${slot.slot} (${slot.itemName})`,
					});
				}
			}

			return {
				member: {
					id: member.id,
					name: member.name,
					class: member.class,
				},
				gear,
				professions: armoryResult.professions,
				notes,
				error: null,
			};
		}),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/trpc/routers/gear.ts
git commit -m "refactor: simplify gear router using crawl4ai resolved data"
```

---

### Task 5: Update Gear Inspector for New Gem Type

**Files:**
- Modify: `src/app/(app)/gear/gear-inspector.tsx`

The gem type changed from `{ name: string; color: string }` to `{ name: string }` (gem color dropped). Update the tooltip rendering.

- [ ] **Step 1: Update gem tooltip rendering**

In `src/app/(app)/gear/gear-inspector.tsx`, find the gem tooltip section (around line 200-205):

```tsx
{slot.gems.map((gem, i) => (
	<span key={i} className="font-body text-xs text-primary">
		{gem.name}
	</span>
))}
```

This already works since we're only accessing `gem.name`. However, the `gems` type from tRPC changed to `{ name: string }[]` (without `color`). TypeScript should still be happy since we only use `.name`. Verify no build errors.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit if changes were needed**

Only commit if the file needed modification. Skip if no changes were required.

---

### Task 6: Delete Unused Data Files

**Files:**
- Delete: `src/lib/wow-data/enchants.ts`
- Delete: `src/lib/wow-data/gems.ts`
- Delete: `src/lib/wow-data/items.ts`

- [ ] **Step 1: Delete the files**

```bash
rm src/lib/wow-data/enchants.ts src/lib/wow-data/gems.ts src/lib/wow-data/items.ts
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "wow-data/enchants\|wow-data/gems\|wow-data/items" src/
```

Expected: No results. If any file still imports these, fix the import.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git rm src/lib/wow-data/enchants.ts src/lib/wow-data/gems.ts src/lib/wow-data/items.ts
git commit -m "chore: delete unused enchant, gem, and item data files"
```

---

### Task 7: Integration Verification

- [ ] **Step 1: Ensure crawl4ai is running**

```bash
docker compose ps
```

Expected: `crawl4ai` container is `healthy`.

- [ ] **Step 2: Build check**

```bash
pnpm build
```

Expected: Build passes. `/gear` route shows in the route list.

- [ ] **Step 3: Start dev server and test**

```bash
pnpm dev
```

Navigate to `/gear` in the browser. Verify:
1. Member dropdown populates and auto-selects first member
2. Gear table renders with item names, quality colors, and iLvl
3. **Enchanted column shows [YES] badges** for enchanted items (with enchant name on hover)
4. **Gemmed column shows [YES] badges** for fully gemmed items (with gem names on hover)
5. [NO] badges appear for missing enchants and empty sockets
6. Actionable notes section lists missing enchants and empty sockets
7. Professions display correctly with [MAX] badge
8. "View Armory" button links to correct URL

- [ ] **Step 4: Test error handling**

- Change member name temporarily to a non-existent character → should show "Character not found"
- Stop crawl4ai container (`docker compose stop crawl4ai`) → should show "Warmane armory is currently unavailable"
- Restart crawl4ai after testing: `docker compose up -d crawl4ai`

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address integration issues in crawl4ai gear page"
```

Only run if fixes were needed.
