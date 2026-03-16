import { type ScanResult, scanLog } from "@munigan/wow-combatlog-parser";

type ScanProgress = {
	type: "progress";
	bytesRead: number;
	totalBytes: number;
};

type ScanDone = {
	type: "done";
	result: ScanResult;
};

type ScanError = {
	type: "error";
	message: string;
};

export type ScanMessage = ScanProgress | ScanDone | ScanError;

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
	try {
		const { file } = e.data;
		const totalBytes = file.size;

		const result = await scanLog(file.stream(), {
			onProgress: (bytesRead) => {
				self.postMessage({
					type: "progress",
					bytesRead,
					totalBytes,
				} satisfies ScanProgress);
			},
		});

		// Send final progress so UI reaches 100% before switching to done
		self.postMessage({
			type: "progress",
			bytesRead: totalBytes,
			totalBytes,
		} satisfies ScanProgress);

		self.postMessage({ type: "done", result } satisfies ScanDone);
	} catch (err) {
		self.postMessage({
			type: "error",
			message: err instanceof Error ? err.message : String(err),
		} satisfies ScanError);
	}
};
