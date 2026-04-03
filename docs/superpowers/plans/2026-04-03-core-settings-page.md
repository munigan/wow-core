# Core Settings Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/settings` page for managing core name, members, and email invitations, plus an invitation acceptance flow for new users.

**Architecture:** Settings page fetches org data server-side via `auth.api.*` and passes props to two client components (core settings form + members section). Invitations page lives in its own `(invitations)` route group to avoid the `(app)` layout's org-required redirect. Resend sends invitation emails via better-auth's `sendInvitationEmail` hook.

**Tech Stack:** better-auth (organization plugin), Resend, React Hook Form, Zod v4, Next.js 16 App Router

**Spec:** `docs/superpowers/specs/2026-04-03-core-settings-page-design.md`

---

### Task 1: Install Resend and configure email sending

**Files:**
- Create: `src/lib/resend.ts`
- Modify: `src/lib/auth.ts`
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Install resend package**

Run: `pnpm add resend`

- [ ] **Step 2: Add env vars to `.env`**

Append to `.env`:
```
RESEND_API_KEY=re_GMvJqngQ_KytnzKeUomjsrqtDeHfE2tkR
RESEND_FROM_EMAIL=me@munigan.app
```

- [ ] **Step 3: Add env vars to `.env.example`**

Append to `.env.example`:
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

- [ ] **Step 4: Create `src/lib/resend.ts`**

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 5: Add `sendInvitationEmail` hook to `src/lib/auth.ts`**

Import resend at top:
```typescript
import { resend } from "@/lib/resend";
```

Add `sendInvitationEmail` to the `organization()` plugin call, before the `schema` key:

```typescript
organization({
  sendInvitationEmail: async (data) => {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: data.email,
      subject: `You've been invited to ${data.organization.name}`,
      text: `${data.inviter.user.name} invited you to join ${data.organization.name} on WoW Raid Tools.\n\nSign up or log in to accept: ${process.env.BETTER_AUTH_URL}/sign-up`,
    });
  },
  schema: {
    // ... existing schema config unchanged
  },
}),
```

- [ ] **Step 6: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/lib/resend.ts src/lib/auth.ts .env.example
git commit -m "feat: add Resend email integration for organization invitations"
```

Note: Do NOT commit `.env` (it should be in `.gitignore`).

---

### Task 2: Add Settings nav item to sidebar

**Files:**
- Modify: `src/components/nav-links.tsx`

- [ ] **Step 1: Add Settings to nav items**

Import the `Settings` icon from lucide-react (add to existing import line):
```typescript
import { LayoutDashboard, Settings, Swords, Users } from "lucide-react";
```

Add to `NAV_ITEMS` array after the Members entry:
```typescript
const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/raids", label: "Raids", icon: Swords },
  { href: "/members", label: "Members", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/nav-links.tsx
git commit -m "feat: add Settings nav item to sidebar"
```

---

### Task 3: Create the Settings page (server component)

**Files:**
- Create: `src/app/(app)/settings/page.tsx`

- [ ] **Step 1: Create the server component page**

This page fetches org data server-side and passes it as props to client components. Reference the pattern from `src/app/(app)/layout.tsx` for auth API calls.

```typescript
import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CoreSettingsForm } from "./core-settings-form";
import { MembersSection } from "./members-section";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const fullOrg = await auth.api.getFullOrganization({
    headers: requestHeaders,
  });

  if (!fullOrg || !session) {
    return null;
  }

  const activeMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );
  const isOwner = activeMember?.role === "owner";

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-4xl font-bold uppercase text-primary">
          Settings
        </h1>
        <p className="font-body text-sm text-secondary">
          {"// Core configuration and member management"}
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <CoreSettingsForm
          organizationId={fullOrg.id}
          name={fullOrg.name}
          realm={(fullOrg as Record<string, unknown>).realm as string}
          raidSize={(fullOrg as Record<string, unknown>).raidSize as string}
          isOwner={isOwner}
        />
        <MembersSection
          organizationId={fullOrg.id}
          members={fullOrg.members.map((m) => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            name: m.user.name,
            email: m.user.email,
          }))}
          invitations={(fullOrg.invitations ?? [])
            .filter((inv) => inv.status === "pending")
            .map((inv) => ({
              id: inv.id,
              email: inv.email,
              status: inv.status,
            }))}
          isOwner={isOwner}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
```

Note: The `fullOrg` object includes `members` (with nested `user`) and `invitations` from better-auth's `getFullOrganization`. The additional fields (`realm`, `raidSize`) are accessed via type assertion since better-auth's types don't know about our custom fields.

- [ ] **Step 2: Create placeholder client components so the page compiles**

Create `src/app/(app)/settings/core-settings-form.tsx`:
```typescript
"use client";

export type CoreSettingsFormProps = {
  organizationId: string;
  name: string;
  realm: string;
  raidSize: string;
  isOwner: boolean;
};

export function CoreSettingsForm(props: CoreSettingsFormProps) {
  return <div>Core settings placeholder</div>;
}
```

Create `src/app/(app)/settings/members-section.tsx`:
```typescript
"use client";

export type MembersSectionProps = {
  organizationId: string;
  members: {
    id: string;
    userId: string;
    role: string;
    name: string;
    email: string;
  }[];
  invitations: {
    id: string;
    email: string;
    status: string;
  }[];
  isOwner: boolean;
  currentUserId: string;
};

export function MembersSection(props: MembersSectionProps) {
  return <div>Members placeholder</div>;
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add "src/app/(app)/settings/"
git commit -m "feat: add settings page with server-side org data fetching"
```

---

### Task 4: Implement core settings form

**Files:**
- Modify: `src/app/(app)/settings/core-settings-form.tsx`

- [ ] **Step 1: Implement the form**

Follow the pattern from `src/components/create-core-form.tsx` for form structure. Reference `src/app/(auth)/sign-in/sign-in-form.tsx` for error handling pattern.

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const coreSettingsSchema = z.object({
  name: z.string().min(2, "Core name must be at least 2 characters"),
});

type CoreSettingsData = z.infer<typeof coreSettingsSchema>;

export type CoreSettingsFormProps = {
  organizationId: string;
  name: string;
  realm: string;
  raidSize: string;
  isOwner: boolean;
};

const REALM_LABELS: Record<string, string> = {
  icecrown: "Icecrown (Warmane)",
  lordaeron: "Lordaeron (Warmane)",
  onyxia: "Onyxia (Warmane)",
};

export function CoreSettingsForm({
  organizationId,
  name,
  realm,
  raidSize,
  isOwner,
}: CoreSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CoreSettingsData>({
    resolver: zodResolver(coreSettingsSchema),
    defaultValues: { name },
  });

  const firstError = errors.root?.message ?? errors.name?.message ?? "";
  const hasErrors = firstError !== "";

  async function onSubmitAction(data: CoreSettingsData) {
    setIsLoading(true);
    const result = await authClient.organization.update({
      data: { name: data.name },
      organizationId,
    });
    if (result.error) {
      setError("root", {
        message: result.error.message ?? "Failed to update core",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold uppercase text-primary">
        Core Settings
      </h2>
      <div className="flex flex-col gap-4 border border-border bg-card p-6">
        {hasErrors && <Alert message={firstError} />}

        {isOwner ? (
          <form
            onSubmit={handleSubmit(onSubmitAction)}
            className="flex flex-col gap-4"
          >
            <Input label="NAME" {...register("name")} />
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
                  Realm
                </span>
                <span className="font-body text-sm text-secondary">
                  {REALM_LABELS[realm] ?? realm}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
                  Raid Size
                </span>
                <span className="font-body text-sm text-secondary">
                  {raidSize}-man
                </span>
              </div>
            </div>
            <div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "SAVING..." : "SAVE"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
                Name
              </span>
              <span className="font-body text-sm text-primary">{name}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
                  Realm
                </span>
                <span className="font-body text-sm text-secondary">
                  {REALM_LABELS[realm] ?? realm}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
                  Raid Size
                </span>
                <span className="font-body text-sm text-secondary">
                  {raidSize}-man
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/settings/core-settings-form.tsx"
git commit -m "feat: implement core settings form with name editing"
```

---

### Task 5: Implement members section

**Files:**
- Modify: `src/app/(app)/settings/members-section.tsx`

- [ ] **Step 1: Implement the members section**

This component handles: invite form (owner), pending invitations list with cancel (owner), members list with remove (owner). Uses `authClient.organization.*` for mutations and `router.refresh()` to re-fetch.

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const inviteSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type InviteData = z.infer<typeof inviteSchema>;

export type MembersSectionProps = {
  organizationId: string;
  members: {
    id: string;
    userId: string;
    role: string;
    name: string;
    email: string;
  }[];
  invitations: {
    id: string;
    email: string;
    status: string;
  }[];
  isOwner: boolean;
  currentUserId: string;
};

export function MembersSection({
  organizationId,
  members,
  invitations,
  isOwner,
  currentUserId,
}: MembersSectionProps) {
  const router = useRouter();
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<InviteData>({
    resolver: zodResolver(inviteSchema),
  });

  const firstError = errors.root?.message ?? errors.email?.message ?? "";
  const hasErrors = firstError !== "";

  async function onInviteAction(data: InviteData) {
    setIsInviting(true);
    const result = await authClient.organization.inviteMember({
      email: data.email,
      role: "member",
      organizationId,
    });
    if (result.error) {
      setError("root", {
        message: result.error.message ?? "Failed to send invitation",
      });
      setIsInviting(false);
      return;
    }
    reset();
    setIsInviting(false);
    router.refresh();
  }

  async function handleCancelInvitation(invitationId: string) {
    if (!confirm("Cancel this invitation?")) return;
    setCancellingId(invitationId);
    await authClient.organization.cancelInvitation({
      invitationId,
    });
    setCancellingId(null);
    router.refresh();
  }

  async function handleRemoveMember(memberIdToRemove: string) {
    if (!confirm("Remove this member from the core?")) return;
    setRemovingId(memberIdToRemove);
    await authClient.organization.removeMember({
      memberIdOrUserId: memberIdToRemove,
      organizationId,
    });
    setRemovingId(null);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold uppercase text-primary">
        Members
      </h2>
      <div className="flex flex-col gap-6 border border-border bg-card p-6">
        {/* Invite form (owner only) */}
        {isOwner && (
          <form
            onSubmit={handleSubmit(onInviteAction)}
            className="flex flex-col gap-3"
          >
            {hasErrors && <Alert message={firstError} />}
            <div className="flex items-end gap-2">
              <Input
                label="INVITE BY EMAIL"
                placeholder="player@example.com"
                className="flex-1"
                {...register("email")}
              />
              <Button type="submit" disabled={isInviting}>
                {isInviting ? "INVITING..." : "INVITE"}
              </Button>
            </div>
          </form>
        )}

        {/* Pending invitations (owner only) */}
        {isOwner && invitations.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
              Pending Invitations
            </span>
            <div className="flex flex-col">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between border-b border-elevated py-2.5 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-primary">
                      {inv.email}
                    </span>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelInvitation(inv.id)}
                    disabled={cancellingId === inv.id}
                    className="font-body text-2xs text-dimmed transition-colors hover:text-danger disabled:opacity-40"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members list */}
        <div className="flex flex-col gap-2">
          <span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
            Members
          </span>
          <div className="flex flex-col">
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUserId;
              const isMemberOwner = member.role === "owner";

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between border-b border-elevated py-2.5 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="font-body text-sm text-primary">
                        {member.name}
                        {isCurrentUser && (
                          <span className="text-dimmed"> (you)</span>
                        )}
                      </span>
                      <span className="font-body text-2xs text-dimmed">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isMemberOwner ? "success" : undefined}
                    >
                      {member.role}
                    </Badge>
                    {isOwner && !isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removingId === member.id}
                        className="font-body text-2xs text-dimmed transition-colors hover:text-danger disabled:opacity-40"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {members.length === 1 && invitations.length === 0 && isOwner && (
            <p className="pt-2 font-body text-xs text-dimmed">
              You're the only member. Invite others to share access to this
              core.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
```

Note: Uses `confirm()` for destructive actions. The spec mentioned confirmation dialogs, but `confirm()` is the simplest approach. Can be upgraded to a Dialog component later if desired.

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/settings/members-section.tsx"
git commit -m "feat: implement members section with invite, cancel, and remove"
```

---

### Task 6: Create the invitations acceptance page

**Files:**
- Create: `src/app/(invitations)/layout.tsx`
- Create: `src/app/(invitations)/invitations/page.tsx`
- Create: `src/app/(invitations)/invitations/invitations-form.tsx`
- Modify: `src/app/(app)/layout.tsx`

- [ ] **Step 1: Create `(invitations)` layout**

Follows the same pattern as `(auth)/layout.tsx` and `(setup)/layout.tsx`:

```typescript
// src/app/(invitations)/layout.tsx
export default function InvitationsLayout({
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

- [ ] **Step 2: Create invitations server page**

```typescript
// src/app/(invitations)/invitations/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { InvitationsForm } from "./invitations-form";

export const metadata: Metadata = {
  title: "Pending Invitations",
};

export default async function InvitationsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/sign-in");
  }

  const invitations = await auth.api.listUserInvitations({
    headers: requestHeaders,
  });

  // If no pending invitations, go to app or setup
  if (!invitations || invitations.length === 0) {
    redirect("/");
  }

  return (
    <div className="flex w-[420px] flex-col gap-8 border border-border bg-sidebar p-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-heading text-lg font-semibold text-primary">
          Pending Invitations
        </h1>
        <p className="text-center font-body text-sm text-secondary">
          You have been invited to join the following cores.
        </p>
      </div>
      <InvitationsForm
        invitations={invitations.map((inv) => ({
          id: inv.id,
          organizationName: inv.organizationName,
          organizationId: inv.organizationId,
        }))}
      />
    </div>
  );
}
```

Note: The exact shape of `listUserInvitations` response may need adjustment during implementation — check what fields better-auth actually returns and adapt the mapping.

- [ ] **Step 3: Create invitations client form**

```typescript
// src/app/(invitations)/invitations/invitations-form.tsx
"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type InvitationsFormProps = {
  invitations: {
    id: string;
    organizationName: string;
    organizationId: string;
  }[];
};

export function InvitationsForm({ invitations }: InvitationsFormProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [handled, setHandled] = useState<Set<string>>(new Set());

  async function handleAccept(invitationId: string, organizationId: string) {
    setLoadingId(invitationId);
    await authClient.organization.acceptInvitation({
      invitationId,
    });
    await authClient.organization.setActive({
      organizationId,
    });
    setHandled((prev) => new Set(prev).add(invitationId));
    setLoadingId(null);

    // If all handled, redirect to app
    const remaining = invitations.filter(
      (inv) => !handled.has(inv.id) && inv.id !== invitationId,
    );
    if (remaining.length === 0) {
      router.push("/");
      router.refresh();
    }
  }

  async function handleReject(invitationId: string) {
    setLoadingId(invitationId);
    await authClient.organization.rejectInvitation({
      invitationId,
    });
    setHandled((prev) => new Set(prev).add(invitationId));
    setLoadingId(null);

    // If all handled, redirect
    const remaining = invitations.filter(
      (inv) => !handled.has(inv.id) && inv.id !== invitationId,
    );
    if (remaining.length === 0) {
      router.push("/");
      router.refresh();
    }
  }

  const pending = invitations.filter((inv) => !handled.has(inv.id));

  return (
    <div className="flex flex-col gap-3">
      {pending.map((inv) => (
        <div
          key={inv.id}
          className="flex items-center justify-between border border-border bg-elevated px-4 py-3"
        >
          <span className="font-body text-sm font-semibold text-primary">
            {inv.organizationName}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleAccept(inv.id, inv.organizationId)}
              disabled={loadingId !== null}
              className="p-1.5 text-accent transition-colors hover:text-accent/80 disabled:opacity-40"
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handleReject(inv.id)}
              disabled={loadingId !== null}
              className="p-1.5 text-dimmed transition-colors hover:text-danger disabled:opacity-40"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Modify `(app)/layout.tsx` to check for pending invitations**

In `src/app/(app)/layout.tsx`, after the `orgs` check and before the `activeCoreId` logic, add:

```typescript
if (!orgs || orgs.length === 0) {
  // Check for pending invitations before redirecting to setup
  const pendingInvitations = await auth.api.listUserInvitations({
    headers: requestHeaders,
  });
  if (pendingInvitations && pendingInvitations.length > 0) {
    redirect("/invitations");
  }
  redirect("/setup");
}
```

This replaces the existing:
```typescript
if (!orgs || orgs.length === 0) {
  redirect("/setup");
}
```

- [ ] **Step 5: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add "src/app/(invitations)/" "src/app/(app)/layout.tsx"
git commit -m "feat: add invitation acceptance page and redirect flow"
```

---

### Task 7: Lint, build, and manual testing

- [ ] **Step 1: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: Both pass

- [ ] **Step 2: Manual testing checklist**

Start dev server: `pnpm dev`

Test settings page (`/settings`):
1. Settings nav item appears in sidebar
2. Core name, realm, raid size display correctly
3. Owner can edit name and save
4. Name update persists after page refresh

Test members section:
1. Owner sees invite form
2. Can invite by email — check Resend dashboard for sent email
3. Pending invitation appears in list
4. Can cancel pending invitation
5. Can remove a member (test with a second account)
6. Owner cannot remove themselves
7. Member (non-owner) sees read-only view

Test invitation acceptance:
1. Sign in as invited user (create account if needed)
2. User is redirected to `/invitations` page
3. Can accept invitation
4. After accepting, redirected to app with core active
5. Can reject invitation

- [ ] **Step 3: Final commit if any fixes needed**
