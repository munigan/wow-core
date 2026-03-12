"use client";

import {
	LayoutDashboard,
	Shield,
	Swords,
	TrendingUp,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/components/ui/nav-item";

const NAV_ITEMS = [
	{ href: "/", label: "Overview", icon: LayoutDashboard },
	{ href: "/raids", label: "Raid Details", icon: Swords },
	{ href: "/members", label: "Members", icon: Users },
	{ href: "/gear", label: "Gear & Enchants", icon: Shield },
	{ href: "/trends", label: "Trends", icon: TrendingUp },
] as const;

export const NavLinks = () => {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-0.5 py-4">
			{NAV_ITEMS.map((item) => {
				const isActive =
					item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

				return (
					<NavItem
						key={item.href}
						href={item.href}
						active={isActive}
						icon={<item.icon className="size-4" />}
					>
						{item.label}
					</NavItem>
				);
			})}
		</nav>
	);
};
