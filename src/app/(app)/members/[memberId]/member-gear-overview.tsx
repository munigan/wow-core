"use client";

import { useEffect, useRef } from "react";
import { ItemTooltip } from "@/components/item-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

type MemberGearOverviewProps = {
	memberId: string;
};

function EnchantGemCell({
	kind,
	value,
}: {
	kind: "enchant" | "gem";
	value: string;
}) {
	if (value === "na") {
		return <span className="font-body text-sm text-dimmed">—</span>;
	}
	if (value === "yes") {
		return <Badge variant="success">[YES]</Badge>;
	}
	if (value === "no") {
		return <Badge variant="error">[NO]</Badge>;
	}
	if (value === "empty" && kind === "gem") {
		return <Badge variant="warning">[EMPTY]</Badge>;
	}
	return <span className="font-body text-sm text-dimmed">—</span>;
}

export function MemberGearOverview({ memberId }: MemberGearOverviewProps) {
	const utils = trpc.useUtils();
	const hasRequestedSync = useRef(false);

	const gearQuery = trpc.members.getArmoryGear.useQuery(
		{ memberId },
		{
			refetchInterval: (q) => {
				const p = q.state.data?.phase;
				return p === "syncing" || p === "pending_first_sync" ? 2000 : false;
			},
		},
	);

	const enqueueMutation = trpc.members.enqueueMemberArmoryRefresh.useMutation({
		onSuccess: () => {
			void utils.members.getArmoryGear.invalidate({ memberId });
		},
	});

	useEffect(() => {
		if (
			gearQuery.data?.phase === "pending_first_sync" &&
			!hasRequestedSync.current &&
			!enqueueMutation.isPending
		) {
			hasRequestedSync.current = true;
			enqueueMutation.mutate({ memberId });
		}
	}, [enqueueMutation, gearQuery.data?.phase, memberId]);

	const phase = gearQuery.data?.phase;
	const isInitialLoading = gearQuery.isLoading && !gearQuery.data;
	const gear = gearQuery.data?.gear ?? [];

	const showSyncBanner =
		phase === "syncing" ||
		phase === "pending_first_sync" ||
		enqueueMutation.isPending;

	if (isInitialLoading) {
		return (
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-secondary">
					{"// GEAR OVERVIEW"}
				</span>
				<div className="border border-border bg-card p-4">
					<Skeleton className="h-48 w-full" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<span className="font-body text-xs uppercase tracking-wider text-secondary">
				{"// GEAR OVERVIEW"}
			</span>

			{showSyncBanner && (
				<div className="flex items-center gap-2 border border-border bg-card px-4 py-3 font-body text-sm text-dimmed">
					<span
						className="inline-block size-3 animate-pulse rounded-full bg-accent"
						aria-hidden
					/>
					Fetching gear from Warmane (background job)…
				</div>
			)}

			{phase === "error" && gearQuery.data?.fetchError && (
				<div className="flex flex-col gap-3 border border-border bg-card px-4 py-3">
					<p className="font-body text-sm text-danger">
						{gearQuery.data.fetchError}
					</p>
					<div>
						<Button
							type="button"
							variant="secondary"
							disabled={enqueueMutation.isPending}
							onClick={() => enqueueMutation.mutate({ memberId })}
						>
							Retry
						</Button>
					</div>
				</div>
			)}

			{phase === "ready" && gear.length > 0 && (
				<div className="overflow-x-auto border border-border bg-card">
					<table className="w-full min-w-[640px] border-collapse font-body text-sm">
						<thead>
							<tr className="border-b border-border text-left text-2xs uppercase tracking-wider text-dimmed">
								<th className="px-3 py-2 font-bold">Slot</th>
								<th className="px-3 py-2 font-bold">Item</th>
								<th className="px-3 py-2 font-bold">iLvl</th>
								<th className="px-3 py-2 font-bold">Enchanted</th>
								<th className="px-3 py-2 font-bold">Gemmed</th>
							</tr>
						</thead>
						<tbody>
							{gear.map((row) => (
								<tr
									key={`${row.memberId}-${row.sortOrder}`}
									className="border-b border-border last:border-b-0"
								>
									<td className="px-3 py-2 font-bold uppercase text-dimmed">
										{row.slotLabel}
									</td>
									<td className="px-3 py-2">
										{row.itemId != null && row.itemName ? (
											<ItemTooltip itemId={row.itemId}>
												<span className="wh-tooltip inline-block cursor-help text-left">
													<span
														className={`q${row.quality ?? 1} whitespace-normal`}
													>
														{row.itemName}
													</span>
												</span>
											</ItemTooltip>
										) : (
											<span className="text-dimmed">—</span>
										)}
									</td>
									<td className="px-3 py-2 text-primary">
										{row.itemLevel != null ? row.itemLevel : "—"}
									</td>
									<td className="px-3 py-2">
										<EnchantGemCell kind="enchant" value={row.enchantStatus} />
									</td>
									<td className="px-3 py-2">
										<EnchantGemCell kind="gem" value={row.gemStatus} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
