"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type DialogRootProps = {
	open?: boolean;
	onOpenChangeAction?: (open: boolean) => void;
	children: React.ReactNode;
};

export const DialogRoot = ({
	open,
	onOpenChangeAction,
	children,
}: DialogRootProps) => {
	return (
		<BaseDialog.Root open={open} onOpenChange={onOpenChangeAction}>
			{children}
		</BaseDialog.Root>
	);
};

export type DialogTriggerProps = {
	className?: string;
	render?: React.ReactElement;
	children?: React.ReactNode;
};

export const DialogTrigger = ({
	className,
	render,
	children,
}: DialogTriggerProps) => {
	return (
		<BaseDialog.Trigger className={className} render={render}>
			{children}
		</BaseDialog.Trigger>
	);
};

export type DialogContentProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogContent = ({ className, children }: DialogContentProps) => {
	return (
		<BaseDialog.Portal>
			<BaseDialog.Backdrop className="fixed inset-0 bg-black/60 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0" />
			<BaseDialog.Popup
				className={twMerge(
					"fixed top-1/2 left-1/2 flex w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 border border-accent bg-sidebar p-8 shadow-lg origin-center transition-[transform,scale,opacity] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
					className,
				)}
			>
				<BaseDialog.Close className="absolute top-4 right-4 cursor-pointer text-dimmed outline-none transition-colors hover:text-primary">
					<X className="size-4" />
				</BaseDialog.Close>
				{children}
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	);
};

export type DialogTitleProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogTitle = ({ className, children }: DialogTitleProps) => {
	return (
		<BaseDialog.Title
			className={twMerge(
				"font-heading text-lg font-semibold uppercase text-primary",
				className,
			)}
		>
			{children}
		</BaseDialog.Title>
	);
};

export type DialogDescriptionProps = {
	className?: string;
	children: React.ReactNode;
};

export const DialogDescription = ({
	className,
	children,
}: DialogDescriptionProps) => {
	return (
		<BaseDialog.Description
			className={twMerge("font-body text-sm text-secondary", className)}
		>
			{children}
		</BaseDialog.Description>
	);
};

export type DialogCloseProps = {
	className?: string;
	render?: React.ReactElement;
	children: React.ReactNode;
};

export const DialogClose = ({
	className,
	render,
	children,
}: DialogCloseProps) => {
	return (
		<BaseDialog.Close className={className} render={render}>
			{children}
		</BaseDialog.Close>
	);
};
