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
