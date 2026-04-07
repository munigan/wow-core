module.exports = [
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/wildcard.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["wildcardMatch", () => wildcardMatch]);
		//#region src/utils/wildcard.ts
		/**
		 * Escapes a character if it has a special meaning in regular expressions
		 * and returns the character as is if it doesn't
		 */ function escapeRegExpChar(char) {
			if (
				char === "-" ||
				char === "^" ||
				char === "$" ||
				char === "+" ||
				char === "." ||
				char === "(" ||
				char === ")" ||
				char === "|" ||
				char === "[" ||
				char === "]" ||
				char === "{" ||
				char === "}" ||
				char === "*" ||
				char === "?" ||
				char === "\\"
			)
				return `\\${char}`;
			else return char;
		}
		/**
		 * Escapes all characters in a given string that have a special meaning in regular expressions
		 */ function escapeRegExpString(str) {
			let result = "";
			for (let i = 0; i < str.length; i++) result += escapeRegExpChar(str[i]);
			return result;
		}
		/**
		 * Transforms one or more glob patterns into a RegExp pattern
		 */ function transform(pattern, separator = true) {
			if (Array.isArray(pattern))
				return `(?:${pattern.map((p) => `^${transform(p, separator)}$`).join("|")})`;
			let separatorSplitter = "";
			let separatorMatcher = "";
			let wildcard = ".";
			if (separator === true) {
				separatorSplitter = "/";
				separatorMatcher = "[/\\\\]";
				wildcard = "[^/\\\\]";
			} else if (separator) {
				separatorSplitter = separator;
				separatorMatcher = escapeRegExpString(separatorSplitter);
				if (separatorMatcher.length > 1) {
					separatorMatcher = `(?:${separatorMatcher})`;
					wildcard = `((?!${separatorMatcher}).)`;
				} else wildcard = `[^${separatorMatcher}]`;
			}
			const requiredSeparator = separator ? `${separatorMatcher}+?` : "";
			const optionalSeparator = separator ? `${separatorMatcher}*?` : "";
			const segments = separator ? pattern.split(separatorSplitter) : [pattern];
			let result = "";
			for (let s = 0; s < segments.length; s++) {
				const segment = segments[s];
				const nextSegment = segments[s + 1];
				let currentSeparator = "";
				if (!segment && s > 0) continue;
				if (separator)
					if (s === segments.length - 1) currentSeparator = optionalSeparator;
					else if (nextSegment !== "**") currentSeparator = requiredSeparator;
					else currentSeparator = "";
				if (separator && segment === "**") {
					if (currentSeparator) {
						result += s === 0 ? "" : currentSeparator;
						result += `(?:${wildcard}*?${currentSeparator})*?`;
					}
					continue;
				}
				for (let c = 0; c < segment.length; c++) {
					const char = segment[c];
					if (char === "\\") {
						if (c < segment.length - 1) {
							result += escapeRegExpChar(segment[c + 1]);
							c++;
						}
					} else if (char === "?") result += wildcard;
					else if (char === "*") result += `${wildcard}*?`;
					else result += escapeRegExpChar(char);
				}
				result += currentSeparator;
			}
			return result;
		}
		function isMatch(regexp, sample) {
			if (typeof sample !== "string")
				throw new TypeError(
					`Sample must be a string, but ${typeof sample} given`,
				);
			return regexp.test(sample);
		}
		/**
		 * Compiles one or more glob patterns into a RegExp and returns an isMatch function.
		 * The isMatch function takes a sample string as its only argument and returns `true`
		 * if the string matches the pattern(s).
		 *
		 * ```js
		 * wildcardMatch('src/*.js')('src/index.js') //=> true
		 * ```
		 *
		 * ```js
		 * const isMatch = wildcardMatch('*.example.com', '.')
		 * isMatch('foo.example.com') //=> true
		 * isMatch('foo.bar.com') //=> false
		 * ```
		 */ function wildcardMatch(pattern, options) {
			if (typeof pattern !== "string" && !Array.isArray(pattern))
				throw new TypeError(
					`The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`,
				);
			if (typeof options === "string" || typeof options === "boolean")
				options = {
					separator: options,
				};
			if (
				arguments.length === 2 &&
				!(
					typeof options === "undefined" ||
					(typeof options === "object" &&
						options !== null &&
						!Array.isArray(options))
				)
			)
				throw new TypeError(
					`The second argument must be an options object or a string/boolean separator, but ${typeof options} given`,
				);
			options = options || {};
			if (options.separator === "\\")
				throw new Error(
					"\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead",
				);
			const regexpPattern = transform(pattern, options.separator);
			const regexp = new RegExp(`^${regexpPattern}$`, options.flags);
			const fn = isMatch.bind(null, regexp);
			fn.options = options;
			fn.pattern = pattern;
			fn.regexp = regexp;
			return fn;
		}
		//# sourceMappingURL=wildcard.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"getBaseURL",
			() => getBaseURL,
			"getHost",
			() => getHost,
			"getHostFromRequest",
			() => getHostFromRequest,
			"getOrigin",
			() => getOrigin,
			"getProtocol",
			() => getProtocol,
			"getProtocolFromRequest",
			() => getProtocolFromRequest,
			"isDynamicBaseURLConfig",
			() => isDynamicBaseURLConfig,
			"matchesHostPattern",
			() => matchesHostPattern,
			"resolveBaseURL",
			() => resolveBaseURL,
			"resolveDynamicBaseURL",
			() => resolveDynamicBaseURL,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/wildcard.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		//#region src/utils/url.ts
		function checkHasPath(url) {
			try {
				return (new URL(url).pathname.replace(/\/+$/, "") || "/") !== "/";
			} catch {
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				](`Invalid base URL: ${url}. Please provide a valid base URL.`);
			}
		}
		function assertHasProtocol(url) {
			try {
				const parsedUrl = new URL(url);
				if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`,
					);
			} catch (error) {
				if (
					error instanceof
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					]
				)
					throw error;
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				](`Invalid base URL: ${url}. Please provide a valid base URL.`, {
					cause: error,
				});
			}
		}
		function withPath(url, path = "/api/auth") {
			assertHasProtocol(url);
			if (checkHasPath(url)) return url;
			const trimmedUrl = url.replace(/\/+$/, "");
			if (!path || path === "/") return trimmedUrl;
			path = path.startsWith("/") ? path : `/${path}`;
			return `${trimmedUrl}${path}`;
		}
		function validateProxyHeader(header, type) {
			if (!header || header.trim() === "") return false;
			if (type === "proto") return header === "http" || header === "https";
			if (type === "host") {
				if (
					[
						/\.\./,
						/\0/,
						/[\s]/,
						/^[.]/,
						/[<>'"]/,
						/javascript:/i,
						/file:/i,
						/data:/i,
					].some((pattern) => pattern.test(header))
				)
					return false;
				return (
					/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(
						header,
					) ||
					/^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) ||
					/^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) ||
					/^localhost(:[0-9]{1,5})?$/i.test(header)
				);
			}
			return false;
		}
		function getBaseURL(url, path, request, loadEnv, trustedProxyHeaders) {
			if (url) return withPath(url, path);
			if (loadEnv !== false) {
				const fromEnv =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].BETTER_AUTH_URL ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].NEXT_PUBLIC_BETTER_AUTH_URL ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].PUBLIC_BETTER_AUTH_URL ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].NUXT_PUBLIC_BETTER_AUTH_URL ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].NUXT_PUBLIC_AUTH_URL ||
					(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].BASE_URL !== "/"
						? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"env"
							].BASE_URL
						: void 0);
				if (fromEnv) return withPath(fromEnv, path);
			}
			const fromRequest = request?.headers.get("x-forwarded-host");
			const fromRequestProto = request?.headers.get("x-forwarded-proto");
			if (fromRequest && fromRequestProto && trustedProxyHeaders) {
				if (
					validateProxyHeader(fromRequestProto, "proto") &&
					validateProxyHeader(fromRequest, "host")
				)
					try {
						return withPath(`${fromRequestProto}://${fromRequest}`, path);
					} catch (_error) {}
			}
			if (request) {
				const url = getOrigin(request.url);
				if (!url)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						"Could not get origin from request. Please provide a valid base URL.",
					);
				return withPath(url, path);
			}
			if (
				("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
			);
		}
		function getOrigin(url) {
			try {
				const parsedUrl = new URL(url);
				return parsedUrl.origin === "null" ? null : parsedUrl.origin;
			} catch {
				return null;
			}
		}
		function getProtocol(url) {
			try {
				return new URL(url).protocol;
			} catch {
				return null;
			}
		}
		function getHost(url) {
			try {
				return new URL(url).host;
			} catch {
				return null;
			}
		}
		/**
		 * Checks if the baseURL config is a dynamic config object
		 */ function isDynamicBaseURLConfig(config) {
			return (
				typeof config === "object" &&
				config !== null &&
				"allowedHosts" in config &&
				Array.isArray(config.allowedHosts)
			);
		}
		/**
		 * Extracts the host from the request headers.
		 * Tries x-forwarded-host first (for proxy setups), then falls back to host header.
		 *
		 * @param request The incoming request
		 * @returns The host string or null if not found
		 */ function getHostFromRequest(request) {
			const forwardedHost = request.headers.get("x-forwarded-host");
			if (forwardedHost && validateProxyHeader(forwardedHost, "host"))
				return forwardedHost;
			const host = request.headers.get("host");
			if (host && validateProxyHeader(host, "host")) return host;
			try {
				return new URL(request.url).host;
			} catch {
				return null;
			}
		}
		/**
		 * Extracts the protocol from the request headers.
		 * Tries x-forwarded-proto first (for proxy setups), then infers from request URL.
		 *
		 * @param request The incoming request
		 * @param configProtocol Protocol override from config
		 * @returns The protocol ("http" or "https")
		 */ function getProtocolFromRequest(request, configProtocol) {
			if (configProtocol === "http" || configProtocol === "https")
				return configProtocol;
			const forwardedProto = request.headers.get("x-forwarded-proto");
			if (forwardedProto && validateProxyHeader(forwardedProto, "proto"))
				return forwardedProto;
			try {
				const url = new URL(request.url);
				if (url.protocol === "http:" || url.protocol === "https:")
					return url.protocol.slice(0, -1);
			} catch {}
			return "https";
		}
		/**
		 * Matches a hostname against a host pattern.
		 * Supports wildcard patterns like `*.vercel.app` or `preview-*.myapp.com`.
		 *
		 * @param host The hostname to test (e.g., "myapp.com", "preview-123.vercel.app")
		 * @param pattern The host pattern (e.g., "myapp.com", "*.vercel.app")
		 * @returns {boolean} true if the host matches the pattern, false otherwise.
		 *
		 * @example
		 * ```ts
		 * matchesHostPattern("myapp.com", "myapp.com") // true
		 * matchesHostPattern("preview-123.vercel.app", "*.vercel.app") // true
		 * matchesHostPattern("preview-123.myapp.com", "preview-*.myapp.com") // true
		 * matchesHostPattern("evil.com", "myapp.com") // false
		 * ```
		 */ const matchesHostPattern = (host, pattern) => {
			if (!host || !pattern) return false;
			const normalizedHost = host
				.replace(/^https?:\/\//, "")
				.split("/")[0]
				.toLowerCase();
			const normalizedPattern = pattern
				.replace(/^https?:\/\//, "")
				.split("/")[0]
				.toLowerCase();
			if (normalizedPattern.includes("*") || normalizedPattern.includes("?"))
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"wildcardMatch"
				])(normalizedPattern)(normalizedHost);
			return normalizedHost.toLowerCase() === normalizedPattern.toLowerCase();
		};
		/**
		 * Resolves the base URL from a dynamic config based on the incoming request.
		 * Validates the derived host against the allowedHosts allowlist.
		 *
		 * @param config The dynamic base URL config
		 * @param request The incoming request
		 * @param basePath The base path to append
		 * @returns The resolved base URL with path
		 * @throws BetterAuthError if host is not in allowedHosts and no fallback is set
		 */ function resolveDynamicBaseURL(config, request, basePath) {
			const host = getHostFromRequest(request);
			if (!host) {
				if (config.fallback) return withPath(config.fallback, basePath);
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				](
					"Could not determine host from request headers. Please provide a fallback URL in your baseURL config.",
				);
			}
			if (
				config.allowedHosts.some((pattern) => matchesHostPattern(host, pattern))
			)
				return withPath(
					`${getProtocolFromRequest(request, config.protocol)}://${host}`,
					basePath,
				);
			if (config.fallback) return withPath(config.fallback, basePath);
			throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"BetterAuthError"
			](
				`Host "${host}" is not in the allowed hosts list. Allowed hosts: ${config.allowedHosts.join(", ")}. Add this host to your allowedHosts config or provide a fallback URL.`,
			);
		}
		/**
		 * Resolves the base URL from any config type (static string or dynamic object).
		 * This is the main entry point for base URL resolution.
		 *
		 * @param config The base URL config (string or object)
		 * @param basePath The base path to append
		 * @param request Optional request for dynamic resolution
		 * @param loadEnv Whether to load from environment variables
		 * @param trustedProxyHeaders Whether to trust proxy headers (for legacy behavior)
		 * @returns The resolved base URL with path
		 */ function resolveBaseURL(
			config,
			basePath,
			request,
			loadEnv,
			trustedProxyHeaders,
		) {
			if (isDynamicBaseURLConfig(config)) {
				if (request) return resolveDynamicBaseURL(config, request, basePath);
				if (config.fallback) return withPath(config.fallback, basePath);
				return getBaseURL(
					void 0,
					basePath,
					request,
					loadEnv,
					trustedProxyHeaders,
				);
			}
			if (typeof config === "string")
				return getBaseURL(
					config,
					basePath,
					request,
					loadEnv,
					trustedProxyHeaders,
				);
			return getBaseURL(
				void 0,
				basePath,
				request,
				loadEnv,
				trustedProxyHeaders,
			);
		}
		//# sourceMappingURL=url.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/date.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getDate", () => getDate]);
		//#region src/utils/date.ts
		const getDate = (span, unit = "ms") => {
			return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
		};
		//# sourceMappingURL=date.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-promise.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["isPromise", () => isPromise]);
		//#region src/utils/is-promise.ts
		function isPromise(obj) {
			return (
				!!obj &&
				(typeof obj === "object" || typeof obj === "function") &&
				typeof obj.then === "function"
			);
		}
		//# sourceMappingURL=is-promise.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/time.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["ms", () => ms, "sec", () => sec]);
		//#region src/utils/time.ts
		const SEC = 1e3;
		const MIN = SEC * 60;
		const HOUR = MIN * 60;
		const DAY = HOUR * 24;
		const WEEK = DAY * 7;
		const MONTH = DAY * 30;
		const YEAR = DAY * 365.25;
		const REGEX =
			/^(\+|-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)(?: (ago|from now))?$/i;
		function parse(value) {
			const match = REGEX.exec(value);
			if (!match || (match[4] && match[1]))
				throw new TypeError(
					`Invalid time string format: "${value}". Use formats like "7d", "30m", "1 hour", etc.`,
				);
			const n = parseFloat(match[2]);
			const unit = match[3].toLowerCase();
			let result;
			switch (unit) {
				case "years":
				case "year":
				case "yrs":
				case "yr":
				case "y":
					result = n * YEAR;
					break;
				case "months":
				case "month":
				case "mo":
					result = n * MONTH;
					break;
				case "weeks":
				case "week":
				case "w":
					result = n * WEEK;
					break;
				case "days":
				case "day":
				case "d":
					result = n * DAY;
					break;
				case "hours":
				case "hour":
				case "hrs":
				case "hr":
				case "h":
					result = n * HOUR;
					break;
				case "minutes":
				case "minute":
				case "mins":
				case "min":
				case "m":
					result = n * MIN;
					break;
				case "seconds":
				case "second":
				case "secs":
				case "sec":
				case "s":
					result = n * SEC;
					break;
				default:
					throw new TypeError(`Unknown time unit: "${unit}"`);
			}
			if (match[1] === "-" || match[4] === "ago") return -result;
			return result;
		}
		/**
		 * Parse a time string and return the value in milliseconds.
		 *
		 * @param value - A time string like "7d", "30m", "1 hour", "2 hours ago"
		 * @returns The parsed value in milliseconds
		 * @throws TypeError if the string format is invalid
		 *
		 * @example
		 * ms("1d")          // 86400000
		 * ms("2 hours")     // 7200000
		 * ms("30s")         // 30000
		 * ms("2 hours ago") // -7200000
		 */ function ms(value) {
			return parse(value);
		}
		/**
		 * Parse a time string and return the value in seconds.
		 *
		 * @param value - A time string like "7d", "30m", "1 hour", "2 hours ago"
		 * @returns The parsed value in seconds (rounded)
		 * @throws TypeError if the string format is invalid
		 *
		 * @example
		 * sec("1d")          // 86400
		 * sec("2 hours")     // 7200
		 * sec("-30s")        // -30
		 * sec("2 hours ago") // -7200
		 */ function sec(value) {
			return Math.round(parse(value) / 1e3);
		}
		//# sourceMappingURL=time.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/hide-metadata.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["HIDE_METADATA", () => HIDE_METADATA]);
		//#region src/utils/hide-metadata.ts
		const HIDE_METADATA = {
			scope: "server",
		};
		//# sourceMappingURL=hide-metadata.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/index.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/state.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/state.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/hide-metadata.mjs [middleware] (ecmascript)",
			);
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-api-error.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["isAPIError", () => isAPIError]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$3$2e$2_zod$40$4$2e$3$2e$6$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-call@1.3.2_zod@4.3.6/node_modules/better-call/dist/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$3$2e$2_zod$40$4$2e$3$2e$6$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-call@1.3.2_zod@4.3.6/node_modules/better-call/dist/error.mjs [middleware] (ecmascript)",
			);
		//#region src/utils/is-api-error.ts
		function isAPIError(error) {
			return (
				error instanceof
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$3$2e$2_zod$40$4$2e$3$2e$6$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"APIError"
					] ||
				error instanceof
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"APIError"
					] ||
				error?.name === "APIError"
			);
		}
		//# sourceMappingURL=is-api-error.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/get-request-ip.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getIp", () => getIp]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/ip.mjs [middleware] (ecmascript)",
			);
		//#region src/utils/get-request-ip.ts
		const LOCALHOST_IP = "127.0.0.1";
		function getIp(req, options) {
			if (options.advanced?.ipAddress?.disableIpTracking) return null;
			const headers = "headers" in req ? req.headers : req;
			const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || [
				"x-forwarded-for",
			];
			for (const key of ipHeaders) {
				const value = "get" in headers ? headers.get(key) : headers[key];
				if (typeof value === "string") {
					const ip = value.split(",")[0].trim();
					if (
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"isValidIP"
						])(ip)
					)
						return (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"normalizeIP"
						])(ip, {
							ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet,
						});
				}
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isTest"
				])() ||
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isDevelopment"
				])()
			)
				return LOCALHOST_IP;
			return null;
		}
		//# sourceMappingURL=get-request-ip.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/password.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"checkPassword",
			() => checkPassword,
			"validatePassword",
			() => validatePassword,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		//#region src/utils/password.ts
		async function validatePassword(ctx, data) {
			const credentialAccount = (
				await ctx.context.internalAdapter.findAccounts(data.userId)
			)?.find((account) => account.providerId === "credential");
			const currentPassword = credentialAccount?.password;
			if (!credentialAccount || !currentPassword) return false;
			return await ctx.context.password.verify({
				hash: currentPassword,
				password: data.password,
			});
		}
		async function checkPassword(userId, c) {
			const credentialAccount = (
				await c.context.internalAdapter.findAccounts(userId)
			)?.find((account) => account.providerId === "credential");
			const currentPassword = credentialAccount?.password;
			if (!credentialAccount || !currentPassword || !c.body.password)
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"BASE_ERROR_CODES"
					].CREDENTIAL_ACCOUNT_NOT_FOUND,
				);
			if (
				!(await c.context.password.verify({
					hash: currentPassword,
					password: c.body.password,
				}))
			)
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"BASE_ERROR_CODES"
					].INVALID_PASSWORD,
				);
			return true;
		}
		//# sourceMappingURL=password.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/constants.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["DEFAULT_SECRET", () => DEFAULT_SECRET]);
		//#region src/utils/constants.ts
		const DEFAULT_SECRET = "better-auth-secret-12345678901234567890";
		//# sourceMappingURL=constants.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/plugin-helper.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getEndpointResponse", () => getEndpointResponse]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-api-error.mjs [middleware] (ecmascript)",
			);
		//#region src/utils/plugin-helper.ts
		const getEndpointResponse = async (ctx) => {
			const returned = ctx.context.returned;
			if (!returned) return null;
			if (returned instanceof Response) {
				if (returned.status !== 200) return null;
				return await returned.clone().json();
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isAPIError"
				])(returned)
			)
				return null;
			return returned;
		};
		//# sourceMappingURL=plugin-helper.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/middleware-response.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["middlewareResponse", () => middlewareResponse]);
		//#region src/utils/middleware-response.ts
		const middlewareResponse = ({ message, status, code }) => ({
			response: new Response(
				JSON.stringify({
					message,
					code,
				}),
				{
					status,
				},
			),
		});
		//# sourceMappingURL=middleware-response.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/boolean.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["toBoolean", () => toBoolean]);
		//#region src/utils/boolean.ts
		function toBoolean(value) {
			return value === "true" || value === true;
		}
		//# sourceMappingURL=boolean.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/shim.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["shimContext", () => shimContext]);
		//#region src/utils/shim.ts
		const shimContext = (originalObject, newContext) => {
			const shimmedObj = {};
			for (const [key, value] of Object.entries(originalObject)) {
				shimmedObj[key] = (ctx) => {
					return value({
						...ctx,
						context: {
							...newContext,
							...ctx.context,
						},
					});
				};
				shimmedObj[key].path = value.path;
				shimmedObj[key].method = value.method;
				shimmedObj[key].options = value.options;
				shimmedObj[key].headers = value.headers;
			}
			return shimmedObj;
		};
		//# sourceMappingURL=shim.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/hashing.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["toChecksumAddress", () => toChecksumAddress]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/utils.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$sha3$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/sha3.js [middleware] (ecmascript)",
			);
		//#region src/utils/hashing.ts
		/**
		 * TS implementation of ERC-55 ("Mixed-case checksum address encoding") using @noble/hashes
		 * @param address - The address to convert to a checksum address
		 * @returns The checksummed address
		 */ function toChecksumAddress(address) {
			address = address.toLowerCase().replace("0x", "");
			const hash = [
				...(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$sha3$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"keccak_256"
				])(
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"utf8ToBytes"
					])(address),
				),
			]
				.map((v) => v.toString(16).padStart(2, "0"))
				.join("");
			let ret = "0x";
			for (let i = 0; i < 40; i++)
				if (parseInt(hash[i], 16) >= 8) ret += address[i].toUpperCase();
				else ret += address[i];
			return ret;
		}
		//# sourceMappingURL=hashing.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"generateRandomString",
			() => generateRandomString,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/random.mjs [middleware] (ecmascript)",
			);
		//#region src/crypto/random.ts
		const generateRandomString = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
			"createRandomStringGenerator"
		])("a-z", "0-9", "A-Z", "-_");
		//# sourceMappingURL=random.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/buffer.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["constantTimeEqual", () => constantTimeEqual]);
		//#region src/crypto/buffer.ts
		/**
		 * Compare two buffers in constant time.
		 */ function constantTimeEqual(a, b) {
			if (typeof a === "string") a = new TextEncoder().encode(a);
			if (typeof b === "string") b = new TextEncoder().encode(b);
			const aBuffer = new Uint8Array(a);
			const bBuffer = new Uint8Array(b);
			let c = aBuffer.length ^ bBuffer.length;
			const length = Math.max(aBuffer.length, bBuffer.length);
			for (let i = 0; i < length; i++)
				c |=
					(i < aBuffer.length ? aBuffer[i] : 0) ^
					(i < bBuffer.length ? bBuffer[i] : 0);
			return c === 0;
		}
		//# sourceMappingURL=buffer.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/jwt.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"signJWT",
			() => signJWT,
			"symmetricDecodeJWT",
			() => symmetricDecodeJWT,
			"symmetricEncodeJWT",
			() => symmetricEncodeJWT,
			"verifyJWT",
			() => verifyJWT,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/hkdf.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/sha2.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/jwt/encrypt.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/jwt/sign.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript) <export * as base64url>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/jwk/thumbprint.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/util/decode_protected_header.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/jwt/decrypt.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/jose@6.2.1/node_modules/jose/dist/webapi/jwt/verify.js [middleware] (ecmascript)",
			);
		//#region src/crypto/jwt.ts
		async function signJWT(payload, secret, expiresIn = 3600) {
			return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"SignJWT"
			](payload)
				.setProtectedHeader({
					alg: "HS256",
				})
				.setIssuedAt()
				.setExpirationTime(Math.floor(Date.now() / 1e3) + expiresIn)
				.sign(new TextEncoder().encode(secret));
		}
		async function verifyJWT(token, secret) {
			try {
				return (
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"jwtVerify"
					])(token, new TextEncoder().encode(secret))
				).payload;
			} catch {
				return null;
			}
		}
		const info = new Uint8Array([
			66, 101, 116, 116, 101, 114, 65, 117, 116, 104, 46, 106, 115, 32, 71, 101,
			110, 101, 114, 97, 116, 101, 100, 32, 69, 110, 99, 114, 121, 112, 116,
			105, 111, 110, 32, 75, 101, 121,
		]);
		const now = () => (Date.now() / 1e3) | 0;
		const alg = "dir";
		const enc = "A256CBC-HS512";
		function deriveEncryptionSecret(secret, salt) {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"hkdf"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"sha256"
				],
				new TextEncoder().encode(secret),
				new TextEncoder().encode(salt),
				info,
				64,
			);
		}
		function getCurrentSecret(secret) {
			if (typeof secret === "string") return secret;
			const value = secret.keys.get(secret.currentVersion);
			if (!value)
				throw new Error(
					`Secret version ${secret.currentVersion} not found in keys`,
				);
			return value;
		}
		function getAllSecrets(secret) {
			if (typeof secret === "string")
				return [
					{
						version: 0,
						value: secret,
					},
				];
			const result = [];
			for (const [version, value] of secret.keys)
				result.push({
					version,
					value,
				});
			if (
				secret.legacySecret &&
				!result.some((s) => s.value === secret.legacySecret)
			)
				result.push({
					version: -1,
					value: secret.legacySecret,
				});
			return result;
		}
		async function symmetricEncodeJWT(payload, secret, salt, expiresIn = 3600) {
			const encryptionSecret = deriveEncryptionSecret(
				getCurrentSecret(secret),
				salt,
			);
			const thumbprint = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"calculateJwkThumbprint"
			])(
				{
					kty: "oct",
					k: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url$3e$__[
						"base64url"
					].encode(encryptionSecret),
				},
				"sha256",
			);
			return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"EncryptJWT"
			](payload)
				.setProtectedHeader({
					alg,
					enc,
					kid: thumbprint,
				})
				.setIssuedAt()
				.setExpirationTime(now() + expiresIn)
				.setJti(crypto.randomUUID())
				.encrypt(encryptionSecret);
		}
		const jwtDecryptOpts = {
			clockTolerance: 15,
			keyManagementAlgorithms: [alg],
			contentEncryptionAlgorithms: [enc, "A256GCM"],
		};
		async function symmetricDecodeJWT(token, secret, salt) {
			if (!token) return null;
			let hasKid = false;
			try {
				hasKid =
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"decodeProtectedHeader"
					])(token).kid !== void 0;
			} catch {
				return null;
			}
			try {
				const secrets = getAllSecrets(secret);
				const { payload } = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"jwtDecrypt"
				])(
					token,
					async (protectedHeader) => {
						const kid = protectedHeader.kid;
						if (kid !== void 0) {
							for (const s of secrets) {
								const encryptionSecret = deriveEncryptionSecret(s.value, salt);
								if (
									kid ===
									(await (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
										"calculateJwkThumbprint"
									])(
										{
											kty: "oct",
											k: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url$3e$__[
												"base64url"
											].encode(encryptionSecret),
										},
										"sha256",
									))
								)
									return encryptionSecret;
							}
							throw new Error("no matching decryption secret");
						}
						if (secrets.length === 1)
							return deriveEncryptionSecret(secrets[0].value, salt);
						return deriveEncryptionSecret(secrets[0].value, salt);
					},
					jwtDecryptOpts,
				);
				return payload;
			} catch {
				if (hasKid) return null;
				const secrets = getAllSecrets(secret);
				if (secrets.length <= 1) return null;
				for (let i = 1; i < secrets.length; i++)
					try {
						const s = secrets[i];
						const { payload } = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$2$2e$1$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"jwtDecrypt"
						])(token, deriveEncryptionSecret(s.value, salt), jwtDecryptOpts);
						return payload;
					} catch {}
				return null;
			}
		}
		//# sourceMappingURL=jwt.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/password.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"hashPassword",
			() => hashPassword,
			"verifyPassword",
			() => verifyPassword,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/buffer.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hex.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$scrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/scrypt.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+hashes@2.0.1/node_modules/@noble/hashes/utils.js [middleware] (ecmascript)",
			);
		//#region src/crypto/password.ts
		const config = {
			N: 16384,
			r: 16,
			p: 1,
			dkLen: 64,
		};
		async function generateKey(password, salt) {
			return await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$scrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"scryptAsync"
			])(password.normalize("NFKC"), salt, {
				N: config.N,
				p: config.p,
				r: config.r,
				dkLen: config.dkLen,
				maxmem: 128 * config.N * config.r * 2,
			});
		}
		const hashPassword = async (password) => {
			const salt =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"hex"
				].encode(crypto.getRandomValues(new Uint8Array(16)));
			const key = await generateKey(password, salt);
			return `${salt}:${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["hex"].encode(key)}`;
		};
		const verifyPassword = async ({ hash, password }) => {
			const [salt, key] = hash.split(":");
			if (!salt || !key)
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				]("Invalid password hash");
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"constantTimeEqual"
			])(
				await generateKey(password, salt),
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$0$2e$1$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"hexToBytes"
				])(key),
			);
		};
		//# sourceMappingURL=password.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"formatEnvelope",
			() => formatEnvelope,
			"getCryptoKey",
			() => getCryptoKey,
			"makeSignature",
			() => makeSignature,
			"parseEnvelope",
			() => parseEnvelope,
			"symmetricDecrypt",
			() => symmetricDecrypt,
			"symmetricEncrypt",
			() => symmetricEncrypt,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/buffer.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/jwt.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/password.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hash.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+ciphers@2.1.1/node_modules/@noble/ciphers/chacha.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@noble+ciphers@2.1.1/node_modules/@noble/ciphers/utils.js [middleware] (ecmascript)",
			);
		//#region src/crypto/index.ts
		const algorithm = {
			name: "HMAC",
			hash: "SHA-256",
		};
		const ENVELOPE_PREFIX = "$ba$";
		function parseEnvelope(data) {
			if (!data.startsWith(ENVELOPE_PREFIX)) return null;
			const firstSep = 4;
			const secondSep = data.indexOf("$", firstSep);
			if (secondSep === -1) return null;
			const version = parseInt(data.slice(firstSep, secondSep), 10);
			if (!Number.isInteger(version) || version < 0) return null;
			return {
				version,
				ciphertext: data.slice(secondSep + 1),
			};
		}
		function formatEnvelope(version, ciphertext) {
			return `${ENVELOPE_PREFIX}${version}$${ciphertext}`;
		}
		async function rawEncrypt(secret, data) {
			const keyAsBytes = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createHash"
			])("SHA-256").digest(secret);
			const dataAsBytes = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"utf8ToBytes"
			])(data);
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"bytesToHex"
			])(
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"managedNonce"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"xchacha20poly1305"
					],
				)(new Uint8Array(keyAsBytes)).encrypt(dataAsBytes),
			);
		}
		async function rawDecrypt(secret, hex) {
			const keyAsBytes = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createHash"
			])("SHA-256").digest(secret);
			const dataAsBytes = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"hexToBytes"
			])(hex);
			const chacha = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"managedNonce"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$1$2e$1$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"xchacha20poly1305"
				],
			)(new Uint8Array(keyAsBytes));
			return new TextDecoder().decode(chacha.decrypt(dataAsBytes));
		}
		const symmetricEncrypt = async ({ key, data }) => {
			if (typeof key === "string") return rawEncrypt(key, data);
			const secret = key.keys.get(key.currentVersion);
			if (!secret)
				throw new Error(
					`Secret version ${key.currentVersion} not found in keys`,
				);
			const ciphertext = await rawEncrypt(secret, data);
			return formatEnvelope(key.currentVersion, ciphertext);
		};
		const symmetricDecrypt = async ({ key, data }) => {
			if (typeof key === "string") return rawDecrypt(key, data);
			const envelope = parseEnvelope(data);
			if (envelope) {
				const secret = key.keys.get(envelope.version);
				if (!secret)
					throw new Error(
						`Secret version ${envelope.version} not found in keys (key may have been retired)`,
					);
				return rawDecrypt(secret, envelope.ciphertext);
			}
			if (key.legacySecret) return rawDecrypt(key.legacySecret, data);
			throw new Error(
				"Cannot decrypt legacy bare-hex payload: no legacy secret available. Set BETTER_AUTH_SECRET for backwards compatibility.",
			);
		};
		const getCryptoKey = async (secret) => {
			const secretBuf =
				typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
			return await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getWebcryptoSubtle"
			])().importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
		};
		const makeSignature = async (value, secret) => {
			const key = await getCryptoKey(secret);
			const signature = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getWebcryptoSubtle"
			])().sign(algorithm.name, key, new TextEncoder().encode(value));
			return btoa(String.fromCharCode(...new Uint8Array(signature)));
		};
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/session-store.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"createAccountStore",
			() => createAccountStore,
			"createSessionStore",
			() => createSessionStore,
			"getAccountCookie",
			() => getAccountCookie,
			"getChunkedCookie",
			() => getChunkedCookie,
			"getSessionQuerySchema",
			() => getSessionQuerySchema,
			"setAccountCookie",
			() => setAccountCookie,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/jwt.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/json.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/external.js [middleware] (ecmascript)",
			);
		//#region src/cookies/session-store.ts
		const ALLOWED_COOKIE_SIZE = 4096;
		const ESTIMATED_EMPTY_COOKIE_SIZE = 200;
		const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
		/**
		 * Parse cookies from the request headers
		 */ function parseCookiesFromContext(ctx) {
			const cookieHeader = ctx.headers?.get("cookie");
			if (!cookieHeader) return {};
			const cookies = {};
			const pairs = cookieHeader.split("; ");
			for (const pair of pairs) {
				const [name, ...valueParts] = pair.split("=");
				if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
			}
			return cookies;
		}
		/**
		 * Extract the chunk index from a cookie name
		 */ function getChunkIndex(cookieName) {
			const parts = cookieName.split(".");
			const lastPart = parts[parts.length - 1];
			const index = parseInt(lastPart || "0", 10);
			return isNaN(index) ? 0 : index;
		}
		/**
		 * Read all existing chunks from cookies
		 */ function readExistingChunks(cookieName, ctx) {
			const chunks = {};
			const cookies = parseCookiesFromContext(ctx);
			for (const [name, value] of Object.entries(cookies))
				if (name.startsWith(cookieName)) chunks[name] = value;
			return chunks;
		}
		/**
		 * Get the full session data by joining all chunks
		 */ function joinChunks(chunks) {
			return Object.keys(chunks)
				.sort((a, b) => {
					return getChunkIndex(a) - getChunkIndex(b);
				})
				.map((key) => chunks[key])
				.join("");
		}
		/**
		 * Split a cookie value into chunks if needed
		 */ function chunkCookie(storeName, cookie, chunks, logger) {
			const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
			if (chunkCount === 1) {
				chunks[cookie.name] = cookie.value;
				return [cookie];
			}
			const cookies = [];
			for (let i = 0; i < chunkCount; i++) {
				const name = `${cookie.name}.${i}`;
				const start = i * CHUNK_SIZE;
				const value = cookie.value.substring(start, start + CHUNK_SIZE);
				cookies.push({
					...cookie,
					name,
					value,
				});
				chunks[name] = value;
			}
			logger.debug(`CHUNKING_${storeName.toUpperCase()}_COOKIE`, {
				message: `${storeName} cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
				emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
				valueSize: cookie.value.length,
				chunkCount,
				chunks: cookies.map(
					(c) => c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE,
				),
			});
			return cookies;
		}
		/**
		 * Get all cookies that should be cleaned (removed)
		 */ function getCleanCookies(chunks, cookieOptions) {
			const cleanedChunks = {};
			for (const name in chunks)
				cleanedChunks[name] = {
					name,
					value: "",
					attributes: {
						...cookieOptions,
						maxAge: 0,
					},
				};
			return cleanedChunks;
		}
		/**
		 * Create a session store for handling cookie chunking.
		 * When session data exceeds 4KB, it automatically splits it into multiple cookies.
		 *
		 * Based on next-auth's SessionStore implementation.
		 * @see https://github.com/nextauthjs/next-auth/blob/27b2519b84b8eb9cf053775dea29d577d2aa0098/packages/next-auth/src/core/lib/cookie.ts
		 */ const storeFactory =
			(storeName) => (cookieName, cookieOptions, ctx) => {
				const chunks = readExistingChunks(cookieName, ctx);
				const logger = ctx.context.logger;
				return {
					getValue() {
						return joinChunks(chunks);
					},
					hasChunks() {
						return Object.keys(chunks).length > 0;
					},
					chunk(value, options) {
						const cleanedChunks = getCleanCookies(chunks, cookieOptions);
						for (const name in chunks) delete chunks[name];
						const cookies = cleanedChunks;
						const chunked = chunkCookie(
							storeName,
							{
								name: cookieName,
								value,
								attributes: {
									...cookieOptions,
									...options,
								},
							},
							chunks,
							logger,
						);
						for (const chunk of chunked) cookies[chunk.name] = chunk;
						return Object.values(cookies);
					},
					clean() {
						const cleanedChunks = getCleanCookies(chunks, cookieOptions);
						for (const name in chunks) delete chunks[name];
						return Object.values(cleanedChunks);
					},
					setCookies(cookies) {
						for (const cookie of cookies)
							ctx.setCookie(cookie.name, cookie.value, cookie.attributes);
					},
				};
			};
		const createSessionStore = storeFactory("Session");
		const createAccountStore = storeFactory("Account");
		function getChunkedCookie(ctx, cookieName) {
			const value = ctx.getCookie(cookieName);
			if (value) return value;
			const chunks = [];
			const cookieHeader = ctx.headers?.get("cookie");
			if (!cookieHeader) return null;
			const cookies = {};
			const pairs = cookieHeader.split("; ");
			for (const pair of pairs) {
				const [name, ...valueParts] = pair.split("=");
				if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
			}
			for (const [name, val] of Object.entries(cookies))
				if (name.startsWith(cookieName + ".")) {
					const indexStr = name.split(".").at(-1);
					const index = parseInt(indexStr || "0", 10);
					if (!isNaN(index))
						chunks.push({
							index,
							value: val,
						});
				}
			if (chunks.length > 0) {
				chunks.sort((a, b) => a.index - b.index);
				return chunks.map((c) => c.value).join("");
			}
			return null;
		}
		async function setAccountCookie(c, accountData) {
			const accountDataCookie = c.context.authCookies.accountData;
			const options = {
				maxAge: 300,
				...accountDataCookie.attributes,
			};
			const data = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"symmetricEncodeJWT"
			])(
				accountData,
				c.context.secretConfig,
				"better-auth-account",
				options.maxAge,
			);
			if (data.length > ALLOWED_COOKIE_SIZE) {
				const accountStore = createAccountStore(
					accountDataCookie.name,
					options,
					c,
				);
				const cookies = accountStore.chunk(data, options);
				accountStore.setCookies(cookies);
			} else {
				const accountStore = createAccountStore(
					accountDataCookie.name,
					options,
					c,
				);
				if (accountStore.hasChunks()) {
					const cleanCookies = accountStore.clean();
					accountStore.setCookies(cleanCookies);
				}
				c.setCookie(accountDataCookie.name, data, options);
			}
		}
		async function getAccountCookie(c) {
			const accountCookie = getChunkedCookie(
				c,
				c.context.authCookies.accountData.name,
			);
			if (accountCookie) {
				const accountData = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"safeJSONParse"
				])(
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"symmetricDecodeJWT"
					])(accountCookie, c.context.secretConfig, "better-auth-account"),
				);
				if (accountData) return accountData;
			}
			return null;
		}
		const getSessionQuerySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"optional"
			](
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"object"
				]({
					disableCookieCache:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"coerce"
						]
							.boolean()
							.meta({
								description:
									"Disable cookie cache and fetch session from database",
							})
							.optional(),
					disableRefresh:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"coerce"
						]
							.boolean()
							.meta({
								description:
									"Disable session refresh. Useful for checking session status, without updating the session",
							})
							.optional(),
				}),
			);
		//# sourceMappingURL=session-store.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/cookie-utils.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"HOST_COOKIE_PREFIX",
			() => HOST_COOKIE_PREFIX,
			"SECURE_COOKIE_PREFIX",
			() => SECURE_COOKIE_PREFIX,
			"parseSetCookieHeader",
			() => parseSetCookieHeader,
			"setCookieToHeader",
			() => setCookieToHeader,
			"splitSetCookieHeader",
			() => splitSetCookieHeader,
			"stripSecureCookiePrefix",
			() => stripSecureCookiePrefix,
		]);
		//#region src/cookies/cookie-utils.ts
		function tryDecode(str) {
			try {
				return decodeURIComponent(str);
			} catch {
				return str;
			}
		}
		const SECURE_COOKIE_PREFIX = "__Secure-";
		const HOST_COOKIE_PREFIX = "__Host-";
		/**
		 * Remove __Secure- or __Host- prefix from cookie name.
		 */ function stripSecureCookiePrefix(cookieName) {
			if (cookieName.startsWith(SECURE_COOKIE_PREFIX))
				return cookieName.slice(9);
			if (cookieName.startsWith(HOST_COOKIE_PREFIX)) return cookieName.slice(7);
			return cookieName;
		}
		/**
		 * Split a comma-joined `Set-Cookie` header string into individual cookies.
		 */ function splitSetCookieHeader(setCookie) {
			if (!setCookie) return [];
			const result = [];
			let start = 0;
			let i = 0;
			while (i < setCookie.length) {
				if (setCookie[i] === ",") {
					let j = i + 1;
					while (j < setCookie.length && setCookie[j] === " ") j++;
					while (
						j < setCookie.length &&
						setCookie[j] !== "=" &&
						setCookie[j] !== ";" &&
						setCookie[j] !== ","
					)
						j++;
					if (j < setCookie.length && setCookie[j] === "=") {
						const part = setCookie.slice(start, i).trim();
						if (part) result.push(part);
						start = i + 1;
						while (start < setCookie.length && setCookie[start] === " ")
							start++;
						i = start;
						continue;
					}
				}
				i++;
			}
			const last = setCookie.slice(start).trim();
			if (last) result.push(last);
			return result;
		}
		function parseSetCookieHeader(setCookie) {
			const cookies = /* @__PURE__ */ new Map();
			splitSetCookieHeader(setCookie).forEach((cookieString) => {
				const [nameValue, ...attributes] = cookieString
					.split(";")
					.map((part) => part.trim());
				const [name, ...valueParts] = (nameValue || "").split("=");
				const value = valueParts.join("=");
				if (!name || value === void 0) return;
				const attrObj = {
					value: value.includes("%") ? tryDecode(value) : value,
				};
				attributes.forEach((attribute) => {
					const [attrName, ...attrValueParts] = attribute.split("=");
					const attrValue = attrValueParts.join("=");
					const normalizedAttrName = attrName.trim().toLowerCase();
					switch (normalizedAttrName) {
						case "max-age":
							attrObj["max-age"] = attrValue
								? parseInt(attrValue.trim(), 10)
								: void 0;
							break;
						case "expires":
							attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
							break;
						case "domain":
							attrObj.domain = attrValue ? attrValue.trim() : void 0;
							break;
						case "path":
							attrObj.path = attrValue ? attrValue.trim() : void 0;
							break;
						case "secure":
							attrObj.secure = true;
							break;
						case "httponly":
							attrObj.httponly = true;
							break;
						case "samesite":
							attrObj.samesite = attrValue
								? attrValue.trim().toLowerCase()
								: void 0;
							break;
						default:
							attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
							break;
					}
				});
				cookies.set(name, attrObj);
			});
			return cookies;
		}
		function setCookieToHeader(headers) {
			return (context) => {
				const setCookieHeader = context.response.headers.get("set-cookie");
				if (!setCookieHeader) return;
				const cookieMap = /* @__PURE__ */ new Map();
				(headers.get("cookie") || "").split(";").forEach((cookie) => {
					const [name, ...rest] = cookie.trim().split("=");
					if (name && rest.length > 0) cookieMap.set(name, rest.join("="));
				});
				parseSetCookieHeader(setCookieHeader).forEach((value, name) => {
					cookieMap.set(name, value.value);
				});
				const updatedCookies = Array.from(cookieMap.entries())
					.map(([name, value]) => `${name}=${value}`)
					.join("; ");
				headers.set("cookie", updatedCookies);
			};
		}
		//# sourceMappingURL=cookie-utils.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"createCookieGetter",
			() => createCookieGetter,
			"deleteSessionCookie",
			() => deleteSessionCookie,
			"expireCookie",
			() => expireCookie,
			"getCookieCache",
			() => getCookieCache,
			"getCookies",
			() => getCookies,
			"getSessionCookie",
			() => getSessionCookie,
			"parseCookies",
			() => parseCookies,
			"setCookieCache",
			() => setCookieCache,
			"setSessionCookie",
			() => setSessionCookie,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/date.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-promise.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/jwt.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/session-store.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$time$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/time.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/cookie-utils.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/json.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/db.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/base64.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/binary.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hmac.mjs [middleware] (ecmascript)",
			);
		//#region src/cookies/index.ts
		function createCookieGetter(options) {
			const baseURLString =
				typeof options.baseURL === "string" ? options.baseURL : void 0;
			const dynamicProtocol =
				typeof options.baseURL === "object" && options.baseURL !== null
					? options.baseURL.protocol
					: void 0;
			const secureCookiePrefix = (
				options.advanced?.useSecureCookies !== void 0
					? options.advanced?.useSecureCookies
					: dynamicProtocol === "https"
						? true
						: dynamicProtocol === "http"
							? false
							: baseURLString
								? baseURLString.startsWith("https://")
								: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"isProduction"
									]
			)
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"SECURE_COOKIE_PREFIX"
					]
				: "";
			const crossSubdomainEnabled =
				!!options.advanced?.crossSubDomainCookies?.enabled;
			const domain = crossSubdomainEnabled
				? options.advanced?.crossSubDomainCookies?.domain ||
					(baseURLString ? new URL(baseURLString).hostname : void 0)
				: void 0;
			if (
				crossSubdomainEnabled &&
				!domain &&
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isDynamicBaseURLConfig"
				])(options.baseURL)
			)
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				]("baseURL is required when crossSubdomainCookies are enabled.");
			function createCookie(cookieName, overrideAttributes = {}) {
				const prefix = options.advanced?.cookiePrefix || "better-auth";
				const name =
					options.advanced?.cookies?.[cookieName]?.name ||
					`${prefix}.${cookieName}`;
				const attributes =
					options.advanced?.cookies?.[cookieName]?.attributes ?? {};
				return {
					name: `${secureCookiePrefix}${name}`,
					attributes: {
						secure: !!secureCookiePrefix,
						sameSite: "lax",
						path: "/",
						httpOnly: true,
						...(crossSubdomainEnabled
							? {
									domain,
								}
							: {}),
						...options.advanced?.defaultCookieAttributes,
						...overrideAttributes,
						...attributes,
					},
				};
			}
			return createCookie;
		}
		function getCookies(options) {
			const createCookie = createCookieGetter(options);
			const sessionToken = createCookie("session_token", {
				maxAge:
					options.session?.expiresIn ||
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$time$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"sec"
					])("7d"),
			});
			const sessionData = createCookie("session_data", {
				maxAge: options.session?.cookieCache?.maxAge || 300,
			});
			const accountData = createCookie("account_data", {
				maxAge: options.session?.cookieCache?.maxAge || 300,
			});
			const dontRememberToken = createCookie("dont_remember");
			return {
				sessionToken: {
					name: sessionToken.name,
					attributes: sessionToken.attributes,
				},
				sessionData: {
					name: sessionData.name,
					attributes: sessionData.attributes,
				},
				dontRememberToken: {
					name: dontRememberToken.name,
					attributes: dontRememberToken.attributes,
				},
				accountData: {
					name: accountData.name,
					attributes: accountData.attributes,
				},
			};
		}
		async function setCookieCache(ctx, session, dontRememberMe) {
			if (!ctx.context.options.session?.cookieCache?.enabled) return;
			const filteredSession = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"filterOutputFields"
			])(session.session, ctx.context.options.session?.additionalFields);
			const filteredUser = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"parseUserOutput"
			])(ctx.context.options, session.user);
			const versionConfig = ctx.context.options.session?.cookieCache?.version;
			let version = "1";
			if (versionConfig) {
				if (typeof versionConfig === "string") version = versionConfig;
				else if (typeof versionConfig === "function") {
					const result = versionConfig(session.session, session.user);
					version = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"isPromise"
					])(result)
						? await result
						: result;
				}
			}
			const sessionData = {
				session: filteredSession,
				user: filteredUser,
				updatedAt: Date.now(),
				version,
			};
			const options = {
				...ctx.context.authCookies.sessionData.attributes,
				maxAge: dontRememberMe
					? void 0
					: ctx.context.authCookies.sessionData.attributes.maxAge,
			};
			const expiresAtDate = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getDate"
			])(options.maxAge || 60, "sec").getTime();
			const strategy =
				ctx.context.options.session?.cookieCache?.strategy || "compact";
			let data;
			if (strategy === "jwe")
				data = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"symmetricEncodeJWT"
				])(
					sessionData,
					ctx.context.secretConfig,
					"better-auth-session",
					options.maxAge || 300,
				);
			else if (strategy === "jwt")
				data = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"signJWT"
				])(sessionData, ctx.context.secret, options.maxAge || 300);
			else
				data =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"base64Url"
					].encode(
						JSON.stringify({
							session: sessionData,
							expiresAt: expiresAtDate,
							signature: await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"createHMAC"
							])("SHA-256", "base64urlnopad").sign(
								ctx.context.secret,
								JSON.stringify({
									...sessionData,
									expiresAt: expiresAtDate,
								}),
							),
						}),
						{
							padding: false,
						},
					);
			if (data.length > 4093) {
				const sessionStore = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"createSessionStore"
				])(ctx.context.authCookies.sessionData.name, options, ctx);
				const cookies = sessionStore.chunk(data, options);
				sessionStore.setCookies(cookies);
			} else {
				const sessionStore = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"createSessionStore"
				])(ctx.context.authCookies.sessionData.name, options, ctx);
				if (sessionStore.hasChunks()) {
					const cleanCookies = sessionStore.clean();
					sessionStore.setCookies(cleanCookies);
				}
				ctx.setCookie(ctx.context.authCookies.sessionData.name, data, options);
			}
			if (ctx.context.options.account?.storeAccountCookie) {
				const accountData = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getAccountCookie"
				])(ctx);
				if (accountData)
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"setAccountCookie"
					])(ctx, accountData);
			}
		}
		async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
			const dontRememberMeCookie = await ctx.getSignedCookie(
				ctx.context.authCookies.dontRememberToken.name,
				ctx.context.secret,
			);
			dontRememberMe =
				dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
			const options = ctx.context.authCookies.sessionToken.attributes;
			const maxAge = dontRememberMe
				? void 0
				: ctx.context.sessionConfig.expiresIn;
			await ctx.setSignedCookie(
				ctx.context.authCookies.sessionToken.name,
				session.session.token,
				ctx.context.secret,
				{
					...options,
					maxAge,
					...overrides,
				},
			);
			if (dontRememberMe)
				await ctx.setSignedCookie(
					ctx.context.authCookies.dontRememberToken.name,
					"true",
					ctx.context.secret,
					ctx.context.authCookies.dontRememberToken.attributes,
				);
			await setCookieCache(ctx, session, dontRememberMe);
			ctx.context.setNewSession(session);
		}
		/**
		 * Expires a cookie by setting `maxAge: 0` while preserving its attributes
		 */ function expireCookie(ctx, cookie) {
			ctx.setCookie(cookie.name, "", {
				...cookie.attributes,
				maxAge: 0,
			});
		}
		function deleteSessionCookie(ctx, skipDontRememberMe) {
			expireCookie(ctx, ctx.context.authCookies.sessionToken);
			expireCookie(ctx, ctx.context.authCookies.sessionData);
			if (ctx.context.options.account?.storeAccountCookie) {
				expireCookie(ctx, ctx.context.authCookies.accountData);
				const accountStore = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"createAccountStore"
				])(
					ctx.context.authCookies.accountData.name,
					ctx.context.authCookies.accountData.attributes,
					ctx,
				);
				const cleanCookies = accountStore.clean();
				accountStore.setCookies(cleanCookies);
			}
			if (ctx.context.oauthConfig.storeStateStrategy === "cookie")
				expireCookie(ctx, ctx.context.createAuthCookie("oauth_state"));
			const sessionStore = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createSessionStore"
			])(
				ctx.context.authCookies.sessionData.name,
				ctx.context.authCookies.sessionData.attributes,
				ctx,
			);
			const cleanCookies = sessionStore.clean();
			sessionStore.setCookies(cleanCookies);
			if (!skipDontRememberMe)
				expireCookie(ctx, ctx.context.authCookies.dontRememberToken);
		}
		function parseCookies(cookieHeader) {
			const cookies = cookieHeader.split("; ");
			const cookieMap = /* @__PURE__ */ new Map();
			cookies.forEach((cookie) => {
				const [name, value] = cookie.split(/=(.*)/s);
				cookieMap.set(name, value);
			});
			return cookieMap;
		}
		const getSessionCookie = (request, config) => {
			const cookies = (
				request instanceof Headers || !("headers" in request)
					? request
					: request.headers
			).get("cookie");
			if (!cookies) return null;
			const { cookieName = "session_token", cookiePrefix = "better-auth" } =
				config || {};
			const parsedCookie = parseCookies(cookies);
			const getCookie = (name) =>
				parsedCookie.get(name) ||
				parsedCookie.get(
					`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"]}${name}`,
				);
			const sessionToken =
				getCookie(`${cookiePrefix}.${cookieName}`) ||
				getCookie(`${cookiePrefix}-${cookieName}`);
			if (sessionToken) return sessionToken;
			return null;
		};
		const getCookieCache = async (request, config) => {
			const cookies = (
				request instanceof Headers || !("headers" in request)
					? request
					: request.headers
			).get("cookie");
			if (!cookies) return null;
			const { cookieName = "session_data", cookiePrefix = "better-auth" } =
				config || {};
			const name =
				config?.isSecure !== void 0
					? config.isSecure
						? `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"]}${cookiePrefix}.${cookieName}`
						: `${cookiePrefix}.${cookieName}`
					: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"isProduction"
							]
						? `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"]}${cookiePrefix}.${cookieName}`
						: `${cookiePrefix}.${cookieName}`;
			const parsedCookie = parseCookies(cookies);
			let sessionData = parsedCookie.get(name);
			if (!sessionData) {
				const chunks = [];
				for (const [cookieName, value] of parsedCookie.entries())
					if (cookieName.startsWith(name + ".")) {
						const parts = cookieName.split(".");
						const indexStr = parts[parts.length - 1];
						const index = parseInt(indexStr || "0", 10);
						if (!isNaN(index))
							chunks.push({
								index,
								value,
							});
					}
				if (chunks.length > 0) {
					chunks.sort((a, b) => a.index - b.index);
					sessionData = chunks.map((c) => c.value).join("");
				}
			}
			if (sessionData) {
				const secret =
					config?.secret ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].BETTER_AUTH_SECRET;
				if (!secret)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						"getCookieCache requires a secret to be provided. Either pass it as an option or set the BETTER_AUTH_SECRET environment variable",
					);
				const strategy = config?.strategy || "compact";
				if (strategy === "jwe") {
					const payload = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"symmetricDecodeJWT"
					])(sessionData, secret, "better-auth-session");
					if (payload && payload.session && payload.user) {
						if (config?.version) {
							const cookieVersion = payload.version || "1";
							let expectedVersion = "1";
							if (typeof config.version === "string")
								expectedVersion = config.version;
							else if (typeof config.version === "function") {
								const result = config.version(payload.session, payload.user);
								expectedVersion = (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"isPromise"
								])(result)
									? await result
									: result;
							}
							if (cookieVersion !== expectedVersion) return null;
						}
						return payload;
					}
					return null;
				} else if (strategy === "jwt") {
					const payload = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"verifyJWT"
					])(sessionData, secret);
					if (payload && payload.session && payload.user) {
						if (config?.version) {
							const cookieVersion = payload.version || "1";
							let expectedVersion = "1";
							if (typeof config.version === "string")
								expectedVersion = config.version;
							else if (typeof config.version === "function") {
								const result = config.version(payload.session, payload.user);
								expectedVersion = (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"isPromise"
								])(result)
									? await result
									: result;
							}
							if (cookieVersion !== expectedVersion) return null;
						}
						return payload;
					}
					return null;
				} else {
					const sessionDataPayload = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"safeJSONParse"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"binary"
						].decode(
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"base64Url"
							].decode(sessionData),
						),
					);
					if (!sessionDataPayload) return null;
					if (
						!(await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"createHMAC"
						])("SHA-256", "base64urlnopad").verify(
							secret,
							JSON.stringify({
								...sessionDataPayload.session,
								expiresAt: sessionDataPayload.expiresAt,
							}),
							sessionDataPayload.signature,
						))
					)
						return null;
					if (config?.version && sessionDataPayload.session) {
						const cookieVersion = sessionDataPayload.session.version || "1";
						let expectedVersion = "1";
						if (typeof config.version === "string")
							expectedVersion = config.version;
						else if (typeof config.version === "function") {
							const result = config.version(
								sessionDataPayload.session.session,
								sessionDataPayload.session.user,
							);
							expectedVersion = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"isPromise"
							])(result)
								? await result
								: result;
						}
						if (cookieVersion !== expectedVersion) return null;
					}
					return sessionDataPayload.session;
				}
			}
			return null;
		};
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/state.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"StateError",
			() => StateError,
			"generateGenericState",
			() => generateGenericState,
			"parseGenericState",
			() => parseGenericState,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/external.js [middleware] (ecmascript)",
			);
		//#region src/state.ts
		const stateDataSchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"looseObject"
			]({
				callbackURL:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					](),
				codeVerifier:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					](),
				errorURL:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().optional(),
				newUserURL:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().optional(),
				expiresAt:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"number"
					](),
				link: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"object"
				]({
					email:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"string"
						](),
					userId:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"coerce"
						].string(),
				}).optional(),
				requestSignUp:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]().optional(),
			});
		var StateError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
			"BetterAuthError"
		] {
			code;
			details;
			constructor(message, options) {
				super(message, options);
				this.code = options.code;
				this.details = options.details;
			}
		};
		async function generateGenericState(c, stateData, settings) {
			const state = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"generateRandomString"
			])(32);
			if (c.context.oauthConfig.storeStateStrategy === "cookie") {
				const encryptedData = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"symmetricEncrypt"
				])({
					key: c.context.secretConfig,
					data: JSON.stringify(stateData),
				});
				const stateCookie = c.context.createAuthCookie(
					settings?.cookieName ?? "oauth_state",
					{
						maxAge: 600,
					},
				);
				c.setCookie(stateCookie.name, encryptedData, stateCookie.attributes);
				return {
					state,
					codeVerifier: stateData.codeVerifier,
				};
			}
			const stateCookie = c.context.createAuthCookie(
				settings?.cookieName ?? "state",
				{
					maxAge: 300,
				},
			);
			await c.setSignedCookie(
				stateCookie.name,
				state,
				c.context.secret,
				stateCookie.attributes,
			);
			const expiresAt = /* @__PURE__ */ new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + 10);
			const verification =
				await c.context.internalAdapter.createVerificationValue({
					value: JSON.stringify(stateData),
					identifier: state,
					expiresAt,
				});
			if (!verification)
				throw new StateError(
					"Unable to create verification. Make sure the database adapter is properly working and there is a verification table in the database",
					{
						code: "state_generation_error",
					},
				);
			return {
				state: verification.identifier,
				codeVerifier: stateData.codeVerifier,
			};
		}
		async function parseGenericState(c, state, settings) {
			const storeStateStrategy = c.context.oauthConfig.storeStateStrategy;
			let parsedData;
			if (storeStateStrategy === "cookie") {
				const stateCookie = c.context.createAuthCookie(
					settings?.cookieName ?? "oauth_state",
				);
				const encryptedData = c.getCookie(stateCookie.name);
				if (!encryptedData)
					throw new StateError("State mismatch: auth state cookie not found", {
						code: "state_mismatch",
						details: {
							state,
						},
					});
				try {
					const decryptedData = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"symmetricDecrypt"
					])({
						key: c.context.secretConfig,
						data: encryptedData,
					});
					parsedData = stateDataSchema.parse(JSON.parse(decryptedData));
				} catch (error) {
					throw new StateError(
						"State invalid: Failed to decrypt or parse auth state",
						{
							code: "state_invalid",
							details: {
								state,
							},
							cause: error,
						},
					);
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"expireCookie"
				])(c, stateCookie);
			} else {
				const data =
					await c.context.internalAdapter.findVerificationValue(state);
				if (!data)
					throw new StateError("State mismatch: verification not found", {
						code: "state_mismatch",
						details: {
							state,
						},
					});
				parsedData = stateDataSchema.parse(JSON.parse(data.value));
				const stateCookie = c.context.createAuthCookie(
					settings?.cookieName ?? "state",
				);
				const stateCookieValue = await c.getSignedCookie(
					stateCookie.name,
					c.context.secret,
				);
				if (
					!c.context.oauthConfig.skipStateCookieCheck &&
					(!stateCookieValue || stateCookieValue !== state)
				)
					throw new StateError(
						"State mismatch: State not persisted correctly",
						{
							code: "state_security_mismatch",
							details: {
								state,
							},
						},
					);
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"expireCookie"
				])(c, stateCookie);
				await c.context.internalAdapter.deleteVerificationByIdentifier(state);
			}
			if (parsedData.expiresAt < Date.now())
				throw new StateError("Invalid state: request expired", {
					code: "state_mismatch",
					details: {
						expiresAt: parsedData.expiresAt,
					},
				});
			return parsedData;
		}
		//# sourceMappingURL=state.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/state.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"generateState",
			() => generateState,
			"parseState",
			() => parseState,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/state/oauth.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/state.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		//#region src/oauth2/state.ts
		async function generateState(c, link, additionalData) {
			const callbackURL = c.body?.callbackURL || c.context.options.baseURL;
			if (!callbackURL)
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"BASE_ERROR_CODES"
					].CALLBACK_URL_REQUIRED,
				);
			const codeVerifier = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"generateRandomString"
			])(128);
			const stateData = {
				...(additionalData ? additionalData : {}),
				callbackURL,
				codeVerifier,
				errorURL: c.body?.errorCallbackURL,
				newUserURL: c.body?.newUserCallbackURL,
				link,
				expiresAt: Date.now() + 600 * 1e3,
				requestSignUp: c.body?.requestSignUp,
			};
			await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"setOAuthState"
			])(stateData);
			try {
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"generateGenericState"
				])(c, stateData);
			} catch (error) {
				c.context.logger.error("Failed to create verification", error);
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				]("INTERNAL_SERVER_ERROR", {
					message: "Unable to create verification",
					cause: error,
				});
			}
		}
		async function parseState(c) {
			const state = c.query.state || c.body.state;
			const errorURL =
				c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
			let parsedData;
			try {
				parsedData = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseGenericState"
				])(c, state);
			} catch (error) {
				c.context.logger.error("Failed to parse state", error);
				if (
					error instanceof
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"StateError"
						] &&
					error.code === "state_security_mismatch"
				)
					throw c.redirect(`${errorURL}?error=state_mismatch`);
				throw c.redirect(`${errorURL}?error=please_restart_the_process`);
			}
			if (!parsedData.errorURL) parsedData.errorURL = errorURL;
			if (parsedData)
				await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"setOAuthState"
				])(parsedData);
			return parsedData;
		}
		//# sourceMappingURL=state.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/utils.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"decryptOAuthToken",
			() => decryptOAuthToken,
			"setTokenUtil",
			() => setTokenUtil,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		//#region src/oauth2/utils.ts
		/**
		 * Check if a string looks like encrypted data
		 */ function isLikelyEncrypted(token) {
			if (token.startsWith("$ba$")) return true;
			return token.length % 2 === 0 && /^[0-9a-f]+$/i.test(token);
		}
		function decryptOAuthToken(token, ctx) {
			if (!token) return token;
			if (ctx.options.account?.encryptOAuthTokens) {
				if (!isLikelyEncrypted(token)) return token;
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"symmetricDecrypt"
				])({
					key: ctx.secretConfig,
					data: token,
				});
			}
			return token;
		}
		function setTokenUtil(token, ctx) {
			if (ctx.options.account?.encryptOAuthTokens && token)
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"symmetricEncrypt"
				])({
					key: ctx.secretConfig,
					data: token,
				});
			return token;
		}
		//# sourceMappingURL=utils.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/link-account.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["handleOAuthUserInfo", () => handleOAuthUserInfo]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-api-error.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/session-store.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/utils.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/routes/email-verification.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/logger.mjs [middleware] (ecmascript)",
			);
		//#region src/oauth2/link-account.ts
		async function handleOAuthUserInfo(c, opts) {
			const {
				userInfo,
				account,
				callbackURL,
				disableSignUp,
				overrideUserInfo,
			} = opts;
			const dbUser = await c.context.internalAdapter
				.findOAuthUser(
					userInfo.email.toLowerCase(),
					account.accountId,
					account.providerId,
				)
				.catch((e) => {
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"logger"
					].error("Better auth was unable to query your database.\nError: ", e);
					const errorURL =
						c.context.options.onAPIError?.errorURL ||
						`${c.context.baseURL}/error`;
					throw c.redirect(`${errorURL}?error=internal_server_error`);
				});
			let user = dbUser?.user;
			const isRegister = !user;
			if (dbUser) {
				const linkedAccount =
					dbUser.linkedAccount ??
					dbUser.accounts.find(
						(acc) =>
							acc.providerId === account.providerId &&
							acc.accountId === account.accountId,
					);
				if (!linkedAccount) {
					const accountLinking = c.context.options.account?.accountLinking;
					if (
						(!(
							opts.isTrustedProvider ||
							c.context.trustedProviders.includes(account.providerId)
						) &&
							!userInfo.emailVerified) ||
						accountLinking?.enabled === false ||
						accountLinking?.disableImplicitLinking === true
					) {
						if (
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"isDevelopment"
							])()
						)
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"logger"
							].warn(
								`User already exist but account isn't linked to ${account.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`,
							);
						return {
							error: "account not linked",
							data: null,
						};
					}
					try {
						await c.context.internalAdapter.linkAccount({
							providerId: account.providerId,
							accountId: userInfo.id.toString(),
							userId: dbUser.user.id,
							accessToken: await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"setTokenUtil"
							])(account.accessToken, c.context),
							refreshToken: await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"setTokenUtil"
							])(account.refreshToken, c.context),
							idToken: account.idToken,
							accessTokenExpiresAt: account.accessTokenExpiresAt,
							refreshTokenExpiresAt: account.refreshTokenExpiresAt,
							scope: account.scope,
						});
					} catch (e) {
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"logger"
						].error("Unable to link account", e);
						return {
							error: "unable to link account",
							data: null,
						};
					}
					if (
						userInfo.emailVerified &&
						!dbUser.user.emailVerified &&
						userInfo.email.toLowerCase() === dbUser.user.email
					)
						await c.context.internalAdapter.updateUser(dbUser.user.id, {
							emailVerified: true,
						});
				} else {
					const freshTokens =
						c.context.options.account?.updateAccountOnSignIn !== false
							? Object.fromEntries(
									Object.entries({
										idToken: account.idToken,
										accessToken: await (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"setTokenUtil"
										])(account.accessToken, c.context),
										refreshToken: await (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"setTokenUtil"
										])(account.refreshToken, c.context),
										accessTokenExpiresAt: account.accessTokenExpiresAt,
										refreshTokenExpiresAt: account.refreshTokenExpiresAt,
										scope: account.scope,
									}).filter(([_, value]) => value !== void 0),
								)
							: {};
					if (c.context.options.account?.storeAccountCookie)
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"setAccountCookie"
						])(c, {
							...linkedAccount,
							...freshTokens,
						});
					if (Object.keys(freshTokens).length > 0)
						await c.context.internalAdapter.updateAccount(
							linkedAccount.id,
							freshTokens,
						);
					if (
						userInfo.emailVerified &&
						!dbUser.user.emailVerified &&
						userInfo.email.toLowerCase() === dbUser.user.email
					)
						await c.context.internalAdapter.updateUser(dbUser.user.id, {
							emailVerified: true,
						});
				}
				if (overrideUserInfo) {
					const { id: _, ...restUserInfo } = userInfo;
					user = await c.context.internalAdapter.updateUser(dbUser.user.id, {
						...restUserInfo,
						email: userInfo.email.toLowerCase(),
						emailVerified:
							userInfo.email.toLowerCase() === dbUser.user.email
								? dbUser.user.emailVerified || userInfo.emailVerified
								: userInfo.emailVerified,
					});
				}
			} else {
				if (disableSignUp)
					return {
						error: "signup disabled",
						data: null,
						isRegister: false,
					};
				try {
					const { id: _, ...restUserInfo } = userInfo;
					const accountData = {
						accessToken: await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"setTokenUtil"
						])(account.accessToken, c.context),
						refreshToken: await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"setTokenUtil"
						])(account.refreshToken, c.context),
						idToken: account.idToken,
						accessTokenExpiresAt: account.accessTokenExpiresAt,
						refreshTokenExpiresAt: account.refreshTokenExpiresAt,
						scope: account.scope,
						providerId: account.providerId,
						accountId: userInfo.id.toString(),
					};
					const { user: createdUser, account: createdAccount } =
						await c.context.internalAdapter.createOAuthUser(
							{
								...restUserInfo,
								email: userInfo.email.toLowerCase(),
							},
							accountData,
						);
					user = createdUser;
					if (c.context.options.account?.storeAccountCookie)
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"setAccountCookie"
						])(c, createdAccount);
					if (
						!userInfo.emailVerified &&
						user &&
						c.context.options.emailVerification?.sendOnSignUp &&
						c.context.options.emailVerification?.sendVerificationEmail
					) {
						const token = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"createEmailVerificationToken"
						])(
							c.context.secret,
							user.email,
							void 0,
							c.context.options.emailVerification?.expiresIn,
						);
						const url = `${c.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
						await c.context.runInBackgroundOrAwait(
							c.context.options.emailVerification.sendVerificationEmail(
								{
									user,
									url,
									token,
								},
								c.request,
							),
						);
					}
				} catch (e) {
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"logger"
					].error(e);
					if (
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"isAPIError"
						])(e)
					)
						return {
							error: e.message,
							data: null,
							isRegister: false,
						};
					return {
						error: "unable to create user",
						data: null,
						isRegister: false,
					};
				}
			}
			if (!user)
				return {
					error: "unable to create user",
					data: null,
					isRegister: false,
				};
			const session = await c.context.internalAdapter.createSession(user.id);
			if (!session)
				return {
					error: "unable to create session",
					data: null,
					isRegister: false,
				};
			return {
				data: {
					session,
					user,
				},
				error: null,
				isRegister,
			};
		}
		//# sourceMappingURL=link-account.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/trusted-origins.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"matchesOriginPattern",
			() => matchesOriginPattern,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/wildcard.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		//#region src/auth/trusted-origins.ts
		/**
		 * Matches the given url against an origin or origin pattern
		 * See "options.trustedOrigins" for details of supported patterns
		 *
		 * @param url The url to test
		 * @param pattern The origin pattern
		 * @param [settings] Specify supported pattern matching settings
		 * @returns {boolean} true if the URL matches the origin pattern, false otherwise.
		 */ const matchesOriginPattern = (url, pattern, settings) => {
			if (url.startsWith("/")) {
				if (settings?.allowRelativePaths)
					return (
						url.startsWith("/") &&
						/^\/(?!\/|\\|%2f|%5c)[\w\-.+/@]*(?:\?[\w\-.+/=&%@]*)?$/.test(url)
					);
				return false;
			}
			if (pattern.includes("*") || pattern.includes("?")) {
				if (pattern.includes("://"))
					return (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"wildcardMatch"
					])(pattern)(
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getOrigin"
						])(url) || url,
					);
				const host = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getHost"
				])(url);
				if (!host) return false;
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"wildcardMatch"
				])(pattern)(host);
			}
			const protocol = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getProtocol"
			])(url);
			return protocol === "http:" || protocol === "https:" || !protocol
				? pattern ===
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getOrigin"
						])(url)
				: url.startsWith(pattern);
		};
		//# sourceMappingURL=trusted-origins.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/base.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["createBetterAuth", () => createBetterAuth]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/helpers.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/transaction.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		//#region src/auth/base.ts
		const createBetterAuth = (options, initFn) => {
			const authContext = initFn(options);
			const { api } = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"getEndpoints"
			])(authContext, options);
			return {
				handler: async (request) => {
					const ctx = await authContext;
					const basePath = ctx.options.basePath || "/api/auth";
					let handlerCtx;
					if (
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"isDynamicBaseURLConfig"
						])(options.baseURL)
					) {
						handlerCtx = Object.create(
							Object.getPrototypeOf(ctx),
							Object.getOwnPropertyDescriptors(ctx),
						);
						const baseURL = (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"resolveBaseURL"
						])(options.baseURL, basePath, request);
						if (baseURL) {
							handlerCtx.baseURL = baseURL;
							handlerCtx.options = {
								...ctx.options,
								baseURL:
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"getOrigin"
									])(baseURL) || void 0,
							};
						} else
							throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"BetterAuthError"
							](
								"Could not resolve base URL from request. Check your allowedHosts config.",
							);
						const trustedOriginOptions = {
							...handlerCtx.options,
							baseURL: options.baseURL,
						};
						handlerCtx.trustedOrigins = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getTrustedOrigins"
						])(trustedOriginOptions, request);
						if (options.advanced?.crossSubDomainCookies?.enabled) {
							handlerCtx.authCookies = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"getCookies"
							])(handlerCtx.options);
							handlerCtx.createAuthCookie = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"createCookieGetter"
							])(handlerCtx.options);
						}
					} else {
						handlerCtx = ctx;
						if (!ctx.options.baseURL) {
							const baseURL = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"getBaseURL"
							])(
								void 0,
								basePath,
								request,
								void 0,
								ctx.options.advanced?.trustedProxyHeaders,
							);
							if (baseURL) {
								ctx.baseURL = baseURL;
								ctx.options.baseURL =
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"getOrigin"
									])(ctx.baseURL) || void 0;
							} else
								throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"BetterAuthError"
								](
									"Could not get base URL from request. Please provide a valid base URL.",
								);
						}
						handlerCtx.trustedOrigins = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getTrustedOrigins"
						])(ctx.options, request);
					}
					handlerCtx.trustedProviders = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getTrustedProviders"
					])(handlerCtx.options, request);
					const { handler } = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"router"
					])(handlerCtx, options);
					return (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"runWithAdapter"
					])(handlerCtx.adapter, () => handler(request));
				},
				api,
				options,
				$context: authContext,
				$ERROR_CODES: {
					...options.plugins?.reduce((acc, plugin) => {
						if (plugin.$ERROR_CODES)
							return {
								...acc,
								...plugin.$ERROR_CODES,
							};
						return acc;
					}, {}),
					...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"BASE_ERROR_CODES"
					],
				},
			};
		};
		//# sourceMappingURL=base.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/full.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["betterAuth", () => betterAuth]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$init$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/init.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$base$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/base.mjs [middleware] (ecmascript)",
			);
		//#region src/auth/full.ts
		/**
		 * Better Auth initializer for full mode (with Kysely)
		 *
		 * @example
		 * ```ts
		 * import { betterAuth } from "better-auth";
		 *
		 * const auth = betterAuth({
		 * 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
		 * });
		 * ```
		 *
		 * For minimal mode (without Kysely), import from `better-auth/minimal` instead
		 * @example
		 * ```ts
		 * import { betterAuth } from "better-auth/minimal";
		 *
		 * const auth = betterAuth({
		 *	  database: drizzleAdapter(db, { provider: "pg" }),
		 * });
		 */ const betterAuth = (options) => {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$base$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createBetterAuth"
			])(
				options,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$init$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"init"
				],
			);
		};
		//# sourceMappingURL=full.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/_virtual/_rolldown/runtime.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"__exportAll",
			() => __exportAll,
			"__reExport",
			() => __reExport,
		]);
		//#region \0rolldown/runtime.js
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __exportAll = (all, no_symbols) => {
			const target = {};
			for (var name in all) {
				__defProp(target, name, {
					get: all[name],
					enumerable: true,
				});
			}
			if (!no_symbols) {
				__defProp(target, Symbol.toStringTag, {
					value: "Module",
				});
			}
			return target;
		};
		var __copyProps = (to, from, except, desc) => {
			if ((from && typeof from === "object") || typeof from === "function") {
				for (
					var keys = __getOwnPropNames(from), i = 0, n = keys.length, key;
					i < n;
					i++
				) {
					key = keys[i];
					if (!__hasOwnProp.call(to, key) && key !== except) {
						__defProp(to, key, {
							get: ((k) => from[k]).bind(null, key),
							enumerable:
								!(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
						});
					}
				}
			}
			return to;
		};
		var __reExport = (target, mod, secondTarget) => (
			__copyProps(target, mod, "default"),
			secondTarget && __copyProps(secondTarget, mod, "default")
		);
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/helpers.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"getAwaitableValue",
			() => getAwaitableValue,
			"getInternalPlugins",
			() => getInternalPlugins,
			"getTrustedOrigins",
			() => getTrustedOrigins,
			"getTrustedProviders",
			() => getTrustedProviders,
			"runPluginInit",
			() => runPluginInit,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/internal-adapter.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-promise.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs [middleware] (ecmascript)",
			);
		//#region src/context/helpers.ts
		async function runPluginInit(context) {
			let options = context.options;
			const plugins = options.plugins || [];
			const dbHooks = [];
			const pluginTrustedOrigins = [];
			for (const plugin of plugins)
				if (plugin.init) {
					const initPromise = plugin.init(context);
					let result;
					if (
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"isPromise"
						])(initPromise)
					)
						result = await initPromise;
					else result = initPromise;
					if (typeof result === "object") {
						if (result.options) {
							const { databaseHooks, trustedOrigins, ...restOpts } =
								result.options;
							if (databaseHooks) dbHooks.push(databaseHooks);
							if (trustedOrigins) pluginTrustedOrigins.push(trustedOrigins);
							options = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"defu"
							])(options, restOpts);
						}
						if (result.context) Object.assign(context, result.context);
					}
				}
			if (pluginTrustedOrigins.length > 0) {
				const allSources = [
					...(options.trustedOrigins ? [options.trustedOrigins] : []),
					...pluginTrustedOrigins,
				];
				const staticOrigins = allSources.filter(Array.isArray).flat();
				const dynamicOrigins = allSources.filter(
					(s) => typeof s === "function",
				);
				if (dynamicOrigins.length > 0)
					options.trustedOrigins = async (request) => {
						const resolved = await Promise.all(
							dynamicOrigins.map((fn) => fn(request)),
						);
						return [...staticOrigins, ...resolved.flat()].filter(
							(v) => typeof v === "string" && v !== "",
						);
					};
				else options.trustedOrigins = staticOrigins;
			}
			dbHooks.push(options.databaseHooks);
			context.internalAdapter = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createInternalAdapter"
			])(context.adapter, {
				options,
				logger: context.logger,
				hooks: dbHooks.filter((u) => u !== void 0),
				generateId: context.generateId,
			});
			context.options = options;
		}
		function getInternalPlugins(options) {
			const plugins = [];
			if (options.advanced?.crossSubDomainCookies?.enabled) {
			}
			return plugins;
		}
		async function getTrustedOrigins(options, request) {
			const trustedOrigins = [];
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isDynamicBaseURLConfig"
				])(options.baseURL)
			) {
				const allowedHosts = options.baseURL.allowedHosts;
				for (const host of allowedHosts)
					if (!host.includes("://")) {
						trustedOrigins.push(`https://${host}`);
						if (host.includes("localhost") || host.includes("127.0.0.1"))
							trustedOrigins.push(`http://${host}`);
					} else trustedOrigins.push(host);
				if (options.baseURL.fallback)
					try {
						trustedOrigins.push(new URL(options.baseURL.fallback).origin);
					} catch {}
			} else {
				const baseURL = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getBaseURL"
				])(
					typeof options.baseURL === "string" ? options.baseURL : void 0,
					options.basePath,
					request,
				);
				if (baseURL) trustedOrigins.push(new URL(baseURL).origin);
			}
			if (options.trustedOrigins) {
				if (Array.isArray(options.trustedOrigins))
					trustedOrigins.push(...options.trustedOrigins);
				if (typeof options.trustedOrigins === "function") {
					const validOrigins = await options.trustedOrigins(request);
					trustedOrigins.push(...validOrigins);
				}
			}
			const envTrustedOrigins =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"env"
				].BETTER_AUTH_TRUSTED_ORIGINS;
			if (envTrustedOrigins)
				trustedOrigins.push(...envTrustedOrigins.split(","));
			return trustedOrigins.filter((v) => Boolean(v));
		}
		async function getAwaitableValue(arr, item) {
			if (!arr) return void 0;
			for (const val of arr) {
				const value = typeof val === "function" ? await val() : val;
				if (value[item.field ?? "id"] === item.value) return value;
			}
		}
		async function getTrustedProviders(options, request) {
			const trustedProviders =
				options.account?.accountLinking?.trustedProviders;
			if (!trustedProviders) return [];
			if (Array.isArray(trustedProviders))
				return trustedProviders.filter((v) => Boolean(v));
			return ((await trustedProviders(request)) ?? []).filter((v) =>
				Boolean(v),
			);
		}
		//# sourceMappingURL=helpers.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/secret-utils.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"buildSecretConfig",
			() => buildSecretConfig,
			"parseSecretsEnv",
			() => parseSecretsEnv,
			"validateSecretsArray",
			() => validateSecretsArray,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/constants.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		//#region src/context/secret-utils.ts
		/**
		 * Estimates the entropy of a string in bits.
		 * This is a simple approximation that helps detect low-entropy secrets.
		 */ function estimateEntropy(str) {
			const unique = new Set(str).size;
			if (unique === 0) return 0;
			return Math.log2(unique ** str.length);
		}
		function parseSecretsEnv(envValue) {
			if (!envValue) return null;
			return envValue.split(",").map((entry) => {
				entry = entry.trim();
				const colonIdx = entry.indexOf(":");
				if (colonIdx === -1)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Invalid BETTER_AUTH_SECRETS entry: "${entry}". Expected format: "<version>:<secret>"`,
					);
				const version = parseInt(entry.slice(0, colonIdx), 10);
				if (!Number.isInteger(version) || version < 0)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Invalid version in BETTER_AUTH_SECRETS: "${entry.slice(0, colonIdx)}". Version must be a non-negative integer.`,
					);
				const value = entry.slice(colonIdx + 1).trim();
				if (!value)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Empty secret value for version ${version} in BETTER_AUTH_SECRETS.`,
					);
				return {
					version,
					value,
				};
			});
		}
		function validateSecretsArray(secrets, logger) {
			if (secrets.length === 0)
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				]("`secrets` array must contain at least one entry.");
			const seen = /* @__PURE__ */ new Set();
			for (const s of secrets) {
				const version = parseInt(String(s.version), 10);
				if (
					!Number.isInteger(version) ||
					version < 0 ||
					String(version) !== String(s.version).trim()
				)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Invalid version ${s.version} in \`secrets\`. Version must be a non-negative integer.`,
					);
				if (!s.value)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](`Empty secret value for version ${version} in \`secrets\`.`);
				if (seen.has(version))
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						`Duplicate version ${version} in \`secrets\`. Each version must be unique.`,
					);
				seen.add(version);
			}
			const current = secrets[0];
			if (current.value.length < 32)
				logger.warn(
					`[better-auth] Warning: the current secret (version ${current.version}) should be at least 32 characters long for adequate security.`,
				);
			if (estimateEntropy(current.value) < 120)
				logger.warn(
					"[better-auth] Warning: the current secret appears low-entropy. Use a randomly generated secret for production.",
				);
		}
		function buildSecretConfig(secrets, legacySecret) {
			const keys = /* @__PURE__ */ new Map();
			for (const s of secrets)
				keys.set(parseInt(String(s.version), 10), s.value);
			return {
				keys,
				currentVersion: parseInt(String(secrets[0].version), 10),
				legacySecret:
					legacySecret &&
					legacySecret !==
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"DEFAULT_SECRET"
						]
						? legacySecret
						: void 0,
			};
		}
		//# sourceMappingURL=secret-utils.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/create-context.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["createAuthContext", () => createAuthContext]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/trusted-origins.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/internal-adapter.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/is-promise.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/helpers.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/password.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/password.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/constants.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/secret-utils.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/global.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/get-tables.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/logger.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/env-impl.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/id.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/social-providers/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$telemetry$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$f_3a7bb418078cfb287032907ca8c54a60$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$node$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+telemetry@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-f_3a7bb418078cfb287032907ca8c54a60/node_modules/@better-auth/telemetry/dist/node.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs [middleware] (ecmascript)",
			);
		//#region src/context/create-context.ts
		/**
		 * Estimates the entropy of a string in bits.
		 * This is a simple approximation that helps detect low-entropy secrets.
		 */ function estimateEntropy(str) {
			const unique = new Set(str).size;
			if (unique === 0) return 0;
			return Math.log2(unique ** str.length);
		}
		/**
		 * Validates that the secret meets minimum security requirements.
		 * Throws BetterAuthError if the secret is invalid.
		 * Skips validation for DEFAULT_SECRET in test environments only.
		 * Only throws for DEFAULT_SECRET in production environment.
		 */ function validateSecret(secret, logger) {
			const isDefaultSecret =
				secret ===
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"DEFAULT_SECRET"
				];
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isTest"
				])()
			)
				return;
			if (
				isDefaultSecret &&
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isProduction"
				]
			)
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				](
					"You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.",
				);
			if (!secret)
				throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"BetterAuthError"
				](
					"BETTER_AUTH_SECRET is missing. Set it in your environment or pass `secret` to betterAuth({ secret }).",
				);
			if (secret.length < 32)
				logger.warn(
					`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx auth secret\` or \`openssl rand -base64 32\`.`,
				);
			if (estimateEntropy(secret) < 120)
				logger.warn(
					"[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.",
				);
		}
		async function createAuthContext(adapter, options, getDatabaseType) {
			if (!options.database)
				options = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"default"
				])(options, {
					session: {
						cookieCache: {
							enabled: true,
							strategy: "jwe",
							refreshCache: true,
						},
					},
					account: {
						storeStateStrategy: "cookie",
						storeAccountCookie: true,
					},
				});
			const plugins = options.plugins || [];
			const internalPlugins = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getInternalPlugins"
			])(options);
			const logger = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createLogger"
			])(options.logger);
			const isDynamicConfig = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"isDynamicBaseURLConfig"
			])(options.baseURL);
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isDynamicBaseURLConfig"
				])(options.baseURL)
			) {
				const { allowedHosts } = options.baseURL;
				if (!allowedHosts || allowedHosts.length === 0)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						'baseURL.allowedHosts cannot be empty. Provide at least one allowed host pattern (e.g., ["myapp.com", "*.vercel.app"]).',
					);
			}
			const baseURL = isDynamicConfig
				? void 0
				: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getBaseURL"
					])(
						typeof options.baseURL === "string" ? options.baseURL : void 0,
						options.basePath,
					);
			if (!baseURL && !isDynamicConfig)
				logger.warn(
					`[better-auth] Base URL could not be determined. Please set a valid base URL using the baseURL config option or the BETTER_AUTH_URL environment variable. Without this, callbacks and redirects may not work correctly.`,
				);
			if (
				adapter.id === "memory" &&
				options.advanced?.database?.generateId === false
			)
				logger.error(`[better-auth] Misconfiguration detected.
You are using the memory DB with generateId: false.
This will cause no id to be generated for any model.
Most of the features of Better Auth will not work correctly.`);
			const secretsArray =
				options.secrets ??
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseSecretsEnv"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"env"
					].BETTER_AUTH_SECRETS,
				);
			const legacySecret =
				options.secret ||
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"env"
				].BETTER_AUTH_SECRET ||
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"env"
				].AUTH_SECRET ||
				"";
			let secret;
			let secretConfig;
			if (secretsArray) {
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"validateSecretsArray"
				])(secretsArray, logger);
				secret = secretsArray[0].value;
				secretConfig = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"buildSecretConfig"
				])(secretsArray, legacySecret);
			} else {
				secret =
					legacySecret ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"DEFAULT_SECRET"
					];
				validateSecret(secret, logger);
				secretConfig = secret;
			}
			options = {
				...options,
				secret,
				baseURL: isDynamicConfig
					? options.baseURL
					: baseURL
						? new URL(baseURL).origin
						: "",
				basePath: options.basePath || "/api/auth",
				plugins: plugins.concat(internalPlugins),
			};
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"checkEndpointConflicts"
			])(options, logger);
			const cookies = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"getCookies"
			])(options);
			const tables = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getAuthTables"
			])(options);
			const providers = (
				await Promise.all(
					Object.entries(options.socialProviders || {}).map(
						async ([key, originalConfig]) => {
							const config =
								typeof originalConfig === "function"
									? await originalConfig()
									: originalConfig;
							if (config == null) return null;
							if (config.enabled === false) return null;
							if (!config.clientId)
								logger.warn(
									`Social provider ${key} is missing clientId or clientSecret`,
								);
							const provider =
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"socialProviders"
								][key](config);
							provider.disableImplicitSignUp = config.disableImplicitSignUp;
							return provider;
						},
					),
				)
			).filter((x) => x !== null);
			const generateIdFunc = ({ model, size }) => {
				if (typeof options.advanced?.generateId === "function")
					return options.advanced.generateId({
						model,
						size,
					});
				const dbGenerateId = options?.advanced?.database?.generateId;
				if (typeof dbGenerateId === "function")
					return dbGenerateId({
						model,
						size,
					});
				if (dbGenerateId === "uuid") return crypto.randomUUID();
				if (dbGenerateId === "serial" || dbGenerateId === false) return false;
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"generateId"
				])(size);
			};
			const { publish } = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$telemetry$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$f_3a7bb418078cfb287032907ca8c54a60$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$node$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createTelemetry"
			])(options, {
				adapter: adapter.id,
				database:
					typeof options.database === "function"
						? "adapter"
						: getDatabaseType(options.database),
			});
			const pluginIds = new Set(options.plugins.map((p) => p.id));
			const getPluginFn = (id) =>
				options.plugins.find((p) => p.id === id) ?? null;
			const hasPluginFn = (id) => pluginIds.has(id);
			const trustedOrigins = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getTrustedOrigins"
			])(options);
			const trustedProviders = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getTrustedProviders"
			])(options);
			const ctx = {
				appName: options.appName || "Better Auth",
				baseURL: baseURL || "",
				version: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getBetterAuthVersion"
				])(),
				socialProviders: providers,
				options,
				oauthConfig: {
					storeStateStrategy:
						options.account?.storeStateStrategy ||
						(options.database ? "database" : "cookie"),
					skipStateCookieCheck: !!options.account?.skipStateCookieCheck,
				},
				tables,
				trustedOrigins,
				trustedProviders,
				isTrustedOrigin(url, settings) {
					return this.trustedOrigins.some((origin) =>
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"matchesOriginPattern"
						])(url, origin, settings),
					);
				},
				sessionConfig: {
					updateAge:
						options.session?.updateAge !== void 0
							? options.session.updateAge
							: 1440 * 60,
					expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
					freshAge:
						options.session?.freshAge === void 0
							? 3600 * 24
							: options.session.freshAge,
					cookieRefreshCache: (() => {
						const refreshCache = options.session?.cookieCache?.refreshCache;
						const maxAge = options.session?.cookieCache?.maxAge || 300;
						if (
							(!!options.database || !!options.secondaryStorage) &&
							refreshCache
						) {
							logger.warn(
								"[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.",
							);
							return false;
						}
						if (refreshCache === false || refreshCache === void 0) return false;
						if (refreshCache === true)
							return {
								enabled: true,
								updateAge: Math.floor(maxAge * 0.2),
							};
						return {
							enabled: true,
							updateAge:
								refreshCache.updateAge !== void 0
									? refreshCache.updateAge
									: Math.floor(maxAge * 0.2),
						};
					})(),
				},
				secret,
				secretConfig,
				rateLimit: {
					...options.rateLimit,
					enabled:
						options.rateLimit?.enabled ??
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"isProduction"
						],
					window: options.rateLimit?.window || 10,
					max: options.rateLimit?.max || 100,
					storage:
						options.rateLimit?.storage ||
						(options.secondaryStorage ? "secondary-storage" : "memory"),
				},
				authCookies: cookies,
				logger,
				generateId: generateIdFunc,
				session: null,
				secondaryStorage: options.secondaryStorage,
				password: {
					hash:
						options.emailAndPassword?.password?.hash ||
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"hashPassword"
						],
					verify:
						options.emailAndPassword?.password?.verify ||
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"verifyPassword"
						],
					config: {
						minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
						maxPasswordLength:
							options.emailAndPassword?.maxPasswordLength || 128,
					},
					checkPassword:
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"checkPassword"
						],
				},
				setNewSession(session) {
					this.newSession = session;
				},
				newSession: null,
				adapter,
				internalAdapter: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"createInternalAdapter"
				])(adapter, {
					options,
					logger,
					hooks: options.databaseHooks ? [options.databaseHooks] : [],
					generateId: generateIdFunc,
				}),
				createAuthCookie: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"createCookieGetter"
				])(options),
				async runMigrations() {
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					]("runMigrations will be set by the specific init implementation");
				},
				publishTelemetry: publish,
				skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
				skipOriginCheck:
					options.advanced?.disableOriginCheck !== void 0
						? options.advanced.disableOriginCheck
						: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"isTest"
								])()
							? true
							: false,
				runInBackground:
					options.advanced?.backgroundTasks?.handler ??
					((p) => {
						p.catch(() => {});
					}),
				async runInBackgroundOrAwait(promise) {
					try {
						if (options.advanced?.backgroundTasks?.handler) {
							if (promise instanceof Promise)
								options.advanced.backgroundTasks.handler(
									promise.catch((e) => {
										logger.error("Failed to run background task:", e);
									}),
								);
						} else await promise;
					} catch (e) {
						logger.error("Failed to run background task:", e);
					}
				},
				getPlugin: getPluginFn,
				hasPlugin: hasPluginFn,
			};
			const initOrPromise = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"runPluginInit"
			])(ctx);
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"isPromise"
				])(initOrPromise)
			)
				await initOrPromise;
			return ctx;
		}
		//# sourceMappingURL=create-context.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/init.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["init", () => init]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$kysely$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/adapter-kysely.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$migration$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/get-migration.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$create$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/context/create-context.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$bet_5f9802a6f0eb6c1ddba8f37c39695dee$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+kysely-adapter@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@bet_5f9802a6f0eb6c1ddba8f37c39695dee/node_modules/@better-auth/kysely-adapter/dist/index.mjs [middleware] (ecmascript)",
			);
		//#region src/context/init.ts
		const init = async (options) => {
			const adapter = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$kysely$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getAdapter"
			])(options);
			const getDatabaseType = (database) =>
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$bet_5f9802a6f0eb6c1ddba8f37c39695dee$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getKyselyDatabaseType"
				])(database) || "unknown";
			const ctx = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$create$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthContext"
			])(adapter, options, getDatabaseType);
			ctx.runMigrations = async () => {
				if (!options.database || "updateMany" in options.database)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					](
						"Database is not provided or it's an adapter. Migrations are only supported with a database instance.",
					);
				const { runMigrations } = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$migration$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getMigrations"
				])(options);
				await runMigrations();
			};
			return ctx;
		};
		//# sourceMappingURL=init.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/url.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/state.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/oauth2/state.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/hide-metadata.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$full$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/auth/full.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/transaction.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$telemetry$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$f_3a7bb418078cfb287032907ca8c54a60$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$node$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+telemetry@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-f_3a7bb418078cfb287032907ca8c54a60/node_modules/@better-auth/telemetry/dist/node.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/env/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/oauth2/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/error-codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/id.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/json.mjs [middleware] (ecmascript)",
			);
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/adapters/drizzle-adapter/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$drizzle$2d$adapter$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$be_eeead38fe098b3bb9d4fe595b0267cdc$2f$node_modules$2f40$better$2d$auth$2f$drizzle$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+drizzle-adapter@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@be_eeead38fe098b3bb9d4fe595b0267cdc/node_modules/@better-auth/drizzle-adapter/dist/index.mjs [middleware] (ecmascript)",
			);
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/client/parser.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["parseJSON", () => parseJSON]);
		//#region src/client/parser.ts
		const PROTO_POLLUTION_PATTERNS = {
			proto:
				/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
			constructor:
				/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
			protoShort: /"__proto__"\s*:/,
			constructorShort: /"constructor"\s*:/,
		};
		const JSON_SIGNATURE =
			/^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
		const SPECIAL_VALUES = {
			true: true,
			false: false,
			null: null,
			undefined: void 0,
			nan: NaN,
			infinity: Number.POSITIVE_INFINITY,
			"-infinity": Number.NEGATIVE_INFINITY,
		};
		const ISO_DATE_REGEX =
			/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
		function isValidDate(date) {
			return date instanceof Date && !isNaN(date.getTime());
		}
		function parseISODate(value) {
			const match = ISO_DATE_REGEX.exec(value);
			if (!match) return null;
			const [
				,
				year,
				month,
				day,
				hour,
				minute,
				second,
				ms,
				offsetSign,
				offsetHour,
				offsetMinute,
			] = match;
			const date = new Date(
				Date.UTC(
					parseInt(year, 10),
					parseInt(month, 10) - 1,
					parseInt(day, 10),
					parseInt(hour, 10),
					parseInt(minute, 10),
					parseInt(second, 10),
					ms ? parseInt(ms.padEnd(3, "0"), 10) : 0,
				),
			);
			if (offsetSign) {
				const offset =
					(parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) *
					(offsetSign === "+" ? -1 : 1);
				date.setUTCMinutes(date.getUTCMinutes() + offset);
			}
			return isValidDate(date) ? date : null;
		}
		function betterJSONParse(value, options = {}) {
			const {
				strict = false,
				warnings = false,
				reviver,
				parseDates = true,
			} = options;
			if (typeof value !== "string") return value;
			const trimmed = value.trim();
			if (
				trimmed.length > 0 &&
				trimmed[0] === '"' &&
				trimmed.endsWith('"') &&
				!trimmed.slice(1, -1).includes('"')
			)
				return trimmed.slice(1, -1);
			const lowerValue = trimmed.toLowerCase();
			if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES)
				return SPECIAL_VALUES[lowerValue];
			if (!JSON_SIGNATURE.test(trimmed)) {
				if (strict) throw new SyntaxError("[better-json] Invalid JSON");
				return value;
			}
			if (
				Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
					const matches = pattern.test(trimmed);
					if (matches && warnings)
						console.warn(
							`[better-json] Detected potential prototype pollution attempt using ${key} pattern`,
						);
					return matches;
				}) &&
				strict
			)
				throw new Error(
					"[better-json] Potential prototype pollution attempt detected",
				);
			try {
				const secureReviver = (key, value) => {
					if (
						key === "__proto__" ||
						(key === "constructor" &&
							value &&
							typeof value === "object" &&
							"prototype" in value)
					) {
						if (warnings)
							console.warn(
								`[better-json] Dropping "${key}" key to prevent prototype pollution`,
							);
						return;
					}
					if (parseDates && typeof value === "string") {
						const date = parseISODate(value);
						if (date) return date;
					}
					return reviver ? reviver(key, value) : value;
				};
				return JSON.parse(trimmed, secureReviver);
			} catch (error) {
				if (strict) throw error;
				return value;
			}
		}
		function parseJSON(
			value,
			options = {
				strict: true,
			},
		) {
			return betterJSONParse(value, options);
		}
		//# sourceMappingURL=parser.mjs.map
	},
];

//# sourceMappingURL=d0383_better-auth_dist_7882b66c._.js.map
