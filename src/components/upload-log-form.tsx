"use client";

import { AlertTriangle, CheckCircle, FileText, Upload, X } from "lucide-react";
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
import {
	TooltipContent,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DetectedRaid, ScanMessage } from "@/lib/log-scanner";
import { trpc } from "@/lib/trpc/client";

type UploadResult = {
	raidId: string;
	raidName: string;
	raidDate: string;
	totalMembers: number;
	newMembers: number;
};

type RaidConfig = {
	isSelected: boolean;
	coreId: string;
};

type UploadState =
	| { step: "select" }
	| { step: "scanning"; progress: number }
	| { step: "choose"; raids: DetectedRaid[]; raidConfigs: RaidConfig[] }
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

function getOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

function formatRaidLabel(raid: DetectedRaid): string {
	const instance = raid.raidInstance ?? "Raid";
	const startDate = new Date(raid.startTime);
	const endDate = new Date(raid.endTime);

	const monthName = startDate.toLocaleDateString("en-US", { month: "long" });
	const day = startDate.getDate();
	const ordinal = getOrdinalSuffix(day);

	if (raid.dates.length === 1) {
		return `${instance} - ${monthName} ${day}${ordinal}`;
	}

	const endDay = endDate.getDate();
	const endOrdinal = getOrdinalSuffix(endDay);
	return `${instance} - ${monthName} ${day}${ordinal} - ${endDay}${endOrdinal}`;
}

function formatTimeRange(raid: DetectedRaid): string {
	const start = new Date(raid.startTime);
	const end = new Date(raid.endTime);
	const fmt = (d: Date) =>
		d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	return `${fmt(start)} - ${fmt(end)}`;
}

function computeOverlap(
	raidPlayerNames: string[],
	coreMembers: { name: string }[],
): number {
	if (coreMembers.length === 0) return 1; // No members yet, no warning
	const raidNames = new Set(raidPlayerNames.map((n) => n.toLowerCase()));
	const matchCount = coreMembers.filter((m) =>
		raidNames.has(m.name.toLowerCase()),
	).length;
	return matchCount / coreMembers.length;
}

type DuplicateInfo = {
	isDuplicate: boolean;
	existingName?: string;
	existingDate?: string;
};

function checkLikelyDuplicate(
	raid: DetectedRaid,
	coreId: string,
	existingRaids: { coreId: string; name: string; date: Date | string }[],
): DuplicateInfo {
	const raidInstance = raid.raidInstance;
	if (!raidInstance) return { isDuplicate: false };

	const raidStartDate = new Date(raid.startTime);
	const oneDayMs = 1000 * 60 * 60 * 24;

	for (const existing of existingRaids) {
		if (existing.coreId !== coreId) continue;

		const existingName = existing.name.toLowerCase();
		if (!existingName.includes(raidInstance.toLowerCase())) continue;

		const existingDate = new Date(existing.date);
		const dayDiff =
			Math.abs(raidStartDate.getTime() - existingDate.getTime()) / oneDayMs;
		if (dayDiff <= 1) {
			return {
				isDuplicate: true,
				existingName: existing.name,
				existingDate: existingDate.toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
				}),
			};
		}
	}

	return { isDuplicate: false };
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
	const hasAppliedDefaultsRef = useRef(false);

	const membersQuery = trpc.members.listByCores.useQuery(
		{ coreIds: cores.map((c) => c.id) },
		{ enabled: state.step === "choose" },
	);

	const existingRaidsQuery = trpc.raids.listByCores.useQuery(
		{ coreIds: cores.map((c) => c.id) },
		{ enabled: state.step === "choose" },
	);

	const membersByCore = useMemo(() => {
		const map = new Map<string, { name: string }[]>();
		if (!membersQuery.data) return map;
		for (const m of membersQuery.data) {
			const list = map.get(m.coreId) ?? [];
			list.push({ name: m.name });
			map.set(m.coreId, list);
		}
		return map;
	}, [membersQuery.data]);

	// Smart core assignment + duplicate detection (runs once per scan when both queries resolve)
	useEffect(() => {
		if (state.step !== "choose") return;
		if (hasAppliedDefaultsRef.current) return;
		if (membersByCore.size === 0) return;
		if (!existingRaidsQuery.data) return;

		hasAppliedDefaultsRef.current = true;

		const existingRaids = existingRaidsQuery.data;

		setState((prev) => {
			if (prev.step !== "choose") return prev;

			const updatedConfigs = prev.raids.map((raid, i) => {
				const existing = prev.raidConfigs[i];
				if (!existing)
					return {
						isSelected: true,
						coreId: activeCoreId ?? cores[0]?.id ?? "",
					};

				// Step 1: determine best core by member overlap
				let bestCoreId = existing.coreId;
				let bestOverlap = -1;

				for (const core of cores) {
					const coreMembers = membersByCore.get(core.id) ?? [];
					if (coreMembers.length === 0) continue;
					const overlap = computeOverlap(raid.playerNames, coreMembers);
					if (overlap > bestOverlap) {
						bestOverlap = overlap;
						bestCoreId = core.id;
					}
				}

				// Step 2: check for duplicate using the resolved coreId
				const { isDuplicate } = checkLikelyDuplicate(
					raid,
					bestCoreId,
					existingRaids,
				);

				return {
					...existing,
					coreId: bestCoreId,
					isSelected: isDuplicate ? false : existing.isSelected,
				};
			});

			return { ...prev, raidConfigs: updatedConfigs };
		});
	}, [state.step, membersByCore, existingRaidsQuery.data, cores, activeCoreId]);

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
			hasAppliedDefaultsRef.current = false;
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
							raidConfigs: msg.raids.map(() => ({
								isSelected: true,
								coreId: defaultCoreId,
							})),
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

		const hasSelected = state.raidConfigs.some((c) => c.isSelected);
		if (!hasSelected) return;

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

		const selectedPayload = state.raids
			.map((raid, i) => ({ raid, config: state.raidConfigs[i] }))
			.filter(({ config }) => config?.isSelected)
			.map(({ raid, config }) => ({
				dates: raid.dates,
				startTime: raid.startTime,
				endTime: raid.endTime,
				timeRanges: raid.timeRanges,
				coreId: config.coreId,
				raidName: formatRaidLabel(raid),
			}));

		xhr.open("POST", "/api/upload");
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.setRequestHeader("X-Selected-Raids", JSON.stringify(selectedPayload));
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
		const { raids, raidConfigs } = state;
		const coreItems = cores.map((c) => ({ value: c.id, label: c.name }));

		const handleToggleRaid = (index: number) => {
			setState((prev) => {
				if (prev.step !== "choose") return prev;
				const next = prev.raidConfigs.map((c, i) =>
					i === index ? { ...c, isSelected: !c.isSelected } : c,
				);
				return { ...prev, raidConfigs: next };
			});
		};

		const handleCoreChange = (index: number, value: string | null) => {
			if (!value) return;
			setState((prev) => {
				if (prev.step !== "choose") return prev;
				const next = prev.raidConfigs.map((c, i) =>
					i === index ? { ...c, coreId: value } : c,
				);
				return { ...prev, raidConfigs: next };
			});
		};

		const isImportDisabled = raidConfigs.every((c) => !c.isSelected);

		return (
			<div className="flex flex-col gap-4">
				{/* Raid list */}
				<div className="flex flex-col gap-1">
					{raids.map((raid, index) => {
						const config = raidConfigs[index];
						if (!config) return null;

						const coreMembers = membersByCore.get(config.coreId) ?? [];
						const overlap = computeOverlap(raid.playerNames, coreMembers);
						const isMismatch = overlap < 0.3;

						const duplicateInfo = existingRaidsQuery.data
							? checkLikelyDuplicate(
									raid,
									config.coreId,
									existingRaidsQuery.data,
								)
							: { isDuplicate: false };

						return (
							<div
								key={`${raid.startTime}-${raid.endTime}`}
								className="flex items-start gap-2.5 border border-border px-3 py-2.5"
							>
								<CheckboxRoot
									checked={config.isSelected}
									onCheckedChangeAction={() => handleToggleRaid(index)}
									className="mt-0.5"
								/>
								<div className="flex min-w-0 flex-1 flex-col gap-1">
									<div className="flex items-center gap-1.5">
										<span className="font-body text-xs font-semibold text-primary">
											{formatRaidLabel(raid)}
										</span>
										{duplicateInfo.isDuplicate && (
											<TooltipRoot>
												<TooltipTrigger render={<span />}>
													<span className="cursor-default font-body text-2xs text-warning">
														Likely duplicate
													</span>
												</TooltipTrigger>
												<TooltipContent side="top">
													<span className="font-body text-2xs text-primary">
														&quot;{duplicateInfo.existingName}&quot; on{" "}
														{duplicateInfo.existingDate} already exists in this
														core
													</span>
												</TooltipContent>
											</TooltipRoot>
										)}
									</div>
									<span className="font-body text-2xs text-dimmed">
										{formatTimeRange(raid)}
									</span>
									<div className="flex flex-wrap items-center gap-1">
										<span className="font-body text-2xs text-dimmed">
											{raid.playerNames.slice(0, 3).join(", ")}
										</span>
										{raid.playerCount > 3 && (
											<TooltipRoot>
												<TooltipTrigger render={<span />}>
													<span className="cursor-default font-body text-2xs text-accent">
														+{raid.playerCount - 3} more
													</span>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													<div className="max-h-48 overflow-y-auto">
														{raid.playerNames.map((name) => (
															<span
																key={name}
																className="block font-body text-2xs text-primary"
															>
																{name}
															</span>
														))}
													</div>
												</TooltipContent>
											</TooltipRoot>
										)}
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-1.5">
									<SelectRoot
										value={config.coreId}
										items={coreItems}
										onValueChangeAction={(value) =>
											handleCoreChange(index, value)
										}
									>
										<SelectTrigger placeholder="Core" className="w-36" />
										<SelectPopup>
											{cores.map((c) => (
												<SelectItem key={c.id} value={c.id}>
													{c.name}
												</SelectItem>
											))}
										</SelectPopup>
									</SelectRoot>
									{isMismatch && (
										<AlertTriangle className="size-3 text-warning" />
									)}
								</div>
							</div>
						);
					})}
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
