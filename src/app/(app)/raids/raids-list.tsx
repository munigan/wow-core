"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

export function RaidsList() {
	const { data: raids, isLoading } = trpc.raids.list.useQuery();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-1">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-14 w-full" />
				))}
			</div>
		);
	}

	if (!raids || raids.length === 0) {
		return (
			<p className="font-body text-sm text-dimmed">
				No raids uploaded yet. Upload a combat log to get started.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{raids.map((raid) => {
				const dateStr = new Date(raid.date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				});

				return (
					<Link
						key={raid.id}
						href={`/raids/${raid.id}`}
						className="flex items-center justify-between border border-border px-4 py-3 transition-colors hover:border-accent hover:bg-subtle"
					>
						<div className="flex flex-col gap-0.5">
							<span className="font-body text-sm font-semibold text-primary">
								{raid.name}
							</span>
							<span className="font-body text-2xs text-dimmed">
								{raid.raidInstance ? `${raid.raidInstance} — ` : ""}
								{dateStr}
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
