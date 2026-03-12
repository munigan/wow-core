# Raid Cores Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to create raid cores, switch between them via a sidebar popover, and gate all app pages behind an active core requirement.

**Architecture:** Uses better-auth's organization plugin with table names remapped to `cores`, `core_members`, `core_invitations`. New UI components (Popover, Dialog) built on `@base-ui/react`. A setup page handles first-time users with no cores. The sidebar's Select is replaced with a Popover-based core switcher.

**Tech Stack:** better-auth (organization plugin), Drizzle ORM (postgres-js), @base-ui/react (popover, dialog), React Hook Form + Zod v4, Tailwind CSS v4

---

### Task 1: Drizzle Schema — Cores Table

**Files:**
- Create: `src/lib/db/schema/cores.ts`
- Modify: `src/lib/db/schema/index.ts`

**Step 1: Create the cores table schema**

```ts
// src/lib/db/schema/cores.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamptz = () => timestamp({ withTimezone: true });

export const cores = pgTable("cores", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	slug: text().notNull().unique(),
	logo: text(),
	metadata: text(),
	realm: text().notNull(),
	raidSize: text().notNull(),
	createdAt: timestamptz().notNull().defaultNow(),
});
```

**Step 2: Update the barrel export**

Add `cores` to `src/lib/db/schema/index.ts`:

```ts
import { accounts } from "./accounts";
import { cores } from "./cores";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export { accounts } from "./accounts";
export { cores } from "./cores";
export { sessions } from "./sessions";
export { users } from "./users";
export { verifications } from "./verifications";

export const schema = {
	users,
	sessions,
	accounts,
	verifications,
	cores,
};
```

**Step 3: Commit**

```bash
git add src/lib/db/schema/cores.ts src/lib/db/schema/index.ts
git commit -m "feat: add cores Drizzle schema table"
```

---

### Task 2: Drizzle Schema — Core Members Table

**Files:**
- Create: `src/lib/db/schema/core-members.ts`
- Modify: `src/lib/db/schema/index.ts`

**Step 1: Create the core members table schema**

```ts
// src/lib/db/schema/core-members.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const coreMembers = pgTable("core_members", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	role: text().notNull().default("member"),
	createdAt: timestamptz().notNull().defaultNow(),
});
```

Note: better-auth's organization plugin uses `organizationId` as the internal column name for the FK to the organization table, even though our table is named `cores`. We must keep the column name `organizationId` for compatibility with the plugin's queries.

**Step 2: Update the barrel export**

Add `coreMembers` to `src/lib/db/schema/index.ts` — both the import/export and the schema object.

**Step 3: Commit**

```bash
git add src/lib/db/schema/core-members.ts src/lib/db/schema/index.ts
git commit -m "feat: add core_members Drizzle schema table"
```

---

### Task 3: Drizzle Schema — Core Invitations Table

**Files:**
- Create: `src/lib/db/schema/core-invitations.ts`
- Modify: `src/lib/db/schema/index.ts`

**Step 1: Create the core invitations table schema**

```ts
// src/lib/db/schema/core-invitations.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const coreInvitations = pgTable("core_invitations", {
	id: uuid().primaryKey().defaultRandom(),
	email: text().notNull(),
	inviterId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	role: text().notNull().default("member"),
	status: text().notNull().default("pending"),
	createdAt: timestamptz().notNull().defaultNow(),
	expiresAt: timestamptz().notNull(),
});
```

**Step 2: Update the barrel export**

Add `coreInvitations` to `src/lib/db/schema/index.ts` — both the import/export and the schema object.

**Step 3: Commit**

```bash
git add src/lib/db/schema/core-invitations.ts src/lib/db/schema/index.ts
git commit -m "feat: add core_invitations Drizzle schema table"
```

---

### Task 4: Configure better-auth Organization Plugin

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/lib/auth-client.ts`

**Step 1: Add the organization plugin to the server config**

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications,
			organization: schema.cores,
			member: schema.coreMembers,
			invitation: schema.coreInvitations,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
		},
	},
	user: {
		modelName: "users",
	},
	session: {
		modelName: "sessions",
	},
	plugins: [
		organization({
			schema: {
				organization: {
					modelName: "cores",
					additionalFields: {
						realm: {
							type: "string",
							required: true,
							input: true,
						},
						raidSize: {
							type: "string",
							required: true,
							input: true,
						},
					},
				},
				member: {
					modelName: "coreMembers",
				},
				invitation: {
					modelName: "coreInvitations",
				},
			},
		}),
	],
	advanced: {
		database: {
			generateId: false,
		},
	},
});
```

**Step 2: Add the organization client plugin**

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	plugins: [organizationClient()],
});
```

**Step 3: Run database migration**

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Verify the migration creates the `cores`, `core_members`, and `core_invitations` tables.

**Step 4: Commit**

```bash
git add src/lib/auth.ts src/lib/auth-client.ts drizzle/
git commit -m "feat: configure better-auth organization plugin for raid cores"
```

---

### Task 5: Popover UI Component

**Files:**
- Create: `src/components/ui/popover.tsx`

**Step 1: Create the Popover compound component**

Build on `@base-ui/react/popover`. Follow the same compound pattern as Tooltip and Select. Parts: `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`.

```tsx
// src/components/ui/popover.tsx
"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { twMerge } from "tailwind-merge";

export type PopoverRootProps = {
	open?: boolean;
	onOpenChangeAction?: (open: boolean) => void;
	children: React.ReactNode;
};

export const PopoverRoot = ({
	open,
	onOpenChangeAction,
	children,
}: PopoverRootProps) => {
	return (
		<BasePopover.Root open={open} onOpenChange={onOpenChangeAction}>
			{children}
		</BasePopover.Root>
	);
};

export type PopoverTriggerProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const PopoverTrigger = ({
	className,
	render,
	children,
}: PopoverTriggerProps) => {
	return (
		<BasePopover.Trigger className={className} render={render}>
			{children}
		</BasePopover.Trigger>
	);
};

export type PopoverContentProps = {
	className?: string;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	align?: "start" | "center" | "end";
};

export const PopoverContent = ({
	className,
	children,
	side = "top",
	sideOffset = 4,
	align = "start",
}: PopoverContentProps) => {
	return (
		<BasePopover.Portal>
			<BasePopover.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				collisionPadding={8}
			>
				<BasePopover.Popup
					className={twMerge(
						"flex flex-col border border-border bg-elevated py-1 font-body shadow-lg origin-(--transform-origin) transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
						className,
					)}
				>
					{children}
				</BasePopover.Popup>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	);
};

export type PopoverCloseProps = {
	className?: string;
	children: React.ReactNode;
};

export const PopoverClose = ({ className, children }: PopoverCloseProps) => {
	return (
		<BasePopover.Close className={className}>{children}</BasePopover.Close>
	);
};
```

**Step 2: Commit**

```bash
git add src/components/ui/popover.tsx
git commit -m "feat(ui): add Popover compound component"
```

---

### Task 6: Dialog UI Component

**Files:**
- Create: `src/components/ui/dialog.tsx`

**Step 1: Create the Dialog compound component**

Build on `@base-ui/react/dialog`. Parts: `DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`. Visual style mirrors the Tooltip component: `bg-sidebar`, `border border-accent`.

```tsx
// src/components/ui/dialog.tsx
"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { twMerge } from "tailwind-merge";

export type DialogRootProps = {
	open?: boolean;
	onOpenChangeAction?: (open: boolean) => void;
	children: React.ReactNode;
};

export const DialogRoot = ({
	open,
	onOpenChangeAction,
	children,
}: DialogRootProps) => {
	return (
		<BaseDialog.Root open={open} onOpenChange={onOpenChangeAction}>
			{children}
		</BaseDialog.Root>
	);
};

export type DialogTriggerProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const DialogTrigger = ({
	className,
	render,
	children,
}: DialogTriggerProps) => {
	return (
		<BaseDialog.Trigger className={className} render={render}>
			{children}
		</BaseDialog.Trigger>
	);
};

export type DialogContentProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogContent = ({
	className,
	children,
}: DialogContentProps) => {
	return (
		<BaseDialog.Portal>
			<BaseDialog.Backdrop className="fixed inset-0 bg-black/60 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0" />
			<BaseDialog.Popup
				className={twMerge(
					"fixed top-1/2 left-1/2 flex w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 border border-accent bg-sidebar p-8 shadow-lg origin-center transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
					className,
				)}
			>
				{children}
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	);
};

export type DialogTitleProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogTitle = ({ className, children }: DialogTitleProps) => {
	return (
		<BaseDialog.Title
			className={twMerge(
				"font-heading text-lg font-semibold text-primary",
				className,
			)}
		>
			{children}
		</BaseDialog.Title>
	);
};

export type DialogDescriptionProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogDescription = ({
	className,
	children,
}: DialogDescriptionProps) => {
	return (
		<BaseDialog.Description
			className={twMerge(
				"font-body text-sm text-secondary",
				className,
			)}
		>
			{children}
		</BaseDialog.Description>
	);
};

export type DialogCloseProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const DialogClose = ({
	className,
	render,
	children,
}: DialogCloseProps) => {
	return (
		<BaseDialog.Close className={className} render={render}>
			{children}
		</BaseDialog.Close>
	);
};
```

**Step 2: Commit**

```bash
git add src/components/ui/dialog.tsx
git commit -m "feat(ui): add Dialog compound component"
```

---

### Task 7: Create Core Form Component

**Files:**
- Create: `src/components/create-core-form.tsx`

**Step 1: Create the shared Create Core form**

This form is used both inside the Dialog and on the setup page. Uses React Hook Form + Zod v4. Calls `authClient.organization.create()` and `authClient.organization.setActive()`.

```tsx
// src/components/create-core-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

const createCoreSchema = z.object({
	name: z.string().min(2, "Core name must be at least 2 characters"),
	realm: z.enum(["onyxia", "icecrown", "lordaeron"], {
		error: "Select a realm",
	}),
	raidSize: z.enum(["10", "25"], {
		error: "Select a raid size",
	}),
});

type CreateCoreForm = z.infer<typeof createCoreSchema>;

type CreateCoreFormProps = {
	onSuccessAction?: () => void;
};

export function CreateCoreForm({ onSuccessAction }: CreateCoreFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm<CreateCoreForm>({
		resolver: zodResolver(createCoreSchema),
	});

	const firstError =
		errors.root?.message ??
		errors.name?.message ??
		errors.realm?.message ??
		errors.raidSize?.message ??
		"";
	const hasErrors = firstError !== "";

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}

	async function onSubmitAction(data: CreateCoreForm) {
		setIsLoading(true);

		const slug = generateSlug(data.name);

		const result = await authClient.organization.create({
			name: data.name,
			slug,
			metadata: {
				realm: data.realm,
				raidSize: data.raidSize,
			},
		});

		if (result.error) {
			setError("root", {
				message: result.error.message ?? "Failed to create core",
			});
			setIsLoading(false);
			return;
		}

		await authClient.organization.setActive({
			organizationId: result.data.id,
		});

		if (onSuccessAction) {
			onSuccessAction();
		}

		router.push("/");
		router.refresh();
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmitAction)}
			className="flex flex-col gap-6"
		>
			{hasErrors && <Alert message={firstError} />}

			<div className="flex flex-col gap-4">
				<Input
					label="CORE NAME"
					placeholder="Frostmourne 25H"
					{...register("name")}
				/>

				<div className="flex flex-col gap-1.5">
					<label className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						REALM
					</label>
					<SelectRoot
						onValueChangeAction={(value) => {
							if (value) setValue("realm", value as CreateCoreForm["realm"]);
						}}
					>
						<SelectTrigger placeholder="Select a realm" className="w-full" />
						<SelectPopup>
							<SelectItem value="icecrown">Icecrown</SelectItem>
							<SelectItem value="lordaeron">Lordaeron</SelectItem>
							<SelectItem value="onyxia">Onyxia</SelectItem>
						</SelectPopup>
					</SelectRoot>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						RAID SIZE
					</label>
					<div className="flex gap-2">
						<RaidSizeOption
							value="10"
							label="10-MAN"
							register={register}
						/>
						<RaidSizeOption
							value="25"
							label="25-MAN"
							register={register}
						/>
					</div>
				</div>
			</div>

			<Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
				<Plus className="size-3.5" />
				{isLoading ? "CREATING..." : "CREATE CORE"}
			</Button>
		</form>
	);
}

function RaidSizeOption({
	value,
	label,
	register,
}: {
	value: string;
	label: string;
	register: ReturnType<typeof useForm<CreateCoreForm>>["register"];
}) {
	return (
		<label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-border bg-elevated px-3 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-secondary transition-colors has-checked:border-accent has-checked:text-accent">
			<input
				type="radio"
				value={value}
				className="sr-only"
				{...register("raidSize")}
			/>
			{label}
		</label>
	);
}
```

**Step 2: Commit**

```bash
git add src/components/create-core-form.tsx
git commit -m "feat: add CreateCoreForm component with Zod validation"
```

---

### Task 8: Core Switcher Component (Sidebar Popover)

**Files:**
- Create: `src/components/core-switcher.tsx`

**Step 1: Create the core switcher**

Client component that renders the Popover with the list of cores and a "Create New Core" button that opens the Dialog.

```tsx
// src/components/core-switcher.tsx
"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateCoreForm } from "@/components/create-core-form";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	PopoverClose,
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";

type Core = {
	id: string;
	name: string;
	slug: string;
};

type CoreSwitcherProps = {
	cores: Core[];
	activeCoreId: string | null;
};

export function CoreSwitcher({ cores, activeCoreId }: CoreSwitcherProps) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const activeCore = cores.find((c) => c.id === activeCoreId);

	async function handleSwitchCore(coreId: string) {
		if (coreId === activeCoreId) {
			setIsPopoverOpen(false);
			return;
		}

		await authClient.organization.setActive({
			organizationId: coreId,
		});

		setIsPopoverOpen(false);
		router.push("/");
		router.refresh();
	}

	function handleCreateCore() {
		setIsPopoverOpen(false);
		setIsDialogOpen(true);
	}

	return (
		<>
			<PopoverRoot open={isPopoverOpen} onOpenChangeAction={setIsPopoverOpen}>
				<PopoverTrigger className="flex w-full items-center gap-2 border border-border bg-elevated px-3.5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-primary outline-none transition-colors hover:border-border-light">
					<span className="flex-1 truncate text-left">
						{activeCore?.name ?? "Select Core"}
					</span>
					<ChevronDown className="size-3.5 shrink-0 text-dimmed" />
				</PopoverTrigger>
				<PopoverContent side="top" sideOffset={4} align="start" className="w-[calc(var(--anchor-width))]">
					{cores.map((core) => (
						<PopoverClose
							key={core.id}
							className="w-full px-3.5 py-2 text-left font-body text-xs font-semibold uppercase tracking-wide text-secondary outline-none transition-colors hover:bg-subtle hover:text-primary data-highlighted:bg-subtle data-highlighted:text-primary"
						>
							<button
								type="button"
								className="w-full text-left"
								onClick={() => handleSwitchCore(core.id)}
							>
								{core.name}
							</button>
						</PopoverClose>
					))}

					<div className="mx-3 my-1 h-px bg-border" />

					<button
						type="button"
						onClick={handleCreateCore}
						className="flex w-full items-center gap-2 px-3.5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-accent outline-none transition-colors hover:bg-subtle"
					>
						<Plus className="size-3" />
						Create New Core
					</button>
				</PopoverContent>
			</PopoverRoot>

			<DialogRoot open={isDialogOpen} onOpenChangeAction={setIsDialogOpen}>
				<DialogContent>
					<DialogTitle>Create New Core</DialogTitle>
					<DialogDescription>
						Set up a new raid core workspace.
					</DialogDescription>
					<CreateCoreForm
						onSuccessAction={() => setIsDialogOpen(false)}
					/>
				</DialogContent>
			</DialogRoot>
		</>
	);
}
```

**Step 2: Commit**

```bash
git add src/components/core-switcher.tsx
git commit -m "feat: add CoreSwitcher component with popover and dialog"
```

---

### Task 9: Setup Page

**Files:**
- Create: `src/app/(setup)/layout.tsx`
- Create: `src/app/(setup)/setup/page.tsx`

**Step 1: Create the setup layout**

Same centered layout pattern as the auth layout. No sidebar.

```tsx
// src/app/(setup)/layout.tsx
export default function SetupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-page">
			{children}
		</div>
	);
}
```

**Step 2: Create the setup page (server component)**

```tsx
// src/app/(setup)/setup/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SetupForm } from "./setup-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Setup — WoW Raid Tools",
};

export default async function SetupPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return <SetupForm />;
}
```

**Step 3: Create the setup form (client component)**

```tsx
// src/app/(setup)/setup/setup-form.tsx
"use client";

import { Sword } from "lucide-react";
import { CreateCoreForm } from "@/components/create-core-form";

export function SetupForm() {
	return (
		<div className="flex w-[420px] flex-col gap-8 border border-border bg-sidebar p-10">
			{/* Logo */}
			<div className="flex flex-col items-center gap-6">
				<div className="flex items-center justify-center gap-3">
					<Sword className="size-5 text-accent" />
					<span className="font-body text-base font-semibold tracking-wide text-primary">
						WOW RAID TOOLS
					</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<h1 className="font-heading text-lg font-semibold text-primary">
						Create Your First Core
					</h1>
					<p className="text-center font-body text-sm text-secondary">
						A core is your raid group workspace. Set up your first one
						to get started.
					</p>
				</div>
			</div>

			<CreateCoreForm />
		</div>
	);
}
```

**Step 4: Commit**

```bash
git add src/app/(setup)/
git commit -m "feat: add setup page for first-time core creation"
```

---

### Task 10: Update App Layout — Active Core Gate

**Files:**
- Modify: `src/app/(app)/layout.tsx`
- Modify: `src/components/sidebar.tsx`

**Step 1: Update the app layout to check for cores and pass data to sidebar**

The layout must:
1. Check if user has any cores (via `auth.api.listOrganizations()`)
2. Redirect to `/setup` if no cores
3. Auto-set first core as active if none is active
4. Pass cores list and active core ID to the sidebar

```tsx
// src/app/(app)/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		headers: requestHeaders,
	});

	if (!session) {
		redirect("/sign-in");
	}

	const orgs = await auth.api.listOrganizations({
		headers: requestHeaders,
	});

	if (!orgs || orgs.length === 0) {
		redirect("/setup");
	}

	let activeCoreId = session.session.activeOrganizationId;

	if (!activeCoreId) {
		await auth.api.setActiveOrganization({
			headers: requestHeaders,
			body: { organizationId: orgs[0].id },
		});
		activeCoreId = orgs[0].id;
	}

	const cores = orgs.map((org) => ({
		id: org.id,
		name: org.name,
		slug: org.slug,
	}));

	return (
		<div className="flex h-screen bg-page">
			<Sidebar
				user={{ name: session.user.name, email: session.user.email }}
				cores={cores}
				activeCoreId={activeCoreId}
			/>
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
```

Note: The exact API method names (`auth.api.listOrganizations`, `auth.api.setActiveOrganization`) should be verified against the better-auth organization plugin server API. If the method names differ, adjust accordingly. Check the better-auth docs or TypeScript IntelliSense during implementation.

**Step 2: Update the sidebar to use CoreSwitcher**

```tsx
// src/components/sidebar.tsx
import { Sword, Upload, User } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { CoreSwitcher } from "@/components/core-switcher";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

type Core = {
	id: string;
	name: string;
	slug: string;
};

type SidebarUser = {
	name: string;
	email: string;
};

type SidebarProps = {
	user: SidebarUser;
	cores: Core[];
	activeCoreId: string | null;
};

export const Sidebar = ({ user, cores, activeCoreId }: SidebarProps) => {
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
				{/* Core selector */}
				<div className="flex flex-col gap-1">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						{"// Active Core"}
					</span>
					<CoreSwitcher cores={cores} activeCoreId={activeCoreId} />
				</div>

				{/* Upload button (placeholder) */}
				<Button className="w-full">
					<Upload className="size-3.5" />
					Upload Log
				</Button>

				{/* User profile */}
				<div className="flex items-center gap-2.5 border-t border-border pt-3">
					<div className="flex size-7 items-center justify-center rounded-full bg-accent-20">
						<User className="size-3.5 text-accent" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="truncate font-body text-xs font-semibold text-primary">
							{user.name}
						</span>
						<span className="truncate font-body text-2xs font-medium text-dimmed">
							{user.email}
						</span>
					</div>
					<SignOutButton />
				</div>
			</div>
		</aside>
	);
};
```

**Step 3: Commit**

```bash
git add src/app/(app)/layout.tsx src/components/sidebar.tsx
git commit -m "feat: gate app layout behind active core, replace Select with CoreSwitcher"
```

---

### Task 11: Update Proxy for Setup Route

**Files:**
- Modify: `src/proxy.ts`

**Step 1: Check if `/setup` needs protection**

Read `src/proxy.ts` and verify the matcher. The setup route requires authentication (user must be signed in), so it should NOT be excluded from the proxy. It should be a protected route. Verify that the current matcher already covers `/setup` — it likely does since the matcher only excludes specific paths like `api`, `_next`, `dev`, `sign-in`, `sign-up`.

If the proxy redirects unauthenticated users to `/sign-in` for all unmatched paths, `/setup` is already protected. No changes needed.

However, the proxy currently redirects authenticated users away from auth pages to `/`. We need to make sure it does NOT redirect authenticated users away from `/setup` — it shouldn't, since `/setup` is not an auth page. Verify this.

**Step 2: Commit only if changes were made**

```bash
git add src/proxy.ts
git commit -m "fix: ensure proxy allows authenticated access to /setup"
```

---

### Task 12: Update Component Showcase

**Files:**
- Modify: `src/app/dev/components/showcase.tsx`

**Step 1: Add Popover and Dialog to the dev showcase**

Add sections demonstrating the new Popover and Dialog components to the existing showcase page. Follow the same pattern used for existing components.

**Step 2: Commit**

```bash
git add src/app/dev/components/showcase.tsx
git commit -m "feat(dev): add Popover and Dialog to component showcase"
```

---

### Task 13: Verification

**Step 1: Run the dev server**

```bash
pnpm dev
```

**Step 2: Manual verification checklist**

1. Sign in with an existing user — should redirect to `/setup`
2. On `/setup`, fill the form and create a core — should redirect to `/`
3. In the sidebar, the active core name appears in the dropdown trigger
4. Click the popover trigger — popover opens showing the core + "Create New Core" button
5. Click "Create New Core" — dialog opens with the form
6. Create a second core — dialog closes, page refreshes with new active core
7. Open popover again — both cores visible
8. Click the first core — switches active core, redirects to `/`
9. Sign out and sign in — active core persists in session
10. Visit `/dev/components` — Popover and Dialog sections render correctly

**Step 3: Run lint and type check**

```bash
pnpm biome check --write .
pnpm tsc --noEmit
```

Fix any errors found.

**Step 4: Commit any fixes**

```bash
git add .
git commit -m "fix: address lint and type errors from raid cores implementation"
```

---

### Task 14: Update UI Components AGENTS.md

**Files:**
- Modify: `src/components/ui/AGENTS.md`

**Step 1: Add Popover and Dialog to the components table and add usage notes**

Add entries for the new components following the existing pattern. Include notes about:
- Popover: compound pattern, callback prop naming (`onOpenChangeAction`)
- Dialog: compound pattern, visual style matches Tooltip, callback prop naming (`onOpenChangeAction`)

**Step 2: Commit**

```bash
git add src/components/ui/AGENTS.md
git commit -m "docs: add Popover and Dialog to UI components AGENTS.md"
```
