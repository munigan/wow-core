"use client";

import {
	Download,
	LayoutDashboard,
	Plus,
	Shield,
	Swords,
	TrendingUp,
	Users,
} from "lucide-react";
import { ItemTooltip } from "@/components/item-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NavItem } from "@/components/ui/nav-item";
import {
	PopoverClose,
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import {
	TooltipContent,
	TooltipLabel,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipValue,
} from "@/components/ui/tooltip";

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<section className="flex flex-col gap-4">
		<h2 className="font-heading text-lg font-bold text-primary">{title}</h2>
		<div className="flex flex-wrap items-start gap-4">{children}</div>
	</section>
);

export const Showcase = () => {
	return (
		<TooltipProvider>
			<div className="min-h-screen bg-page p-10">
				<div className="flex flex-col gap-12">
					<h1 className="font-heading text-2xl font-bold text-primary">
						UI Components
					</h1>

					<Section title="Button">
						<Button>
							<Plus className="size-3.5" />
							Upload Log
						</Button>
						<Button variant="secondary">
							<Download className="size-3.5" />
							Export
						</Button>
						<Button size="lg">Sign In</Button>
						<Button variant="secondary" size="lg">
							Battle.net
						</Button>
						<Button disabled>Disabled</Button>
					</Section>

					<Section title="Badge">
						<Badge variant="success">Validated</Badge>
						<Badge variant="warning">Processing</Badge>
						<Badge variant="error">Missing</Badge>
					</Section>

					<Section title="Card">
						<Card className="w-64">
							<span className="font-body text-xs font-bold uppercase tracking-wide text-secondary">
								Total Raid DPS
							</span>
							<span className="font-heading text-3xl font-bold text-primary">
								148,230
							</span>
							<span className="flex items-center gap-1 text-accent">
								<TrendingUp className="size-3" />
								<span className="font-body text-xs font-semibold">+12.4%</span>
							</span>
						</Card>
						<Card className="w-64">
							<span className="font-body text-xs font-bold uppercase tracking-wide text-secondary">
								Active Raiders
							</span>
							<span className="font-heading text-3xl font-bold text-primary">
								25
							</span>
						</Card>
					</Section>

					<Section title="Input">
						<Input
							id="email"
							label="Email or Battle.net ID"
							placeholder="arthas@frostmourne.gg"
						/>
						<Input
							id="password"
							label="Password"
							type="password"
							placeholder="••••••••••••"
						/>
						<Input id="plain" placeholder="Without label" />
					</Section>

					<Section title="NavItem">
						<div className="flex w-60 flex-col border border-border bg-sidebar">
							<NavItem active icon={<LayoutDashboard className="size-4" />}>
								Dashboard
							</NavItem>
							<NavItem icon={<Swords className="size-4" />}>Raids</NavItem>
							<NavItem icon={<Users className="size-4" />}>Members</NavItem>
							<NavItem icon={<Shield className="size-4" />}>Gear</NavItem>
						</div>
					</Section>

					<Section title="Select">
						<SelectRoot defaultValue="all">
							<SelectTrigger placeholder="Select raid..." />
							<SelectPopup>
								<SelectItem value="all">All Raids</SelectItem>
								<SelectItem value="icc">ICC 25H</SelectItem>
								<SelectItem value="toc">ToC 25H</SelectItem>
								<SelectItem value="ulduar">Ulduar 25</SelectItem>
							</SelectPopup>
						</SelectRoot>
					</Section>

					<Section title="Tabs">
						<Tabs defaultValue="overview" className="w-full">
							<TabList>
								<Tab value="overview">Overview</Tab>
								<Tab value="raids">Raids</Tab>
								<Tab value="members">Members</Tab>
							</TabList>
							<TabPanel value="overview">
								<Card className="mt-4">
									<span className="text-secondary">Overview panel content</span>
								</Card>
							</TabPanel>
							<TabPanel value="raids">
								<Card className="mt-4">
									<span className="text-secondary">Raids panel content</span>
								</Card>
							</TabPanel>
							<TabPanel value="members">
								<Card className="mt-4">
									<span className="text-secondary">Members panel content</span>
								</Card>
							</TabPanel>
						</Tabs>
					</Section>

					<Section title="ProgressBar">
						<div className="flex w-80 flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<span className="font-body text-xs text-secondary">
									80% complete
								</span>
								<ProgressBar value={80} />
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="font-body text-xs text-secondary">
									45% complete
								</span>
								<ProgressBar value={45} />
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="font-body text-xs text-secondary">
									100% complete
								</span>
								<ProgressBar value={100} />
							</div>
						</div>
					</Section>

					<Section title="Tooltip">
						<div className="flex gap-6">
							<TooltipRoot>
								<TooltipTrigger render={<span />}>
									<Button variant="secondary">Hover me (top)</Button>
								</TooltipTrigger>
								<TooltipContent side="top">
									<TooltipLabel>Enchant</TooltipLabel>
									<TooltipValue>Arcanum of Torment</TooltipValue>
								</TooltipContent>
							</TooltipRoot>

							<TooltipRoot>
								<TooltipTrigger render={<span />}>
									<Button variant="secondary">Hover me (bottom)</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<TooltipLabel>Socket</TooltipLabel>
									<TooltipValue>Delicate Cardinal Ruby</TooltipValue>
								</TooltipContent>
							</TooltipRoot>

							<TooltipRoot>
								<TooltipTrigger render={<span />}>
									<Badge variant="success">Validated</Badge>
								</TooltipTrigger>
								<TooltipContent side="right">
									<TooltipLabel>Status</TooltipLabel>
									<TooltipValue>All checks passed</TooltipValue>
								</TooltipContent>
							</TooltipRoot>
						</div>
					</Section>
					<Section title="Tooltip — Item (Wowhead API)">
						<div className="flex gap-6">
							<ItemTooltip itemId={51125}>
								<span className="cursor-default font-body text-sm font-bold text-rarity-epic underline decoration-rarity-epic/40 underline-offset-2">
									Sanctified Scourgelord Shoulderplates
								</span>
							</ItemTooltip>

							<ItemTooltip itemId={49990}>
								<span className="cursor-default font-body text-sm font-bold text-rarity-epic underline decoration-rarity-epic/40 underline-offset-2">
									Ring of Maddening Whispers
								</span>
							</ItemTooltip>

							<ItemTooltip itemId={49623}>
								<span className="cursor-default font-body text-sm font-bold text-rarity-legendary underline decoration-rarity-legendary/40 underline-offset-2">
									Shadowmourne
								</span>
							</ItemTooltip>
						</div>
					</Section>

					<Section title="Popover">
						<PopoverRoot>
							<PopoverTrigger render={<span />}>
								<Button variant="secondary">Open Popover</Button>
							</PopoverTrigger>
							<PopoverContent side="bottom" align="start">
								<span className="px-3 py-1.5 font-body text-xs text-secondary">
									Raid Actions
								</span>
								<button
									type="button"
									className="px-3 py-1.5 text-left font-body text-sm text-primary hover:bg-surface"
								>
									View Details
								</button>
								<button
									type="button"
									className="px-3 py-1.5 text-left font-body text-sm text-primary hover:bg-surface"
								>
									Export Log
								</button>
								<PopoverClose className="px-3 py-1.5 text-left font-body text-sm text-danger hover:bg-surface">
									Remove
								</PopoverClose>
							</PopoverContent>
						</PopoverRoot>
					</Section>

					<Section title="Dialog">
						<DialogRoot>
							<DialogTrigger render={<span />}>
								<Button variant="secondary">Open Dialog</Button>
							</DialogTrigger>
							<DialogContent>
								<div className="flex flex-col gap-2">
									<DialogTitle>Delete Raid Log</DialogTitle>
									<DialogDescription>
										Are you sure you want to delete this raid log? This action
										cannot be undone.
									</DialogDescription>
								</div>
								<div className="flex justify-end gap-3">
									<DialogClose render={<span />}>
										<Button variant="secondary">Cancel</Button>
									</DialogClose>
									<DialogClose render={<span />}>
										<Button>Confirm</Button>
									</DialogClose>
								</div>
							</DialogContent>
						</DialogRoot>
					</Section>
				</div>
			</div>
		</TooltipProvider>
	);
};
