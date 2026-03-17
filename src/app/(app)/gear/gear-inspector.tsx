"use client";

import { ExternalLink, Info, TriangleAlert } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	TooltipContent,
	TooltipLabel,
	TooltipRoot,
	TooltipTrigger,
	TooltipValue,
} from "@/components/ui/tooltip";
import { ItemTooltip } from "@/components/item-tooltip";
import { trpc } from "@/lib/trpc/client";
import { QUALITY_COLORS } from "@/lib/wow-data/constants";

const NOTE_ICONS: Record<string, typeof TriangleAlert> = {
	error: TriangleAlert,
	warning: TriangleAlert,
	info: Info,
};

const NOTE_COLORS: Record<string, string> = {
	error: "text-danger",
	warning: "text-warning",
	info: "text-secondary",
};

type GearInspectorProps = {
	realm: string;
};

export function GearInspector({ realm }: GearInspectorProps) {
	const [memberId, setMemberId] = useQueryState(
		"member",
		parseAsString.withDefault(""),
	);

	const { data: memberList } = trpc.members.list.useQuery();

	// Auto-select first member if none selected
	const selectedMemberId =
		memberId || memberList?.[0]?.id || "";

	const { data, isLoading } = trpc.gear.getByMember.useQuery(
		{ memberId: selectedMemberId },
		{ enabled: selectedMemberId !== "" },
	);

	const selectedMember = memberList?.find((m) => m.id === selectedMemberId);

	function handleCopyNotes() {
		if (!data?.notes.length) return;
		const text = data.notes.map((n) => n.message).join("\n");
		navigator.clipboard.writeText(text);
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Filter Row */}
			<div className="flex items-center gap-3">
				<SelectRoot
					value={selectedMemberId}
					onValueChangeAction={(val) => setMemberId(val ?? "")}
				>
					<SelectTrigger placeholder="Select member" />
					<SelectPopup>
						{memberList?.map((m) => (
							<SelectItem key={m.id} value={m.id}>
								{m.name}
							</SelectItem>
						))}
					</SelectPopup>
				</SelectRoot>

				{selectedMember && (
					<a
						href={`https://armory.warmane.com/character/${encodeURIComponent(selectedMember.name)}/${encodeURIComponent(realm)}/summary`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 border border-border px-3.5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:border-border-light hover:text-primary"
					>
						View Armory
						<ExternalLink className="size-3.5" />
					</a>
				)}
			</div>

			{/* Loading state */}
			{isLoading && (
				<>
					<div className="border border-border bg-card">
						<Skeleton className="h-10 w-full" />
						{Array.from({ length: 16 }).map((_, i) => (
							<Skeleton key={i} className="h-11 w-full border-t border-border" />
						))}
					</div>
					<div className="flex gap-3">
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-40 w-80 shrink-0" />
					</div>
				</>
			)}

			{/* Error states */}
			{data?.error === "CHARACTER_NOT_FOUND" && (
				<p className="font-body text-sm text-dimmed">
					Character not found on Warmane armory.
				</p>
			)}
			{data?.error === "ARMORY_UNAVAILABLE" && (
				<p className="font-body text-sm text-dimmed">
					Warmane armory is currently unavailable. Try again later.
				</p>
			)}

			{/* Gear Table */}
			{data && !data.error && data.gear.length > 0 && (
				<>
					<div className="flex flex-col gap-3">
						<span className="font-body text-xs uppercase tracking-wider text-secondary">
							// Gear Overview
						</span>

						<div className="border border-border bg-card">
							{/* Table header */}
							<div className="grid items-center border-b border-border px-6 py-2.5 font-body text-2xs uppercase tracking-wider text-dimmed" style={{ gridTemplateColumns: "100px 1fr 60px 100px 100px" }}>
								<span>Slot</span>
								<span>Item</span>
								<span>iLvl</span>
								<span className="text-center">Enchanted</span>
								<span className="text-center">Gemmed</span>
							</div>

							{/* Table rows */}
							{data.gear.map((slot) => (
								<div
									key={slot.slot}
									className="grid items-center border-t border-elevated px-6 py-2.5 font-body text-sm"
									style={{ gridTemplateColumns: "100px 1fr 60px 100px 100px" }}
								>
									<span className="text-2xs font-bold uppercase tracking-wide text-primary">
										{slot.slot}
									</span>

									<ItemTooltip itemId={slot.itemId}>
										<span
											className="cursor-default truncate font-medium"
											style={{ color: QUALITY_COLORS[slot.itemQuality] ?? "#ffffff" }}
										>
											{slot.itemName}
										</span>
									</ItemTooltip>

									<span className="text-primary">{slot.itemLevel || "—"}</span>

									<div className="flex justify-center">
										{slot.isEnchantable ? (
											slot.enchant ? (
												<TooltipRoot>
													<TooltipTrigger render={<span />}>
														<Badge variant="success">[YES]</Badge>
													</TooltipTrigger>
													<TooltipContent side="top">
														<TooltipLabel>Enchant</TooltipLabel>
														<TooltipValue>{slot.enchant}</TooltipValue>
													</TooltipContent>
												</TooltipRoot>
											) : (
												<Badge variant="error">[NO]</Badge>
											)
										) : null}
									</div>

									<div className="flex justify-center">
										{slot.gems.length > 0 || !slot.hasAllGems ? (
											slot.hasAllGems ? (
												<TooltipRoot>
													<TooltipTrigger render={<span />}>
														<Badge variant="success">[YES]</Badge>
													</TooltipTrigger>
													<TooltipContent side="top">
														<TooltipLabel>Gems</TooltipLabel>
														<div className="flex flex-col gap-0.5">
															{slot.gems.map((gem, i) => (
																<span key={i} className="font-body text-xs text-primary">
																	{gem.name}
																</span>
															))}
														</div>
													</TooltipContent>
												</TooltipRoot>
											) : (
												<Badge variant="error">[NO]</Badge>
											)
										) : null}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Notes + Professions */}
					<div className="flex gap-3">
						{/* Actionable Notes */}
						<Card className="flex-1">
							<div className="flex items-center justify-between">
								<span className="font-body text-xs uppercase tracking-wider text-secondary">
									// Actionable Notes
								</span>
								{data.notes.length > 0 && (
									<button
										type="button"
										onClick={handleCopyNotes}
										className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-2xs font-bold uppercase tracking-wide text-accent transition-colors hover:border-accent"
									>
										Copy to Send
									</button>
								)}
							</div>
							{data.notes.length > 0 ? (
								<div className="flex flex-col gap-2">
									{data.notes.map((note, i) => {
										const Icon = NOTE_ICONS[note.severity] ?? Info;
										return (
											<div key={i} className="flex items-center gap-2">
												<Icon className={`size-3.5 shrink-0 ${NOTE_COLORS[note.severity]}`} />
												<span className={`font-body text-sm ${NOTE_COLORS[note.severity]}`}>
													{note.message}
												</span>
											</div>
										);
									})}
								</div>
							) : (
								<p className="font-body text-sm text-dimmed">
									No issues found — gear is fully enchanted and gemmed.
								</p>
							)}
						</Card>

						{/* Professions */}
						<Card className="w-80 shrink-0">
							<span className="font-body text-xs uppercase tracking-wider text-secondary">
								// Professions
							</span>
							{data.professions.length > 0 ? (
								<div className="flex flex-col gap-2">
									{data.professions.map((prof) => (
										<div key={prof.name} className="flex items-center gap-2">
											<span className="font-body text-sm text-primary">
												{prof.name} — {prof.level}/{prof.maxLevel}
											</span>
											{prof.level >= prof.maxLevel && (
												<Badge variant="success">[MAX]</Badge>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="font-body text-sm text-dimmed">
									No professions found.
								</p>
							)}
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
