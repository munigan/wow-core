import { tv } from "tailwind-variants";

const badge = tv({
	base: "inline-flex items-center px-2 py-1 font-body text-xs font-bold uppercase tracking-wide",
	variants: {
		variant: {
			success: "bg-accent-20 text-accent",
			warning: "bg-warning-20 text-warning",
			error: "bg-danger-20 text-danger",
		},
	},
	defaultVariants: {
		variant: "success",
	},
});

export type BadgeProps = {
	variant?: "success" | "warning" | "error";
} & React.HTMLAttributes<HTMLSpanElement>;

export const Badge = ({
	variant,
	className,
	children,
	...props
}: BadgeProps) => {
	return (
		<span className={badge({ variant, className })} {...props}>
			{children}
		</span>
	);
};
