# Raid Cores Design

## Overview

Raid cores are the primary tenant unit in WoW Raid Tools. Each core represents a raid group (e.g., a 25-man ICC guild run on Frostmourne). Users can create multiple cores, be invited to cores created by others, and switch between them via the sidebar. All navigation pages require an active core selected.

## Decisions

- **Multi-user cores.** Multiple users can belong to one core. The creator is the owner; others join via invitation.
- **Multiple cores per user.** A user can create and belong to several cores.
- **better-auth organization plugin** provides the data layer. Tables are renamed to domain-appropriate names.
- **Instant switch + redirect.** Switching cores sets the active core and navigates to `/` (overview).
- **Full-page setup** for users with no cores. No sidebar visible until a core exists.

## Data Architecture

### Table Mapping

The better-auth organization plugin creates three internal models. We remap all table names:

| Plugin model | Table name | Purpose |
|---|---|---|
| `organization` | `cores` | Raid core (tenant) |
| `member` | `core_members` | User membership in a core |
| `invitation` | `core_invitations` | Pending invitations (unused in MVP UI) |

### Plugin Configuration

```ts
organization({
  schema: {
    organization: {
      modelName: "cores",
      additionalFields: {
        realm: { type: "string", required: true, input: true },
        raidSize: { type: "string", required: true, input: true },
      },
    },
    member: {
      modelName: "coreMembers",
    },
    invitation: {
      modelName: "coreInvitations",
    },
  },
})
```

### Core Fields

From the plugin: `id`, `name`, `slug`, `logo` (optional), `metadata` (optional), `createdAt`.
Custom fields: `realm` (`"onyxia" | "icecrown" | "lordaeron"`), `raidSize` (`"10" | "25"`).

### Active Core

Tracked server-side in the session via `organization.setActive()`. Available on the session object as `activeOrganizationId`. Server components access it via `auth.api.getSession()`.

## UI Components

### Popover (new)

Compound component built on `@base-ui/react/popover`: `PopoverRoot`, `PopoverTrigger`, `PopoverContent`.

- Replaces the current `Select` in the sidebar core selector area.
- Trigger: active core name + chevron-down icon (matches `Component/Dropdown` from Pencil design).
- Content: list of user's cores (clickable to switch), divider, "+ Create New Core" button.
- Styling: `bg-elevated`, `border border-border`, standard font/size conventions.

### Dialog (new)

Compound component built on `@base-ui/react/dialog`: `DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`.

- Visual style mirrors the Tooltip component: `bg-sidebar`, `border border-accent`.
- Centered overlay with semi-transparent backdrop.
- Animated entry/exit (scale + opacity transition matching tooltip pattern).

### Create Core Form (new)

Shared between the Dialog and the setup page. Uses React Hook Form + Zod.

Fields:
- **Name** -- text input (e.g., "Frostmourne 25H")
- **Realm** -- select with three options: Onyxia, Icecrown, Lordaeron
- **Raid size** -- toggle/radio: 10 or 25
- **Submit** -- primary button, calls `organization.create()` with name, slug (auto-generated from name), realm, raidSize

Zod schema:
```ts
const createCoreSchema = z.object({
  name: z.string().min(2, "Core name must be at least 2 characters"),
  realm: z.enum(["onyxia", "icecrown", "lordaeron"]),
  raidSize: z.enum(["10", "25"]),
});
```

## Application Flow

### Active Core Requirement

Every page under `(app)/` requires an active core. Checked in `(app)/layout.tsx`:

1. Get session (already done for auth check).
2. List user's organizations via `auth.api.listOrganizations()`.
3. **No cores** → redirect to `/setup`.
4. **Has cores, no active one** → auto-set first core as active, render normally.
5. **Has active core** → render sidebar + page.

### Route Structure

| Route | Group | Layout | Purpose |
|---|---|---|---|
| `/setup` | `(setup)` or `(auth)` | Centered, no sidebar | First-time core creation |
| `(app)/*` | `(app)` | Sidebar + main content | All app pages (require active core) |

### Core Switching Flow

1. User opens the popover in the sidebar.
2. Clicks a different core.
3. Client calls `authClient.organization.setActive({ organizationId })`.
4. On success, `router.push("/")` navigates to overview.
5. Page re-renders with new active core data.

### Core Creation Flow (Dialog)

1. User clicks "+ Create New Core" in the popover.
2. Dialog opens with the Create Core Form.
3. User fills name, realm, raid size and submits.
4. Client calls `authClient.organization.create({ name, slug, realm, raidSize })`.
5. On success, calls `authClient.organization.setActive()` with the new core.
6. Dialog closes, page refreshes with new core active.

### Core Creation Flow (Setup)

1. User with no cores lands on `/setup`.
2. Full-page layout: logo, heading, subtext, Create Core Form (embedded directly).
3. User fills and submits the form.
4. Same API calls as dialog flow.
5. On success, redirect to `/`.

## Setup Page Design

- Full-page, centered layout (same pattern as auth pages).
- Max-width ~480px, vertically centered.
- Sword icon + "WOW RAID TOOLS" logo at top.
- Heading: "Create Your First Core" (`font-heading`).
- Subtext: "A core is your raid group workspace. Set up your first one to get started." (`text-secondary`).
- Create Core Form rendered directly (no dialog wrapper).
- On success → set active → redirect to `/`.

## Sidebar Changes

- Replace `SelectRoot`/`SelectTrigger`/`SelectPopup` with the new Popover component.
- The core selector section becomes a client component (or a client island) to handle `organization.setActive()` and `router.push()`.
- Popover trigger shows active core name in uppercase + chevron icon.
- Popover content lists all user cores + "+ Create New Core" button.

## Files Affected

### New files
- `src/lib/db/schema/cores.ts` -- Drizzle table definition for `cores`
- `src/lib/db/schema/core-members.ts` -- Drizzle table definition for `core_members`
- `src/lib/db/schema/core-invitations.ts` -- Drizzle table definition for `core_invitations`
- `src/components/ui/popover.tsx` -- Popover compound component
- `src/components/ui/dialog.tsx` -- Dialog compound component
- `src/components/create-core-form.tsx` -- Create Core Form (shared)
- `src/components/core-switcher.tsx` -- Popover-based core switcher for sidebar
- `src/app/(setup)/setup/page.tsx` -- Setup page
- `src/app/(setup)/layout.tsx` -- Setup layout (centered, no sidebar)

### Modified files
- `src/lib/auth.ts` -- Add organization plugin with schema config
- `src/lib/auth-client.ts` -- Add organizationClient plugin
- `src/lib/db/schema/index.ts` -- Export new tables + add to schema object
- `src/components/sidebar.tsx` -- Replace Select with CoreSwitcher, pass core data
- `src/app/(app)/layout.tsx` -- Add active core check, redirect to `/setup` if no cores
