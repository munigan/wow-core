# Navigation Sidebar Design

## Summary

Add a persistent sidebar navigation to the `(app)` layout, matching the Pencil design file. The sidebar is 240px wide, full viewport height, dark background (`bg-sidebar`), with a logo, six navigation links, and a bottom section containing placeholder UI for future features plus a user profile row.

## Architecture

Server component shell with a small client island for active route detection.

```
(app)/layout.tsx (server — fetches session)
├── Sidebar (server component)
│   ├── Logo (static: sword icon + "WOW RAID TOOLS")
│   ├── NavLinks (client — usePathname() for active state)
│   │   └── NavItem × 6 (rendered as <Link>)
│   ├── Spacer (flex-1)
│   └── SidebarBottom (server)
│       ├── CoreSelector (static placeholder)
│       ├── Upload Log button (static placeholder)
│       ├── SystemInfo (static placeholder text)
│       └── UserProfile (session.user data + logout)
└── <main> wrapper for {children}
```

## Files

| File | Type | Purpose |
|------|------|---------|
| `src/app/(app)/layout.tsx` | Server | Fetch session, render Sidebar + main content wrapper |
| `src/components/sidebar.tsx` | Server | Full sidebar shell: logo, nav, spacer, bottom |
| `src/components/nav-links.tsx` | Client | `"use client"` — NavItem links with usePathname() active detection |
| `src/components/ui/nav-item.tsx` | Shared | Add `href` prop — renders `<Link>` when present, `<button>` otherwise |

## NavItem Refactor

Add an optional `href` prop. When provided, render `next/link` `<Link>` instead of `<button>`, keeping the same styling via `tailwind-variants`.

## Route Mapping

| Label | Icon (lucide) | Route | Active match |
|-------|--------------|-------|--------------|
| Overview | `LayoutDashboard` | `/` | `pathname === "/"` |
| Raid Details | `Swords` | `/raids` | starts with `/raids` |
| Members | `Users` | `/members` | starts with `/members` |
| Gear & Enchants | `Shield` | `/gear` | starts with `/gear` |
| Trends | `TrendingUp` | `/trends` | starts with `/trends` |
| Exports | `Download` | `/exports` | starts with `/exports` |

## Styling (from Pencil design)

- **Sidebar**: `w-60 bg-sidebar border-r border-border`, full viewport height, vertical flex
- **Logo area**: `px-5 py-5`, sword icon (accent green, 20px) + "WOW RAID TOOLS" (JetBrains Mono, 13px, semibold, 1px letter-spacing), gap-3
- **Nav section**: `py-4`, vertical, gap-0.5
- **NavItem**: `px-5 py-3 gap-3`, icon 16px + uppercase label (12px JetBrains Mono, semibold, 0.5px tracking)
  - Active: `text-accent bg-accent-10`
  - Inactive: `text-secondary`, hover `text-primary`
- **Bottom section**: `border-t border-border px-5 py-4`, vertical, gap-3
  - Core label: 9px, muted, uppercase, "// ACTIVE CORE"
  - Dropdown: placeholder (full width, `bg-elevated` + border)
  - Upload button: full-width primary button (placeholder)
  - System info: 9px muted text (static "v2.4.1 // uwu-logs", "LAST SYNC: —")
  - User row: 28px avatar circle (`bg-accent-20`, user icon in accent), name (11px semibold), realm (9px muted), logout icon (14px muted)
- **Main content**: `flex-1 bg-page overflow-y-auto`

## Session Data Flow

`(app)/layout.tsx` fetches the session server-side via `auth.api.getSession()`. Passes `session.user` as a prop to `Sidebar`, which renders the user profile. No client-side session fetching.

## Placeholder Pages

Create minimal placeholder pages for routes that don't have content yet:
- `src/app/(app)/raids/page.tsx`
- `src/app/(app)/members/page.tsx`
- `src/app/(app)/gear/page.tsx`
- `src/app/(app)/trends/page.tsx`
- `src/app/(app)/exports/page.tsx`

Each renders a simple page title matching the nav label. The existing `(app)/page.tsx` (Overview) will be updated to remove its own centering layout since the layout shell now provides structure.

## Decisions

- **Server + client island** over fully client sidebar: minimal JS, no session flicker
- **`href` prop on NavItem** over `asChild` pattern: simpler, more explicit
- **Each page owns its header** rather than shared header in layout: more flexible per-page
- **Full sidebar with placeholders** for future features (core selector, upload, system info)
- **Placeholder pages** for all routes so navigation works without 404s
