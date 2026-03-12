# Domain Components

Components in this directory are app-specific (not generic UI primitives). They compose UI components from `./ui/` with domain logic.

## Wowhead API

Endpoint: `https://nether.wowhead.com/wotlk/tooltip/item/{itemId}`

Uses the **Wrath of the Lich King Classic** API so stats are not level-squished. Returns JSON:

```ts
{
  name: string;      // "Shadowmourne"
  quality: number;   // 0-7 (0=poor, 2=uncommon, 3=rare, 4=epic, 5=legendary)
  icon: string;      // "inv_axe_113" (for icon URL)
  tooltip: string;   // Pre-built HTML with Wowhead CSS classes
}
```

Icon URL: `https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg`

Quality-to-color mapping:

| Quality | Name | Color |
|---|---|---|
| 0 | Poor | `#9d9d9d` |
| 1 | Common | `#ffffff` |
| 2 | Uncommon | `#1eff00` |
| 3 | Rare | `#0070dd` |
| 4 | Epic | `#a335ee` |
| 5 | Legendary | `#ff8000` |
| 6 | Artifact | `#e6cc80` |
| 7 | Heirloom | `#00ccff` |

## ItemTooltip

`src/components/item-tooltip.tsx` — wraps a child element with a hover tooltip that fetches and renders Wowhead item data.

- **Data fetching**: TanStack Query (`useQuery`) with key `["wowhead-item", itemId]` and 30-min stale time. Data is cached across mounts and deduped per item ID.
- **Tooltip HTML**: Rendered via `dangerouslySetInnerHTML` inside a `.wh-tooltip` wrapper. The CSS classes from Wowhead (`.q0`–`.q8`, `.c1`–`.c11`, `.socket-*`, `.whtt-*`) are styled in `globals.css`.
- **Border color**: Dynamically set from the quality field to match rarity color.
- **Loading state**: Shows "Loading..." text until the query resolves.

Usage:

```tsx
<ItemTooltip itemId={49623} side="right">
  <span className="text-rarity-legendary">Shadowmourne</span>
</ItemTooltip>
```

## UploadLogDialog

`src/components/upload-log-dialog.tsx` — dialog wrapper that renders the Upload Log trigger button and hosts `UploadLogForm`.

- **Trigger**: Full-width `<Button>` with `Upload` icon, rendered in the sidebar.
- **State**: Controls open/close via `useState`. Passes `onDoneAction` to close the dialog when the upload flow completes.
- **Dialog**: Uses `DialogRoot` (controlled), `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`.

Usage (in sidebar):

```tsx
<UploadLogDialog />
```

## UploadLogForm

`src/components/upload-log-form.tsx` — 3-state upload form with XHR progress tracking.

- **Props**: `onDoneAction: () => void` — called when the user clicks "Done" after a successful upload.
- **State machine** (`UploadState` discriminated union):
  - `select` — drag-and-drop zone + click-to-browse for `.txt` files
  - `uploading` — shows file name, size, progress bar, cancel button; uses `XMLHttpRequest` for upload progress events
  - `error` — shows error message in `Alert`, "Try Again" button resets to `select`
  - `done` — shows raid name, date, member count summary, "Done" button calls `onDoneAction` + `router.refresh()`
- **Upload target**: `POST /api/upload` with `Content-Type: application/octet-stream` (raw file body, not multipart).
- **Response shape** (`UploadResult`): `{ raidId, raidName, raidDate, totalMembers, newMembers }`
- **Cancel**: Aborts the XHR and resets to `select` state.
- **No React Hook Form** — this is a file upload, not a traditional form. State is managed manually.
