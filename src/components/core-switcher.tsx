"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateCoreForm } from "@/components/create-core-form";
import {
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";

type Core = {
	id: string;
	name: string;
	slug: string;
};

type CoreSwitcherProps = {
	cores: Core[];
	activeCoreId: string | null;
};

export function CoreSwitcher({ cores, activeCoreId }: CoreSwitcherProps) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const activeCore = cores.find((c) => c.id === activeCoreId);

	async function handleSwitchCore(coreId: string) {
		if (coreId === activeCoreId) {
			setIsPopoverOpen(false);
			return;
		}

		await authClient.organization.setActive({
			organizationId: coreId,
		});

		setIsPopoverOpen(false);
		router.push("/");
		router.refresh();
	}

	function handleCreateCore() {
		setIsPopoverOpen(false);
		setIsDialogOpen(true);
	}

	return (
		<>
			<PopoverRoot open={isPopoverOpen} onOpenChangeAction={setIsPopoverOpen}>
				<PopoverTrigger className="flex w-full items-center gap-2 border border-border bg-elevated px-3.5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-primary outline-none transition-colors hover:border-border-light">
					<span className="flex-1 truncate text-left">
						{activeCore?.name ?? "Select Core"}
					</span>
					<ChevronDown className="size-3.5 shrink-0 text-dimmed" />
				</PopoverTrigger>
				<PopoverContent
					side="top"
					sideOffset={4}
					align="start"
					className="w-(--anchor-width)"
				>
					{cores.map((core) => (
						<button
							key={core.id}
							type="button"
							className="w-full px-3.5 py-2 text-left font-body text-xs font-semibold uppercase tracking-wide text-secondary outline-none transition-colors hover:bg-subtle hover:text-primary"
							onClick={() => handleSwitchCore(core.id)}
						>
							{core.name}
						</button>
					))}

					<div className="mx-3 my-1 h-px bg-border" />

					<button
						type="button"
						onClick={handleCreateCore}
						className="flex w-full items-center gap-2 px-3.5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-accent outline-none transition-colors hover:bg-subtle"
					>
						<Plus className="size-3" />
						Create New Core
					</button>
				</PopoverContent>
			</PopoverRoot>

			<DialogRoot open={isDialogOpen} onOpenChangeAction={setIsDialogOpen}>
				<DialogContent>
					<DialogTitle>Create New Core</DialogTitle>
					<DialogDescription>
						Set up a new raid core workspace.
					</DialogDescription>
					<CreateCoreForm onSuccessAction={() => setIsDialogOpen(false)} />
				</DialogContent>
			</DialogRoot>
		</>
	);
}
