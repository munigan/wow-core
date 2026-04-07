module.exports = [
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"TWO_FACTOR_ERROR_CODES",
			() => TWO_FACTOR_ERROR_CODES,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/error-codes.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/error-code.ts
		const TWO_FACTOR_ERROR_CODES = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
			"defineErrorCodes"
		])({
			OTP_NOT_ENABLED: "OTP not enabled",
			OTP_HAS_EXPIRED: "OTP has expired",
			TOTP_NOT_ENABLED: "TOTP not enabled",
			TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled",
			BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled",
			INVALID_BACKUP_CODE: "Invalid backup code",
			INVALID_CODE: "Invalid code",
			TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
				"Too many attempts. Please request a new code.",
			INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie",
		});
		//# sourceMappingURL=error-code.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/client.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["twoFactorClient", () => twoFactorClient]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/client.ts
		const twoFactorClient = (options) => {
			return {
				id: "two-factor",
				$InferServerPlugin: {},
				atomListeners: [
					{
						matcher: (path) => path.startsWith("/two-factor/"),
						signal: "$sessionSignal",
					},
				],
				pathMethods: {
					"/two-factor/disable": "POST",
					"/two-factor/enable": "POST",
					"/two-factor/send-otp": "POST",
					"/two-factor/generate-backup-codes": "POST",
					"/two-factor/get-totp-uri": "POST",
					"/two-factor/verify-totp": "POST",
					"/two-factor/verify-otp": "POST",
					"/two-factor/verify-backup-code": "POST",
				},
				fetchPlugins: [
					{
						id: "two-factor",
						name: "two-factor",
						hooks: {
							async onSuccess(context) {
								if (context.data?.twoFactorRedirect) {
									if (options?.onTwoFactorRedirect)
										await options.onTwoFactorRedirect();
								}
							},
						},
					},
				],
				$ERROR_CODES:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"TWO_FACTOR_ERROR_CODES"
					],
			};
		};
		//# sourceMappingURL=client.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/constant.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"TRUST_DEVICE_COOKIE_MAX_AGE",
			() => TRUST_DEVICE_COOKIE_MAX_AGE,
			"TRUST_DEVICE_COOKIE_NAME",
			() => TRUST_DEVICE_COOKIE_NAME,
			"TWO_FACTOR_COOKIE_NAME",
			() => TWO_FACTOR_COOKIE_NAME,
		]);
		//#region src/plugins/two-factor/constant.ts
		const TWO_FACTOR_COOKIE_NAME = "two_factor";
		const TRUST_DEVICE_COOKIE_NAME = "trust_device";
		const TRUST_DEVICE_COOKIE_MAX_AGE = 720 * 60 * 60;
		//# sourceMappingURL=constant.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/verify-two-factor.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["verifyTwoFactor", () => verifyTwoFactor]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/routes/session.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/constant.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hmac.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/verify-two-factor.ts
		async function verifyTwoFactor(ctx) {
			const invalid = (errorKey) => {
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"UNAUTHORIZED",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"TWO_FACTOR_ERROR_CODES"
					][errorKey],
				);
			};
			const session = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getSessionFromCtx"
			])(ctx);
			if (!session) {
				const twoFactorCookie = ctx.context.createAuthCookie(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"TWO_FACTOR_COOKIE_NAME"
					],
				);
				const signedTwoFactorCookie = await ctx.getSignedCookie(
					twoFactorCookie.name,
					ctx.context.secret,
				);
				if (!signedTwoFactorCookie)
					throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"APIError"
					].from(
						"UNAUTHORIZED",
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"TWO_FACTOR_ERROR_CODES"
						].INVALID_TWO_FACTOR_COOKIE,
					);
				const verificationToken =
					await ctx.context.internalAdapter.findVerificationValue(
						signedTwoFactorCookie,
					);
				if (!verificationToken)
					throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"APIError"
					].from(
						"UNAUTHORIZED",
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"TWO_FACTOR_ERROR_CODES"
						].INVALID_TWO_FACTOR_COOKIE,
					);
				const user = await ctx.context.internalAdapter.findUserById(
					verificationToken.value,
				);
				if (!user)
					throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"APIError"
					].from(
						"UNAUTHORIZED",
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"TWO_FACTOR_ERROR_CODES"
						].INVALID_TWO_FACTOR_COOKIE,
					);
				const dontRememberMe = await ctx.getSignedCookie(
					ctx.context.authCookies.dontRememberToken.name,
					ctx.context.secret,
				);
				return {
					valid: async (ctx) => {
						const session = await ctx.context.internalAdapter.createSession(
							verificationToken.value,
							!!dontRememberMe,
						);
						if (!session)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from("INTERNAL_SERVER_ERROR", {
								message: "failed to create session",
								code: "FAILED_TO_CREATE_SESSION",
							});
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							signedTwoFactorCookie,
						);
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"setSessionCookie"
						])(ctx, {
							session,
							user,
						});
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"expireCookie"
						])(ctx, twoFactorCookie);
						if (ctx.body.trustDevice) {
							const maxAge =
								ctx.context.getPlugin("two-factor").options
									?.trustDeviceMaxAge ??
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"TRUST_DEVICE_COOKIE_MAX_AGE"
								];
							const trustDeviceCookie = ctx.context.createAuthCookie(
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"TRUST_DEVICE_COOKIE_NAME"
								],
								{
									maxAge,
								},
							);
							/**
							 * Create a random identifier for the trust device record.
							 * Store it in the verification table with an expiration
							 * so the server can validate and revoke it.
							 */ const trustIdentifier = `trust-device-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomString"])(32)}`;
							const token = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"createHMAC"
							])("SHA-256", "base64urlnopad").sign(
								ctx.context.secret,
								`${user.id}!${trustIdentifier}`,
							);
							await ctx.context.internalAdapter.createVerificationValue({
								value: user.id,
								identifier: trustIdentifier,
								expiresAt: new Date(Date.now() + maxAge * 1e3),
							});
							await ctx.setSignedCookie(
								trustDeviceCookie.name,
								`${token}!${trustIdentifier}`,
								ctx.context.secret,
								trustDeviceCookie.attributes,
							);
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"expireCookie"
							])(ctx, ctx.context.authCookies.dontRememberToken);
						}
						return ctx.json({
							token: session.token,
							user: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"parseUserOutput"
							])(ctx.context.options, user),
						});
					},
					invalid,
					session: {
						session: null,
						user,
					},
					key: signedTwoFactorCookie,
				};
			}
			return {
				valid: async (ctx) => {
					return ctx.json({
						token: session.session.token,
						user: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseUserOutput"
						])(ctx.context.options, session.user),
					});
				},
				invalid,
				session,
				key: `${session.user.id}!${session.session.id}`,
			};
		}
		//# sourceMappingURL=verify-two-factor.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/backup-codes/index.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"backupCode2fa",
			() => backupCode2fa,
			"generateBackupCodes",
			() => generateBackupCodes,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/routes/session.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/verify-two-factor.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/json.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/external.js [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/backup-codes/index.ts
		function generateBackupCodesFn(options) {
			return Array.from({
				length: options?.amount ?? 10,
			})
				.fill(null)
				.map(() =>
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"generateRandomString"
					])(options?.length ?? 10, "a-z", "0-9", "A-Z"),
				)
				.map((code) => `${code.slice(0, 5)}-${code.slice(5)}`);
		}
		async function generateBackupCodes(secret, options) {
			const backupCodes = options?.customBackupCodesGenerate
				? options.customBackupCodesGenerate()
				: generateBackupCodesFn(options);
			if (options?.storeBackupCodes === "encrypted")
				return {
					backupCodes,
					encryptedBackupCodes: await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"symmetricEncrypt"
					])({
						data: JSON.stringify(backupCodes),
						key: secret,
					}),
				};
			if (
				typeof options?.storeBackupCodes === "object" &&
				"encrypt" in options?.storeBackupCodes
			)
				return {
					backupCodes,
					encryptedBackupCodes: await options?.storeBackupCodes.encrypt(
						JSON.stringify(backupCodes),
					),
				};
			return {
				backupCodes,
				encryptedBackupCodes: JSON.stringify(backupCodes),
			};
		}
		async function verifyBackupCode(data, key, options) {
			const codes = await getBackupCodes(data.backupCodes, key, options);
			if (!codes)
				return {
					status: false,
					updated: null,
				};
			return {
				status: codes.includes(data.code),
				updated: codes.filter((code) => code !== data.code),
			};
		}
		async function getBackupCodes(backupCodes, key, options) {
			if (options?.storeBackupCodes === "encrypted")
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"safeJSONParse"
				])(
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"symmetricDecrypt"
					])({
						key,
						data: backupCodes,
					}),
				);
			if (
				typeof options?.storeBackupCodes === "object" &&
				"decrypt" in options?.storeBackupCodes
			)
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"safeJSONParse"
				])(await options?.storeBackupCodes.decrypt(backupCodes));
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"safeJSONParse"
			])(backupCodes);
		}
		const verifyBackupCodeBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					description: `A backup code to verify. Eg: "123456"`,
				}),
				disableSession:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]()
						.meta({
							description: "If true, the session cookie will not be set.",
						})
						.optional(),
				trustDevice:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]()
						.meta({
							description:
								"If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true",
						})
						.optional(),
			});
		const viewBackupCodesBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				userId:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"coerce"
					]
						.string()
						.meta({
							description: `The user ID to view all backup codes. Eg: "user-id"`,
						}),
			});
		const generateBackupCodesBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				password:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "The users password.",
					}),
			});
		const backupCode2fa = (opts) => {
			const twoFactorTable = "twoFactor";
			return {
				id: "backup_code",
				endpoints: {
					verifyBackupCode: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/verify-backup-code",
						{
							method: "POST",
							body: verifyBackupCodeBodySchema,
							metadata: {
								openapi: {
									description:
										"Verify a backup code for two-factor authentication",
									responses: {
										200: {
											description: "Backup code verified successfully",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															user: {
																type: "object",
																properties: {
																	id: {
																		type: "string",
																		description:
																			"Unique identifier of the user",
																	},
																	email: {
																		type: "string",
																		format: "email",
																		nullable: true,
																		description: "User's email address",
																	},
																	emailVerified: {
																		type: "boolean",
																		nullable: true,
																		description:
																			"Whether the email is verified",
																	},
																	name: {
																		type: "string",
																		nullable: true,
																		description: "User's name",
																	},
																	image: {
																		type: "string",
																		format: "uri",
																		nullable: true,
																		description: "User's profile image URL",
																	},
																	twoFactorEnabled: {
																		type: "boolean",
																		description:
																			"Whether two-factor authentication is enabled for the user",
																	},
																	createdAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the user was created",
																	},
																	updatedAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the user was last updated",
																	},
																},
																required: [
																	"id",
																	"twoFactorEnabled",
																	"createdAt",
																	"updatedAt",
																],
																description:
																	"The authenticated user object with two-factor details",
															},
															session: {
																type: "object",
																properties: {
																	token: {
																		type: "string",
																		description: "Session token",
																	},
																	userId: {
																		type: "string",
																		description:
																			"ID of the user associated with the session",
																	},
																	createdAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the session was created",
																	},
																	expiresAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the session expires",
																	},
																},
																required: [
																	"token",
																	"userId",
																	"createdAt",
																	"expiresAt",
																],
																description:
																	"The current session object, included unless disableSession is true",
															},
														},
														required: ["user", "session"],
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							const { session, valid } = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"verifyTwoFactor"
							])(ctx);
							const user = session.user;
							const twoFactor = await ctx.context.adapter.findOne({
								model: twoFactorTable,
								where: [
									{
										field: "userId",
										value: user.id,
									},
								],
							});
							if (!twoFactor)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].BACKUP_CODES_NOT_ENABLED,
								);
							const validate = await verifyBackupCode(
								{
									backupCodes: twoFactor.backupCodes,
									code: ctx.body.code,
								},
								ctx.context.secretConfig,
								opts,
							);
							if (!validate.status)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"UNAUTHORIZED",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].INVALID_BACKUP_CODE,
								);
							const updatedBackupCodes = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"symmetricEncrypt"
							])({
								key: ctx.context.secretConfig,
								data: JSON.stringify(validate.updated),
							});
							if (
								!(await ctx.context.adapter.update({
									model: twoFactorTable,
									update: {
										backupCodes: updatedBackupCodes,
									},
									where: [
										{
											field: "id",
											value: twoFactor.id,
										},
										{
											field: "backupCodes",
											value: twoFactor.backupCodes,
										},
									],
								}))
							)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].fromStatus("CONFLICT", {
									message: "Failed to verify backup code. Please try again.",
								});
							if (!ctx.body.disableSession) return valid(ctx);
							return ctx.json({
								token: session.session?.token,
								user: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"parseUserOutput"
								])(ctx.context.options, session.user),
							});
						},
					),
					generateBackupCodes: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/generate-backup-codes",
						{
							method: "POST",
							body: generateBackupCodesBodySchema,
							use: [
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"sessionMiddleware"
								],
							],
							metadata: {
								openapi: {
									description:
										"Generate new backup codes for two-factor authentication",
									responses: {
										200: {
											description: "Backup codes generated successfully",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															status: {
																type: "boolean",
																description:
																	"Indicates if the backup codes were generated successfully",
																enum: [true],
															},
															backupCodes: {
																type: "array",
																items: {
																	type: "string",
																},
																description:
																	"Array of generated backup codes in plain text",
															},
														},
														required: ["status", "backupCodes"],
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							const user = ctx.context.session.user;
							if (!user.twoFactorEnabled)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].TWO_FACTOR_NOT_ENABLED,
								);
							await ctx.context.password.checkPassword(user.id, ctx);
							const twoFactor = await ctx.context.adapter.findOne({
								model: twoFactorTable,
								where: [
									{
										field: "userId",
										value: user.id,
									},
								],
							});
							if (!twoFactor)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].TWO_FACTOR_NOT_ENABLED,
								);
							const backupCodes = await generateBackupCodes(
								ctx.context.secretConfig,
								opts,
							);
							await ctx.context.adapter.update({
								model: twoFactorTable,
								update: {
									backupCodes: backupCodes.encryptedBackupCodes,
								},
								where: [
									{
										field: "id",
										value: twoFactor.id,
									},
								],
							});
							return ctx.json({
								status: true,
								backupCodes: backupCodes.backupCodes,
							});
						},
					),
					viewBackupCodes: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						{
							method: "POST",
							body: viewBackupCodesBodySchema,
						},
						async (ctx) => {
							const twoFactor = await ctx.context.adapter.findOne({
								model: twoFactorTable,
								where: [
									{
										field: "userId",
										value: ctx.body.userId,
									},
								],
							});
							if (!twoFactor)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].BACKUP_CODES_NOT_ENABLED,
								);
							const decryptedBackupCodes = await getBackupCodes(
								twoFactor.backupCodes,
								ctx.context.secretConfig,
								opts,
							);
							if (!decryptedBackupCodes)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].INVALID_BACKUP_CODE,
								);
							return ctx.json({
								status: true,
								backupCodes: decryptedBackupCodes,
							});
						},
					),
				},
			};
		};
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/utils.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["defaultKeyHasher", () => defaultKeyHasher]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/base64.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hash.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/utils.ts
		const defaultKeyHasher = async (token) => {
			const hash = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createHash"
			])("SHA-256").digest(new TextEncoder().encode(token));
			return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"base64Url"
			].encode(new Uint8Array(hash), {
				padding: false,
			});
		};
		//# sourceMappingURL=utils.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/otp/index.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["otp2fa", () => otp2fa]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/buffer.mjs [middleware] (ecmascript)",
			);
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/verify-two-factor.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/utils.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/otp/index.ts
		const verifyOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					description: 'The otp code to verify. Eg: "012345"',
				}),
				trustDevice:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]()
						.optional()
						.meta({
							description:
								"If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true",
						}),
			});
		const send2FaOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				trustDevice:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]()
						.optional()
						.meta({
							description:
								"If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true",
						}),
			}).optional();
		/**
		 * The otp adapter is created from the totp adapter.
		 */ const otp2fa = (options) => {
			const opts = {
				storeOTP: "plain",
				digits: 6,
				...options,
				period: (options?.period || 3) * 60 * 1e3,
			};
			async function storeOTP(ctx, otp) {
				if (opts.storeOTP === "hashed")
					return await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"defaultKeyHasher"
					])(otp);
				if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP)
					return await opts.storeOTP.hash(otp);
				if (typeof opts.storeOTP === "object" && "encrypt" in opts.storeOTP)
					return await opts.storeOTP.encrypt(otp);
				if (opts.storeOTP === "encrypted")
					return await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"symmetricEncrypt"
					])({
						key: ctx.context.secretConfig,
						data: otp,
					});
				return otp;
			}
			async function decryptOrHashForComparison(ctx, storedOtp, userInput) {
				if (opts.storeOTP === "hashed")
					return [
						storedOtp,
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"defaultKeyHasher"
						])(userInput),
					];
				if (opts.storeOTP === "encrypted")
					return [
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"symmetricDecrypt"
						])({
							key: ctx.context.secretConfig,
							data: storedOtp,
						}),
						userInput,
					];
				if (typeof opts.storeOTP === "object" && "encrypt" in opts.storeOTP)
					return [await opts.storeOTP.decrypt(storedOtp), userInput];
				if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP)
					return [storedOtp, await opts.storeOTP.hash(userInput)];
				return [storedOtp, userInput];
			}
			return {
				id: "otp",
				endpoints: {
					sendTwoFactorOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/send-otp",
						{
							method: "POST",
							body: send2FaOTPBodySchema,
							metadata: {
								openapi: {
									summary: "Send two factor OTP",
									description: "Send two factor OTP to the user",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															status: {
																type: "boolean",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							if (!options || !options.sendOTP) {
								ctx.context.logger.error(
									"send otp isn't configured. Please configure the send otp function on otp options.",
								);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from("BAD_REQUEST", {
									message: "otp isn't configured",
									code: "OTP_NOT_CONFIGURED",
								});
							}
							const { session, key } = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"verifyTwoFactor"
							])(ctx);
							const code = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"generateRandomString"
							])(opts.digits, "0-9");
							const hashedCode = await storeOTP(ctx, code);
							await ctx.context.internalAdapter.createVerificationValue({
								value: `${hashedCode}:0`,
								identifier: `2fa-otp-${key}`,
								expiresAt: new Date(Date.now() + opts.period),
							});
							const sendOTPResult = options.sendOTP(
								{
									user: session.user,
									otp: code,
								},
								ctx,
							);
							if (sendOTPResult instanceof Promise)
								await ctx.context.runInBackgroundOrAwait(
									sendOTPResult.catch((e) => {
										ctx.context.logger.error(
											"Failed to send two-factor OTP",
											e,
										);
									}),
								);
							return ctx.json({
								status: true,
							});
						},
					),
					verifyTwoFactorOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/verify-otp",
						{
							method: "POST",
							body: verifyOTPBodySchema,
							metadata: {
								openapi: {
									summary: "Verify two factor OTP",
									description: "Verify two factor OTP",
									responses: {
										200: {
											description: "Two-factor OTP verified successfully",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															token: {
																type: "string",
																description:
																	"Session token for the authenticated session",
															},
															user: {
																type: "object",
																properties: {
																	id: {
																		type: "string",
																		description:
																			"Unique identifier of the user",
																	},
																	email: {
																		type: "string",
																		format: "email",
																		nullable: true,
																		description: "User's email address",
																	},
																	emailVerified: {
																		type: "boolean",
																		nullable: true,
																		description:
																			"Whether the email is verified",
																	},
																	name: {
																		type: "string",
																		nullable: true,
																		description: "User's name",
																	},
																	image: {
																		type: "string",
																		format: "uri",
																		nullable: true,
																		description: "User's profile image URL",
																	},
																	createdAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the user was created",
																	},
																	updatedAt: {
																		type: "string",
																		format: "date-time",
																		description:
																			"Timestamp when the user was last updated",
																	},
																},
																required: ["id", "createdAt", "updatedAt"],
																description: "The authenticated user object",
															},
														},
														required: ["token", "user"],
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							const { session, key, valid, invalid } = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"verifyTwoFactor"
							])(ctx);
							const toCheckOtp =
								await ctx.context.internalAdapter.findVerificationValue(
									`2fa-otp-${key}`,
								);
							const [otp, counter] = toCheckOtp?.value?.split(":") ?? [];
							if (
								!toCheckOtp ||
								toCheckOtp.expiresAt < /* @__PURE__ */ new Date()
							) {
								if (toCheckOtp)
									await ctx.context.internalAdapter.deleteVerificationByIdentifier(
										`2fa-otp-${key}`,
									);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].OTP_HAS_EXPIRED,
								);
							}
							const allowedAttempts = options?.allowedAttempts || 5;
							if (parseInt(counter) >= allowedAttempts) {
								await ctx.context.internalAdapter.deleteVerificationByIdentifier(
									`2fa-otp-${key}`,
								);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE,
								);
							}
							const [storedValue, inputValue] =
								await decryptOrHashForComparison(ctx, otp, ctx.body.code);
							if (
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"constantTimeEqual"
								])(
									new TextEncoder().encode(storedValue),
									new TextEncoder().encode(inputValue),
								)
							) {
								if (!session.user.twoFactorEnabled) {
									if (!session.session)
										throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
											"APIError"
										].from(
											"BAD_REQUEST",
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
												"BASE_ERROR_CODES"
											].FAILED_TO_CREATE_SESSION,
										);
									const updatedUser =
										await ctx.context.internalAdapter.updateUser(
											session.user.id,
											{
												twoFactorEnabled: true,
											},
										);
									const newSession =
										await ctx.context.internalAdapter.createSession(
											session.user.id,
											false,
											session.session,
										);
									await ctx.context.internalAdapter.deleteSession(
										session.session.token,
									);
									await (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
										"setSessionCookie"
									])(ctx, {
										session: newSession,
										user: updatedUser,
									});
									return ctx.json({
										token: newSession.token,
										user: (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"parseUserOutput"
										])(ctx.context.options, updatedUser),
									});
								}
								return valid(ctx);
							} else {
								await ctx.context.internalAdapter.updateVerificationByIdentifier(
									`2fa-otp-${key}`,
									{
										value: `${otp}:${(parseInt(counter, 10) || 0) + 1}`,
									},
								);
								return invalid("INVALID_CODE");
							}
						},
					),
				},
			};
		};
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/schema.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["schema", () => schema]);
		//#region src/plugins/two-factor/schema.ts
		const schema = {
			user: {
				fields: {
					twoFactorEnabled: {
						type: "boolean",
						required: false,
						defaultValue: false,
						input: false,
					},
				},
			},
			twoFactor: {
				fields: {
					secret: {
						type: "string",
						required: true,
						returned: false,
						index: true,
					},
					backupCodes: {
						type: "string",
						required: true,
						returned: false,
					},
					userId: {
						type: "string",
						required: true,
						returned: false,
						references: {
							model: "user",
							field: "id",
						},
						index: true,
					},
				},
			},
		};
		//# sourceMappingURL=schema.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/totp/index.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["totp2fa", () => totp2fa]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/cookies/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/routes/session.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/verify-two-factor.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/otp.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/totp/index.ts
		const generateTOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				secret:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "The secret to generate the TOTP code",
					}),
			});
		const getTOTPURIBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				password:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "User password",
					}),
			});
		const verifyTOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					description: 'The otp code to verify. Eg: "012345"',
				}),
				trustDevice:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"boolean"
					]()
						.meta({
							description:
								"If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true",
						})
						.optional(),
			});
		const totp2fa = (options) => {
			const opts = {
				...options,
				digits: options?.digits || 6,
				period: options?.period || 30,
			};
			const twoFactorTable = "twoFactor";
			return {
				id: "totp",
				endpoints: {
					generateTOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						{
							method: "POST",
							body: generateTOTPBodySchema,
							metadata: {
								openapi: {
									summary: "Generate TOTP code",
									description: "Use this endpoint to generate a TOTP code",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															code: {
																type: "string",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							if (options?.disable) {
								ctx.context.logger.error(
									"totp isn't configured. please pass totp option on two factor plugin to enable totp",
								);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from("BAD_REQUEST", {
									message: "totp isn't configured",
									code: "TOTP_NOT_CONFIGURED",
								});
							}
							return {
								code: await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"createOTP"
								])(ctx.body.secret, {
									period: opts.period,
									digits: opts.digits,
								}).totp(),
							};
						},
					),
					getTOTPURI: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/get-totp-uri",
						{
							method: "POST",
							use: [
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"sessionMiddleware"
								],
							],
							body: getTOTPURIBodySchema,
							metadata: {
								openapi: {
									summary: "Get TOTP URI",
									description: "Use this endpoint to get the TOTP URI",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															totpURI: {
																type: "string",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							if (options?.disable) {
								ctx.context.logger.error(
									"totp isn't configured. please pass totp option on two factor plugin to enable totp",
								);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from("BAD_REQUEST", {
									message: "totp isn't configured",
									code: "TOTP_NOT_CONFIGURED",
								});
							}
							const user = ctx.context.session.user;
							const twoFactor = await ctx.context.adapter.findOne({
								model: twoFactorTable,
								where: [
									{
										field: "userId",
										value: user.id,
									},
								],
							});
							if (!twoFactor)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].TOTP_NOT_ENABLED,
								);
							const secret = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"symmetricDecrypt"
							])({
								key: ctx.context.secretConfig,
								data: twoFactor.secret,
							});
							await ctx.context.password.checkPassword(user.id, ctx);
							return {
								totpURI: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"createOTP"
								])(secret, {
									digits: opts.digits,
									period: opts.period,
								}).url(options?.issuer || ctx.context.appName, user.email),
							};
						},
					),
					verifyTOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/verify-totp",
						{
							method: "POST",
							body: verifyTOTPBodySchema,
							metadata: {
								openapi: {
									summary: "Verify two factor TOTP",
									description: "Verify two factor TOTP",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															status: {
																type: "boolean",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							if (options?.disable) {
								ctx.context.logger.error(
									"totp isn't configured. please pass totp option on two factor plugin to enable totp",
								);
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from("BAD_REQUEST", {
									message: "totp isn't configured",
									code: "TOTP_NOT_CONFIGURED",
								});
							}
							const { session, valid, invalid } = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$verify$2d$two$2d$factor$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"verifyTwoFactor"
							])(ctx);
							const user = session.user;
							const twoFactor = await ctx.context.adapter.findOne({
								model: twoFactorTable,
								where: [
									{
										field: "userId",
										value: user.id,
									},
								],
							});
							if (!twoFactor)
								throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"APIError"
								].from(
									"BAD_REQUEST",
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_ERROR_CODES"
									].TOTP_NOT_ENABLED,
								);
							if (
								!(await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"createOTP"
								])(
									await (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
										"symmetricDecrypt"
									])({
										key: ctx.context.secretConfig,
										data: twoFactor.secret,
									}),
									{
										period: opts.period,
										digits: opts.digits,
									},
								).verify(ctx.body.code))
							)
								return invalid("INVALID_CODE");
							if (!user.twoFactorEnabled) {
								if (!session.session)
									throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
										"APIError"
									].from(
										"BAD_REQUEST",
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"BASE_ERROR_CODES"
										].FAILED_TO_CREATE_SESSION,
									);
								const updatedUser =
									await ctx.context.internalAdapter.updateUser(user.id, {
										twoFactorEnabled: true,
									});
								const newSession = await ctx.context.internalAdapter
									.createSession(user.id, false, session.session)
									.catch((e) => {
										throw e;
									});
								await ctx.context.internalAdapter.deleteSession(
									session.session.token,
								);
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"setSessionCookie"
								])(ctx, {
									session: newSession,
									user: updatedUser,
								});
							}
							return valid(ctx);
						},
					),
				},
			};
		};
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s(["twoFactor", () => twoFactor]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/routes/session.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/password.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/error-code.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$client$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/client.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/constant.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$backup$2d$codes$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/backup-codes/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$otp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/otp/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$totp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/two-factor/totp/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hmac.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/otp.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/two-factor/index.ts
		const enableTwoFactorBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				password:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "User password",
					}),
				issuer:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]()
						.meta({
							description: "Custom issuer for the TOTP URI",
						})
						.optional(),
			});
		const disableTwoFactorBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				password:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "User password",
					}),
			});
		const twoFactor = (options) => {
			const opts = {
				twoFactorTable: "twoFactor",
			};
			const trustDeviceMaxAge =
				options?.trustDeviceMaxAge ??
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"TRUST_DEVICE_COOKIE_MAX_AGE"
				];
			const backupCodeOptions = {
				storeBackupCodes: "encrypted",
				...options?.backupCodeOptions,
			};
			const totp = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$totp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"totp2fa"
			])(options?.totpOptions);
			const backupCode = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$backup$2d$codes$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"backupCode2fa"
			])(backupCodeOptions);
			const otp = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$otp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"otp2fa"
			])(options?.otpOptions);
			return {
				id: "two-factor",
				endpoints: {
					...totp.endpoints,
					...otp.endpoints,
					...backupCode.endpoints,
					enableTwoFactor: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/enable",
						{
							method: "POST",
							body: enableTwoFactorBodySchema,
							use: [
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"sessionMiddleware"
								],
							],
							metadata: {
								openapi: {
									summary: "Enable two factor authentication",
									description:
										"Use this endpoint to enable two factor authentication. This will generate a TOTP URI and backup codes. Once the user verifies the TOTP URI, the two factor authentication will be enabled.",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															totpURI: {
																type: "string",
																description: "TOTP URI",
															},
															backupCodes: {
																type: "array",
																items: {
																	type: "string",
																},
																description: "Backup codes",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							const user = ctx.context.session.user;
							const { password, issuer } = ctx.body;
							if (
								!(await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"validatePassword"
								])(ctx, {
									password,
									userId: user.id,
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
							const secret = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"generateRandomString"
							])(32);
							const encryptedSecret = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"symmetricEncrypt"
							])({
								key: ctx.context.secretConfig,
								data: secret,
							});
							const backupCodes = await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$backup$2d$codes$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"generateBackupCodes"
							])(ctx.context.secretConfig, backupCodeOptions);
							if (options?.skipVerificationOnEnable) {
								const updatedUser =
									await ctx.context.internalAdapter.updateUser(user.id, {
										twoFactorEnabled: true,
									});
								/**
								 * Update the session cookie with the new user data
								 */ await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"setSessionCookie"
								])(ctx, {
									session: await ctx.context.internalAdapter.createSession(
										updatedUser.id,
										false,
										ctx.context.session.session,
									),
									user: updatedUser,
								});
								await ctx.context.internalAdapter.deleteSession(
									ctx.context.session.session.token,
								);
							}
							await ctx.context.adapter.deleteMany({
								model: opts.twoFactorTable,
								where: [
									{
										field: "userId",
										value: user.id,
									},
								],
							});
							await ctx.context.adapter.create({
								model: opts.twoFactorTable,
								data: {
									secret: encryptedSecret,
									backupCodes: backupCodes.encryptedBackupCodes,
									userId: user.id,
								},
							});
							const totpURI = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"createOTP"
							])(secret, {
								digits: options?.totpOptions?.digits || 6,
								period: options?.totpOptions?.period,
							}).url(
								issuer || options?.issuer || ctx.context.appName,
								user.email,
							);
							return ctx.json({
								totpURI,
								backupCodes: backupCodes.backupCodes,
							});
						},
					),
					disableTwoFactor: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createAuthEndpoint"
					])(
						"/two-factor/disable",
						{
							method: "POST",
							body: disableTwoFactorBodySchema,
							use: [
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"sessionMiddleware"
								],
							],
							metadata: {
								openapi: {
									summary: "Disable two factor authentication",
									description:
										"Use this endpoint to disable two factor authentication.",
									responses: {
										200: {
											description: "Successful response",
											content: {
												"application/json": {
													schema: {
														type: "object",
														properties: {
															status: {
																type: "boolean",
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						async (ctx) => {
							const user = ctx.context.session.user;
							const { password } = ctx.body;
							if (
								!(await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"validatePassword"
								])(ctx, {
									password,
									userId: user.id,
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
							const updatedUser = await ctx.context.internalAdapter.updateUser(
								user.id,
								{
									twoFactorEnabled: false,
								},
							);
							await ctx.context.adapter.delete({
								model: opts.twoFactorTable,
								where: [
									{
										field: "userId",
										value: updatedUser.id,
									},
								],
							});
							/**
							 * Update the session cookie with the new user data
							 */ await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"setSessionCookie"
							])(ctx, {
								session: await ctx.context.internalAdapter.createSession(
									updatedUser.id,
									false,
									ctx.context.session.session,
								),
								user: updatedUser,
							});
							await ctx.context.internalAdapter.deleteSession(
								ctx.context.session.session.token,
							);
							const disableTrustCookie = ctx.context.createAuthCookie(
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"TRUST_DEVICE_COOKIE_NAME"
								],
								{
									maxAge: trustDeviceMaxAge,
								},
							);
							const disableTrustValue = await ctx.getSignedCookie(
								disableTrustCookie.name,
								ctx.context.secret,
							);
							if (disableTrustValue) {
								const [, trustId] = disableTrustValue.split("!");
								if (trustId)
									await ctx.context.internalAdapter.deleteVerificationByIdentifier(
										trustId,
									);
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"expireCookie"
								])(ctx, disableTrustCookie);
							}
							return ctx.json({
								status: true,
							});
						},
					),
				},
				options,
				hooks: {
					after: [
						{
							matcher(context) {
								return (
									context.path === "/sign-in/email" ||
									context.path === "/sign-in/username" ||
									context.path === "/sign-in/phone-number"
								);
							},
							handler: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"createAuthMiddleware"
							])(async (ctx) => {
								const data = ctx.context.newSession;
								if (!data) return;
								if (!data?.user.twoFactorEnabled) return;
								const trustDeviceCookieAttrs = ctx.context.createAuthCookie(
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TRUST_DEVICE_COOKIE_NAME"
									],
									{
										maxAge: trustDeviceMaxAge,
									},
								);
								const trustDeviceCookie = await ctx.getSignedCookie(
									trustDeviceCookieAttrs.name,
									ctx.context.secret,
								);
								if (trustDeviceCookie) {
									const [token, trustIdentifier] = trustDeviceCookie.split("!");
									if (token && trustIdentifier) {
										if (
											token ===
											(await (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
												"createHMAC"
											])("SHA-256", "base64urlnopad").sign(
												ctx.context.secret,
												`${data.user.id}!${trustIdentifier}`,
											))
										) {
											const verificationRecord =
												await ctx.context.internalAdapter.findVerificationValue(
													trustIdentifier,
												);
											if (
												verificationRecord &&
												verificationRecord.value === data.user.id &&
												verificationRecord.expiresAt >
													/* @__PURE__ */ new Date()
											) {
												await ctx.context.internalAdapter.deleteVerificationByIdentifier(
													trustIdentifier,
												);
												const newTrustIdentifier = `trust-device-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomString"])(32)}`;
												const newToken = await (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
													"createHMAC"
												])("SHA-256", "base64urlnopad").sign(
													ctx.context.secret,
													`${data.user.id}!${newTrustIdentifier}`,
												);
												await ctx.context.internalAdapter.createVerificationValue(
													{
														value: data.user.id,
														identifier: newTrustIdentifier,
														expiresAt: new Date(
															Date.now() + trustDeviceMaxAge * 1e3,
														),
													},
												);
												const newTrustDeviceCookie =
													ctx.context.createAuthCookie(
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
															"TRUST_DEVICE_COOKIE_NAME"
														],
														{
															maxAge: trustDeviceMaxAge,
														},
													);
												await ctx.setSignedCookie(
													newTrustDeviceCookie.name,
													`${newToken}!${newTrustIdentifier}`,
													ctx.context.secret,
													trustDeviceCookieAttrs.attributes,
												);
												return;
											}
										}
									}
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
										"expireCookie"
									])(ctx, trustDeviceCookieAttrs);
								}
								/**
								 * remove the session cookie. It's set by the sign in credential
								 */ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
									"deleteSessionCookie"
								])(ctx, true);
								await ctx.context.internalAdapter.deleteSession(
									data.session.token,
								);
								const maxAge = options?.twoFactorCookieMaxAge ?? 600;
								const twoFactorCookie = ctx.context.createAuthCookie(
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$constant$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"TWO_FACTOR_COOKIE_NAME"
									],
									{
										maxAge,
									},
								);
								const identifier = `2fa-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomString"])(20)}`;
								await ctx.context.internalAdapter.createVerificationValue({
									value: data.user.id,
									identifier,
									expiresAt: new Date(Date.now() + maxAge * 1e3),
								});
								await ctx.setSignedCookie(
									twoFactorCookie.name,
									identifier,
									ctx.context.secret,
									twoFactorCookie.attributes,
								);
								return ctx.json({
									twoFactorRedirect: true,
								});
							}),
						},
					],
				},
				schema: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"mergeSchema"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"schema"
					],
					{
						...options?.schema,
						twoFactor: {
							...options?.schema?.twoFactor,
							...(options?.twoFactorTable
								? {
										modelName: options.twoFactorTable,
									}
								: {}),
						},
					},
				),
				rateLimit: [
					{
						pathMatcher(path) {
							return path.startsWith("/two-factor/");
						},
						window: 10,
						max: 3,
					},
				],
				$ERROR_CODES:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$two$2d$factor$2f$error$2d$code$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"TWO_FACTOR_ERROR_CODES"
					],
			};
		};
		//# sourceMappingURL=index.mjs.map
	},
];

//# sourceMappingURL=d0383_better-auth_dist_plugins_two-factor_dbffe531._.js.map
