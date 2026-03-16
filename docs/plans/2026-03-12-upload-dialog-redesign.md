# Upload Dialog Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the upload dialog's "choose" step: per-raid core assignment with smart defaults, boss-based raid instance identification, richer raid rows with member previews and tooltips, wider dialog.

**Architecture:** Static boss-to-raid map identifies raid instances from NPC names. Scanner worker collects NPCs alongside players. Form state changes from global core to per-raid `RaidConfig[]`. Server route accepts per-raid core IDs. Dialog widened to ~620px.

**Tech Stack:** Next.js 16, Web Workers, Drizzle ORM, better-auth, Base UI, Tailwind CSS v4, tRPC v11

**Design doc:** `docs/plans/2026-03-12-upload-dialog-redesign-design.md`

---

### Task 1: WotLK boss-to-raid static map

**Files:**
- Create: `src/lib/wow-raids.ts`

Create the boss-to-raid mapping module with all WotLK 10/25-man raid instances.

```ts
const BOSS_TO_RAID: ReadonlyMap<string, string> = new Map([
	// Naxxramas
	["Anub'Rekhan", "Naxxramas"],
	["Grand Widow Faerlina", "Naxxramas"],
	["Maexxna", "Naxxramas"],
	["Noth the Plaguebringer", "Naxxramas"],
	["Heigan the Unclean", "Naxxramas"],
	["Loatheb", "Naxxramas"],
	["Instructor Razuvious", "Naxxramas"],
	["Gothik the Harvester", "Naxxramas"],
	["Thane Korth'azz", "Naxxramas"],
	["Lady Blaumeux", "Naxxramas"],
	["Sir Zeliek", "Naxxramas"],
	["Baron Rivendare", "Naxxramas"],
	["Patchwerk", "Naxxramas"],
	["Grobbulus", "Naxxramas"],
	["Gluth", "Naxxramas"],
	["Thaddius", "Naxxramas"],
	["Feugen", "Naxxramas"],
	["Stalagg", "Naxxramas"],
	["Sapphiron", "Naxxramas"],
	["Kel'Thuzad", "Naxxramas"],

	// Vault of Archavon
	["Archavon the Stone Watcher", "Vault of Archavon"],
	["Emalon the Storm Watcher", "Vault of Archavon"],
	["Koralon the Flame Watcher", "Vault of Archavon"],
	["Toravon the Ice Watcher", "Vault of Archavon"],

	// The Obsidian Sanctum
	["Sartharion", "The Obsidian Sanctum"],
	["Shadron", "The Obsidian Sanctum"],
	["Tenebron", "The Obsidian Sanctum"],
	["Vesperon", "The Obsidian Sanctum"],

	// The Eye of Eternity
	["Malygos", "The Eye of Eternity"],

	// Ulduar
	["Flame Leviathan", "Ulduar"],
	["Ignis the Furnace Master", "Ulduar"],
	["Razorscale", "Ulduar"],
	["XT-002 Deconstructor", "Ulduar"],
	["Assembly of Iron", "Ulduar"],
	["Steelbreaker", "Ulduar"],
	["Runemaster Molgeim", "Ulduar"],
	["Stormcaller Brundir", "Ulduar"],
	["Kologarn", "Ulduar"],
	["Auriaya", "Ulduar"],
	["Hodir", "Ulduar"],
	["Thorim", "Ulduar"],
	["Freya", "Ulduar"],
	["Mimiron", "Ulduar"],
	["General Vezax", "Ulduar"],
	["Yogg-Saron", "Ulduar"],
	["Algalon the Observer", "Ulduar"],

	// Trial of the Crusader
	["Gormok the Impaler", "Trial of the Crusader"],
	["Acidmaw", "Trial of the Crusader"],
	["Dreadscale", "Trial of the Crusader"],
	["Icehowl", "Trial of the Crusader"],
	["Lord Jaraxxus", "Trial of the Crusader"],
	["Eydis Darkbane", "Trial of the Crusader"],
	["Fjola Lightbane", "Trial of the Crusader"],
	["Anub'arak", "Trial of the Crusader"],

	// Onyxia's Lair
	["Onyxia", "Onyxia's Lair"],

	// Icecrown Citadel
	["Lord Marrowgar", "Icecrown Citadel"],
	["Lady Deathwhisper", "Icecrown Citadel"],
	["Deathbringer Saurfang", "Icecrown Citadel"],
	["Festergut", "Icecrown Citadel"],
	["Rotface", "Icecrown Citadel"],
	["Professor Putricide", "Icecrown Citadel"],
	["Blood-Queen Lana'thel", "Icecrown Citadel"],
	["Blood Prince Council", "Icecrown Citadel"],
	["Prince Valanar", "Icecrown Citadel"],
	["Prince Taldaram", "Icecrown Citadel"],
	["Prince Keleseth", "Icecrown Citadel"],
	["Valithria Dreamwalker", "Icecrown Citadel"],
	["Sindragosa", "Icecrown Citadel"],
	["The Lich King", "Icecrown Citadel"],

	// The Ruby Sanctum
	["Halion", "The Ruby Sanctum"],
]);

/**
 * Identify the raid instance from a list of NPC names seen in the combat log.
 * Counts boss matches per instance, returns the one with the most hits.
 * Returns null if no bosses matched.
 */
export function identifyRaidInstance(npcNames: string[]): string | null {
	const counts = new Map<string, number>();

	for (const name of npcNames) {
		const raid = BOSS_TO_RAID.get(name);
		if (raid) {
			counts.set(raid, (counts.get(raid) ?? 0) + 1);
		}
	}

	if (counts.size === 0) return null;

	let bestRaid = "";
	let bestCount = 0;
	for (const [raid, count] of counts) {
		if (count > bestCount) {
			bestRaid = raid;
			bestCount = count;
		}
	}

	return bestRaid;
}
```

**Commit:** `feat: add WotLK boss-to-raid static mapping`

---

### Task 2: Update scanner types and worker to collect NPCs

**Files:**
- Modify: `src/lib/log-scanner.ts`
- Modify: `src/lib/log-scanner.worker.ts`

**`log-scanner.ts` changes:**

1. Add `npcNames: string[]` to `DateGroup`:

```ts
export type DateGroup = {
	date: string;
	firstTimestamp: string;
	lastTimestamp: string;
	players: Map<string, string>;
	npcs: Map<string, string>; // NEW: guid -> name for 0xF130/0xF150 entities
};
```

2. Add `npcNames: string[]` and `raidInstance: string | null` to `DetectedRaid`:

```ts
export type DetectedRaid = {
	dates: string[];
	startTime: string;
	endTime: string;
	playerCount: number;
	playerNames: string[];
	npcNames: string[];            // NEW
	raidInstance: string | null;   // NEW
};
```

3. Update `buildDetectedRaid` to collect NPC names from all date groups and call `identifyRaidInstance()`:

```ts
import { identifyRaidInstance } from "./wow-raids";

// In buildDetectedRaid, after building allPlayers:
const allNpcs = new Map<string, string>();
for (const dg of group) {
	for (const [guid, name] of dg.npcs) {
		allNpcs.set(guid, name);
	}
}
const uniqueNpcNames = [...new Set(allNpcs.values())];
const raidInstance = identifyRaidInstance(uniqueNpcNames);

return {
	dates,
	startTime: startTime.toISOString(),
	endTime: endTime.toISOString(),
	playerCount: uniqueNames.length,
	playerNames: uniqueNames,
	npcNames: uniqueNpcNames,
	raidInstance,
};
```

**`log-scanner.worker.ts` changes:**

1. Update the internal date map type to include NPCs:

```ts
const dateMap = new Map<
	string,
	{
		firstTimestamp: Date;
		lastTimestamp: Date;
		players: Map<string, string>;
		npcs: Map<string, string>; // NEW
	}
>();
```

2. In `processLine`, also collect `0xF130` and `0xF150` GUIDs:

```ts
// After the 0x0E player checks:
if (sourceGuid?.startsWith("0xF130") || sourceGuid?.startsWith("0xF150")) {
	if (sourceName && sourceName !== "nil") {
		group.npcs.set(sourceGuid, sourceName);
	}
}
if (destGuid?.startsWith("0xF130") || destGuid?.startsWith("0xF150")) {
	if (destName && destName !== "nil") {
		group.npcs.set(destGuid, destName);
	}
}
```

3. Update the DateGroup conversion to include `npcs`:

```ts
dateGroups.push({
	date,
	firstTimestamp: group.firstTimestamp.toISOString(),
	lastTimestamp: group.lastTimestamp.toISOString(),
	players: group.players,
	npcs: group.npcs,
});
```

**Commit:** `feat: collect NPC names in scanner and identify raid instances`

---

### Task 3: Rewrite UploadLogForm choose step with per-raid core assignment

**Files:**
- Modify: `src/components/upload-log-form.tsx`

This is the biggest task. Major changes to the "choose" step:

**State machine update:**

```ts
type RaidConfig = {
	isSelected: boolean;
	coreId: string;
};

type UploadState =
	| { step: "select" }
	| { step: "scanning"; progress: number }
	| { step: "choose"; raids: DetectedRaid[]; raidConfigs: RaidConfig[] }
	| { step: "uploading"; fileName: string; fileSize: number; progress: number }
	| { step: "error"; message: string }
	| { step: "done"; results: UploadResult[] };
```

**Smart default core assignment:**

When transitioning from "scanning" to "choose":

1. Fetch members for each core via parallel `trpc.members.listByCore.useQuery` calls. Since hooks can't be called conditionally, use a `trpc.useQueries` pattern or query for all cores upfront regardless of step. Actually, the simplest approach: fetch members for all cores when entering choose step by issuing multiple queries. Use `trpc.members.listByCore.useQuery` for each core with `enabled: state.step === "choose"`.

   Since we can't dynamically call hooks, an alternative: create one tRPC query `members.listByCores` that accepts `coreIds: string[]` and returns `{ coreId, name }[]`. This is simpler from the React side.

2. For each detected raid, compute overlap with each core. Overlap = `|raidPlayerNames ∩ coreMembers| / |coreMembers|`. Assign to core with highest overlap. If no core has members, default to `activeCoreId`.

**New tRPC query — `members.listByCores`:**

```ts
listByCores: protectedProcedure
	.input(z.object({ coreIds: z.array(z.string()) }))
	.query(async ({ input }) => {
		if (input.coreIds.length === 0) return [];
		return db
			.select({ coreId: members.coreId, name: members.name })
			.from(members)
			.where(inArray(members.coreId, input.coreIds));
	}),
```

**Raid label formatting:**

```ts
function formatRaidLabel(raid: DetectedRaid): string {
	const instance = raid.raidInstance ?? "Raid";
	const startDate = new Date(raid.startTime);
	const endDate = new Date(raid.endTime);

	const monthName = startDate.toLocaleDateString("en-US", { month: "long" });
	const day = startDate.getDate();
	const ordinal = getOrdinalSuffix(day);

	if (raid.dates.length === 1) {
		return `${instance} - ${monthName} ${day}${ordinal}`;
	}

	const endDay = endDate.getDate();
	const endOrdinal = getOrdinalSuffix(endDay);
	return `${instance} - ${monthName} ${day}${ordinal} - ${endDay}${endOrdinal}`;
}

function getOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) return "th";
	switch (day % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}
```

**Time range formatting:**

```ts
function formatTimeRange(raid: DetectedRaid): string {
	const start = new Date(raid.startTime);
	const end = new Date(raid.endTime);
	const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
	return `${fmt(start)} - ${fmt(end)}`;
}
```

**Member preview (3 names + tooltip):**

Each raid row shows the first 3 player names, then "+N more" wrapped in a tooltip trigger that shows all names:

```tsx
<span className="font-body text-2xs text-dimmed">
	{raid.playerNames.slice(0, 3).join(", ")}
</span>
{raid.playerCount > 3 && (
	<TooltipRoot>
		<TooltipTrigger render={<span />}>
			<span className="font-body text-2xs cursor-default text-accent">
				+{raid.playerCount - 3} more
			</span>
		</TooltipTrigger>
		<TooltipContent side="bottom">
			<div className="max-h-48 overflow-y-auto">
				{raid.playerNames.map((name) => (
					<span key={name} className="font-body text-2xs text-primary block">
						{name}
					</span>
				))}
			</div>
		</TooltipContent>
	</TooltipRoot>
)}
```

**Per-raid core selector:**

Each raid row has its own `SelectRoot` for core selection. A small inline warning icon (AlertTriangle, `size-3 text-warning`) appears next to the dropdown when mismatch is detected for that specific raid.

**Raid row layout:**

```tsx
<div className="flex items-start gap-2.5 border border-border px-3 py-2.5">
	<CheckboxRoot checked={config.isSelected} onCheckedChangeAction={...} className="mt-0.5" />
	<div className="flex min-w-0 flex-1 flex-col gap-1">
		<span className="font-body text-xs font-semibold text-primary">
			{formatRaidLabel(raid)}
		</span>
		<span className="font-body text-2xs text-dimmed">
			{formatTimeRange(raid)}
		</span>
		<div className="flex items-center gap-1 flex-wrap">
			<span className="font-body text-2xs text-dimmed">
				{raid.playerNames.slice(0, 3).join(", ")}
			</span>
			{/* +N more tooltip */}
		</div>
	</div>
	<div className="flex shrink-0 items-center gap-1.5">
		<SelectRoot value={config.coreId} onValueChangeAction={...}>
			<SelectTrigger placeholder="Core" className="w-36" />
			<SelectPopup>
				{cores.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
			</SelectPopup>
		</SelectRoot>
		{isMismatch && <AlertTriangle className="size-3 text-warning" />}
	</div>
</div>
```

**Remove:** Global core selector, select-all checkbox, global mismatch warning.

**Import button:** Disabled when no raids are selected (any `isSelected === true`).

**Commit:** `feat: rewrite choose step with per-raid core assignment and member preview`

---

### Task 4: Add `members.listByCores` tRPC query

**Files:**
- Modify: `src/lib/trpc/routers/members.ts`

Add the batch query that accepts multiple core IDs:

```ts
listByCores: protectedProcedure
	.input(z.object({ coreIds: z.array(z.string()) }))
	.query(async ({ input }) => {
		if (input.coreIds.length === 0) return [];
		return db
			.select({ coreId: members.coreId, name: members.name })
			.from(members)
			.where(inArray(members.coreId, input.coreIds));
	}),
```

Import `inArray` from `drizzle-orm`.

**Commit:** `feat: add members.listByCores batch tRPC query`

---

### Task 5: Widen dialog and update description for choose step

**Files:**
- Modify: `src/components/upload-log-dialog.tsx`
- Modify: `src/components/ui/dialog.tsx`

**`dialog.tsx`:** Add an optional `size` prop to `DialogContent` to support wider dialogs:

```tsx
export type DialogContentProps = {
	className?: string;
	children: React.ReactNode;
	size?: "default" | "wide";
};

// In the Popup className:
// default: "w-[420px]" (keep as current via @theme variable)
// wide: "w-[620px]"
```

Actually, simpler: just pass a `className` override from `UploadLogDialog` when in choose step. The dialog already supports `className`. But the dialog width is fixed — we need it to change based on form step.

Best approach: `UploadLogDialog` always renders the wider dialog (620px). The extra width is harmless for the select/scanning/uploading/error/done steps since content is centered. Pass `className="w-156"` to `DialogContent` (156 = 620px in Tailwind's default 4px scale... actually 620/4 = 155, not standard). Better: define `--dialog-wide` in `globals.css` or just use `max-w-[620px]`. Wait, no arbitrary values. Define `--size-dialog-wide: 620px` in globals.css `@theme`, then use `w-(--size-dialog-wide)`.

Actually, even simpler — the `DialogContent` already accepts `className`. Just override the width:

```tsx
<DialogContent className="w-156">
```

But 156 doesn't exist in default Tailwind scale. Let me check: `w-xl` = 576px, `w-2xl` = 672px. `w-2xl` at 672px is close. Or use a custom value in `@theme`:

In `globals.css`:
```css
--width-dialog-wide: 38rem; /* 608px */
```

Then: `<DialogContent className="w-(--width-dialog-wide)">` 

Or just use the Tailwind `max-w-2xl` utility which is 672px — a bit wider but fine.

Let's go with adding a theme variable. The plan says no arbitrary values.

**`globals.css`:** Add `--width-dialog-wide: 38rem;` under `@theme`.

**`upload-log-dialog.tsx`:** Pass the wider class:

```tsx
<DialogContent className="w-(--width-dialog-wide)">
```

**Commit:** `refactor: widen upload dialog for per-raid core selectors`

---

### Task 6: Update server route for per-raid core IDs

**Files:**
- Modify: `src/app/api/upload/route.ts`
- Modify: `src/lib/log-parser.ts`

**`route.ts` changes:**

The `X-Selected-Raids` header payload changes from `string[][]` to:

```ts
type SelectedRaidPayload = { dates: string[]; coreId: string; raidName: string }[];
```

Remove `X-Core-Id` header usage. The route now:

1. Parses `X-Selected-Raids` as `SelectedRaidPayload[]`.
2. Calls `parseLogStreamMulti(body, payload.map(r => r.dates))` — same as before.
3. Groups results by `coreId`. For each unique core:
   - Batch upsert members for that core.
   - Fetch member IDs for that core.
4. For each raid, create raid record with the raid's specific `coreId` and `raidName` from the payload (this includes the identified instance name like "Naxxramas - April 9th").
5. Return array of results.

**`log-parser.ts` changes:**

Update `parseLogStreamMulti` to accept an optional `raidNames: string[]` parameter so the caller can override raid names with the instance-identified names from the client:

Actually, simpler: the route already receives `raidName` from the client payload. Just pass it directly to the raid insert instead of using `raidData.raidName` from the parser. The parser's `raidName` is the fallback.

**Commit:** `feat: update server route for per-raid core IDs and raid names`

---

### Task 7: Build verification

**Steps:**

1. Run `pnpm tsc --noEmit` — must exit 0.
2. Run `pnpm biome check src/` — must report no new errors.
3. Run `pnpm next build` — must exit 0.
4. Manual test: start dev server, open app, click Upload Log, select a multi-raid log file, verify:
   - Scanning step shows progress
   - Choose step shows raids with instance names (e.g. "Naxxramas - April 9th")
   - Each raid has its own core dropdown
   - Member preview shows 3 names + "+N more" tooltip
   - Smart core defaults are applied
   - Import works and results show in done step

**Commit:** `docs: update AGENTS.md with upload dialog redesign documentation`

---

### Task summary

| # | Description | Estimated size |
|---|-------------|----------------|
| 1 | WotLK boss-to-raid static map | Small |
| 2 | Scanner types + worker NPC collection | Medium |
| 3 | Rewrite choose step (per-raid core, labels, tooltips) | Large |
| 4 | `members.listByCores` batch tRPC query | Small |
| 5 | Widen dialog + theme variable | Small |
| 6 | Server route per-raid core IDs | Medium |
| 7 | Build verification | Medium |
