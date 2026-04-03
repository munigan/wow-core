"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { twMerge } from "tailwind-merge";

export type ScrollAreaRootProps = {
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
};

export const ScrollAreaRoot = ({
	className,
	style,
	children,
}: ScrollAreaRootProps) => {
	return (
		<BaseScrollArea.Root
			className={twMerge("relative", className)}
			style={style}
		>
			{children}
		</BaseScrollArea.Root>
	);
};

export type ScrollAreaViewportProps = {
	className?: string;
	children: React.ReactNode;
};

export const ScrollAreaViewport = ({
	className,
	children,
}: ScrollAreaViewportProps) => {
	return (
		<BaseScrollArea.Viewport
			className={twMerge("scroll-area-viewport", className)}
		>
			<BaseScrollArea.Content>{children}</BaseScrollArea.Content>
		</BaseScrollArea.Viewport>
	);
};

export type ScrollAreaScrollbarProps = {
	className?: string;
	orientation?: "vertical" | "horizontal";
};

export const ScrollAreaScrollbar = ({
	className,
	orientation = "vertical",
}: ScrollAreaScrollbarProps) => {
	return (
		<BaseScrollArea.Scrollbar
			orientation={orientation}
			className={twMerge(
				"flex w-1 justify-center rounded-full opacity-0 transition-opacity data-hovering:opacity-100 data-scrolling:opacity-100",
				className,
			)}
		>
			<BaseScrollArea.Thumb className="w-full rounded-full bg-muted" />
		</BaseScrollArea.Scrollbar>
	);
};
