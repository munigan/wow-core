import { twMerge } from "tailwind-merge";

export type SkeletonProps = React.ComponentProps<"div">;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
	return (
		<div
			className={twMerge("animate-pulse bg-elevated", className)}
			{...props}
		/>
	);
};
