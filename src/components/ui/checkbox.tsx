"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type CheckboxRootProps = {
	checked?: boolean;
	defaultChecked?: boolean;
	indeterminate?: boolean;
	parent?: boolean;
	onCheckedChangeAction?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
};

export const CheckboxRoot = ({
	checked,
	defaultChecked,
	indeterminate,
	parent,
	onCheckedChangeAction,
	disabled,
	className,
	children,
}: CheckboxRootProps) => {
	return (
		<BaseCheckbox.Root
			checked={checked}
			defaultChecked={defaultChecked}
			indeterminate={indeterminate}
			parent={parent}
			onCheckedChange={
				onCheckedChangeAction
					? (value) => onCheckedChangeAction(value)
					: undefined
			}
			disabled={disabled}
			className={twMerge(
				"flex size-4 shrink-0 items-center justify-center border border-border bg-elevated outline-none transition-colors hover:border-border-light data-checked:border-accent data-checked:bg-accent data-indeterminate:border-accent data-indeterminate:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
		>
			{children ?? <CheckboxIndicator />}
		</BaseCheckbox.Root>
	);
};

export type CheckboxIndicatorProps = {
	className?: string;
};

export const CheckboxIndicator = ({ className }: CheckboxIndicatorProps) => {
	return (
		<BaseCheckbox.Indicator
			className={twMerge(
				"flex items-center justify-center text-on-accent data-unchecked:hidden",
				className,
			)}
			render={(props, state) => (
				<span {...props}>
					{state.indeterminate ? (
						<Minus className="size-3" />
					) : (
						<Check className="size-3" />
					)}
				</span>
			)}
		/>
	);
};
