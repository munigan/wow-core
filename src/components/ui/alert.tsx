import { type VariantProps, tv } from "tailwind-variants";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const alertVariants = tv({
	base: "flex items-center gap-2 px-3.5 py-2.5 font-body text-sm font-medium",
	variants: {
		variant: {
			error: "border border-danger-40 bg-danger-20 text-danger",
			warning: "border border-warning-40 bg-warning-20 text-warning",
			success: "border border-accent-40 bg-accent-20 text-accent",
		},
	},
	defaultVariants: {
		variant: "error",
	},
});

const iconMap = {
	error: AlertTriangle,
	warning: Info,
	success: CheckCircle,
} as const;

export type AlertProps = React.ComponentProps<"div"> &
	VariantProps<typeof alertVariants> & {
		message: string;
	};

export const Alert = ({
	variant = "error",
	message,
	className,
	...props
}: AlertProps) => {
	const Icon = iconMap[variant!];

	return (
		<div role="alert" className={alertVariants({ variant, className })} {...props}>
			<Icon className="h-3.5 w-3.5 shrink-0" />
			<span>{message}</span>
		</div>
	);
};
