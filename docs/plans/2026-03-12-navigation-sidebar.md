# Navigation Sidebar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a persistent sidebar navigation to the `(app)` layout matching the Pencil design, with logo, 6 nav links, placeholder bottom section, and user profile.

**Architecture:** Server component shell (`Sidebar`) rendered in the `(app)` layout, containing a small `"use client"` island (`NavLinks`) for active route detection via `usePathname()`. Session fetched server-side and passed as props. Each page owns its own header.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, tailwind-variants, lucide-react, better-auth, next/link

---

### Task 1: Refactor NavItem to support `href` prop

**Files:**
- Modify: `src/components/ui/nav-item.tsx`

**Step 1: Update NavItem to support `<Link>` rendering**

Replace the entire file with:

```tsx
import Link from "next/link";
import { tv } from "tailwind-variants";

const navItem = tv({
	base: "flex w-full items-center gap-3 px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide transition-colors",
	variants: {
		active: {
			true: "bg-accent-10 text-accent",
			false: "text-secondary hover:text-primary",
		},
	},
	defaultVariants: {
		active: false,
	},
});

type NavItemBaseProps = {
	active?: boolean;
	icon: React.ReactNode;
};

export type NavItemButtonProps = NavItemBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: undefined;
	};

export type NavItemLinkProps = NavItemBaseProps &
	Omit<React.ComponentProps<typeof Link>, "className"> & {
		href: string;
	};

export type NavItemProps = NavItemButtonProps | NavItemLinkProps;

export const NavItem = ({
	active = false,
	icon,
	className,
	children,
	...props
}: NavItemProps) => {
	const classes = navItem({ active, className });

	if ("href" in props && props.href !== undefined) {
		const { href, ...linkProps } = props as NavItemLinkProps;
		return (
			<Link href={href} className={classes} {...linkProps}>
				<span className="flex size-4 items-center justify-center">{icon}</span>
				{children}
			</Link>
		);
	}

	return (
		<button className={classes} {...(props as NavItemButtonProps)}>
			<span className="flex size-4 items-center justify-center">{icon}</span>
			{children}
		</button>
	);
};
```

Key changes:
- Active variant now includes `bg-accent-10` background (matching Pencil design)
- When `href` is passed, renders `<Link>` from next/link
- When `href` is absent, renders `<button>` (backward compatible)
- Union type discriminated on `href` presence

**Step 2: Verify the showcase still renders correctly**

Run: `pnpm build`
Expected: Build succeeds. The showcase at `/dev/components` uses `NavItem` without `href` and should be unaffected.

**Step 3: Commit**

```bash
git add src/components/ui/nav-item.tsx
git commit -m "feat(ui): add href prop to NavItem for Link rendering"
```

---

### Task 2: Create NavLinks client component

**Files:**
- Create: `src/components/nav-links.tsx`

**Step 1: Create the NavLinks client component**

```tsx
"use client";

import {
	Download,
	LayoutDashboard,
	Shield,
	Swords,
	TrendingUp,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/components/ui/nav-item";

const NAV_ITEMS = [
	{ href: "/", label: "Overview", icon: LayoutDashboard },
	{ href: "/raids", label: "Raid Details", icon: Swords },
	{ href: "/members", label: "Members", icon: Users },
	{ href: "/gear", label: "Gear & Enchants", icon: Shield },
	{ href: "/trends", label: "Trends", icon: TrendingUp },
	{ href: "/exports", label: "Exports", icon: Download },
] as const;

export const NavLinks = () => {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-0.5 py-4">
			{NAV_ITEMS.map((item) => {
				const isActive =
					item.href === "/"
						? pathname === "/"
						: pathname.startsWith(item.href);

				return (
					<NavItem
						key={item.href}
						href={item.href}
						active={isActive}
						icon={<item.icon className="size-4" />}
					>
						{item.label}
					</NavItem>
				);
			})}
		</nav>
	);
};
```

**Step 2: Commit**

```bash
git add src/components/nav-links.tsx
git commit -m "feat: add NavLinks client component with route-based active state"
```

---

### Task 3: Create Sidebar server component

**Files:**
- Create: `src/components/sidebar.tsx`

**Step 1: Create the Sidebar component**

This is a server component (no `"use client"`). It receives the user data as props and renders the full sidebar structure.

```tsx
import { LogOut, Sword, Upload, User } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { Button } from "@/components/ui/button";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";

type SidebarUser = {
	name: string;
	email: string;
};

type SidebarProps = {
	user: SidebarUser;
};

export const Sidebar = ({ user }: SidebarProps) => {
	return (
		<aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar">
			{/* Logo */}
			<div className="flex items-center gap-3 px-5 py-5">
				<Sword className="size-5 text-accent" />
				<span className="font-body text-base font-semibold tracking-wide text-primary">
					WOW RAID TOOLS
				</span>
			</div>

			{/* Navigation */}
			<NavLinks />

			{/* Spacer */}
			<div className="flex-1" />

			{/* Bottom section */}
			<div className="flex flex-col gap-3 border-t border-border px-5 py-4">
				{/* Core selector (placeholder) */}
				<div className="flex flex-col gap-1">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-muted">
						// Active Core
					</span>
					<SelectRoot defaultValue="frostmourne">
						<SelectTrigger className="w-full" />
						<SelectPopup>
							<SelectItem value="frostmourne">Frostmourne_25H</SelectItem>
						</SelectPopup>
					</SelectRoot>
				</div>

				{/* Upload button (placeholder) */}
				<Button className="w-full">
					<Upload className="size-3.5" />
					Upload Log
				</Button>

				{/* System info (placeholder) */}
				<div className="flex flex-col gap-1.5">
					<span className="font-body text-2xs text-muted">
						v2.4.1 // uwu-logs
					</span>
					<span className="font-body text-2xs text-muted">
						LAST SYNC: —
					</span>
				</div>

				{/* User profile */}
				<div className="flex items-center gap-2.5 border-t border-border pt-3">
					<div className="flex size-7 items-center justify-center rounded-full bg-accent-20">
						<User className="size-3.5 text-accent" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="truncate font-body text-xs font-semibold text-primary">
							{user.name}
						</span>
						<span className="truncate font-body text-2xs text-muted">
							{user.email}
						</span>
					</div>
					<button
						type="button"
						className="text-muted transition-colors hover:text-primary"
						aria-label="Sign out"
					>
						<LogOut className="size-3.5" />
					</button>
				</div>
			</div>
		</aside>
	);
};
```

Note: The logout button is non-functional for now. Sign-out logic will be added when we wire up auth actions. The core selector and upload button are static placeholders.

**Step 2: Commit**

```bash
git add src/components/sidebar.tsx
git commit -m "feat: add Sidebar server component with navigation and user profile"
```

---

### Task 4: Update (app) layout to render the sidebar shell

**Files:**
- Modify: `src/app/(app)/layout.tsx`

**Step 1: Update the layout**

Replace the entire file with:

```tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";

export default async function AppLayout({
	children,
}: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<div className="flex h-screen bg-page">
			<Sidebar user={{ name: session.user.name, email: session.user.email }} />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
```

Key points:
- Session check moved from individual pages to the layout (applies to all `(app)` routes)
- Horizontal flex: sidebar fixed 240px, main content fills rest
- Main content area scrolls independently (`overflow-y-auto`)

**Step 2: Update the dashboard page to remove redundant session check**

Modify `src/app/(app)/page.tsx` — remove the session check (layout handles it) and update the layout to work within the new shell:

```tsx
export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Overview
				</h1>
				<p className="font-body text-sm text-secondary">
					// Raid Core Analyzer
				</p>
			</div>
		</div>
	);
}
```

Note: This is now a simple server component with no async, no session check — the layout handles auth. The page just renders a heading matching the design.

**Step 3: Verify the build**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

**Step 4: Commit**

```bash
git add src/app/\(app\)/layout.tsx src/app/\(app\)/page.tsx
git commit -m "feat: wire Sidebar into (app) layout with session-based auth"
```

---

### Task 5: Create placeholder pages for remaining routes

**Files:**
- Create: `src/app/(app)/raids/page.tsx`
- Create: `src/app/(app)/members/page.tsx`
- Create: `src/app/(app)/gear/page.tsx`
- Create: `src/app/(app)/trends/page.tsx`
- Create: `src/app/(app)/exports/page.tsx`

**Step 1: Create all 5 placeholder pages**

Each follows the same pattern. Here's the template — replace `TITLE` and `SUBTITLE` per route:

`src/app/(app)/raids/page.tsx`:
```tsx
export default function RaidsPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Raid Details
				</h1>
				<p className="font-body text-sm text-secondary">
					// Boss encounters and performance metrics
				</p>
			</div>
		</div>
	);
}
```

`src/app/(app)/members/page.tsx`:
```tsx
export default function MembersPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Members
				</h1>
				<p className="font-body text-sm text-secondary">
					// Roster and individual performance
				</p>
			</div>
		</div>
	);
}
```

`src/app/(app)/gear/page.tsx`:
```tsx
export default function GearPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Gear & Enchants
				</h1>
				<p className="font-body text-sm text-secondary">
					// Equipment audit and enchant compliance
				</p>
			</div>
		</div>
	);
}
```

`src/app/(app)/trends/page.tsx`:
```tsx
export default function TrendsPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Trends
				</h1>
				<p className="font-body text-sm text-secondary">
					// Group performance metrics over time
				</p>
			</div>
		</div>
	);
}
```

`src/app/(app)/exports/page.tsx`:
```tsx
export default function ExportsPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Exports
				</h1>
				<p className="font-body text-sm text-secondary">
					// Download and share raid data
				</p>
			</div>
		</div>
	);
}
```

**Step 2: Verify the build**

Run: `pnpm build`
Expected: Build succeeds. All 6 routes (`/`, `/raids`, `/members`, `/gear`, `/trends`, `/exports`) should be listed in the build output.

**Step 3: Commit**

```bash
git add src/app/\(app\)/raids src/app/\(app\)/members src/app/\(app\)/gear src/app/\(app\)/trends src/app/\(app\)/exports
git commit -m "feat: add placeholder pages for all navigation routes"
```

---

### Task 6: Visual verification and formatting

**Step 1: Run Biome format**

Run: `pnpm biome check --fix src/components/sidebar.tsx src/components/nav-links.tsx src/components/ui/nav-item.tsx src/app/\(app\)/`
Expected: Files formatted with no lint errors.

**Step 2: Run the build one final time**

Run: `pnpm build`
Expected: Clean build with no warnings or errors.

**Step 3: Manual verification**

Start the dev server with `pnpm dev` and verify:
- Sidebar renders at 240px on the left with `bg-sidebar` background
- Logo shows sword icon + "WOW RAID TOOLS"
- All 6 nav items are visible with correct icons
- Clicking each nav item navigates to the correct route
- Active nav item is highlighted in green with green-tinted background
- Bottom section shows core selector, upload button, system info, and user profile
- User name and email from the session appear in the profile section
- Main content area scrolls independently
- Page headers render correctly for each route

**Step 4: Commit any formatting fixes**

```bash
git add -A
git commit -m "style: apply Biome formatting"
```
