import { Sword, Upload, User } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";

type SidebarUser = {
	name: string;
	email: string;
};

type SidebarProps = {
	user: SidebarUser;
};

export const Sidebar = ({ user }: SidebarProps) => {
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
				{/* Core selector (placeholder) */}
				<div className="flex flex-col gap-1">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						{"// Active Core"}
					</span>
					<SelectRoot defaultValue="frostmourne">
						<SelectTrigger className="w-full" />
						<SelectPopup>
							<SelectItem value="frostmourne">Frostmourne_25H</SelectItem>
						</SelectPopup>
					</SelectRoot>
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
