import { twMerge } from "tailwind-merge";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, children, ...props }: CardProps) => {
	return (
		<div
			className={twMerge(
				"flex flex-col gap-4 border border-border bg-card p-6",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
