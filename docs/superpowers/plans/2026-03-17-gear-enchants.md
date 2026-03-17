# Gear & Enchants Page — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a gear inspection page that fetches live character data from Warmane armory, showing equipped items, enchants, gems, and professions with actionable notes for missing enchants/gems.

**Architecture:** A tRPC procedure calls cached functions that fetch the Warmane armory HTML, parse `rel` attributes for gear data, and resolve item names via the Wowhead API. Enchant/gem names come from static lookup maps. The page uses `nuqs` for member selection state and renders a gear table with tooltips, badges, and an actionable notes section.

**Tech Stack:** Next.js 16 (App Router, cache components), tRPC v11, Tailwind CSS v4, nuqs, Wowhead tooltip API, static WotLK data maps

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `next.config.ts` | Modify | Add `cacheComponents: true` and `armory` cache profile |
| `src/lib/wow-data/constants.ts` | Create | Shared constants: `QUALITY_COLORS`, slot lists |
| `src/lib/wow-data/enchants.ts` | Create | Static enchant entry ID → name map |
| `src/lib/wow-data/gems.ts` | Create | Static gem entry ID → { name, color } map |
| `src/lib/wow-data/items.ts` | Create | `fetchItemData()` with `"use cache"` for Wowhead API |
| `src/lib/armory.ts` | Create | `fetchArmoryGear()` with `"use cache"` — HTML fetch + parse |
| `src/lib/trpc/routers/gear.ts` | Create | `gear.getByMember` tRPC procedure |
| `src/lib/trpc/routers/_app.ts` | Modify | Register gear router |
| `src/app/(app)/gear/page.tsx` | Modify | Server component with tRPC prefetch |
| `src/app/(app)/gear/gear-inspector.tsx` | Create | Client component — member selector, gear table, notes |
| `src/app/(app)/gear/loading.tsx` | Create | Loading skeleton |

---

### Task 1: Enable Cache Components in Next.js Config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	cacheLife: {
		armory: {
			stale: 86400,
			revalidate: 86400,
			expire: 604800,
		},
	},
};

export default nextConfig;
```

- [ ] **Step 2: Verify dev server still starts**

```bash
pnpm dev
```

Expected: No errors. The cache config is passive until `"use cache"` is used.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: enable cache components with armory cache profile"
```

---

### Task 2: Create Static Data Maps & Shared Constants

**Files:**
- Create: `src/lib/wow-data/constants.ts`
- Create: `src/lib/wow-data/enchants.ts`
- Create: `src/lib/wow-data/gems.ts`

These are static TypeScript maps for WotLK enchant entry IDs → names. The IDs come from the Warmane armory `rel` attributes (e.g., `ench=3368`, `gems=3552:3535:0`). These are NOT item IDs or spell IDs — they are enchantment entry IDs from the WoW DB.

**Important:** Enchant IDs and gem IDs live in SEPARATE ID namespaces. Some numeric IDs appear in both maps (e.g., 3595, 3603) — this is expected and correct. The armory uses separate `ench=` and `gems=` keys, so lookups always use the correct map.

- [ ] **Step 1: Create shared constants**

Create `src/lib/wow-data/constants.ts`:

```ts
// WoW item quality number → hex color
// Used in both ItemTooltip (client) and gear table (client)
export const QUALITY_COLORS: Record<number, string> = {
	0: "#9d9d9d",
	1: "#ffffff",
	2: "#1eff00",
	3: "#0070dd",
	4: "#a335ee",
	5: "#ff8000",
	6: "#e6cc80",
	7: "#00ccff",
};
```

- [ ] **Step 2: Create the enchant map**

Create `src/lib/wow-data/enchants.ts`. This map needs to cover all common WotLK raiding enchants. Here are the known IDs from the Warmane armory data we inspected:

```ts
// Enchant entry ID → display name
// These are enchantment entry IDs (ench= parameter in Warmane armory rel attributes).
// This is a SEPARATE ID namespace from gem enchant entries — some IDs may numerically
// match gem IDs but refer to completely different things.
// Source: WotLK enchantment entry IDs as found in Warmane armory rel attributes
export const ENCHANT_MAP: Record<number, string> = {
	// Head
	3795: "Arcanum of Torment",
	3797: "Arcanum of Burning Mysteries",
	3819: "Arcanum of Blissful Mending",
	3842: "Arcanum of the Stalwart Protector",

	// Shoulders
	3793: "Inscription of Triumph",
	3794: "Inscription of Dominance",
	3808: "Greater Inscription of the Axe",
	3809: "Greater Inscription of the Crag",
	3810: "Greater Inscription of the Pinnacle",
	3811: "Greater Inscription of the Storm",
	3852: "Greater Inscription of the Gladiator",
	3875: "Master's Inscription of the Axe",
	3876: "Master's Inscription of the Crag",
	3835: "Master's Inscription of the Pinnacle",
	3836: "Master's Inscription of the Storm",

	// Back
	3243: "Spell Piercing",
	3256: "Shadow Armor",
	3294: "Mighty Armor",
	3831: "Greater Speed",
	3605: "Flexweave Underlay",
	3859: "Springy Arachnoweave",
	3722: "Scroll of Enchant Cloak - Superior Arcane Resistance",
	3825: "Enchant Cloak - Titanweave",

	// Chest
	3245: "Exceptional Resilience",
	3252: "Super Stats",
	3832: "Powerful Stats",
	3297: "Super Health",
	3233: "Exceptional Mana",

	// Wrist
	3845: "Greater Assault",
	3850: "Major Stamina",
	2332: "Superior Spellpower",
	3758: "Fur Lining - Attack Power",
	3757: "Fur Lining - Spell Power",
	3756: "Fur Lining - Stamina",
	3760: "Fur Lining - Arcane Resist",
	3763: "Socket Bracer",

	// Hands
	3604: "Hyperspeed Accelerators",
	3253: "Armsman",
	3246: "Exceptional Spellpower",
	3234: "Crusher",
	3603: "Hand-Mounted Pyro Rocket",
	3860: "Reticulated Armor Webbing",

	// Legs
	3853: "Earthen Leg Armor",
	3822: "Frosthide Leg Armor",
	3823: "Icescale Leg Armor",
	3325: "Brilliant Spellthread",
	3326: "Sapphire Spellthread",
	3827: "Nerubian Leg Reinforcements",

	// Feet
	3606: "Nitro Boosts",
	3232: "Tuskarr's Vitality",
	3826: "Icewalker",
	1597: "Greater Assault",
	3824: "Greater Fortitude",
	983: "Superior Agility",

	// Weapons
	3368: "Rune of the Fallen Crusader",
	3369: "Rune of Cinderglacier",
	3370: "Rune of Razorice",
	3365: "Rune of Swordshattering",
	3594: "Rune of Spellshattering",
	3595: "Rune of Spellbreaking",
	3366: "Rune of Swordbreaking",
	3847: "Rune of the Stoneskin Gargoyle",
	3883: "Rune of the Nerubian Carapace",
	3790: "Black Magic",
	3789: "Berserking",
	3788: "Accuracy",
	3834: "Mighty Spellpower",
	3833: "Superior Potency",
	3830: "Exceptional Spellpower",
	3844: "Greater Savagery",
	3225: "Executioner",
	3869: "Blade Ward",
	3870: "Blood Draining",
	3241: "Titanium Weapon Chain",
	1103: "Greater Agility",

	// Shield
	1952: "Defense",
	3748: "Titanium Plating",
	3849: "Titanium Shield Spike",

	// Rings (enchanter only)
	3839: "Assault",
	3840: "Greater Spellpower",
	3838: "Stamina",
	3791: "SP",
};
```

**Note:** This map may not be exhaustive. Unknown IDs display "Unknown Enchant" as fallback. Additional entries can be added over time as they're discovered.

- [ ] **Step 3: Create the gem map**

Create `src/lib/wow-data/gems.ts`:

```ts
export type GemColor = "red" | "blue" | "yellow" | "meta" | "prismatic" | "orange" | "green" | "purple";

export type GemData = {
	name: string;
	color: GemColor;
};

// Gem enchant entry ID → gem data
// These are gem enchantment entry IDs (gems= parameter in Warmane armory rel attributes).
// This is a SEPARATE ID namespace from gear enchant entries — some IDs may numerically
// match enchant IDs but refer to completely different things.
// Source: WotLK gem enchantment entries as found in Warmane armory rel attributes
export const GEM_MAP: Record<number, GemData> = {
	// Meta gems
	3627: { name: "Relentless Earthsiege Diamond", color: "meta" },
	3621: { name: "Chaotic Skyflare Diamond", color: "meta" },
	3628: { name: "Austere Earthsiege Diamond", color: "meta" },
	3632: { name: "Ember Skyflare Diamond", color: "meta" },
	3631: { name: "Forlorn Skyflare Diamond", color: "meta" },
	3622: { name: "Destructive Skyflare Diamond", color: "meta" },
	3624: { name: "Enigmatic Skyflare Diamond", color: "meta" },
	3626: { name: "Revitalizing Skyflare Diamond", color: "meta" },
	3629: { name: "Eternal Earthsiege Diamond", color: "meta" },
	3630: { name: "Powerful Earthsiege Diamond", color: "meta" },
	3633: { name: "Trenchant Earthsiege Diamond", color: "meta" },
	3623: { name: "Swift Skyflare Diamond", color: "meta" },
	3625: { name: "Impassive Skyflare Diamond", color: "meta" },
	3634: { name: "Thundering Skyflare Diamond", color: "meta" },
	3635: { name: "Insightful Earthsiege Diamond", color: "meta" },
	3636: { name: "Beaming Earthsiege Diamond", color: "meta" },
	3643: { name: "Chaotic Skyflare Diamond", color: "meta" },

	// Red gems (Cardinal Ruby)
	3552: { name: "Delicate Cardinal Ruby", color: "red" },
	3535: { name: "Bold Cardinal Ruby", color: "red" },
	3546: { name: "Bright Cardinal Ruby", color: "red" },
	3547: { name: "Fractured Cardinal Ruby", color: "red" },
	3548: { name: "Precise Cardinal Ruby", color: "red" },
	3549: { name: "Subtle Cardinal Ruby", color: "red" },
	3550: { name: "Flashing Cardinal Ruby", color: "red" },
	3551: { name: "Runed Cardinal Ruby", color: "red" },

	// Blue gems (Majestic Zircon)
	3553: { name: "Solid Majestic Zircon", color: "blue" },
	3554: { name: "Sparkling Majestic Zircon", color: "blue" },
	3555: { name: "Lustrous Majestic Zircon", color: "blue" },
	3556: { name: "Stormy Majestic Zircon", color: "blue" },

	// Yellow gems (King's Amber)
	3557: { name: "Thick King's Amber", color: "yellow" },
	3558: { name: "Mystic King's Amber", color: "yellow" },
	3559: { name: "Quick King's Amber", color: "yellow" },
	3560: { name: "Smooth King's Amber", color: "yellow" },
	3561: { name: "Rigid King's Amber", color: "yellow" },

	// Orange gems (Ametrine)
	3562: { name: "Accurate Ametrine", color: "orange" },
	3563: { name: "Champion's Ametrine", color: "orange" },
	3564: { name: "Deadly Ametrine", color: "orange" },
	3565: { name: "Deft Ametrine", color: "orange" },
	3566: { name: "Fierce Ametrine", color: "orange" },
	3567: { name: "Inscribed Ametrine", color: "orange" },
	3568: { name: "Lucent Ametrine", color: "orange" },
	3569: { name: "Luminous Ametrine", color: "orange" },
	3570: { name: "Potent Ametrine", color: "orange" },
	3571: { name: "Pristine Ametrine", color: "orange" },
	3572: { name: "Reckless Ametrine", color: "orange" },
	3573: { name: "Resolute Ametrine", color: "orange" },
	3574: { name: "Resplendent Ametrine", color: "orange" },
	3575: { name: "Stalwart Ametrine", color: "orange" },
	3576: { name: "Veiled Ametrine", color: "orange" },
	3577: { name: "Wicked Ametrine", color: "orange" },
	3578: { name: "Willful Ametrine", color: "orange" },

	// Green gems (Eye of Zul)
	3579: { name: "Energized Eye of Zul", color: "green" },
	3580: { name: "Forceful Eye of Zul", color: "green" },
	3581: { name: "Intricate Eye of Zul", color: "green" },
	3582: { name: "Jagged Eye of Zul", color: "green" },
	3583: { name: "Lambent Eye of Zul", color: "green" },
	3584: { name: "Misty Eye of Zul", color: "green" },
	3585: { name: "Opaque Eye of Zul", color: "green" },
	3586: { name: "Radiant Eye of Zul", color: "green" },
	3587: { name: "Shattered Eye of Zul", color: "green" },
	3588: { name: "Steady Eye of Zul", color: "green" },
	3589: { name: "Sundered Eye of Zul", color: "green" },
	3590: { name: "Tense Eye of Zul", color: "green" },
	3591: { name: "Turbid Eye of Zul", color: "green" },
	3592: { name: "Vivid Eye of Zul", color: "green" },

	// Purple gems (Dreadstone)
	3593: { name: "Balanced Dreadstone", color: "purple" },
	3530: { name: "Shifting Dreadstone", color: "purple" },
	3595: { name: "Defender's Dreadstone", color: "purple" },
	3596: { name: "Glowing Dreadstone", color: "purple" },
	3597: { name: "Guardian's Dreadstone", color: "purple" },
	3598: { name: "Infused Dreadstone", color: "purple" },
	3599: { name: "Mysterious Dreadstone", color: "purple" },
	3600: { name: "Puissant Dreadstone", color: "purple" },
	3601: { name: "Regal Dreadstone", color: "purple" },
	3602: { name: "Royal Dreadstone", color: "purple" },
	3603: { name: "Tenuous Dreadstone", color: "purple" },

	// Prismatic gems
	3544: { name: "Nightmare Tear", color: "prismatic" },

	// Jewelcrafter-only gems (Dragon's Eye)
	3536: { name: "Bold Dragon's Eye", color: "prismatic" },
	3537: { name: "Delicate Dragon's Eye", color: "prismatic" },
	3538: { name: "Runed Dragon's Eye", color: "prismatic" },
	3539: { name: "Bright Dragon's Eye", color: "prismatic" },
	3540: { name: "Solid Dragon's Eye", color: "prismatic" },
	3541: { name: "Sparkling Dragon's Eye", color: "prismatic" },
	3542: { name: "Rigid Dragon's Eye", color: "prismatic" },
	3543: { name: "Smooth Dragon's Eye", color: "prismatic" },
	3545: { name: "Mystic Dragon's Eye", color: "prismatic" },

	// Lower-tier gems (Scarlet Ruby, Autumn's Glow, etc.) — common in pre-BiS
	3461: { name: "Delicate Scarlet Ruby", color: "red" },
	3459: { name: "Bold Scarlet Ruby", color: "red" },
	3468: { name: "Runed Scarlet Ruby", color: "red" },
	3744: { name: "Nightmare Tear", color: "prismatic" },
};
```

**Note:** Some IDs may overlap or be approximate. The map can be expanded as new IDs are discovered in the wild. Unknown IDs fall back to "Unknown Gem".

- [ ] **Step 4: Commit**

```bash
git add src/lib/wow-data/constants.ts src/lib/wow-data/enchants.ts src/lib/wow-data/gems.ts
git commit -m "feat: add static WotLK enchant/gem lookup maps and shared constants"
```

---

### Task 3: Create Cached Wowhead Item Tooltip Fetcher

**Files:**
- Create: `src/lib/wow-data/items.ts`

This is a server-side function that fetches item data from the Wowhead tooltip API with `"use cache"` for permanent caching (item data never changes).

**Important:** The existing `ItemTooltip` component (`src/components/item-tooltip.tsx`) fetches on the client via TanStack Query. This new function fetches on the server for the tRPC procedure. They use the same Wowhead endpoint but are separate because one is client-side (React component) and the other is server-side (cached function).

- [ ] **Step 1: Create the server-side item fetcher**

Create `src/lib/wow-data/items.ts`:

```ts
import { cacheLife, cacheTag } from "next/cache";

export type ItemData = {
	itemId: number;
	name: string;
	quality: number;
	icon: string;
	itemLevel: number;
};

export async function fetchItemData(itemId: number): Promise<ItemData> {
	"use cache";
	cacheLife("max");
	cacheTag("wowhead-item", String(itemId));

	try {
		const res = await fetch(
			`https://nether.wowhead.com/wotlk/tooltip/item/${itemId}`,
		);
		if (!res.ok) {
			return { itemId, name: "Unknown Item", quality: 0, icon: "", itemLevel: 0 };
		}

		const data = await res.json();
		const itemLevelMatch = data.tooltip?.match(/Item Level (\d+)/);
		const itemLevel = itemLevelMatch ? Number.parseInt(itemLevelMatch[1], 10) : 0;

		return {
			itemId,
			name: data.name ?? "Unknown Item",
			quality: data.quality ?? 0,
			icon: data.icon ?? "",
			itemLevel,
		};
	} catch {
		return { itemId, name: "Unknown Item", quality: 0, icon: "", itemLevel: 0 };
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/wow-data/items.ts
git commit -m "feat: add cached server-side Wowhead item tooltip fetcher"
```

---

### Task 4: Create Armory HTML Parser

**Files:**
- Create: `src/lib/armory.ts`

Fetches a Warmane armory page and parses gear data from `rel` attributes. Cached with `"use cache"` + 24-hour `cacheLife('armory')`.

**Key parsing logic:**
- Item links have `rel="item=49623&ench=3368&gems=3552:3552:3552&transmog=22691"`
- Quality is in parent class: `icon-quality4` = epic (4), `icon-quality5` = legendary (5)
- Slots are in fixed WoW order (19 positions including Tabard/Shirt/empty)
- Professions are in the sidebar with format "Engineering 435 / 450"

- [ ] **Step 1: Create the armory parser**

Create `src/lib/armory.ts`:

```ts
import { cacheLife, cacheTag } from "next/cache";

const SLOT_NAMES = [
	"Head", "Neck", "Shoulders", "Back", "Chest",
	"Tabard", "Shirt", "Wrist", "Hands", "Waist",
	"Legs", "Feet", "Ring 1", "Ring 2",
	"Trinket 1", "Trinket 2", "Main Hand", "Off Hand",
] as const;

const EXCLUDED_SLOTS = new Set(["Tabard", "Shirt"]);

export type RawGearSlot = {
	slot: string;
	itemId: number;
	quality: number;
	enchantId: number | null;
	gemIds: number[];
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

	try {
		const url = `https://armory.warmane.com/character/${encodeURIComponent(name)}/${encodeURIComponent(realm)}/summary`;
		const res = await fetch(url, {
			headers: { "User-Agent": "WowRaidTools/1.0" },
		});

		if (!res.ok) {
			return { success: false, error: "ARMORY_UNAVAILABLE" };
		}

		const html = await res.text();

		// Check if character exists
		if (html.includes("does not exist") || html.includes("does not meet the minimum")) {
			return { success: false, error: "CHARACTER_NOT_FOUND" };
		}

		// Parse gear slots from rel attributes
		const gear = parseGearFromHtml(html);
		const professions = parseProfessionsFromHtml(html);

		return { success: true, gear, professions };
	} catch {
		return { success: false, error: "ARMORY_UNAVAILABLE" };
	}
}

function parseGearFromHtml(html: string): RawGearSlot[] {
	const gear: RawGearSlot[] = [];

	// Match all icon-quality elements with their item links
	// Pattern: <div class="icon-quality icon-qualityN"><a ... rel="item=XXX&ench=YYY&gems=Z:Z:Z">
	const itemPattern =
		/class="icon-quality(?:\s+icon-quality(\d+))?(?:\s+tooltip)?"[^>]*>\s*<a[^>]*rel="([^"]*)"[^>]*>/g;

	let match: RegExpExecArray | null;
	let slotIndex = 0;

	match = itemPattern.exec(html);
	while (match !== null) {
		const quality = match[1] ? Number.parseInt(match[1], 10) : 0;
		const rel = match[2];

		if (!rel || !rel.startsWith("item=")) {
			slotIndex++;
			match = itemPattern.exec(html);
			continue;
		}

		const params = new URLSearchParams(rel);
		const itemId = Number.parseInt(params.get("item") ?? "0", 10);
		const enchantId = params.get("ench")
			? Number.parseInt(params.get("ench") as string, 10)
			: null;
		const gemIds = (params.get("gems") ?? "")
			.split(":")
			.map((g) => Number.parseInt(g, 10))
			.filter((g) => !Number.isNaN(g));

		const slotName = SLOT_NAMES[slotIndex] ?? `Slot ${slotIndex}`;

		if (!EXCLUDED_SLOTS.has(slotName) && itemId > 0) {
			gear.push({
				slot: slotName,
				itemId,
				quality,
				enchantId,
				gemIds,
			});
		}

		slotIndex++;
		match = itemPattern.exec(html);
	}

	return gear;
}

function parseProfessionsFromHtml(html: string): RawProfession[] {
	const professions: RawProfession[] = [];

	// Professions section contains text like "Engineering 435 / 450"
	const profPattern = /(?:Engineering|Blacksmithing|Jewelcrafting|Alchemy|Enchanting|Tailoring|Leatherworking|Inscription|Mining|Herbalism|Skinning)\s+(\d+)\s*\/\s*(\d+)/g;

	let match: RegExpExecArray | null;
	match = profPattern.exec(html);
	while (match !== null) {
		const fullMatch = match[0];
		const name = fullMatch.split(/\s+\d/)[0];
		professions.push({
			name,
			level: Number.parseInt(match[1], 10),
			maxLevel: Number.parseInt(match[2], 10),
		});
		match = profPattern.exec(html);
	}

	return professions;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/armory.ts
git commit -m "feat: add cached Warmane armory HTML parser"
```

---

### Task 5: Create Gear tRPC Router

**Files:**
- Create: `src/lib/trpc/routers/gear.ts`
- Modify: `src/lib/trpc/routers/_app.ts`

The tRPC procedure fetches armory data, resolves IDs to names, and generates actionable notes.

**DB references:**
- `members` table: `id`, `name`, `class`, `coreId` — schema at `src/lib/db/schema/members.ts`
- `cores` table: `id`, `realm` — schema at `src/lib/db/schema/cores.ts`

**Enchantable slots** in WotLK: Head, Shoulders, Back, Chest, Wrist, Hands, Legs, Feet, Main Hand, Off Hand, Ring 1, Ring 2. Waist, Neck, Trinkets are NOT enchantable.

- [ ] **Step 1: Create the gear router**

Create `src/lib/trpc/routers/gear.ts`:

```ts
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { fetchArmoryGear } from "@/lib/armory";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { members } from "@/lib/db/schema/members";
import { ENCHANT_MAP } from "@/lib/wow-data/enchants";
import { GEM_MAP } from "@/lib/wow-data/gems";
import { fetchItemData } from "@/lib/wow-data/items";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

const ENCHANTABLE_SLOTS = new Set([
	"Head", "Shoulders", "Back", "Chest", "Wrist",
	"Hands", "Legs", "Feet", "Main Hand", "Off Hand",
	"Ring 1", "Ring 2",
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
				throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			}

			const core = await db
				.select({ realm: cores.realm })
				.from(cores)
				.where(eq(cores.id, ctx.coreId))
				.then((rows) => rows[0]);

			if (!core) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Core not found" });
			}

			const armoryResult = await fetchArmoryGear(member.name, core.realm);

			if (!armoryResult.success) {
				return {
					member: { id: member.id, name: member.name, class: member.class },
					gear: [],
					professions: [],
					notes: [],
					error: armoryResult.error,
				};
			}

			// Resolve all item IDs in parallel
			const itemDataMap = new Map<number, Awaited<ReturnType<typeof fetchItemData>>>();
			const uniqueItemIds = [...new Set(armoryResult.gear.map((g) => g.itemId))];
			const itemResults = await Promise.all(
				uniqueItemIds.map((id) => fetchItemData(id)),
			);
			for (const item of itemResults) {
				itemDataMap.set(item.itemId, item);
			}

			// Build gear response with resolved names
			const gear = armoryResult.gear.map((slot) => {
				const item = itemDataMap.get(slot.itemId);
				const isEnchantable = ENCHANTABLE_SLOTS.has(slot.slot);
				const enchant = slot.enchantId
					? (ENCHANT_MAP[slot.enchantId] ?? `Unknown Enchant (${slot.enchantId})`)
					: null;

				const gems = slot.gemIds
					.filter((id) => id !== 0)
					.map((id) => {
						const gem = GEM_MAP[id];
						return gem
							? { name: gem.name, color: gem.color }
							: { name: `Unknown Gem (${id})`, color: "prismatic" as const };
					});

				const hasEmptySocket = slot.gemIds.some((id) => id === 0);

				return {
					slot: slot.slot,
					itemId: slot.itemId,
					itemName: item?.name ?? "Unknown Item",
					itemQuality: item?.quality ?? slot.quality,
					itemLevel: item?.itemLevel ?? 0,
					itemIcon: item?.icon ?? "",
					enchant,
					gems,
					isEnchantable,
					hasAllGems: !hasEmptySocket || slot.gemIds.length === 0,
				};
			});

			// Generate actionable notes
			const notes: { severity: "error" | "warning" | "info"; message: string }[] = [];
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
				member: { id: member.id, name: member.name, class: member.class },
				gear,
				professions: armoryResult.professions,
				notes,
				error: null,
			};
		}),
});
```

- [ ] **Step 2: Register the gear router in `_app.ts`**

Add the import and router entry to `src/lib/trpc/routers/_app.ts`. Do NOT replace the whole file — only add these two changes:

Add import at top:
```ts
import { gearRouter } from "@/lib/trpc/routers/gear";
```

Add `gear: gearRouter` to the `createTRPCRouter` call:
```ts
export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
	gear: gearRouter,
});
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/trpc/routers/gear.ts src/lib/trpc/routers/_app.ts
git commit -m "feat: add gear tRPC router with armory fetch and ID resolution"
```

---

### Task 6: Create Gear Inspector Client Component

**Files:**
- Create: `src/app/(app)/gear/gear-inspector.tsx`

This is the main client component that renders the member selector, gear table, actionable notes, and professions.

**Patterns to follow:**
- `nuqs` for URL params: see `src/app/(app)/members/members-list.tsx` for `useQueryState` + `parseAsString` pattern
- `Select` component: see `src/components/ui/select.tsx` — uses `SelectRoot`, `SelectTrigger`, `SelectPopup`, `SelectItem` with `onValueChangeAction` prop
- `Badge` component: see `src/components/ui/badge.tsx` — `variant="success"` / `variant="error"`
- `ItemTooltip`: see `src/components/item-tooltip.tsx` — wraps children with hover tooltip
- `Card`: see `src/components/ui/card.tsx` — simple bordered container
- Section headers: `font-body text-xs uppercase tracking-wider text-secondary` with `//` prefix

**Note on inline styles:** The gear table uses `style={{ gridTemplateColumns: "..." }}` for CSS Grid — this is an acceptable exception to the "no arbitrary values" rule since CSS Grid template literals cannot be expressed as `@theme` variables. The same pattern is used in `HeatmapGrid`.

**Quality colors** are imported from `src/lib/wow-data/constants.ts` (shared with `ItemTooltip`).

- [ ] **Step 1: Create the gear inspector component**

Create `src/app/(app)/gear/gear-inspector.tsx`:

```tsx
"use client";

import { ExternalLink, Info, TriangleAlert } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	TooltipContent,
	TooltipLabel,
	TooltipRoot,
	TooltipTrigger,
	TooltipValue,
} from "@/components/ui/tooltip";
import { ItemTooltip } from "@/components/item-tooltip";
import { trpc } from "@/lib/trpc/client";
import { QUALITY_COLORS } from "@/lib/wow-data/constants";

const NOTE_ICONS: Record<string, typeof TriangleAlert> = {
	error: TriangleAlert,
	warning: TriangleAlert,
	info: Info,
};

const NOTE_COLORS: Record<string, string> = {
	error: "text-danger",
	warning: "text-warning",
	info: "text-secondary",
};

type GearInspectorProps = {
	realm: string;
};

export function GearInspector({ realm }: GearInspectorProps) {
	const [memberId, setMemberId] = useQueryState(
		"member",
		parseAsString.withDefault(""),
	);

	const { data: memberList } = trpc.members.list.useQuery();

	// Auto-select first member if none selected
	const selectedMemberId =
		memberId || memberList?.[0]?.id || "";

	const { data, isLoading } = trpc.gear.getByMember.useQuery(
		{ memberId: selectedMemberId },
		{ enabled: selectedMemberId !== "" },
	);

	const selectedMember = memberList?.find((m) => m.id === selectedMemberId);

	function handleCopyNotes() {
		if (!data?.notes.length) return;
		const text = data.notes.map((n) => n.message).join("\n");
		navigator.clipboard.writeText(text);
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Filter Row */}
			<div className="flex items-center gap-3">
				<SelectRoot
					value={selectedMemberId}
					onValueChangeAction={(val) => setMemberId(val ?? "")}
				>
					<SelectTrigger placeholder="Select member" />
					<SelectPopup>
						{memberList?.map((m) => (
							<SelectItem key={m.id} value={m.id}>
								{m.name}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>

				{selectedMember && (
					<a
						href={`https://armory.warmane.com/character/${encodeURIComponent(selectedMember.name)}/${encodeURIComponent(realm)}/summary`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 border border-border px-3.5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:border-border-light hover:text-primary"
					>
						View Armory
						<ExternalLink className="size-3.5" />
					</a>
				)}
			</div>

			{/* Loading state */}
			{isLoading && (
				<>
					<div className="border border-border bg-card">
						<Skeleton className="h-10 w-full" />
						{Array.from({ length: 16 }).map((_, i) => (
							<Skeleton key={i} className="h-11 w-full border-t border-border" />
						))}
					</div>
					<div className="flex gap-3">
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-40 w-80 shrink-0" />
					</div>
				</>
			)}

			{/* Error states */}
			{data?.error === "CHARACTER_NOT_FOUND" && (
				<p className="font-body text-sm text-dimmed">
					Character not found on Warmane armory.
				</p>
			)}
			{data?.error === "ARMORY_UNAVAILABLE" && (
				<p className="font-body text-sm text-dimmed">
					Warmane armory is currently unavailable. Try again later.
				</p>
			)}

			{/* Gear Table */}
			{data && !data.error && data.gear.length > 0 && (
				<>
					<div className="flex flex-col gap-3">
						<span className="font-body text-xs uppercase tracking-wider text-secondary">
							// Gear Overview
						</span>

						<div className="border border-border bg-card">
							{/* Table header */}
							<div className="grid items-center border-b border-border px-6 py-2.5 font-body text-2xs uppercase tracking-wider text-dimmed" style={{ gridTemplateColumns: "100px 1fr 60px 100px 100px" }}>
								<span>Slot</span>
								<span>Item</span>
								<span>iLvl</span>
								<span className="text-center">Enchanted</span>
								<span className="text-center">Gemmed</span>
							</div>

							{/* Table rows */}
							{data.gear.map((slot) => (
								<div
									key={slot.slot}
									className="grid items-center border-t border-elevated px-6 py-2.5 font-body text-sm"
									style={{ gridTemplateColumns: "100px 1fr 60px 100px 100px" }}
								>
									<span className="text-2xs font-bold uppercase tracking-wide text-primary">
										{slot.slot}
									</span>

									<ItemTooltip itemId={slot.itemId}>
										<span
											className="cursor-default truncate font-medium"
											style={{ color: QUALITY_COLORS[slot.itemQuality] ?? "#ffffff" }}
										>
											{slot.itemName}
										</span>
									</ItemTooltip>

									<span className="text-primary">{slot.itemLevel || "—"}</span>

									<div className="flex justify-center">
										{slot.isEnchantable ? (
											slot.enchant ? (
												<TooltipRoot>
													<TooltipTrigger render={<span />}>
														<Badge variant="success">[YES]</Badge>
													</TooltipTrigger>
													<TooltipContent side="top">
														<TooltipLabel>Enchant</TooltipLabel>
														<TooltipValue>{slot.enchant}</TooltipValue>
													</TooltipContent>
												</TooltipRoot>
											) : (
												<Badge variant="error">[NO]</Badge>
											)
										) : null}
									</div>

									<div className="flex justify-center">
										{slot.gems.length > 0 || !slot.hasAllGems ? (
											slot.hasAllGems ? (
												<TooltipRoot>
													<TooltipTrigger render={<span />}>
														<Badge variant="success">[YES]</Badge>
													</TooltipTrigger>
													<TooltipContent side="top">
														<TooltipLabel>Gems</TooltipLabel>
														<div className="flex flex-col gap-0.5">
															{slot.gems.map((gem, i) => (
																<span key={i} className="font-body text-xs text-primary">
																	{gem.name}
																</span>
															))}
														</div>
													</TooltipContent>
												</TooltipRoot>
											) : (
												<Badge variant="error">[NO]</Badge>
											)
										) : null}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Notes + Professions */}
					<div className="flex gap-3">
						{/* Actionable Notes */}
						<Card className="flex-1">
							<div className="flex items-center justify-between">
								<span className="font-body text-xs uppercase tracking-wider text-secondary">
									// Actionable Notes
								</span>
								{data.notes.length > 0 && (
									<button
										type="button"
										onClick={handleCopyNotes}
										className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-2xs font-bold uppercase tracking-wide text-accent transition-colors hover:border-accent"
									>
										Copy to Send
									</button>
								)}
							</div>
							{data.notes.length > 0 ? (
								<div className="flex flex-col gap-2">
									{data.notes.map((note, i) => {
										const Icon = NOTE_ICONS[note.severity] ?? Info;
										return (
											<div key={i} className="flex items-center gap-2">
												<Icon className={`size-3.5 shrink-0 ${NOTE_COLORS[note.severity]}`} />
												<span className={`font-body text-sm ${NOTE_COLORS[note.severity]}`}>
													{note.message}
												</span>
											</div>
										);
									})}
								</div>
							) : (
								<p className="font-body text-sm text-dimmed">
									No issues found — gear is fully enchanted and gemmed.
								</p>
							)}
						</Card>

						{/* Professions */}
						<Card className="w-80 shrink-0">
							<span className="font-body text-xs uppercase tracking-wider text-secondary">
								// Professions
							</span>
							{data.professions.length > 0 ? (
								<div className="flex flex-col gap-2">
									{data.professions.map((prof) => (
										<div key={prof.name} className="flex items-center gap-2">
											<span className="font-body text-sm text-primary">
												{prof.name} — {prof.level}/{prof.maxLevel}
											</span>
											{prof.level >= prof.maxLevel && (
												<Badge variant="success">[MAX]</Badge>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="font-body text-sm text-dimmed">
									No professions found.
								</p>
							)}
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/gear/gear-inspector.tsx
git commit -m "feat: add gear inspector client component with table, notes, and professions"
```

---

### Task 7: Update Gear Page & Add Loading Skeleton

**Files:**
- Modify: `src/app/(app)/gear/page.tsx`
- Create: `src/app/(app)/gear/loading.tsx`

- [ ] **Step 1: Update the gear page server component**

Replace `src/app/(app)/gear/page.tsx`:

```tsx
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { GearInspector } from "./gear-inspector";

export const metadata: Metadata = {
	title: "Gear & Enchants",
};

export default async function GearPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const coreId = session?.session?.activeOrganizationId;
	if (!coreId) redirect("/setup");

	const core = await db
		.select({ realm: cores.realm })
		.from(cores)
		.where(eq(cores.id, coreId))
		.then((rows) => rows[0]);

	if (!core) redirect("/setup");

	void trpc.members.list.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Gear & Enchants
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Equipment audit and enchant compliance"}
					</p>
				</div>
				<GearInspector realm={core.realm} />
			</div>
		</HydrateClient>
	);
}
```

- [ ] **Step 2: Create the loading skeleton**

Create `src/app/(app)/gear/loading.tsx`:

```tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-80" />
			</div>
			{/* Filter row */}
			<div className="flex gap-3">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
			{/* Table */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-3 w-32" />
				<div className="border border-border bg-card">
					<Skeleton className="h-9 w-full" />
					{Array.from({ length: 16 }).map((_, i) => (
						<Skeleton key={i} className="h-11 w-full border-t border-border" />
					))}
				</div>
			</div>
			{/* Notes + Professions */}
			<div className="flex gap-3">
				<Card className="flex-1">
					<Skeleton className="h-3 w-40" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Card>
				<Card className="w-80 shrink-0">
					<Skeleton className="h-3 w-28" />
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-4 w-40" />
				</Card>
			</div>
		</div>
	);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/gear/page.tsx src/app/(app)/gear/loading.tsx
git commit -m "feat: update gear page with server prefetch and loading skeleton"
```

---

### Task 8: Integration Verification

- [ ] **Step 1: Build check**

```bash
pnpm build
```

Expected: Build passes with no errors. The `/gear` route should appear in the route list.

- [ ] **Step 2: Start dev server and verify**

```bash
pnpm dev
```

Navigate to `/gear` in the browser. Verify:
1. Member dropdown populates with core members
2. Selecting a member triggers a gear fetch
3. Gear table renders with item names, quality colors, iLvl
4. Enchanted/Gemmed badges show YES/NO correctly
5. Hovering item names shows Wowhead tooltip
6. Hovering YES enchant badge shows enchant name
7. Actionable notes generate for missing enchants/gems
8. "Copy to Send" copies notes to clipboard
9. Professions show with MAX badge for 450/450
10. Loading skeleton appears while data is loading

- [ ] **Step 3: Test edge cases**

- Character not found → shows "Character not found on Warmane armory"
- Empty member list → dropdown is empty, no crash
- Unknown enchant/gem IDs → shows "Unknown Enchant (XXXX)" fallback

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address integration issues in gear page"
```

Only run if fixes were needed.
