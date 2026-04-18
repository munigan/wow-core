import { defineConfig } from "@trigger.dev/sdk";

/** Default project ref (wow-core on Trigger.dev); override with `TRIGGER_PROJECT_REF`. */
const DEFAULT_TRIGGER_PROJECT_REF = "proj_btkmlvtjolreuqhzblvg";

function getProjectRef(): string {
	return process.env.TRIGGER_PROJECT_REF?.trim() || DEFAULT_TRIGGER_PROJECT_REF;
}

export default defineConfig({
	project: getProjectRef(),
	dirs: ["./src/trigger"],
	retries: {
		enabledInDev: false,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true,
		},
	},
	maxDuration: 3600,
});
