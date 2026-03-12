# Log Upload & Member Extraction — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upload WoW combat logs, stream-parse player names, upsert them as core members, and create raid records. Establish tRPC as the backend RPC layer.

**Architecture:** Raw Next.js API route for file upload (streaming parse + XHR progress), tRPC for all queries/mutations. Three new DB tables: `members`, `raids`, `raidMembers`.

**Tech Stack:** tRPC v11, TanStack React Query, Drizzle ORM, Next.js 16 App Router, Zod v4, XHR for upload progress

---

### Task 1: Database schema — `members`, `raids`, `raidMembers`

**Files:**
- Create: `src/lib/db/schema/members.ts`
- Create: `src/lib/db/schema/raids.ts`
- Create: `src/lib/db/schema/raid-members.ts`
- Modify: `src/lib/db/schema/index.ts`

**Step 1: Create `members` table schema**

Create `src/lib/db/schema/members.ts`:

```ts
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";

const timestamptz = () => timestamp({ withTimezone: true });

export const members = pgTable(
	"members",
	{
		id: uuid().primaryKey().defaultRandom(),
		coreId: uuid()
			.notNull()
			.references(() => cores.id, { onDelete: "cascade" }),
		name: text().notNull(),
		class: text(),
		spec: text(),
		role: text(),
		createdAt: timestamptz().notNull().defaultNow(),
		updatedAt: timestamptz().notNull().defaultNow(),
	},
	(table) => [unique().on(table.coreId, table.name)],
);
```

**Step 2: Create `raids` table schema**

Create `src/lib/db/schema/raids.ts`:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";

const timestamptz = () => timestamp({ withTimezone: true });

export const raids = pgTable("raids", {
	id: uuid().primaryKey().defaultRandom(),
	coreId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	name: text().notNull(),
	date: timestamptz().notNull(),
	createdAt: timestamptz().notNull().defaultNow(),
});
```

**Step 3: Create `raidMembers` join table schema**

Create `src/lib/db/schema/raid-members.ts`:

```ts
import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { members } from "./members";
import { raids } from "./raids";

const timestamptz = () => timestamp({ withTimezone: true });

export const raidMembers = pgTable(
	"raid_members",
	{
		id: uuid().primaryKey().defaultRandom(),
		raidId: uuid()
			.notNull()
			.references(() => raids.id, { onDelete: "cascade" }),
		memberId: uuid()
			.notNull()
			.references(() => members.id, { onDelete: "cascade" }),
		createdAt: timestamptz().notNull().defaultNow(),
	},
	(table) => [unique().on(table.raidId, table.memberId)],
);
```

**Step 4: Update barrel export**

Modify `src/lib/db/schema/index.ts` — add imports and exports for `members`, `raids`, `raidMembers`. Add them to the `schema` object.

**Step 5: Generate and apply migration**

Run:
```bash
pnpm drizzle-kit generate --name add-members-raids
pnpm drizzle-kit migrate
```

**Step 6: Verify**

Run:
```bash
pnpm tsc --noEmit
```
Expected: no errors.

**Step 7: Commit**

```bash
git add src/lib/db/schema/ drizzle/
git commit -m "feat: add members, raids, and raidMembers schema"
```

---

### Task 2: Log parser module

**Files:**
- Create: `src/lib/log-parser.ts`

**Step 1: Create the parser**

Create `src/lib/log-parser.ts`. This is a pure module with no DB or framework dependencies.

```ts
export type ParsedPlayer = {
	guid: string;
	name: string;
};

export type ParseResult = {
	raidDate: Date;
	raidName: string;
	players: ParsedPlayer[];
};

export async function parseLogStream(
	stream: ReadableStream<Uint8Array>,
): Promise<ParseResult> {
	const players = new Map<string, string>();
	let raidDate: Date | null = null;
	let raidName = "Unnamed Raid";

	const textStream = stream.pipeThrough(new TextDecoderStream());
	const reader = textStream.getReader();

	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += value;
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";

		for (const line of lines) {
			processLine(line, players, raidDate === null);

			if (raidDate === null) {
				raidDate = extractDate(line);
				if (raidDate) {
					const month = raidDate.getMonth() + 1;
					const day = raidDate.getDate();
					raidName = `Raid ${month}/${day}`;
				}
			}
		}
	}

	// Process remaining buffer
	if (buffer.trim()) {
		processLine(buffer, players, raidDate === null);
		if (raidDate === null) {
			raidDate = extractDate(buffer);
			if (raidDate) {
				const month = raidDate.getMonth() + 1;
				const day = raidDate.getDate();
				raidName = `Raid ${month}/${day}`;
			}
		}
	}

	return {
		raidDate: raidDate ?? new Date(),
		raidName,
		players: Array.from(players.entries()).map(([guid, name]) => ({
			guid,
			name,
		})),
	};
}

function processLine(
	line: string,
	players: Map<string, string>,
	_isFirst: boolean,
): void {
	// Format: M/D HH:MM:SS.mmm  EVENT_TYPE,sourceGUID,"sourceName",sourceFlags,destGUID,"destName",destFlags,...
	const doubleSpaceIdx = line.indexOf("  ");
	if (doubleSpaceIdx === -1) return;

	const eventPart = line.slice(doubleSpaceIdx + 2);
	// Parse comma-separated fields, respecting quoted strings
	const fields = parseFields(eventPart);
	if (fields.length < 7) return;

	// fields[0] = EVENT_TYPE
	// fields[1] = sourceGUID, fields[2] = "sourceName", fields[3] = sourceFlags
	// fields[4] = destGUID, fields[5] = "destName", fields[6] = destFlags

	const sourceGuid = fields[1];
	const sourceName = stripQuotes(fields[2]);
	const destGuid = fields[4];
	const destName = stripQuotes(fields[5]);

	if (sourceGuid && sourceGuid.startsWith("0x0E") && sourceName) {
		players.set(sourceGuid, sourceName);
	}
	if (destGuid && destGuid.startsWith("0x0E") && destName && destName !== "nil") {
		players.set(destGuid, destName);
	}
}

function parseFields(eventPart: string): string[] {
	const fields: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < eventPart.length; i++) {
		const char = eventPart[i];
		if (char === '"') {
			inQuotes = !inQuotes;
			current += char;
		} else if (char === "," && !inQuotes) {
			fields.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	if (current) fields.push(current.trim());
	return fields;
}

function extractDate(line: string): Date | null {
	// Format: M/D HH:MM:SS.mmm
	const match = line.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})/);
	if (!match) return null;

	const month = Number.parseInt(match[1], 10) - 1;
	const day = Number.parseInt(match[2], 10);
	const hours = Number.parseInt(match[3], 10);
	const minutes = Number.parseInt(match[4], 10);
	const seconds = Number.parseInt(match[5], 10);

	const now = new Date();
	return new Date(now.getFullYear(), month, day, hours, minutes, seconds);
}

function stripQuotes(s: string): string {
	if (s.startsWith('"') && s.endsWith('"')) {
		return s.slice(1, -1);
	}
	return s;
}
```

**Step 2: Verify**

Run:
```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/lib/log-parser.ts
git commit -m "feat: add combat log stream parser"
```

---

### Task 3: Upload API route

**Files:**
- Create: `src/app/api/upload/route.ts`

**Step 1: Create the upload route**

Create `src/app/api/upload/route.ts`:

```ts
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
import { raidMembers } from "@/lib/db/schema/raid-members";
import { raids } from "@/lib/db/schema/raids";
import { parseLogStream } from "@/lib/log-parser";

export async function POST(request: Request) {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const coreId = session.session.activeOrganizationId;
	if (!coreId) {
		return Response.json({ error: "No active core" }, { status: 400 });
	}

	const body = request.body;
	if (!body) {
		return Response.json({ error: "No file provided" }, { status: 400 });
	}

	try {
		const result = await parseLogStream(body);

		if (result.players.length === 0) {
			return Response.json(
				{ error: "No players found in log file" },
				{ status: 400 },
			);
		}

		// Create raid record
		const [raid] = await db
			.insert(raids)
			.values({
				coreId,
				name: result.raidName,
				date: result.raidDate,
			})
			.returning();

		// Upsert members and collect their IDs
		let newMemberCount = 0;
		const memberIds: string[] = [];

		for (const player of result.players) {
			// Try to find existing member
			const [existing] = await db
				.select()
				.from(members)
				.where(and(eq(members.coreId, coreId), eq(members.name, player.name)))
				.limit(1);

			if (existing) {
				memberIds.push(existing.id);
			} else {
				const [inserted] = await db
					.insert(members)
					.values({ coreId, name: player.name })
					.returning();
				memberIds.push(inserted.id);
				newMemberCount++;
			}
		}

		// Insert raid members
		if (memberIds.length > 0) {
			await db
				.insert(raidMembers)
				.values(memberIds.map((memberId) => ({ raidId: raid.id, memberId })))
				.onConflictDoNothing();
		}

		return Response.json({
			raidId: raid.id,
			raidName: raid.name,
			raidDate: raid.date,
			totalMembers: result.players.length,
			newMembers: newMemberCount,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return Response.json({ error: "Failed to process log file" }, { status: 500 });
	}
}
```

**Step 2: Verify**

Run:
```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/app/api/upload/
git commit -m "feat: add streaming log upload API route"
```

---

### Task 4: Install tRPC and set up foundation

**Files:**
- Modify: `package.json` (via pnpm add)
- Create: `src/lib/trpc/init.ts`
- Create: `src/lib/trpc/query-client.ts`
- Create: `src/lib/trpc/server.ts`
- Create: `src/lib/trpc/client.tsx`
- Create: `src/lib/trpc/routers/_app.ts`
- Create: `src/app/api/trpc/[...trpc]/route.ts`
- Modify: `src/app/providers.tsx`

**Step 1: Install packages**

```bash
pnpm add @trpc/server@next @trpc/client@next @trpc/react-query@next
```

Note: tRPC v11 is published under the `next` tag. Verify the installed version is 11.x.

**Step 2: Create tRPC init**

Create `src/lib/trpc/init.ts`:

```ts
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const createTRPCContext = cache(async (opts: { headers: Headers }) => {
	const session = await auth.api.getSession({ headers: opts.headers });

	return {
		session: session?.session ?? null,
		user: session?.user ?? null,
		coreId: session?.session?.activeOrganizationId ?? null,
	};
});

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session || !ctx.user || !ctx.coreId) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			session: ctx.session,
			user: ctx.user,
			coreId: ctx.coreId,
		},
	});
});
```

**Step 3: Create query client factory**

Create `src/lib/trpc/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				gcTime: 30 * 60 * 1000,
			},
		},
	});
}
```

**Step 4: Create app router**

Create `src/lib/trpc/routers/_app.ts`:

```ts
import { createTRPCRouter } from "@/lib/trpc/init";

export const appRouter = createTRPCRouter({});

export type AppRouter = typeof appRouter;
```

**Step 5: Create server-side caller for RSC**

Create `src/lib/trpc/server.ts`:

```ts
import "server-only";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "@/lib/trpc/init";
import { makeQueryClient } from "@/lib/trpc/query-client";
import type { AppRouter } from "@/lib/trpc/routers/_app";
import { appRouter } from "@/lib/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(async () => {
	return createTRPCContext({ headers: await headers() });
});

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient,
);
```

**Step 6: Create client-side provider**

Create `src/lib/trpc/client.tsx`:

```tsx
"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	httpBatchStreamLink,
	httpLink,
	isNonJsonSerializable,
	splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { makeQueryClient } from "@/lib/trpc/query-client";
import type { AppRouter } from "@/lib/trpc/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
	if (typeof window !== "undefined") return "/api/trpc";
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`;
	return "http://localhost:3000/api/trpc";
}

export const TRPCProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				splitLink({
					condition: (op) => isNonJsonSerializable(op.input),
					true: httpLink({ url: getUrl() }),
					false: httpBatchStreamLink({ url: getUrl() }),
				}),
			],
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
```

**Step 7: Create tRPC API route handler**

Create `src/app/api/trpc/[...trpc]/route.ts`:

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { headers } from "next/headers";
import { createTRPCContext } from "@/lib/trpc/init";
import { appRouter } from "@/lib/trpc/routers/_app";

const handler = async (req: Request) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: async () => createTRPCContext({ headers: await headers() }),
	});
};

export { handler as GET, handler as POST };
```

**Step 8: Update providers**

Replace `src/app/providers.tsx` contents with:

```tsx
"use client";

import { TRPCProvider } from "@/lib/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return <TRPCProvider>{children}</TRPCProvider>;
};
```

The `TRPCProvider` already wraps `QueryClientProvider` internally, so the standalone one is no longer needed.

**Step 9: Verify**

Run:
```bash
pnpm tsc --noEmit
```

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: set up tRPC v11 with auth-aware context and TanStack Query"
```

---

### Task 5: tRPC routers — raids and members

**Files:**
- Create: `src/lib/trpc/routers/raids.ts`
- Create: `src/lib/trpc/routers/members.ts`
- Modify: `src/lib/trpc/routers/_app.ts`

**Step 1: Create raids router**

Create `src/lib/trpc/routers/raids.ts`:

```ts
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { raids } from "@/lib/db/schema/raids";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const raidsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select()
			.from(raids)
			.where(eq(raids.coreId, ctx.coreId))
			.orderBy(desc(raids.date));
	}),
});
```

**Step 2: Create members router**

Create `src/lib/trpc/routers/members.ts`:

```ts
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema/members";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";

export const membersRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select()
			.from(members)
			.where(eq(members.coreId, ctx.coreId))
			.orderBy(asc(members.name));
	}),
});
```

**Step 3: Merge into app router**

Update `src/lib/trpc/routers/_app.ts`:

```ts
import { createTRPCRouter } from "@/lib/trpc/init";
import { membersRouter } from "@/lib/trpc/routers/members";
import { raidsRouter } from "@/lib/trpc/routers/raids";

export const appRouter = createTRPCRouter({
	raids: raidsRouter,
	members: membersRouter,
});

export type AppRouter = typeof appRouter;
```

**Step 4: Verify**

Run:
```bash
pnpm tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/lib/trpc/routers/
git commit -m "feat: add raids and members tRPC routers"
```

---

### Task 6: Upload dialog UI — `UploadLogDialog` + `UploadLogForm`

**Files:**
- Create: `src/components/upload-log-dialog.tsx`
- Create: `src/components/upload-log-form.tsx`
- Modify: `src/components/sidebar.tsx`

**Step 1: Create `UploadLogForm`**

Create `src/components/upload-log-form.tsx`. This component manages the 3 upload states (select, uploading, results):

```tsx
"use client";

import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

type UploadResult = {
	raidId: string;
	raidName: string;
	raidDate: string;
	totalMembers: number;
	newMembers: number;
};

type UploadState =
	| { step: "select" }
	| { step: "uploading"; fileName: string; fileSize: number; progress: number }
	| { step: "error"; message: string }
	| { step: "done"; result: UploadResult };

type UploadLogFormProps = {
	onDoneAction: () => void;
};

export function UploadLogForm({ onDoneAction }: UploadLogFormProps) {
	const router = useRouter();
	const [state, setState] = useState<UploadState>({ step: "select" });
	const xhrRef = useRef<XMLHttpRequest | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleFile = useCallback((file: File) => {
		setState({
			step: "uploading",
			fileName: file.name,
			fileSize: file.size,
			progress: 0,
		});

		const xhr = new XMLHttpRequest();
		xhrRef.current = xhr;

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) {
				const progress = Math.round((e.loaded / e.total) * 100);
				setState((prev) =>
					prev.step === "uploading" ? { ...prev, progress } : prev,
				);
			}
		};

		xhr.onload = () => {
			try {
				const data = JSON.parse(xhr.responseText);
				if (xhr.status >= 200 && xhr.status < 300) {
					setState({ step: "done", result: data });
				} else {
					setState({
						step: "error",
						message: data.error ?? "Upload failed",
					});
				}
			} catch {
				setState({ step: "error", message: "Invalid server response" });
			}
		};

		xhr.onerror = () => {
			setState({ step: "error", message: "Network error during upload" });
		};

		xhr.onabort = () => {
			setState({ step: "select" });
		};

		xhr.open("POST", "/api/upload");
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.send(file);
	}, []);

	const handleCancel = () => {
		xhrRef.current?.abort();
		xhrRef.current = null;
	};

	const handleDone = () => {
		onDoneAction();
		router.refresh();
	};

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file && file.name.endsWith(".txt")) {
				handleFile(file);
			}
		},
		[handleFile],
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	function formatSize(bytes: number): string {
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	if (state.step === "uploading") {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<FileText className="size-5 shrink-0 text-accent" />
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="truncate font-body text-xs font-semibold text-primary">
							{state.fileName}
						</span>
						<span className="font-body text-2xs text-dimmed">
							{formatSize(state.fileSize)}
						</span>
					</div>
					<span className="font-body text-xs font-semibold text-accent">
						{state.progress}%
					</span>
				</div>
				<ProgressBar value={state.progress} />
				<Button
					type="button"
					variant="secondary"
					className="w-full"
					onClick={handleCancel}
				>
					<X className="size-3.5" />
					CANCEL
				</Button>
			</div>
		);
	}

	if (state.step === "error") {
		return (
			<div className="flex flex-col gap-4">
				<Alert message={state.message} />
				<Button
					type="button"
					variant="secondary"
					className="w-full"
					onClick={() => setState({ step: "select" })}
				>
					TRY AGAIN
				</Button>
			</div>
		);
	}

	if (state.step === "done") {
		const { result } = state;
		const dateStr = new Date(result.raidDate).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});

		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3 py-4">
					<CheckCircle className="size-8 text-accent" />
					<div className="flex flex-col items-center gap-1">
						<span className="font-heading text-base font-semibold text-primary">
							{result.raidName}
						</span>
						<span className="font-body text-xs text-secondary">{dateStr}</span>
					</div>
					<span className="font-body text-sm text-secondary">
						{result.totalMembers} members found, {result.newMembers} new
					</span>
				</div>
				<Button type="button" className="w-full" onClick={handleDone}>
					DONE
				</Button>
			</div>
		);
	}

	// State: select
	return (
		<div className="flex flex-col gap-4">
			<button
				type="button"
				className="flex cursor-pointer flex-col items-center gap-3 border border-dashed border-border px-6 py-10 transition-colors hover:border-accent hover:bg-subtle"
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onClick={() => inputRef.current?.click()}
			>
				<Upload className="size-6 text-dimmed" />
				<div className="flex flex-col items-center gap-1">
					<span className="font-body text-sm font-semibold text-primary">
						Drag & drop your combat log here
					</span>
					<span className="font-body text-2xs text-dimmed">
						or click to browse (.txt)
					</span>
				</div>
			</button>
			<input
				ref={inputRef}
				type="file"
				accept=".txt"
				className="hidden"
				onChange={handleInputChange}
			/>
		</div>
	);
}
```

**Step 2: Create `UploadLogDialog`**

Create `src/components/upload-log-dialog.tsx`:

```tsx
"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { UploadLogForm } from "@/components/upload-log-form";
import {
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UploadLogDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DialogRoot open={isOpen} onOpenChangeAction={setIsOpen}>
			<DialogTrigger render={<span />}>
				<Button className="w-full">
					<Upload className="size-3.5" />
					Upload Log
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Upload Log</DialogTitle>
				<DialogDescription>
					Upload a WoW combat log file to extract raid data and members.
				</DialogDescription>
				<UploadLogForm onDoneAction={() => setIsOpen(false)} />
			</DialogContent>
		</DialogRoot>
	);
}
```

**Step 3: Update sidebar**

Modify `src/components/sidebar.tsx`:
- Replace the placeholder `<Button>` for "Upload Log" with the `<UploadLogDialog />` component.
- The sidebar is a server component, but `UploadLogDialog` is a client component — this is fine, server components can render client components.
- Remove the `Upload` import from lucide since it moves into the dialog component.

Replace this section:
```tsx
{/* Upload button (placeholder) */}
<Button className="w-full">
	<Upload className="size-3.5" />
	Upload Log
</Button>
```

With:
```tsx
{/* Upload log */}
<UploadLogDialog />
```

Update imports: remove `Upload` from lucide import, add `import { UploadLogDialog } from "@/components/upload-log-dialog";`. Remove `import { Button } from "@/components/ui/button";` if it's no longer used elsewhere in the sidebar.

**Step 4: Verify**

Run:
```bash
pnpm tsc --noEmit
pnpm biome check --write
```

**Step 5: Commit**

```bash
git add src/components/upload-log-dialog.tsx src/components/upload-log-form.tsx src/components/sidebar.tsx
git commit -m "feat: add upload log dialog with progress bar and XHR upload"
```

---

### Task 7: Build verification and final cleanup

**Files:**
- Possibly: any files with lint/format issues

**Step 1: Run full build**

```bash
pnpm next build
```

Expected: successful build, no errors.

**Step 2: Run Biome**

```bash
pnpm biome check --write
```

Fix any formatting issues.

**Step 3: Run type check**

```bash
pnpm tsc --noEmit
```

**Step 4: Update AGENTS.md docs**

Add entries to `src/lib/AGENTS.md` documenting:
- tRPC setup (file locations, context, protectedProcedure)
- Upload API route

Add entries to `src/components/AGENTS.md` documenting:
- UploadLogDialog / UploadLogForm components

**Step 5: Commit**

```bash
git add -A
git commit -m "docs: update AGENTS.md with tRPC and upload documentation"
```
