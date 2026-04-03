# Raid Player Preview in Upload Flow

## Problem

When importing a combat log, the "choose" step shows detected raids with player count but no player names. Users can't verify which players were in a raid before uploading, risking importing logs that don't belong to their raid group.

## Solution

Add an inline player preview and hover popover to each raid card in the upload form's "choose" step.

## Design

### Inline Preview

Below the existing time range / member count line, show the first 3 player names followed by a "+N more" trigger:

```
Icecrown Citadel
19:00 - 22:30 · 25 members
Arthas, Thrall, Jaina +22 more
```

- Plain text, `text-dimmed` color, `text-2xs` size (matches existing metadata line)
- Players sorted alphabetically by name
- If 3 or fewer players total, show all names with no "+N more"
- "+N more" text is the popover trigger

### Hover Popover

On hover over "+N more", a popover appears with the full player list:

- Uses existing `PopoverRoot` / `PopoverTrigger` / `PopoverContent` components
- `PopoverTrigger` uses `openOnHover` prop (supported by Base UI)
- Players listed alphabetically, each name colored by WoW class using existing `text-class-*` Tailwind utilities
- Class color map: reuse the same `CLASS_COLORS` pattern already in `members-list.tsx`, `player-breakdown.tsx`, etc.
- Popover positioned `side="bottom"`, `align="start"`
- Max height with scroll if needed (handles 40-man raids)

### Class Color Mapping

Reuse the existing pattern (duplicated in several files):

```ts
const CLASS_COLORS: Record<string, string> = {
  warrior: "text-class-warrior",
  paladin: "text-class-paladin",
  hunter: "text-class-hunter",
  rogue: "text-class-rogue",
  priest: "text-class-priest",
  "death-knight": "text-class-dk",
  shaman: "text-class-shaman",
  mage: "text-class-mage",
  warlock: "text-class-warlock",
  druid: "text-class-druid",
};
```

## Data Source

`DetectedRaid.players: PlayerInfo[]` — already returned by `scanLog()` and available in the `choose` step state. Each `PlayerInfo` has `name`, `class`, and `spec`. No parser or API changes needed.

## Scope

- Single file change: `src/components/upload-log-form.tsx`
- Add the `CLASS_COLORS` map (local to the file)
- Add inline preview text below the metadata line
- Add popover with class-colored player list on "+N more" hover
- Import `PopoverRoot`, `PopoverTrigger`, `PopoverContent` from UI lib

## Out of Scope

- Extracting `CLASS_COLORS` into a shared utility (it's duplicated in 4+ files already — follow existing pattern)
- Player filtering or search within the popover
- Spec display in the popover (only class-colored names)
