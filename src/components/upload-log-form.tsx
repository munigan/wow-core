"use client";

import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxRoot } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import type { DetectedRaid, ScanMessage } from "@/lib/log-scanner";
import { trpc } from "@/lib/trpc/client";

type UploadResult = {
	raidId: string;
	raidName: string;
	raidDate: string;
	totalMembers: number;
	newMembers: number;
};

type UploadState =
	| { step: "select" }
	| { step: "scanning"; progress: number }
	| {
			step: "choose";
			raids: DetectedRaid[];
			selectedCoreId: string;
			selectedRaidIndices: Set<number>;
	  }
	| { step: "uploading"; fileName: string; fileSize: number; progress: number }
	| { step: "error"; message: string }
	| { step: "done"; results: UploadResult[] };

type UploadLogFormProps = {
	cores: { id: string; name: string }[];
	activeCoreId: string | null;
	onDoneAction: () => void;
};

function formatSize(bytes: number): string {
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRaidLabel(raid: DetectedRaid): string {
	const dates = raid.dates;
	if (dates.length === 1) {
		return `Raid ${dates[0]}`;
	}
	return `Raid ${dates[0]} - ${dates[dates.length - 1]}`;
}

export function UploadLogForm({
	cores,
	activeCoreId,
	onDoneAction,
}: UploadLogFormProps) {
	const router = useRouter();
	const [state, setState] = useState<UploadState>({ step: "select" });
	const xhrRef = useRef<XMLHttpRequest | null>(null);
	const workerRef = useRef<Worker | null>(null);
	const fileRef = useRef<File | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const selectedCoreId = state.step === "choose" ? state.selectedCoreId : null;

	const membersQuery = trpc.members.listByCore.useQuery(
		{ coreId: selectedCoreId ?? "" },
		{ enabled: state.step === "choose" && selectedCoreId != null },
	);

	const chooseState = state.step === "choose" ? state : null;

	const mismatchWarning = useMemo(() => {
		if (!chooseState) return null;
		const existingMembers = membersQuery.data;
		if (!existingMembers || existingMembers.length === 0) return null;

		const selectedRaids = chooseState.raids.filter((_, i) =>
			chooseState.selectedRaidIndices.has(i),
		);
		const detectedNames = new Set(
			selectedRaids.flatMap((r) => r.playerNames.map((n) => n.toLowerCase())),
		);

		const existingNames = existingMembers.map((m) => m.name.toLowerCase());
		const overlapCount = existingNames.filter((n) =>
			detectedNames.has(n),
		).length;
		const overlap = overlapCount / existingMembers.length;

		if (overlap < 0.3) {
			return `Only ${Math.round(overlap * 100)}% of this core's members were found in the selected raids. You may have selected the wrong core.`;
		}
		return null;
	}, [chooseState, membersQuery.data]);

	// Cleanup worker on unmount
	useEffect(() => {
		return () => {
			workerRef.current?.terminate();
			workerRef.current = null;
		};
	}, []);

	const handleScan = useCallback(
		(file: File) => {
			// Terminate any existing worker before starting a new scan
			workerRef.current?.terminate();
			workerRef.current = null;

			fileRef.current = file;
			setState({ step: "scanning", progress: 0 });

			const worker = new Worker(
				new URL("../lib/log-scanner.worker.ts", import.meta.url),
			);
			workerRef.current = worker;

			worker.onmessage = (e: MessageEvent<ScanMessage>) => {
				const msg = e.data;
				switch (msg.type) {
					case "progress": {
						const progress =
							msg.totalBytes > 0
								? Math.round((msg.bytesRead / msg.totalBytes) * 100)
								: 0;
						setState((prev) =>
							prev.step === "scanning" ? { ...prev, progress } : prev,
						);
						break;
					}
					case "done": {
						worker.terminate();
						workerRef.current = null;

						if (msg.raids.length === 0) {
							setState({
								step: "error",
								message: "No raids detected in this log file.",
							});
							return;
						}

						const defaultCoreId = activeCoreId ?? cores[0]?.id ?? "";
						setState({
							step: "choose",
							raids: msg.raids,
							selectedCoreId: defaultCoreId,
							selectedRaidIndices: new Set(msg.raids.map((_, i) => i)),
						});
						break;
					}
					case "error": {
						worker.terminate();
						workerRef.current = null;
						setState({ step: "error", message: msg.message });
						break;
					}
				}
			};

			worker.onerror = () => {
				worker.terminate();
				workerRef.current = null;
				setState({
					step: "error",
					message: "Worker failed unexpectedly.",
				});
			};

			worker.postMessage({ file });
		},
		[activeCoreId, cores],
	);

	const handleUpload = useCallback(() => {
		if (state.step !== "choose") return;

		const file = fileRef.current;
		if (!file) return;

		const selectedRaids = state.raids.filter((_, i) =>
			state.selectedRaidIndices.has(i),
		);
		if (selectedRaids.length === 0) return;

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
					const results: UploadResult[] = Array.isArray(data) ? data : [data];
					setState({ step: "done", results });
				} else {
					setState({
						step: "error",
						message: data.error ?? "Upload failed",
					});
				}
			} catch {
				setState({
					step: "error",
					message: "Invalid server response",
				});
			}
		};

		xhr.onerror = () => {
			setState({
				step: "error",
				message: "Network error during upload",
			});
		};

		xhr.onabort = () => {
			setState({ step: "select" });
		};

		xhr.open("POST", "/api/upload");
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.setRequestHeader("X-Core-Id", state.selectedCoreId);
		xhr.setRequestHeader(
			"X-Selected-Raids",
			JSON.stringify(selectedRaids.map((r) => r.dates)),
		);
		xhr.send(file);
	}, [state]);

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
				handleScan(file);
			}
		},
		[handleScan],
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleScan(file);
	};

	// Step: scanning
	if (state.step === "scanning") {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3 py-4">
					<span className="font-heading text-sm font-semibold text-primary">
						Scanning file...
					</span>
					<span className="font-body text-xs text-dimmed">
						{state.progress}%
					</span>
				</div>
				<ProgressBar value={state.progress} />
			</div>
		);
	}

	// Step: choose
	if (state.step === "choose") {
		const { raids, selectedCoreId: coreId, selectedRaidIndices } = state;
		const isAllSelected = selectedRaidIndices.size === raids.length;
		const isNoneSelected = selectedRaidIndices.size === 0;
		const isIndeterminate = !isAllSelected && !isNoneSelected;

		const handleCoreChange = (value: string | null) => {
			if (value) {
				setState((prev) =>
					prev.step === "choose" ? { ...prev, selectedCoreId: value } : prev,
				);
			}
		};

		const handleToggleAll = (checked: boolean) => {
			setState((prev) => {
				if (prev.step !== "choose") return prev;
				return {
					...prev,
					selectedRaidIndices: checked
						? new Set(prev.raids.map((_, i) => i))
						: new Set<number>(),
				};
			});
		};

		const handleToggleRaid = (index: number) => {
			setState((prev) => {
				if (prev.step !== "choose") return prev;
				const next = new Set(prev.selectedRaidIndices);
				if (next.has(index)) {
					next.delete(index);
				} else {
					next.add(index);
				}
				return { ...prev, selectedRaidIndices: next };
			});
		};

		const isImportDisabled = !coreId || isNoneSelected;

		return (
			<div className="flex flex-col gap-4">
				{/* Core selector */}
				<div className="flex flex-col gap-1.5">
					<span className="font-body text-xs font-semibold uppercase tracking-wide text-secondary">
						Core
					</span>
					<SelectRoot value={coreId} onValueChangeAction={handleCoreChange}>
						<SelectTrigger placeholder="Select a core" className="w-full" />
						<SelectPopup>
							{cores.map((core) => (
								<SelectItem key={core.id} value={core.id}>
									{core.name}
								</SelectItem>
							))}
						</SelectPopup>
					</SelectRoot>
				</div>

				{/* Mismatch warning */}
				{mismatchWarning && (
					<Alert message={mismatchWarning} variant="warning" />
				)}

				{/* Raid list */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2.5">
						<CheckboxRoot
							checked={isAllSelected}
							indeterminate={isIndeterminate}
							onCheckedChangeAction={handleToggleAll}
						/>
						<span className="font-body text-xs font-semibold text-primary">
							Select all ({raids.length})
						</span>
					</div>

					<div className="flex flex-col gap-1">
						{raids.map((raid, index) => {
							const isSelected = selectedRaidIndices.has(index);
							return (
								<div
									key={raid.dates.join("-")}
									className="flex items-center gap-2.5 border border-border px-3 py-2 transition-colors hover:border-border-light"
								>
									<CheckboxRoot
										checked={isSelected}
										onCheckedChangeAction={() => handleToggleRaid(index)}
									/>
									<div className="flex min-w-0 flex-1 flex-col gap-0.5">
										<span className="font-body text-xs font-semibold text-primary">
											{formatRaidLabel(raid)}
										</span>
										<span className="font-body text-2xs text-dimmed">
											{raid.playerCount} members
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Import button */}
				<Button
					type="button"
					className="w-full"
					disabled={isImportDisabled}
					onClick={handleUpload}
				>
					Import Selected
				</Button>
			</div>
		);
	}

	// Step: uploading
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

	// Step: error
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

	// Step: done
	if (state.step === "done") {
		const { results } = state;

		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3 py-4">
					<CheckCircle className="size-8 text-accent" />
					<span className="font-heading text-base font-semibold text-primary">
						Import Complete
					</span>
				</div>
				<div className="flex flex-col gap-1">
					{results.map((result) => {
						const dateStr = new Date(result.raidDate).toLocaleDateString(
							"en-US",
							{
								month: "long",
								day: "numeric",
							},
						);
						return (
							<div
								key={result.raidId}
								className="flex items-center justify-between border border-border px-3 py-2"
							>
								<div className="flex flex-col gap-0.5">
									<span className="font-body text-xs font-semibold text-primary">
										{result.raidName}
									</span>
									<span className="font-body text-2xs text-dimmed">
										{dateStr}
									</span>
								</div>
								<span className="font-body text-xs text-secondary">
									{result.totalMembers} members
								</span>
							</div>
						);
					})}
				</div>
				<Button type="button" className="w-full" onClick={handleDone}>
					DONE
				</Button>
			</div>
		);
	}

	// Step: select (default)
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
