module.exports = [
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/error-codes.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"EMAIL_OTP_ERROR_CODES",
			() => EMAIL_OTP_ERROR_CODES,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/error-codes.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/email-otp/error-codes.ts
		const EMAIL_OTP_ERROR_CODES = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
			"defineErrorCodes"
		])({
			OTP_EXPIRED: "OTP expired",
			INVALID_OTP: "Invalid OTP",
			TOO_MANY_ATTEMPTS: "Too many attempts",
		});
		//# sourceMappingURL=error-codes.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/utils.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"defaultKeyHasher",
			() => defaultKeyHasher,
			"splitAtLastColon",
			() => splitAtLastColon,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/base64.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hash.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/email-otp/utils.ts
		const defaultKeyHasher = async (otp) => {
			const hash = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createHash"
			])("SHA-256").digest(new TextEncoder().encode(otp));
			return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"base64Url"
			].encode(new Uint8Array(hash), {
				padding: false,
			});
		};
		function splitAtLastColon(input) {
			const idx = input.lastIndexOf(":");
			if (idx === -1) return [input, ""];
			return [input.slice(0, idx), input.slice(idx + 1)];
		}
		//# sourceMappingURL=utils.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/otp-token.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"storeOTP",
			() => storeOTP,
			"verifyStoredOTP",
			() => verifyStoredOTP,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/buffer.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/utils.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/email-otp/otp-token.ts
		async function storeOTP(ctx, opts, otp) {
			if (opts.storeOTP === "encrypted")
				return await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"symmetricEncrypt"
				])({
					key: ctx.context.secretConfig,
					data: otp,
				});
			if (opts.storeOTP === "hashed")
				return await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"defaultKeyHasher"
				])(otp);
			if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP)
				return await opts.storeOTP.hash(otp);
			if (typeof opts.storeOTP === "object" && "encrypt" in opts.storeOTP)
				return await opts.storeOTP.encrypt(otp);
			return otp;
		}
		async function verifyStoredOTP(ctx, opts, storedOtp, otp) {
			if (opts.storeOTP === "encrypted")
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"constantTimeEqual"
				])(
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"symmetricDecrypt"
					])({
						key: ctx.context.secretConfig,
						data: storedOtp,
					}),
					otp,
				);
			if (opts.storeOTP === "hashed")
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"constantTimeEqual"
				])(
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"defaultKeyHasher"
					])(otp),
					storedOtp,
				);
			if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP)
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"constantTimeEqual"
				])(await opts.storeOTP.hash(otp), storedOtp);
			if (typeof opts.storeOTP === "object" && "decrypt" in opts.storeOTP)
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"constantTimeEqual"
				])(await opts.storeOTP.decrypt(storedOtp), otp);
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"constantTimeEqual"
			])(otp, storedOtp);
		}
		//# sourceMappingURL=otp-token.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/routes.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"changeEmailEmailOTP",
			() => changeEmailEmailOTP,
			"checkVerificationOTP",
			() => checkVerificationOTP,
			"createVerificationOTP",
			() => createVerificationOTP,
			"forgetPasswordEmailOTP",
			() => forgetPasswordEmailOTP,
			"getVerificationOTP",
			() => getVerificationOTP,
			"requestEmailChangeEmailOTP",
			() => requestEmailChangeEmailOTP,
			"requestPasswordResetEmailOTP",
			() => requestPasswordResetEmailOTP,
			"resetPasswordEmailOTP",
			() => resetPasswordEmailOTP,
			"sendVerificationOTP",
			() => sendVerificationOTP,
			"signInEmailOTP",
			() => signInEmailOTP,
			"verifyEmailOTP",
			() => verifyEmailOTP,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/date.mjs [middleware] (ecmascript)",
			);
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/api/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/error-codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/utils.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/otp-token.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$deprecate$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/deprecate.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js [middleware] (ecmascript)",
			);
		//#region src/plugins/email-otp/routes.ts
		const types = [
			"email-verification",
			"sign-in",
			"forget-password",
			"change-email",
		];
		const sendVerificationOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]({}).meta({
						description: "Email address to send the OTP",
					}),
				type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"enum"
				](types).meta({
					description: "Type of the OTP",
				}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/send-verification-otp`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.sendVerificationOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.sendVerificationOtp`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-email-otp-send-verification-otp)
		 */ const sendVerificationOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/send-verification-otp",
				{
					method: "POST",
					body: sendVerificationOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "sendEmailVerificationOTP",
							description: "Send a verification OTP to an email",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
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
					if (!opts?.sendVerificationOTP) {
						ctx.context.logger.error(
							"send email verification is not implemented",
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "send email verification is not implemented",
						});
					}
					const email = ctx.body.email.toLowerCase();
					if (
						!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"email"
						]().safeParse(email).success
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].INVALID_EMAIL,
						);
					if (ctx.body.type === "change-email") {
						ctx.context.logger.error(
							"Use the /email-otp/request-email-change endpoint to send OTP for changing email",
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Invalid OTP type",
						});
					}
					const otp =
						opts.generateOTP(
							{
								email,
								type: ctx.body.type,
							},
							ctx,
						) || defaultOTPGenerator(opts);
					const storedOTP = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"storeOTP"
					])(ctx, opts, otp);
					await ctx.context.internalAdapter
						.createVerificationValue({
							value: `${storedOTP}:0`,
							identifier: `${ctx.body.type}-otp-${email}`,
							expiresAt: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"getDate"
							])(opts.expiresIn, "sec"),
						})
						.catch(async (error) => {
							await ctx.context.internalAdapter.deleteVerificationByIdentifier(
								`${ctx.body.type}-otp-${email}`,
							);
							await ctx.context.internalAdapter.createVerificationValue({
								value: `${storedOTP}:0`,
								identifier: `${ctx.body.type}-otp-${email}`,
								expiresAt: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getDate"
								])(opts.expiresIn, "sec"),
							});
						});
					if (!(await ctx.context.internalAdapter.findUserByEmail(email)))
						if (ctx.body.type === "sign-in" && !opts.disableSignUp) {
						} else {
							await ctx.context.internalAdapter.deleteVerificationByIdentifier(
								`${ctx.body.type}-otp-${email}`,
							);
							return ctx.json({
								success: true,
							});
						}
					await ctx.context.runInBackgroundOrAwait(
						opts.sendVerificationOTP(
							{
								email,
								otp,
								type: ctx.body.type,
							},
							ctx,
						),
					);
					return ctx.json({
						success: true,
					});
				},
			);
		const createVerificationOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]({}).meta({
						description: "Email address to send the OTP",
					}),
				type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"enum"
				](types).meta({
					required: true,
					description: "Type of the OTP",
				}),
			});
		const createVerificationOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				{
					method: "POST",
					body: createVerificationOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "createEmailVerificationOTP",
							description: "Create a verification OTP for an email",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "string",
											},
										},
									},
								},
							},
						},
					},
				},
				async (ctx) => {
					const email = ctx.body.email.toLowerCase();
					const otp =
						opts.generateOTP(
							{
								email,
								type: ctx.body.type,
							},
							ctx,
						) || defaultOTPGenerator(opts);
					const storedOTP = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"storeOTP"
					])(ctx, opts, otp);
					await ctx.context.internalAdapter.createVerificationValue({
						value: `${storedOTP}:0`,
						identifier: `${ctx.body.type}-otp-${email}`,
						expiresAt: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getDate"
						])(opts.expiresIn, "sec"),
					});
					return otp;
				},
			);
		const getVerificationOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]({}).meta({
						description: "Email address the OTP was sent to",
					}),
				type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"enum"
				](types).meta({
					required: true,
					description: "Type of the OTP",
				}),
			});
		/**
		 * ### Endpoint
		 *
		 * GET `/email-otp/get-verification-otp`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.getVerificationOTP`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-email-otp-get-verification-otp)
		 */ const getVerificationOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				{
					method: "GET",
					query: getVerificationOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "getEmailVerificationOTP",
							description: "Get a verification OTP for an email",
							responses: {
								200: {
									description:
										"OTP retrieved successfully or not found/expired",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													otp: {
														type: "string",
														nullable: true,
														description:
															"The stored OTP, or null if not found or expired",
													},
												},
												required: ["otp"],
											},
										},
									},
								},
							},
						},
					},
				},
				async (ctx) => {
					const email = ctx.query.email.toLowerCase();
					const verificationValue =
						await ctx.context.internalAdapter.findVerificationValue(
							`${ctx.query.type}-otp-${email}`,
						);
					if (
						!verificationValue ||
						verificationValue.expiresAt < /* @__PURE__ */ new Date()
					)
						return ctx.json({
							otp: null,
						});
					if (
						opts.storeOTP === "hashed" ||
						(typeof opts.storeOTP === "object" && "hash" in opts.storeOTP)
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "OTP is hashed, cannot return the plain text OTP",
						});
					const [storedOtp, _attempts] = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"splitAtLastColon"
					])(verificationValue.value);
					let otp = storedOtp;
					if (opts.storeOTP === "encrypted")
						otp = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"symmetricDecrypt"
						])({
							key: ctx.context.secretConfig,
							data: storedOtp,
						});
					if (typeof opts.storeOTP === "object" && "decrypt" in opts.storeOTP)
						otp = await opts.storeOTP.decrypt(storedOtp);
					return ctx.json({
						otp,
					});
				},
			);
		const checkVerificationOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "Email address the OTP was sent to",
					}),
				type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"enum"
				](types).meta({
					required: true,
					description: "Type of the OTP",
				}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					required: true,
					description: "OTP to verify",
				}),
			});
		/**
		 * ### Endpoint
		 *
		 * GET `/email-otp/check-verification-otp`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.checkVerificationOTP`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-email-otp-check-verification-otp)
		 */ const checkVerificationOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/check-verification-otp",
				{
					method: "POST",
					body: checkVerificationOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "verifyEmailWithOTP",
							description: "Verify an email with an OTP",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
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
					const email = ctx.body.email.toLowerCase();
					if (
						!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"email"
						]().safeParse(email).success
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].INVALID_EMAIL,
						);
					if (!(await ctx.context.internalAdapter.findUserByEmail(email)))
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].USER_NOT_FOUND,
						);
					const verificationValue =
						await ctx.context.internalAdapter.findVerificationValue(
							`${ctx.body.type}-otp-${email}`,
						);
					if (!verificationValue)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].INVALID_OTP,
						);
					const otpIdentifier = `${ctx.body.type}-otp-${email}`;
					if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							otpIdentifier,
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].OTP_EXPIRED,
						);
					}
					const [otpValue, attempts] = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"splitAtLastColon"
					])(verificationValue.value);
					const allowedAttempts = opts?.allowedAttempts || 3;
					if (attempts && parseInt(attempts) >= allowedAttempts) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							otpIdentifier,
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"FORBIDDEN",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].TOO_MANY_ATTEMPTS,
						);
					}
					if (
						!(await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"verifyStoredOTP"
						])(ctx, opts, otpValue, ctx.body.otp))
					) {
						await ctx.context.internalAdapter.updateVerificationByIdentifier(
							otpIdentifier,
							{
								value: `${otpValue}:${parseInt(attempts || "0") + 1}`,
							},
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].INVALID_OTP,
						);
					}
					return ctx.json({
						success: true,
					});
				},
			);
		const verifyEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]({}).meta({
						description: "Email address to verify",
					}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					required: true,
					description: "OTP to verify",
				}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/verify-email`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.verifyEmailOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.verifyEmail`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-email-otp-verify-email)
		 */ const verifyEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/verify-email",
				{
					method: "POST",
					body: verifyEmailOTPBodySchema,
					metadata: {
						openapi: {
							description: "Verify email with OTP",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													status: {
														type: "boolean",
														description:
															"Indicates if the verification was successful",
														enum: [true],
													},
													token: {
														type: "string",
														nullable: true,
														description:
															"Session token if autoSignInAfterVerification is enabled, otherwise null",
													},
													user: {
														$ref: "#/components/schemas/User",
													},
												},
												required: ["status", "token", "user"],
											},
										},
									},
								},
							},
						},
					},
				},
				async (ctx) => {
					const email = ctx.body.email.toLowerCase();
					if (
						!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"email"
						]().safeParse(email).success
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].INVALID_EMAIL,
						);
					await atomicVerifyOTP(
						ctx,
						opts,
						`email-verification-otp-${email}`,
						ctx.body.otp,
					);
					const user = await ctx.context.internalAdapter.findUserByEmail(email);
					if (!user)
						/**
						 * safe to leak the existence of a user, given the user has already the OTP from the
						 * email
						 */ throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].USER_NOT_FOUND,
						);
					if (ctx.context.options.emailVerification?.beforeEmailVerification)
						await ctx.context.options.emailVerification.beforeEmailVerification(
							user.user,
							ctx.request,
						);
					const updatedUser = await ctx.context.internalAdapter.updateUser(
						user.user.id,
						{
							email,
							emailVerified: true,
						},
					);
					await ctx.context.options.emailVerification?.afterEmailVerification?.(
						updatedUser,
						ctx.request,
					);
					if (
						ctx.context.options.emailVerification?.autoSignInAfterVerification
					) {
						const session = await ctx.context.internalAdapter.createSession(
							updatedUser.id,
						);
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"setSessionCookie"
						])(ctx, {
							session,
							user: updatedUser,
						});
						return ctx.json({
							status: true,
							token: session.token,
							user: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"parseUserOutput"
							])(ctx.context.options, updatedUser),
						});
					}
					const currentSession = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getSessionFromCtx"
					])(ctx);
					if (currentSession && updatedUser.emailVerified) {
						const dontRememberMeCookie = await ctx.getSignedCookie(
							ctx.context.authCookies.dontRememberToken.name,
							ctx.context.secret,
						);
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"setCookieCache"
						])(
							ctx,
							{
								session: currentSession.session,
								user: {
									...currentSession.user,
									emailVerified: true,
								},
							},
							!!dontRememberMeCookie,
						);
					}
					return ctx.json({
						status: true,
						token: null,
						user: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseUserOutput"
						])(ctx.context.options, updatedUser),
					});
				},
			);
		const signInEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]({}).meta({
						description: "Email address to sign in",
					}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					required: true,
					description: "OTP sent to the email",
				}),
				name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]()
					.meta({
						description:
							'User display name. Only used if the user is registering for the first time. Eg: "my-name"',
					})
					.optional(),
				image:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]()
						.meta({
							description:
								"User profile image URL. Only used if the user is registering for the first time.",
						})
						.optional(),
			}).and(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"record"
				](
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					](),
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"any"
					](),
				),
			);
		/**
		 * ### Endpoint
		 *
		 * POST `/sign-in/email-otp`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.signInEmailOTP`
		 *
		 * **client:**
		 * `authClient.signIn.emailOtp`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-sign-in-email-otp)
		 */ const signInEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/sign-in/email-otp",
				{
					method: "POST",
					body: signInEmailOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "signInWithEmailOTP",
							description: "Sign in with email and OTP",
							responses: {
								200: {
									description: "Success",
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
														$ref: "#/components/schemas/User",
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
					const { email: rawEmail, otp, name, image, ...rest } = ctx.body;
					const email = rawEmail.toLowerCase();
					await atomicVerifyOTP(ctx, opts, `sign-in-otp-${email}`, otp);
					const user = await ctx.context.internalAdapter.findUserByEmail(email);
					if (!user) {
						if (opts.disableSignUp)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"BAD_REQUEST",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"EMAIL_OTP_ERROR_CODES"
								].INVALID_OTP,
							);
						const additionalFields = (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseUserInput"
						])(ctx.context.options, rest, "create");
						const newUser = await ctx.context.internalAdapter.createUser({
							...additionalFields,
							email,
							emailVerified: true,
							name: name || "",
							image,
						});
						const session = await ctx.context.internalAdapter.createSession(
							newUser.id,
						);
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"setSessionCookie"
						])(ctx, {
							session,
							user: newUser,
						});
						return ctx.json({
							token: session.token,
							user: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"parseUserOutput"
							])(ctx.context.options, newUser),
						});
					}
					if (!user.user.emailVerified)
						await ctx.context.internalAdapter.updateUser(user.user.id, {
							emailVerified: true,
						});
					const session = await ctx.context.internalAdapter.createSession(
						user.user.id,
					);
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"setSessionCookie"
					])(ctx, {
						session,
						user: user.user,
					});
					return ctx.json({
						token: session.token,
						user: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseUserOutput"
						])(ctx.context.options, user.user),
					});
				},
			);
		const requestPasswordResetEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "Email address to send the OTP",
					}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/request-password-reset`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.requestPasswordResetEmailOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.requestPasswordReset`
		 *
		 * @see [Read our docs to learn more.](https://www.better-auth.com/docs/plugins/email-otp#reset-password-with-otp)
		 */ const requestPasswordResetEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/request-password-reset",
				{
					method: "POST",
					body: requestPasswordResetEmailOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "requestPasswordResetWithEmailOTP",
							description: "Request password reset with email and OTP",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
														type: "boolean",
														description:
															"Indicates if the OTP was sent successfully",
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
					const email = ctx.body.email;
					const otp =
						opts.generateOTP(
							{
								email,
								type: "forget-password",
							},
							ctx,
						) || defaultOTPGenerator(opts);
					const storedOTP = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"storeOTP"
					])(ctx, opts, otp);
					await ctx.context.internalAdapter.createVerificationValue({
						value: `${storedOTP}:0`,
						identifier: `forget-password-otp-${email}`,
						expiresAt: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getDate"
						])(opts.expiresIn, "sec"),
					});
					if (!(await ctx.context.internalAdapter.findUserByEmail(email))) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							`forget-password-otp-${email}`,
						);
						return ctx.json({
							success: true,
						});
					}
					await ctx.context.runInBackgroundOrAwait(
						opts.sendVerificationOTP(
							{
								email,
								otp,
								type: "forget-password",
							},
							ctx,
						),
					);
					return ctx.json({
						success: true,
					});
				},
			);
		const forgetPasswordEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "Email address to send the OTP",
					}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/forget-password/email-otp`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.forgetPasswordEmailOTP`
		 *
		 * **client:**
		 * `authClient.forgetPassword.emailOtp`
		 *
		 * @deprecated Use `/email-otp/request-password-reset` instead.
		 * @see [Read our docs to learn more.](https://www.better-auth.com/docs/plugins/email-otp#reset-password-with-otp)
		 */ const forgetPasswordEmailOTP = (opts) => {
			const warnDeprecation = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$deprecate$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"deprecate"
			])(
				() => {},
				'The "/forget-password/email-otp" endpoint is deprecated. Please use "/email-otp/request-password-reset" instead. This endpoint will be removed in the next major version.',
			);
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/forget-password/email-otp",
				{
					method: "POST",
					body: forgetPasswordEmailOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "forgetPasswordWithEmailOTP",
							description:
								"Deprecated: Use /email-otp/request-password-reset instead.",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
														type: "boolean",
														description:
															"Indicates if the OTP was sent successfully",
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
					warnDeprecation();
					const email = ctx.body.email;
					const otp =
						opts.generateOTP(
							{
								email,
								type: "forget-password",
							},
							ctx,
						) || defaultOTPGenerator(opts);
					const storedOTP = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"storeOTP"
					])(ctx, opts, otp);
					await ctx.context.internalAdapter.createVerificationValue({
						value: `${storedOTP}:0`,
						identifier: `forget-password-otp-${email}`,
						expiresAt: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getDate"
						])(opts.expiresIn, "sec"),
					});
					if (!(await ctx.context.internalAdapter.findUserByEmail(email))) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							`forget-password-otp-${email}`,
						);
						return ctx.json({
							success: true,
						});
					}
					await ctx.context.runInBackgroundOrAwait(
						opts.sendVerificationOTP(
							{
								email,
								otp,
								type: "forget-password",
							},
							ctx,
						),
					);
					return ctx.json({
						success: true,
					});
				},
			);
		};
		const resetPasswordEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				email:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "Email address to reset the password",
					}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					description: "OTP sent to the email",
				}),
				password:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "New password",
					}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/reset-password`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.resetPasswordEmailOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.resetPassword`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#api-method-email-otp-reset-password)
		 */ const resetPasswordEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/reset-password",
				{
					method: "POST",
					body: resetPasswordEmailOTPBodySchema,
					metadata: {
						openapi: {
							operationId: "resetPasswordWithEmailOTP",
							description: "Reset password with email and OTP",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
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
					const email = ctx.body.email;
					await atomicVerifyOTP(
						ctx,
						opts,
						`forget-password-otp-${email}`,
						ctx.body.otp,
					);
					const user = await ctx.context.internalAdapter.findUserByEmail(
						email,
						{
							includeAccounts: true,
						},
					);
					if (!user)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].USER_NOT_FOUND,
						);
					const minPasswordLength =
						ctx.context.password.config.minPasswordLength;
					if (ctx.body.password.length < minPasswordLength)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].PASSWORD_TOO_SHORT,
						);
					const maxPasswordLength =
						ctx.context.password.config.maxPasswordLength;
					if (ctx.body.password.length > maxPasswordLength)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].PASSWORD_TOO_LONG,
						);
					const passwordHash = await ctx.context.password.hash(
						ctx.body.password,
					);
					if (
						!user.accounts?.find(
							(account) => account.providerId === "credential",
						)
					)
						await ctx.context.internalAdapter.createAccount({
							userId: user.user.id,
							providerId: "credential",
							accountId: user.user.id,
							password: passwordHash,
						});
					else
						await ctx.context.internalAdapter.updatePassword(
							user.user.id,
							passwordHash,
						);
					if (ctx.context.options.emailAndPassword?.onPasswordReset)
						await ctx.context.options.emailAndPassword.onPasswordReset(
							{
								user: user.user,
							},
							ctx.request,
						);
					if (!user.user.emailVerified)
						await ctx.context.internalAdapter.updateUser(user.user.id, {
							emailVerified: true,
						});
					if (
						ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset
					)
						await ctx.context.internalAdapter.deleteSessions(user.user.id);
					return ctx.json({
						success: true,
					});
				},
			);
		const requestEmailChangeEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				newEmail:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "New email address to send the OTP",
					}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]()
					.optional()
					.meta({
						description:
							"OTP sent to the current email. This is required if changeEmail.verifyCurrentEmail option is set to true",
					}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/request-email-change`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.requestEmailChangeEmailOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.requestEmailChange`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#change-email-with-otp)
		 */ const requestEmailChangeEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/request-email-change",
				{
					method: "POST",
					body: requestEmailChangeEmailOTPBodySchema,
					use: [
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"sensitiveSessionMiddleware"
						],
					],
					metadata: {
						openapi: {
							operationId: "requestEmailChangeWithEmailOTP",
							description:
								"Request email change with verification OTP sent to the new email",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
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
					if (!opts.changeEmail?.enabled) {
						ctx.context.logger.error("Change email with OTP is disabled.");
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Change email with OTP is disabled",
						});
					}
					const email = ctx.context.session.user.email.toLowerCase();
					const newEmail = ctx.body.newEmail.toLowerCase();
					if (
						!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"email"
						]().safeParse(newEmail).success
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].INVALID_EMAIL,
						);
					if (newEmail === email) {
						ctx.context.logger.error("Email is the same");
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Email is the same",
						});
					}
					if (opts.changeEmail?.verifyCurrentEmail) {
						if (!ctx.body.otp)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].fromStatus("BAD_REQUEST", {
								message: "OTP is required to verify current email",
							});
						const currentEmailVerificationValue =
							await ctx.context.internalAdapter.findVerificationValue(
								`email-verification-otp-${email}`,
							);
						if (!currentEmailVerificationValue)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"BAD_REQUEST",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"EMAIL_OTP_ERROR_CODES"
								].INVALID_OTP,
							);
						const currentEmailIdentifier = `email-verification-otp-${email}`;
						if (
							currentEmailVerificationValue.expiresAt <
							/* @__PURE__ */ new Date()
						) {
							await ctx.context.internalAdapter.deleteVerificationByIdentifier(
								currentEmailIdentifier,
							);
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"BAD_REQUEST",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"EMAIL_OTP_ERROR_CODES"
								].OTP_EXPIRED,
							);
						}
						const [otpValue, attempts] = (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"splitAtLastColon"
						])(currentEmailVerificationValue.value);
						const allowedAttempts = opts?.allowedAttempts || 3;
						if (attempts && parseInt(attempts) >= allowedAttempts) {
							await ctx.context.internalAdapter.deleteVerificationByIdentifier(
								currentEmailIdentifier,
							);
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"FORBIDDEN",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"EMAIL_OTP_ERROR_CODES"
								].TOO_MANY_ATTEMPTS,
							);
						}
						if (
							!(await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"verifyStoredOTP"
							])(ctx, opts, otpValue, ctx.body.otp))
						) {
							await ctx.context.internalAdapter.updateVerificationByIdentifier(
								currentEmailIdentifier,
								{
									value: `${otpValue}:${parseInt(attempts || "0") + 1}`,
								},
							);
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"BAD_REQUEST",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"EMAIL_OTP_ERROR_CODES"
								].INVALID_OTP,
							);
						}
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							currentEmailIdentifier,
						);
					} else if (ctx.body.otp)
						ctx.context.logger.warn(
							"OTP provided but not required for verifying current email. If you want to require OTP verification for current email, please set the changeEmail.verifyCurrentEmail option to true in the configuration",
						);
					const otp =
						opts.generateOTP(
							{
								email: newEmail,
								type: "change-email",
							},
							ctx,
						) || defaultOTPGenerator(opts);
					const storedOTP = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"storeOTP"
					])(ctx, opts, otp);
					await ctx.context.internalAdapter.createVerificationValue({
						value: `${storedOTP}:0`,
						identifier: `change-email-otp-${email}-${newEmail}`,
						expiresAt: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getDate"
						])(opts.expiresIn, "sec"),
					});
					if (await ctx.context.internalAdapter.findUserByEmail(newEmail)) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							`change-email-otp-${email}-${newEmail}`,
						);
						return ctx.json({
							success: true,
						});
					}
					await ctx.context.runInBackgroundOrAwait(
						opts.sendVerificationOTP(
							{
								email: newEmail,
								otp,
								type: "change-email",
							},
							ctx,
						),
					);
					return ctx.json({
						success: true,
					});
				},
			);
		const changeEmailEmailOTPBodySchema =
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
				"object"
			]({
				newEmail:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"string"
					]().meta({
						description: "New email address to verify and change to",
					}),
				otp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
					"string"
				]().meta({
					description: "OTP sent to the new email",
				}),
			});
		/**
		 * ### Endpoint
		 *
		 * POST `/email-otp/change-email`
		 *
		 * ### API Methods
		 *
		 * **server:**
		 * `auth.api.changeEmailEmailOTP`
		 *
		 * **client:**
		 * `authClient.emailOtp.changeEmail`
		 *
		 * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/email-otp#change-email-with-otp)
		 */ const changeEmailEmailOTP = (opts) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createAuthEndpoint"
			])(
				"/email-otp/change-email",
				{
					method: "POST",
					body: changeEmailEmailOTPBodySchema,
					use: [
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"sensitiveSessionMiddleware"
						],
					],
					metadata: {
						openapi: {
							operationId: "changeEmailWithEmailOTP",
							description:
								"Verify new email with OTP and change the email if verification is successful",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													success: {
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
					if (!opts.changeEmail?.enabled) {
						ctx.context.logger.error("Change email with OTP is disabled.");
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Change email with OTP is disabled",
						});
					}
					const session = ctx.context.session;
					const email = session.user.email.toLowerCase();
					const newEmail = ctx.body.newEmail.toLowerCase();
					if (
						!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"email"
						]().safeParse(newEmail).success
					)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].INVALID_EMAIL,
						);
					if (newEmail === email) {
						ctx.context.logger.error("Email is the same");
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Email is the same",
						});
					}
					const verificationValue =
						await ctx.context.internalAdapter.findVerificationValue(
							`change-email-otp-${email}-${newEmail}`,
						);
					if (!verificationValue)
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].INVALID_OTP,
						);
					const changeEmailIdentifier = `change-email-otp-${email}-${newEmail}`;
					if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							changeEmailIdentifier,
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].OTP_EXPIRED,
						);
					}
					const [otpValue, attempts] = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"splitAtLastColon"
					])(verificationValue.value);
					const allowedAttempts = opts?.allowedAttempts || 3;
					if (attempts && parseInt(attempts) >= allowedAttempts) {
						await ctx.context.internalAdapter.deleteVerificationByIdentifier(
							changeEmailIdentifier,
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"FORBIDDEN",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].TOO_MANY_ATTEMPTS,
						);
					}
					if (
						!(await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"verifyStoredOTP"
						])(ctx, opts, otpValue, ctx.body.otp))
					) {
						await ctx.context.internalAdapter.updateVerificationByIdentifier(
							changeEmailIdentifier,
							{
								value: `${otpValue}:${parseInt(attempts || "0") + 1}`,
							},
						);
						throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"EMAIL_OTP_ERROR_CODES"
							].INVALID_OTP,
						);
					}
					await ctx.context.internalAdapter.deleteVerificationByIdentifier(
						changeEmailIdentifier,
					);
					const currentUser =
						await ctx.context.internalAdapter.findUserByEmail(email);
					if (!currentUser)
						/**
						 * safe to leak the existence of a user as a valid OTP has been provided
						 */ throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].from(
							"BAD_REQUEST",
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"BASE_ERROR_CODES"
							].USER_NOT_FOUND,
						);
					if (await ctx.context.internalAdapter.findUserByEmail(newEmail))
						/**
						 * safe to leak the existence of a user as a valid OTP has been provided
						 */ throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
							"APIError"
						].fromStatus("BAD_REQUEST", {
							message: "Email already in use",
						});
					if (ctx.context.options.emailVerification?.beforeEmailVerification)
						await ctx.context.options.emailVerification.beforeEmailVerification(
							currentUser.user,
							ctx.request,
						);
					const updatedUser = await ctx.context.internalAdapter.updateUser(
						currentUser.user.id,
						{
							email: newEmail,
							emailVerified: true,
						},
					);
					if (ctx.context.options.emailVerification?.afterEmailVerification)
						await ctx.context.options.emailVerification.afterEmailVerification(
							updatedUser,
							ctx.request,
						);
					await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"setSessionCookie"
					])(ctx, {
						session: session.session,
						user: {
							...session.user,
							email: newEmail,
							emailVerified: true,
						},
					});
					return ctx.json({
						success: true,
					});
				},
			);
		const defaultOTPGenerator = (options) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"generateRandomString"
			])(options.otpLength ?? 6, "0-9");
		/**
		 * Atomically verifies OTP with race condition protection.
		 * Deletes token before verification to prevent concurrent reuse.
		 * Re-creates token with incremented attempts on failure.
		 */ async function atomicVerifyOTP(ctx, opts, identifier, providedOTP) {
			const verificationValue =
				await ctx.context.internalAdapter.findVerificationValue(identifier);
			if (!verificationValue)
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"EMAIL_OTP_ERROR_CODES"
					].INVALID_OTP,
				);
			if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
				await ctx.context.internalAdapter.deleteVerificationByIdentifier(
					identifier,
				);
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"EMAIL_OTP_ERROR_CODES"
					].OTP_EXPIRED,
				);
			}
			const [otpValue, attempts] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$utils$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"splitAtLastColon"
			])(verificationValue.value);
			const allowedAttempts = opts?.allowedAttempts || 3;
			if (attempts && parseInt(attempts) >= allowedAttempts) {
				await ctx.context.internalAdapter.deleteVerificationByIdentifier(
					identifier,
				);
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"FORBIDDEN",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"EMAIL_OTP_ERROR_CODES"
					].TOO_MANY_ATTEMPTS,
				);
			}
			await ctx.context.internalAdapter.deleteVerificationByIdentifier(
				identifier,
			);
			if (
				!(await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"verifyStoredOTP"
				])(ctx, opts, otpValue, providedOTP))
			) {
				await ctx.context.internalAdapter.createVerificationValue({
					value: `${otpValue}:${parseInt(attempts || "0") + 1}`,
					identifier,
					expiresAt: verificationValue.expiresAt,
				});
				throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"APIError"
				].from(
					"BAD_REQUEST",
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"EMAIL_OTP_ERROR_CODES"
					].INVALID_OTP,
				);
			}
		}
		//# sourceMappingURL=routes.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/index.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["emailOTP", () => emailOTP]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/date.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/random.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/crypto/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/error-codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$plugin$2d$helper$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/plugin-helper.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/otp-token.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/plugins/email-otp/routes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/api/index.mjs [middleware] (ecmascript)",
			);
		//#region src/plugins/email-otp/index.ts
		const defaultOTPGenerator = (options) =>
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"generateRandomString"
			])(options.otpLength ?? 6, "0-9");
		const emailOTP = (options) => {
			const opts = {
				expiresIn: 300,
				generateOTP: () => defaultOTPGenerator(options),
				storeOTP: "plain",
				...options,
			};
			const sendVerificationOTPAction = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"sendVerificationOTP"
			])(opts);
			return {
				id: "email-otp",
				init(ctx) {
					if (!opts.overrideDefaultEmailVerification) return;
					return {
						options: {
							emailVerification: {
								async sendVerificationEmail(data, request) {
									await ctx.runInBackgroundOrAwait(
										sendVerificationOTPAction({
											context: ctx,
											request,
											body: {
												email: data.user.email,
												type: "email-verification",
											},
											ctx,
										}),
									);
								},
							},
						},
					};
				},
				endpoints: {
					sendVerificationOTP: sendVerificationOTPAction,
					createVerificationOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"createVerificationOTP"
					])(opts),
					getVerificationOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getVerificationOTP"
					])(opts),
					checkVerificationOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"checkVerificationOTP"
					])(opts),
					verifyEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"verifyEmailOTP"
					])(opts),
					signInEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"signInEmailOTP"
					])(opts),
					requestPasswordResetEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"requestPasswordResetEmailOTP"
					])(opts),
					forgetPasswordEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"forgetPasswordEmailOTP"
					])(opts),
					resetPasswordEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"resetPasswordEmailOTP"
					])(opts),
					requestEmailChangeEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"requestEmailChangeEmailOTP"
					])(opts),
					changeEmailEmailOTP: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$routes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"changeEmailEmailOTP"
					])(opts),
				},
				hooks: {
					after: [
						{
							matcher(context) {
								return !!(
									context.path?.startsWith("/sign-up") &&
									opts.sendVerificationOnSignUp &&
									!opts.overrideDefaultEmailVerification
								);
							},
							handler: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"createAuthMiddleware"
							])(async (ctx) => {
								const email = (
									await (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$plugin$2d$helper$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"getEndpointResponse"
									])(ctx)
								)?.user.email;
								if (email) {
									const otp =
										opts.generateOTP(
											{
												email,
												type: ctx.body.type,
											},
											ctx,
										) || defaultOTPGenerator(opts);
									const storedOTP = await (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$otp$2d$token$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"storeOTP"
									])(ctx, opts, otp);
									await ctx.context.internalAdapter.createVerificationValue({
										value: `${storedOTP}:0`,
										identifier: `email-verification-otp-${email}`,
										expiresAt: (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"getDate"
										])(opts.expiresIn, "sec"),
									});
									await ctx.context.runInBackgroundOrAwait(
										options.sendVerificationOTP(
											{
												email,
												otp,
												type: "email-verification",
											},
											ctx,
										),
									);
								}
							}),
						},
					],
				},
				rateLimit: [
					{
						pathMatcher(path) {
							return path === "/email-otp/send-verification-otp";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/check-verification-otp";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/verify-email";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/sign-in/email-otp";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/request-password-reset";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/reset-password";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/forget-password/email-otp";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/request-email-change";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
					{
						pathMatcher(path) {
							return path === "/email-otp/change-email";
						},
						window: opts.rateLimit?.window || 60,
						max: opts.rateLimit?.max || 3,
					},
				],
				options,
				$ERROR_CODES:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$error$2d$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"EMAIL_OTP_ERROR_CODES"
					],
			};
		};
		//# sourceMappingURL=index.mjs.map
	},
];

//# sourceMappingURL=d0383_better-auth_dist_plugins_email-otp_fc2da6ba._.js.map
