# Upload Dialog Redesign - Design

## Goal

Rework the "choose" step of the upload dialog to support per-raid core assignment, raid instance identification via boss detection, richer raid row display with member previews, and removal of the global core selector/select-all checkbox.

## Changes from Current Implementation

### 1. Raid Identification via Static Boss Map

New module `src/lib/wow-raids.ts` containing a hardcoded `Map<string, string>` of WotLK boss NPC name to raid instance name. WotLK is frozen content — these never change.

**Covered raids:**

| Raid Instance | Boss Count |
|---|---|
| Naxxramas | ~15 (Anub'Rekhan, Faerlina, Maexxna, Noth, Heigan, Loatheb, Razuvious, Gothik, Thane/Blaumeux/Zeliek/Rivendare, Patchwerk, Grobbulus, Gluth, Thaddius, Sapphiron, Kel'Thuzad) |
| Vault of Archavon | 4 (Archavon, Emalon, Koralon, Toravon) |
| The Obsidian Sanctum | 1 boss + 3 drakes (Sartharion, Shadron, Tenebron, Vesperon) |
| The Eye of Eternity | 1 (Malygos) |
| Ulduar | ~14 (Flame Leviathan, Ignis, Razorscale, XT-002, Assembly of Iron, Kologarn, Auriaya, Hodir, Thorim, Freya, Mimiron, General Vezax, Yogg-Saron, Algalon) |
| Trial of the Crusader | 5 (Gormok, Acidmaw/Dreadscale, Jaraxxus, Twin Val'kyr, Anub'arak) |
| Onyxia's Lair | 1 (Onyxia) |
| Icecrown Citadel | ~12 (Marrowgar, Deathwhisper, Gunship, Saurfang, Festergut, Rotface, Putricide, Council, Queen, Dreamwalker, Sindragosa, Lich King) |
| The Ruby Sanctum | 1 (Halion) |

**Detection function:** `identifyRaidInstance(npcNames: string[]): string | null` — counts boss matches per raid, returns the one with the most hits. Returns `null` if no bosses matched (fallback to generic naming).

### 2. Scanner Changes

The worker already parses all entities from combat log lines. It needs to additionally collect NPC names (entities with `0xF130`/`0xF150` GUID prefixes) per date group, then call `identifyRaidInstance()` on each detected raid's NPC set.

**`DetectedRaid` type update:**

```ts
export type DetectedRaid = {
  dates: string[];
  startTime: string;       // ISO string
  endTime: string;         // ISO string
  playerCount: number;
  playerNames: string[];
  npcNames: string[];          // NEW
  raidInstance: string | null; // NEW: e.g. "Naxxramas"
};
```

### 3. Per-Raid Core Assignment

The "choose" step state changes from a global core to per-raid configuration:

```ts
type RaidConfig = {
  isSelected: boolean;
  coreId: string;
};

// State shape
{ step: "choose"; raids: DetectedRaid[]; raidConfigs: RaidConfig[] }
```

**Smart default:** On entering "choose", for each detected raid:
1. Query existing members for each of the user's cores.
2. Compute overlap (intersection of raid's playerNames with core's member names).
3. Assign to the core with highest overlap. If no core has overlap (or all cores are empty), default to the user's active core.

**Mismatch warning:** Inline warning icon (AlertTriangle) next to a raid's core dropdown when the selected core has <30% member overlap with that raid's roster and the core has existing members.

### 4. Raid Row Layout

Each raid in the checklist:

```
[checkbox] | Raid info                      | Core selector
           |                                |
           | Naxxramas - April 9th          | [Core dropdown v]
           | 20:13 - 23:45                  | (warning icon if mismatch)
           | Stranglol, Raelios, Twpal      |
           | +22 more                       |
```

- **Raid name:** `{raidInstance} - {monthName} {day}{ordinal}` (e.g. "Naxxramas - April 9th"). If no instance detected: `Raid - April 9th`. Multi-day: "Naxxramas - April 9th - 10th".
- **Time range:** `HH:MM - HH:MM` from startTime/endTime.
- **Member preview:** First 3 player names comma-separated, then "+N more" as a tooltip trigger. The tooltip lists all player names.
- **No select-all checkbox.** Each raid toggled individually.

### 5. Dialog Width

Widened from 420px to ~620px to accommodate the per-raid core selector column.

### 6. Server Route Changes

The `X-Selected-Raids` header payload changes to carry per-raid core IDs:

```ts
// New format
type SelectedRaidPayload = { dates: string[]; coreId: string }[];

// Header: X-Selected-Raids: JSON.stringify(payload)
```

The `X-Core-Id` header is removed (core is now per-raid). The server iterates each selected raid, using its specific `coreId` for the DB writes (create raid, upsert members, link raidMembers).

Members are upserted per-core (since different raids may target different cores). For each unique `coreId` in the payload, batch-upsert that core's members in a single query, then link raidMembers per-raid.

### 7. Core Selector Display Fix

The `SelectRoot` value is the core `id`, but `SelectItem` children display the core `name`. The trigger should show the selected item's text, not the value. This is already how Base UI Select works — the current bug is likely that the trigger renders the `value` prop instead of the selected item text. Verify and fix.

### 8. Members Query

Need a new tRPC query or extend existing one to fetch members for all of the user's cores in a single call, rather than one call per core. Options:

- **`members.listByCores`** (plural) accepting `coreIds: string[]` and returning `{ coreId, name }[]`. This lets us compute overlap for all cores in one round-trip.

Or reuse the existing `listByCore` with parallel React Query calls per core (simpler but more network round-trips).

Given the typical user has 1-3 cores, parallel `listByCore` calls are acceptable and simpler.
