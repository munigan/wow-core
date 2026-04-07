/**
 * Canonical public site origin for server-only absolute URLs (emails, etc.).
 * Prefer BETTER_AUTH_URL; host-only values get https://. On Vercel, falls back to VERCEL_URL.
 */
export function getPublicAppOrigin(): string {
	const fromEnv = process.env.BETTER_AUTH_URL?.trim();
	if (fromEnv) {
		const withScheme = fromEnv.includes("://") ? fromEnv : `https://${fromEnv}`;
		try {
			return new URL(withScheme).origin;
		} catch {
			// invalid BETTER_AUTH_URL — try fallbacks below
		}
	}

	const vercelHost = process.env.VERCEL_URL?.trim();
	if (vercelHost) {
		return new URL(`https://${vercelHost}`).origin;
	}

	return "http://localhost:3000";
}
