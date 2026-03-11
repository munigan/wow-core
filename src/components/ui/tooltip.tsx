"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { twMerge } from "tailwind-merge";

export type TooltipProviderProps = {
	delay?: number;
	closeDelay?: number;
	children: React.ReactNode;
};

export const TooltipProvider = ({
	delay = 200,
	closeDelay = 0,
	children,
}: TooltipProviderProps) => {
	return (
		<BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
			{children}
		</BaseTooltip.Provider>
	);
};

export type TooltipRootProps = {
	children: React.ReactNode;
};

export const TooltipRoot = ({ children }: TooltipRootProps) => {
	return <BaseTooltip.Root>{children}</BaseTooltip.Root>;
};

export type TooltipTriggerProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const TooltipTrigger = ({
	className,
	render,
	children,
}: TooltipTriggerProps) => {
	return (
		<BaseTooltip.Trigger className={className} render={render}>
			{children}
		</BaseTooltip.Trigger>
	);
};

export type TooltipContentProps = {
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
};

export const TooltipContent = ({
	className,
	style,
	children,
	side = "top",
	sideOffset = 8,
}: TooltipContentProps) => {
	return (
		<BaseTooltip.Portal>
			<BaseTooltip.Positioner
				side={side}
				sideOffset={sideOffset}
				collisionAvoidance={{ side: "flip", align: "shift" }}
				collisionPadding={8}
			>
				<BaseTooltip.Popup
					className={twMerge(
						"flex flex-col gap-1 border border-accent bg-sidebar px-3.5 py-2.5 origin-(--transform-origin) transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
						className,
					)}
					style={style}
				>
					{children}
				</BaseTooltip.Popup>
			</BaseTooltip.Positioner>
		</BaseTooltip.Portal>
	);
};

export type TooltipLabelProps = {
	className?: string;
	children: React.ReactNode;
};

export const TooltipLabel = ({ className, children }: TooltipLabelProps) => {
	return (
		<span
			className={twMerge(
				"font-body text-2xs font-bold uppercase tracking-wide text-dimmed",
				className,
			)}
		>
			{children}
		</span>
	);
};

export type TooltipValueProps = {
	className?: string;
	children: React.ReactNode;
};

export const TooltipValue = ({ className, children }: TooltipValueProps) => {
	return (
		<span
			className={twMerge(
				"font-body text-sm font-semibold text-accent",
				className,
			)}
		>
			{children}
		</span>
	);
};
