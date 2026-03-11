import { tv } from "tailwind-variants";

const button = tv({
	base: "inline-flex items-center justify-center gap-2 font-body text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-accent text-on-accent",
			secondary: "border border-border bg-transparent text-secondary",
		},
		size: {
			default: "px-4 py-2.5",
			lg: "h-11 px-4 py-2.5",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "default",
	},
});

export type ButtonProps = {
	variant?: "primary" | "secondary";
	size?: "default" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	variant,
	size,
	className,
	children,
	...props
}: ButtonProps) => {
	return (
		<button className={button({ variant, size, className })} {...props}>
			{children}
		</button>
	);
};
