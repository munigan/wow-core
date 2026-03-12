import Link from "next/link";
import { tv } from "tailwind-variants";

const navItem = tv({
	base: "flex w-full items-center gap-3 px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide transition-colors",
	variants: {
		active: {
			true: "bg-accent-10 text-accent",
			false: "text-secondary hover:text-primary",
		},
	},
	defaultVariants: {
		active: false,
	},
});

type NavItemBaseProps = {
	active?: boolean;
	icon: React.ReactNode;
	className?: string;
};

export type NavItemButtonProps = NavItemBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
		href?: undefined;
	};

export type NavItemLinkProps = NavItemBaseProps &
	Omit<React.ComponentProps<typeof Link>, "className"> & {
		href: string;
	};

export type NavItemProps = NavItemButtonProps | NavItemLinkProps;

export const NavItem = ({
	active = false,
	icon,
	className,
	children,
	...props
}: NavItemProps) => {
	const classes = navItem({ active, className });

	if ("href" in props && props.href !== undefined) {
		const { href, ...linkProps } = props as NavItemLinkProps;
		return (
			<Link href={href} className={classes} {...linkProps}>
				<span className="flex size-4 items-center justify-center">{icon}</span>
				{children}
			</Link>
		);
	}

	return (
		<button className={classes} {...(props as NavItemButtonProps)}>
			<span className="flex size-4 items-center justify-center">{icon}</span>
			{children}
		</button>
	);
};
