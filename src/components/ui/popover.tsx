"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { twMerge } from "tailwind-merge";

export type PopoverRootProps = {
	open?: boolean;
	onOpenChangeAction?: (open: boolean) => void;
	children: React.ReactNode;
};

export const PopoverRoot = ({
	open,
	onOpenChangeAction,
	children,
}: PopoverRootProps) => {
	return (
		<BasePopover.Root open={open} onOpenChange={onOpenChangeAction}>
			{children}
		</BasePopover.Root>
	);
};

export type PopoverTriggerProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const PopoverTrigger = ({
	className,
	render,
	children,
}: PopoverTriggerProps) => {
	return (
		<BasePopover.Trigger className={className} render={render}>
			{children}
		</BasePopover.Trigger>
	);
};

export type PopoverContentProps = {
	className?: string;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	align?: "start" | "center" | "end";
};

export const PopoverContent = ({
	className,
	children,
	side = "top",
	sideOffset = 4,
	align = "start",
}: PopoverContentProps) => {
	return (
		<BasePopover.Portal>
			<BasePopover.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				collisionPadding={8}
			>
				<BasePopover.Popup
					className={twMerge(
						"flex flex-col border border-border bg-elevated py-1 font-body shadow-lg origin-(--transform-origin) transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
						className,
					)}
				>
					{children}
				</BasePopover.Popup>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	);
};

export type PopoverCloseProps = {
	className?: string;
	children: React.ReactNode;
};

export const PopoverClose = ({ className, children }: PopoverCloseProps) => {
	return (
		<BasePopover.Close className={className}>{children}</BasePopover.Close>
	);
};
