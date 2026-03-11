import { twMerge } from "tailwind-merge";

export type InputProps = {
	label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, className, id, ...props }: InputProps) => {
	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label
					htmlFor={id}
					className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed"
				>
					{label}
				</label>
			)}
			<input
				id={id}
				className={twMerge(
					"h-10 border border-border bg-elevated px-3.5 font-body text-sm font-medium text-primary outline-none placeholder:text-dimmed focus:border-border-light",
					className,
				)}
				{...props}
			/>
		</div>
	);
};
