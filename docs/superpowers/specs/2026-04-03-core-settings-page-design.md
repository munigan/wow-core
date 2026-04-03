# Core Settings Page

## Problem

There's no way to manage a core (organization) after creation — rename it, invite other users to view/upload data, or manage members. Everything relies on the creator being the sole user.

## Solution

Add a `/settings` page with core name editing, member management, and email-based invitations via Resend. Only the owner can perform actions; members see a read-only view.

## Design

### Route & Navigation

- Route: `src/app/(app)/settings/page.tsx` (server component) with client form components
- Add "Settings" nav item to `src/components/nav-links.tsx` with the `Settings` (gear) icon from lucide-react
- Place it after "Members" in the sidebar nav

### Section 1: Core Settings

A form with one editable field (name) and two read-only fields:

- **Name** — text input, pre-filled with current name. React Hook Form + Zod validation. Submits via `authClient.organization.update({ name, organizationId })`.
- **Realm** — displayed as plain text (not editable)
- **Raid Size** — displayed as plain text (not editable)
- Owner sees the form with a "Save" button; members see all three fields as read-only text.

### Section 2: Members & Invitations

#### Invite Form (owner only)

Email input + "Invite" button. Calls `authClient.organization.createInvitation({ email, role: "member", organizationId })`. On success, the pending invitations list refreshes. On error (already invited, already a member), show inline error via `setError("root", { message })`. Disable button and show loading state during submission.

#### Pending Invitations List (owner only)

Lists invitations with `status: "pending"`. Each row shows:
- Email address
- "Pending" badge
- Cancel button — shows confirmation dialog before calling `authClient.organization.cancelInvitation({ invitationId })`

If no pending invitations, hide this subsection.

#### Members List

Lists all organization members. Each row shows:
- User name
- User email (dimmed)
- Role badge ("Owner" in accent, "Member" in secondary)
- Remove button (owner only, not shown for the owner themselves) — shows confirmation dialog before calling `authClient.organization.removeMember({ memberIdOrUserId, organizationId })`

If only the owner exists and there are no invitations, show a message encouraging them to invite members.

### Resend Email Integration

#### Setup

- Install `resend` package
- Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` env vars
- Create `src/lib/resend.ts` with Resend client instance

#### Hook

Add `sendInvitationEmail` to the organization plugin config in `src/lib/auth.ts`:

```typescript
organization({
  sendInvitationEmail: async (data) => {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: data.email,
      subject: `You've been invited to ${data.organization.name}`,
      text: `${data.inviter.user.name} invited you to join ${data.organization.name} on WoW Raid Tools.\n\nSign up or log in to accept: ${process.env.BETTER_AUTH_URL}/sign-up`
    });
  },
  // ... existing schema config
})
```

Simple plain-text email. No HTML template needed. Links to the sign-up page (with option to sign in for existing users).

### Invitation Acceptance Flow

The `(app)` layout currently redirects to `/setup` if the user has no organizations. A newly invited user who signs up will have zero organizations until they accept, creating a redirect loop if `/invitations` is inside `(app)`.

**Solution:** Place the invitations page in its own route group `(invitations)`, following the same pattern as `(setup)`:

- `src/app/(invitations)/invitations/page.tsx` — server component
- `src/app/(invitations)/invitations/invitations-form.tsx` — client component
- `src/app/(invitations)/layout.tsx` — simple centered layout (like `(auth)` layout), checks session only

**Flow:**

1. Modify `(app)/layout.tsx`: before redirecting to `/setup` when user has no orgs, check for pending invitations via `auth.api.listUserInvitations()` (server-side). If invitations exist, redirect to `/invitations` instead of `/setup`.
2. On the `/invitations` page, list pending invitations with Accept/Reject buttons per invitation.
3. On accept, call `authClient.organization.acceptInvitation({ invitationId })`.
4. After accepting, the user now has an organization. The `(app)` layout will pick it up and set it as active automatically.
5. After handling all invitations (accept/reject), redirect to `/`.

### Access Control

- **Owner** — sees edit form, invite form, cancel/remove buttons
- **Member** — sees read-only core info and member list, no action buttons
- Role detected via `authClient.organization.getActiveMember()` which returns `{ role }` for the current user

### Data Fetching

Follow server-first pattern: fetch initial data in the server component page using `auth.api.*`, pass as props to client components. Mutations use `authClient.organization.*` from the client.

**Server-side (in `page.tsx`):**
- `auth.api.getFullOrganization()` — core details + members + invitations
- `auth.api.getActiveMemberRole()` or equivalent — current user's role

**Client-side (mutations only):**
- `authClient.organization.update()` — rename core
- `authClient.organization.createInvitation()` — invite by email
- `authClient.organization.cancelInvitation()` — revoke pending invite
- `authClient.organization.removeMember()` — kick member
- `authClient.organization.acceptInvitation()` — accept invite

After mutations, call `router.refresh()` to re-fetch server data.

## Scope

### Files to Create
- `src/app/(app)/settings/page.tsx` — server component, fetches org data
- `src/app/(app)/settings/core-settings-form.tsx` — client component for name editing
- `src/app/(app)/settings/members-section.tsx` — client component for members + invitations management
- `src/app/(invitations)/invitations/page.tsx` — server component for invitation acceptance
- `src/app/(invitations)/invitations/invitations-form.tsx` — client component for accept/reject UI
- `src/app/(invitations)/layout.tsx` — simple centered layout with session check
- `src/lib/resend.ts` — Resend client instance

### Files to Modify
- `src/lib/auth.ts` — add `sendInvitationEmail` hook to organization plugin
- `src/components/nav-links.tsx` — add "Settings" nav item
- `src/app/(app)/layout.tsx` — check pending invitations before redirecting to `/setup`
- `.env` — add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### Dependencies to Add
- `resend` npm package

## Out of Scope

- Custom email HTML templates (plain text is enough)
- Role management (no admin role, just owner + member)
- Editing realm or raid size
- Organization deletion
- Transfer ownership
