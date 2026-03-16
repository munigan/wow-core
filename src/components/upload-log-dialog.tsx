"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UploadLogForm } from "@/components/upload-log-form";

type UploadLogDialogProps = {
	cores: { id: string; name: string }[];
	activeCoreId: string | null;
};

export function UploadLogDialog({ cores, activeCoreId }: UploadLogDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasProgressRef = useRef(false);

	const handleOpenChange = useCallback((open: boolean) => {
		if (!open && hasProgressRef.current) {
			const confirmed = window.confirm(
				"You have an upload in progress. Are you sure you want to close?",
			);
			if (!confirmed) return;
		}
		if (open) {
			hasProgressRef.current = false;
		}
		setIsOpen(open);
	}, []);

	return (
		<DialogRoot open={isOpen} onOpenChangeAction={handleOpenChange}>
			<DialogTrigger
				render={
					<Button className="w-full">
						<Upload className="size-3.5" />
						Upload Log
					</Button>
				}
			/>
			<DialogContent className="w-(--width-dialog-wide)">
				<DialogTitle>Upload Log</DialogTitle>
				<DialogDescription>
					Upload a WoW combat log file to extract raid data and members.
				</DialogDescription>
				<UploadLogForm
					cores={cores}
					activeCoreId={activeCoreId}
					onDoneAction={() => setIsOpen(false)}
					onProgressChangeAction={(hasProgress) => {
						hasProgressRef.current = hasProgress;
					}}
				/>
			</DialogContent>
		</DialogRoot>
	);
}
