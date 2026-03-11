"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { twMerge } from "tailwind-merge";

export type TabListProps = {
	className?: string;
	children: React.ReactNode;
};

export const TabList = ({ className, children }: TabListProps) => {
	return (
		<BaseTabs.List className={twMerge("flex gap-1", className)}>
			{children}
		</BaseTabs.List>
	);
};

export type TabProps = {
	value: string | number;
	disabled?: boolean;
	className?: string;
	children: React.ReactNode;
};

export const Tab = ({ value, disabled, className, children }: TabProps) => {
	return (
		<BaseTabs.Tab
			value={value}
			disabled={disabled}
			className={twMerge(
				"border-b-2 border-transparent px-4 py-2.5 font-body text-sm font-medium uppercase tracking-wide text-dimmed outline-none transition-colors hover:text-secondary data-active:border-accent data-active:font-bold data-active:text-accent",
				className,
			)}
		>
			{children}
		</BaseTabs.Tab>
	);
};

export type TabPanelProps = {
	value: string | number;
	className?: string;
	children: React.ReactNode;
};

export const TabPanel = ({ value, className, children }: TabPanelProps) => {
	return (
		<BaseTabs.Panel
			value={value}
			className={twMerge("outline-none", className)}
		>
			{children}
		</BaseTabs.Panel>
	);
};

export type TabsProps = {
	defaultValue?: string | number;
	value?: string | number;
	onValueChangeAction?: (value: string | number) => void;
	className?: string;
	children: React.ReactNode;
};

export const Tabs = ({
	defaultValue,
	value,
	onValueChangeAction,
	className,
	children,
}: TabsProps) => {
	return (
		<BaseTabs.Root
			defaultValue={defaultValue}
			value={value}
			onValueChange={onValueChangeAction}
			className={className}
		>
			{children}
		</BaseTabs.Root>
	);
};
