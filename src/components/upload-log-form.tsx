"use client";

import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

type UploadResult = {
	raidId: string;
	raidName: string;
	raidDate: string;
	totalMembers: number;
	newMembers: number;
};

type UploadState =
	| { step: "select" }
	| { step: "uploading"; fileName: string; fileSize: number; progress: number }
	| { step: "error"; message: string }
	| { step: "done"; result: UploadResult };

type UploadLogFormProps = {
	onDoneAction: () => void;
};

export function UploadLogForm({ onDoneAction }: UploadLogFormProps) {
	const router = useRouter();
	const [state, setState] = useState<UploadState>({ step: "select" });
	const xhrRef = useRef<XMLHttpRequest | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleFile = useCallback((file: File) => {
		setState({
			step: "uploading",
			fileName: file.name,
			fileSize: file.size,
			progress: 0,
		});

		const xhr = new XMLHttpRequest();
		xhrRef.current = xhr;

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) {
				const progress = Math.round((e.loaded / e.total) * 100);
				setState((prev) =>
					prev.step === "uploading" ? { ...prev, progress } : prev,
				);
			}
		};

		xhr.onload = () => {
			try {
				const data = JSON.parse(xhr.responseText);
				if (xhr.status >= 200 && xhr.status < 300) {
					setState({ step: "done", result: data });
				} else {
					setState({
						step: "error",
						message: data.error ?? "Upload failed",
					});
				}
			} catch {
				setState({ step: "error", message: "Invalid server response" });
			}
		};

		xhr.onerror = () => {
			setState({ step: "error", message: "Network error during upload" });
		};

		xhr.onabort = () => {
			setState({ step: "select" });
		};

		xhr.open("POST", "/api/upload");
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.send(file);
	}, []);

	const handleCancel = () => {
		xhrRef.current?.abort();
		xhrRef.current = null;
	};

	const handleDone = () => {
		onDoneAction();
		router.refresh();
	};

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file?.name.endsWith(".txt")) {
				handleFile(file);
			}
		},
		[handleFile],
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	function formatSize(bytes: number): string {
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	if (state.step === "uploading") {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<FileText className="size-5 shrink-0 text-accent" />
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="truncate font-body text-xs font-semibold text-primary">
							{state.fileName}
						</span>
						<span className="font-body text-2xs text-dimmed">
							{formatSize(state.fileSize)}
						</span>
					</div>
					<span className="font-body text-xs font-semibold text-accent">
						{state.progress}%
					</span>
				</div>
				<ProgressBar value={state.progress} />
				<Button
					type="button"
					variant="secondary"
					className="w-full"
					onClick={handleCancel}
				>
					<X className="size-3.5" />
					CANCEL
				</Button>
			</div>
		);
	}

	if (state.step === "error") {
		return (
			<div className="flex flex-col gap-4">
				<Alert message={state.message} />
				<Button
					type="button"
					variant="secondary"
					className="w-full"
					onClick={() => setState({ step: "select" })}
				>
					TRY AGAIN
				</Button>
			</div>
		);
	}

	if (state.step === "done") {
		const { result } = state;
		const dateStr = new Date(result.raidDate).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});

		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3 py-4">
					<CheckCircle className="size-8 text-accent" />
					<div className="flex flex-col items-center gap-1">
						<span className="font-heading text-base font-semibold text-primary">
							{result.raidName}
						</span>
						<span className="font-body text-xs text-secondary">{dateStr}</span>
					</div>
					<span className="font-body text-sm text-secondary">
						{result.totalMembers} members found, {result.newMembers} new
					</span>
				</div>
				<Button type="button" className="w-full" onClick={handleDone}>
					DONE
				</Button>
			</div>
		);
	}

	// State: select
	return (
		<div className="flex flex-col gap-4">
			<button
				type="button"
				className="flex cursor-pointer flex-col items-center gap-3 border border-dashed border-border px-6 py-10 transition-colors hover:border-accent hover:bg-subtle"
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onClick={() => inputRef.current?.click()}
			>
				<Upload className="size-6 text-dimmed" />
				<div className="flex flex-col items-center gap-1">
					<span className="font-body text-sm font-semibold text-primary">
						Drag & drop your combat log here
					</span>
					<span className="font-body text-2xs text-dimmed">
						or click to browse (.txt)
					</span>
				</div>
			</button>
			<input
				ref={inputRef}
				type="file"
				accept=".txt"
				className="hidden"
				onChange={handleInputChange}
			/>
		</div>
	);
}
