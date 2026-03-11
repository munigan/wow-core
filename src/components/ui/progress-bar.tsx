"use client";

import { Progress } from "@base-ui/react/progress";
import { twMerge } from "tailwind-merge";

export type ProgressBarProps = {
	value: number;
	max?: number;
	className?: string;
} & Omit<
	React.ComponentPropsWithoutRef<typeof Progress.Root>,
	"value" | "max" | "children"
>;

export const ProgressBar = ({
	value,
	max = 100,
	className,
	...props
}: ProgressBarProps) => {
	return (
		<Progress.Root value={value} max={max} {...props}>
			<Progress.Track
				className={twMerge("h-1.5 w-full bg-elevated", className)}
			>
				<Progress.Indicator className="h-full bg-accent transition-all duration-300" />
			</Progress.Track>
		</Progress.Root>
	);
};
