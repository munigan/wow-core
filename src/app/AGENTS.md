# App Router

## Pages are server components

Never add `"use client"` to `page.tsx` or `layout.tsx`. Pages must always be server components. Interactive parts go into child client components colocated alongside the page.

```
app/(auth)/sign-in/
├── page.tsx           # Server component — imports and renders the form
└── sign-in-form.tsx   # "use client" — contains hooks, state, event handlers
```

```tsx
// page.tsx — server component, no "use client"
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return <SignInForm />;
}
```

This preserves server-side capabilities on the page (metadata, `headers()`, data fetching) and pushes the client boundary to the smallest subtree.

## Route groups

- `(auth)` — public auth pages (`/sign-in`, `/sign-up`), centered layout
- `(app)` — authenticated pages, session-checked

## Proxy (middleware)

Next.js 16 uses `src/proxy.ts` (not `middleware.ts`). Export `export default async function proxy()`. The matcher excludes `/api`, `/_next`, `/dev`, and static assets.

## Providers

`src/app/providers.tsx` wraps the app with TanStack Query. It is a `"use client"` component imported by the root `layout.tsx` (server component).
