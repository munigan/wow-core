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

export function UploadLogDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DialogRoot open={isOpen} onOpenChangeAction={setIsOpen}>
			<DialogTrigger render={<span />}>
				<Button className="w-full">
					<Upload className="size-3.5" />
					Upload Log
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Upload Log</DialogTitle>
				<DialogDescription>
					Upload a WoW combat log file to extract raid data and members.
				</DialogDescription>
				<UploadLogForm onDoneAction={() => setIsOpen(false)} />
			</DialogContent>
		</DialogRoot>
	);
}
