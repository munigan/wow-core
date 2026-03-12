# UI Components

## Rules

1. **Composition pattern** — prefer compound components over monolithic ones. Split complex UI into composable parts (e.g. `SelectRoot`, `SelectTrigger`, `SelectItem`). Each part is a named export. Simple leaf components (Button, Badge, Card) are fine as single exports
2. **tailwind-merge** — use on components without variants for `className` override support
3. **tailwind-variants** — use only when the component has actual variants (e.g. `primary`/`secondary`). TV handles `className` merging internally, so no need for `tailwind-merge`
4. **base-ui** (`@base-ui/react`) — use for interactive primitives that need accessibility, keyboard navigation, or positioning (Select, Tabs, Tooltip, Progress)
5. **Extend native HTML props** — every component must extend the appropriate native element props via TypeScript
6. **Named inline exports** — use `export const` and `export type`, no default exports
7. **No arbitrary Tailwind values** — define new `@theme` variables in `globals.css` instead of bracket syntax like `text-[11px]`
8. **Canonical Tailwind syntax** — use `data-active:` not `data-[active]:`, use `origin-(--var)` not `origin-[var(--var)]`
9. **Server Action naming** — in `"use client"` files, callback props must end with `Action` (e.g. `onValueChangeAction`) to avoid RSC serialization warnings

## Tooltip

`TooltipTrigger` renders a `<button>` by default (via Base UI). When wrapping an element that is already a `<button>` (e.g. `<Button>`), pass `render={<span />}` to avoid invalid nested `<button>` HTML and hydration errors.

```tsx
// Wrapping a Button — use render prop
<TooltipTrigger render={<span />}>
  <Button>Click me</Button>
</TooltipTrigger>

// Wrapping plain text — no render prop needed
<TooltipTrigger>
  <span>Hover me</span>
</TooltipTrigger>
```

`TooltipProvider` defaults to `delay={200}` (ms before open). Override per-context if needed.

All tooltips use collision avoidance (`side: "flip"`, `align: "shift"`, `collisionPadding: 8`) so they never render offscreen.

## Components

| Component | Pattern | Styling |
|---|---|---|
| `alert` | single export | tailwind-variants (`error`/`warning`/`success`) |
| `button` | single export | tailwind-variants (`primary`/`secondary`, `default`/`lg`) |
| `badge` | single export | tailwind-variants (`success`/`warning`/`error`) |
| `card` | single export | tailwind-merge |
| `input` | single export | tailwind-merge, optional `label` prop |
| `nav-item` | single export | tailwind-variants (`active` boolean) |
| `select` | compound: `SelectRoot`, `SelectTrigger`, `SelectPopup`, `SelectItem` | base-ui + tailwind-merge |
| `tabs` | compound: `Tabs`, `TabList`, `Tab`, `TabPanel` | base-ui + tailwind-merge |
| `progress-bar` | single export | base-ui + tailwind-merge |
| `tooltip` | compound: `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `TooltipContent`, `TooltipLabel`, `TooltipValue` | base-ui + tailwind-merge |
| `popover` | compound: `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `PopoverClose` | base-ui + tailwind-merge |
| `dialog` | compound: `DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose` | base-ui + tailwind-merge |

## Popover

`PopoverTrigger` renders a `<button>` by default (via Base UI). When wrapping an element that is already a `<button>`, pass `render={<span />}` to avoid nested `<button>` HTML. Same pattern as `TooltipTrigger`.

`PopoverRoot` accepts `onOpenChangeAction` for controlled mode. Use controlled mode when you need to close the popover programmatically (e.g., after selecting an item).

## Dialog

Visual style mirrors the Tooltip component: `border border-accent bg-sidebar`, centered with semi-transparent backdrop.

`DialogRoot` accepts `onOpenChangeAction` for controlled mode. The dialog is modal by default (focus trapped, scroll locked).

`DialogTrigger` renders a `<button>` by default. Use `render={<span />}` when wrapping existing interactive elements.

## Alert

Inline alert banner for form errors and status messages. Design follows the `shareLinkRow` pattern from the Pencil design file — bordered box with tinted background, icon, and text.

- **Variants**: `error` (red, default), `warning` (orange), `success` (green)
- **Props**: `message` (string, required), `variant`, plus native `<div>` props
- **Icons**: Auto-selected per variant (AlertTriangle, Info, CheckCircle)
- **Form usage**: Place at the top of the form (after the logo, before fields). Collect all field-level and root-level errors into a single `firstError` string; show only the first error.

```tsx
const firstError =
  errors.root?.message ??
  errors.email?.message ??
  errors.password?.message ??
  "";
const hasErrors = firstError !== "";

// In JSX, before form fields:
{hasErrors && <Alert message={firstError} />}
```
