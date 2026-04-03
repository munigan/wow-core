"use client";

import { LayoutDashboard, Settings, Swords, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/components/ui/nav-item";

const NAV_ITEMS = [
	{ href: "/", label: "Overview", icon: LayoutDashboard },
	{ href: "/raids", label: "Raids", icon: Swords },
	{ href: "/members", label: "Members", icon: Users },
	{ href: "/settings", label: "Settings", icon: Settings },
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
