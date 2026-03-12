"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
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

	return (
		<DialogRoot open={isOpen} onOpenChangeAction={setIsOpen}>
			<DialogTrigger
				render={
					<Button className="w-full">
						<Upload className="size-3.5" />
						Upload Log
					</Button>
				}
			/>
			<DialogContent>
				<DialogTitle>Upload Log</DialogTitle>
				<DialogDescription>
					Upload a WoW combat log file to extract raid data and members.
				</DialogDescription>
				<UploadLogForm
					cores={cores}
					activeCoreId={activeCoreId}
					onDoneAction={() => setIsOpen(false)}
				/>
			</DialogContent>
		</DialogRoot>
	);
}
