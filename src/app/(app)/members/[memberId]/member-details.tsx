"use client";

import Image from "next/image";
import Link from "next/link";
import dkIcon from "@/assets/classes/dk.png";
import druidIcon from "@/assets/classes/druid.png";
import hunterIcon from "@/assets/classes/hunter.png";
import mageIcon from "@/assets/classes/mage.png";
import paladinIcon from "@/assets/classes/paladin.png";
import priestIcon from "@/assets/classes/priest.png";
import rogueIcon from "@/assets/classes/rogue.png";
import shamanIcon from "@/assets/classes/shaman.png";
import warlockIcon from "@/assets/classes/warlock.png";
import warriorIcon from "@/assets/classes/warrior.png";
import { Skeleton } from "@/components/ui/skeleton";
import {
	TooltipContent,
	TooltipLabel,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";

const CLASS_ICONS: Record<string, typeof dkIcon> = {
	warrior: warriorIcon,
	paladin: paladinIcon,
	hunter: hunterIcon,
	rogue: rogueIcon,
	priest: priestIcon,
	"death-knight": dkIcon,
	shaman: shamanIcon,
	mage: mageIcon,
	warlock: warlockIcon,
	druid: druidIcon,
};

const CLASS_COLORS: Record<string, string> = {
	warrior: "text-class-warrior",
	paladin: "text-class-paladin",
	hunter: "text-class-hunter",
	rogue: "text-class-rogue",
	priest: "text-class-priest",
	"death-knight": "text-class-dk",
	shaman: "text-class-shaman",
	mage: "text-class-mage",
	warlock: "text-class-warlock",
	druid: "text-class-druid",
};

function formatSpec(spec: string | null, playerClass: string | null): string | null {
	if (!spec || !playerClass) return null;
	const classPrefix = playerClass === "death-knight" ? "death-knight-" : `${playerClass}-`;
	if (!spec.startsWith(classPrefix)) return null;
	const specName = spec.slice(classPrefix.length);
	return specName.charAt(0).toUpperCase() + specName.slice(1);
}

function getUptimeAttrs(value: number | null): Record<string, boolean | undefined> {
	if (value === null) return {};
	if (value >= 100) return { "data-full": true };
	if (value >= 80) return { "data-partial": true };
	return {};
}

function formatUptime(value: number | null): string {
	if (value === null) return "—";
	return `${Math.round(value)}%`;
}

type MemberDetailsProps = {
	memberId: string;
};

export function MemberDetails({ memberId }: MemberDetailsProps) {
	const { data, isLoading } = trpc.members.getById.useQuery({ memberId });

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full border-t border-border" />
					))}
				</div>
			</div>
		);
	}

	const { member, raids } = data;
	const playerClass = member.class;
	const spec = formatSpec(member.latestSpec, playerClass);

	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					{member.name}
				</h1>
				<div className="flex items-center gap-2 font-body text-sm">
					{playerClass && CLASS_ICONS[playerClass] && (
						<Image
							src={CLASS_ICONS[playerClass]}
							alt={playerClass}
							width={16}
							height={16}
						/>
					)}
					<span
						className={`capitalize ${CLASS_COLORS[playerClass ?? ""] ?? "text-secondary"}`}
					>
						{playerClass ?? "Unknown"}
						{spec && (
							<span className="text-dimmed"> ({spec})</span>
						)}
					</span>
				</div>
			</div>

			{/* Raid consumable table */}
			<div className="flex flex-col gap-3">
				<span className="font-body text-xs uppercase tracking-wider text-secondary">
					Consumable Usage Per Raid
				</span>

				{raids.length === 0 ? (
					<p className="font-body text-sm text-dimmed">
						No raid data found for this member.
					</p>
				) : (
					<div className="border border-border bg-card">
						<table className="w-full font-body">
							<thead>
								<tr className="border-b border-border text-2xs uppercase tracking-wider text-dimmed">
									<th className="py-2.5 pl-4 text-left font-normal">Raid</th>
									<th className="w-28 py-2.5 text-left font-normal">Date</th>
									<th className="w-20 py-2.5 text-left font-normal">Flask</th>
									<th className="w-20 py-2.5 text-left font-normal">Food</th>
									<th className="w-20 py-2.5 text-left font-normal">Pots</th>
									<th className="w-20 py-2.5 pr-4 text-left font-normal">Engi</th>
								</tr>
							</thead>
							<tbody className="text-sm">
								{raids.map((raid) => {
									const potItems = raid.consumableItems.filter(
										(c) => c.type === "potion" || c.type === "mana_potion" || c.type === "flame_cap",
									);
									const engiItems = raid.consumableItems.filter(
										(c) => c.type === "engineering",
									);
									const potLabel = raid.totalPots > 0
										? raid.hasPrePot
											? `${raid.totalPots} (PP)`
											: String(raid.totalPots)
										: "0";

									const dateStr = new Date(raid.raidDate).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									});

									return (
										<tr
											key={raid.raidId}
											className="border-b border-elevated"
										>
											<td className="py-2.5 pl-4">
												<Link
													href={`/raids/${raid.raidId}`}
													className="font-semibold text-primary hover:text-accent"
												>
													{raid.raidName}
												</Link>
											</td>
											<td className="py-2.5 text-secondary">
												{dateStr}
											</td>
											<td
												{...getUptimeAttrs(raid.flaskUptime)}
												className="py-2.5 text-danger data-full:text-accent data-partial:text-warning"
											>
												{formatUptime(raid.flaskUptime)}
											</td>
											<td
												{...getUptimeAttrs(raid.foodUptime)}
												className="py-2.5 text-danger data-full:text-accent data-partial:text-warning"
											>
												{formatUptime(raid.foodUptime)}
											</td>
											<td
												data-has-prepot={raid.hasPrePot || undefined}
												data-has-value={raid.totalPots > 0 || undefined}
												className="py-2.5 text-dimmed data-has-value:text-primary data-has-prepot:text-accent"
											>
												{potItems.length > 0 ? (
													<TooltipRoot>
														<TooltipTrigger render={<span />}>
															<span className="cursor-default underline decoration-dashed decoration-dimmed underline-offset-4 hover:decoration-secondary">
																{potLabel}
															</span>
														</TooltipTrigger>
														<TooltipContent side="top">
															<TooltipLabel>Consumables</TooltipLabel>
															<div className="flex flex-col gap-1">
																{potItems.map((item) => (
																	<div
																		key={item.spellName}
																		className="flex items-center justify-between gap-6 font-body text-xs"
																	>
																		<span className="text-accent">{item.spellName}</span>
																		<span className="text-secondary">x{item.count}</span>
																	</div>
																))}
															</div>
														</TooltipContent>
													</TooltipRoot>
												) : (
													potLabel
												)}
											</td>
											<td
												data-has-value={raid.totalEngi > 0 || undefined}
												className="py-2.5 pr-4 text-dimmed data-has-value:text-primary"
											>
												{engiItems.length > 0 ? (
													<TooltipRoot>
														<TooltipTrigger render={<span />}>
															<span className="cursor-default underline decoration-dashed decoration-dimmed underline-offset-4 hover:decoration-secondary">
																{raid.totalEngi}
															</span>
														</TooltipTrigger>
														<TooltipContent side="top">
															<TooltipLabel>Consumables</TooltipLabel>
															<div className="flex flex-col gap-1">
																{engiItems.map((item) => (
																	<div
																		key={item.spellName}
																		className="flex items-center justify-between gap-6 font-body text-xs"
																	>
																		<span className="text-accent">{item.spellName}</span>
																		<span className="text-secondary">x{item.count}</span>
																	</div>
																))}
															</div>
														</TooltipContent>
													</TooltipRoot>
												) : (
													raid.totalEngi
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
