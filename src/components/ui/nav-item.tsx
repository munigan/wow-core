import { tv } from "tailwind-variants";

const navItem = tv({
	base: "flex w-full items-center gap-3 px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide transition-colors",
	variants: {
		active: {
			true: "text-accent",
			false: "text-secondary hover:text-primary",
		},
	},
	defaultVariants: {
		active: false,
	},
});

export type NavItemProps = {
	active?: boolean;
	icon: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const NavItem = ({
	active = false,
	icon,
	className,
	children,
	...props
}: NavItemProps) => {
	return (
		<button className={navItem({ active, className })} {...props}>
			<span className="flex size-4 items-center justify-center">{icon}</span>
			{children}
		</button>
	);
};
