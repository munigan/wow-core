"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type SelectOption = {
	value: string;
	label: string;
};

export type SelectRootProps = {
	defaultValue?: string;
	value?: string;
	items?: SelectOption[];
	onValueChangeAction?: (value: string | null) => void;
	children: React.ReactNode;
};

export const SelectRoot = ({
	defaultValue,
	value,
	items,
	onValueChangeAction,
	children,
}: SelectRootProps) => {
	return (
		<BaseSelect.Root
			defaultValue={defaultValue}
			value={value}
			items={items}
			onValueChange={onValueChangeAction}
		>
			{children}
		</BaseSelect.Root>
	);
};

export type SelectTriggerProps = {
	placeholder?: string;
	className?: string;
};

export const SelectTrigger = ({
	placeholder,
	className,
}: SelectTriggerProps) => {
	return (
		<BaseSelect.Trigger
			className={twMerge(
				"flex items-center gap-2 border border-border bg-elevated px-3.5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-primary outline-none transition-colors hover:border-border-light",
				className,
			)}
		>
			<BaseSelect.Value
				placeholder={placeholder}
				className="min-w-0 truncate"
			/>
			<BaseSelect.Icon className="flex shrink-0">
				<ChevronDown className="size-3.5 text-dimmed" />
			</BaseSelect.Icon>
		</BaseSelect.Trigger>
	);
};

export type SelectPopupProps = {
	children: React.ReactNode;
	className?: string;
};

export const SelectPopup = ({ children, className }: SelectPopupProps) => {
	return (
		<BaseSelect.Portal>
			<BaseSelect.Positioner className="z-50 outline-none" sideOffset={4}>
				<BaseSelect.Popup
					className={twMerge(
						"origin-(--transform-origin) border border-border bg-elevated py-1 font-body shadow-lg transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
						className,
					)}
				>
					<BaseSelect.List>{children}</BaseSelect.List>
				</BaseSelect.Popup>
			</BaseSelect.Positioner>
		</BaseSelect.Portal>
	);
};

export type SelectItemProps = {
	value: string;
	children: React.ReactNode;
	className?: string;
};

export const SelectItem = ({ value, children, className }: SelectItemProps) => {
	return (
		<BaseSelect.Item
			value={value}
			className={twMerge(
				"grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-secondary outline-none select-none data-highlighted:bg-subtle data-highlighted:text-primary",
				className,
			)}
		>
			<BaseSelect.ItemIndicator className="col-start-1">
				<Check className="size-3 text-accent" />
			</BaseSelect.ItemIndicator>
			<BaseSelect.ItemText className="col-start-2">
				{children}
			</BaseSelect.ItemText>
		</BaseSelect.Item>
	);
};
