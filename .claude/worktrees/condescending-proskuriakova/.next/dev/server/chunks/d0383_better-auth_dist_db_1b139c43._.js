module.exports = [
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"getSessionDefaultFields",
			() => getSessionDefaultFields,
			"mergeSchema",
			() => mergeSchema,
			"parseAccountInput",
			() => parseAccountInput,
			"parseAccountOutput",
			() => parseAccountOutput,
			"parseAdditionalUserInput",
			() => parseAdditionalUserInput,
			"parseInputData",
			() => parseInputData,
			"parseSessionInput",
			() => parseSessionInput,
			"parseSessionOutput",
			() => parseSessionOutput,
			"parseUserInput",
			() => parseUserInput,
			"parseUserOutput",
			() => parseUserOutput,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/get-tables.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/codes.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/db.mjs [middleware] (ecmascript)",
			);
		//#region src/db/schema.ts
		const cache = /* @__PURE__ */ new WeakMap();
		function getFields(options, modelName, mode) {
			const cacheKey = `${modelName}:${mode}`;
			if (!cache.has(options)) cache.set(options, /* @__PURE__ */ new Map());
			const tableCache = cache.get(options);
			if (tableCache.has(cacheKey)) return tableCache.get(cacheKey);
			const coreSchema =
				mode === "output"
					? ((0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getAuthTables"
						])(options)[modelName]?.fields ?? {})
					: {};
			const additionalFields =
				modelName === "user" ||
				modelName === "session" ||
				modelName === "account"
					? options[modelName]?.additionalFields
					: void 0;
			let schema = {
				...coreSchema,
				...(additionalFields ?? {}),
			};
			for (const plugin of options.plugins || [])
				if (plugin.schema && plugin.schema[modelName])
					schema = {
						...schema,
						...plugin.schema[modelName].fields,
					};
			tableCache.set(cacheKey, schema);
			return schema;
		}
		function parseUserOutput(options, user) {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"filterOutputFields"
			])(user, getFields(options, "user", "output"));
		}
		function parseSessionOutput(options, session) {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"filterOutputFields"
			])(session, getFields(options, "session", "output"));
		}
		function parseAccountOutput(options, account) {
			const {
				accessToken: _accessToken,
				refreshToken: _refreshToken,
				idToken: _idToken,
				accessTokenExpiresAt: _accessTokenExpiresAt,
				refreshTokenExpiresAt: _refreshTokenExpiresAt,
				password: _password,
				...rest
			} = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"filterOutputFields"
			])(account, getFields(options, "account", "output"));
			return rest;
		}
		function parseInputData(data, schema) {
			const action = schema.action || "create";
			const fields = schema.fields;
			const parsedData = Object.create(null);
			for (const key in fields) {
				if (key in data) {
					if (fields[key].input === false) {
						if (fields[key].defaultValue !== void 0) {
							if (action !== "update") {
								parsedData[key] = fields[key].defaultValue;
								continue;
							}
						}
						if (data[key])
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from("BAD_REQUEST", {
								...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"BASE_ERROR_CODES"
								].FIELD_NOT_ALLOWED,
								message: `${key} is not allowed to be set`,
							});
						continue;
					}
					if (fields[key].validator?.input && data[key] !== void 0) {
						const result = fields[key].validator.input["~standard"].validate(
							data[key],
						);
						if (result instanceof Promise)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from(
								"INTERNAL_SERVER_ERROR",
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"BASE_ERROR_CODES"
								].ASYNC_VALIDATION_NOT_SUPPORTED,
							);
						if ("issues" in result && result.issues)
							throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
								"APIError"
							].from("BAD_REQUEST", {
								...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"BASE_ERROR_CODES"
								].VALIDATION_ERROR,
								message: result.issues[0]?.message || "Validation Error",
							});
						parsedData[key] = result.value;
						continue;
					}
					if (fields[key].transform?.input && data[key] !== void 0) {
						parsedData[key] = fields[key].transform?.input(data[key]);
						continue;
					}
					parsedData[key] = data[key];
					continue;
				}
				if (fields[key].defaultValue !== void 0 && action === "create") {
					if (typeof fields[key].defaultValue === "function") {
						parsedData[key] = fields[key].defaultValue();
						continue;
					}
					parsedData[key] = fields[key].defaultValue;
					continue;
				}
				if (fields[key].required && action === "create")
					throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"APIError"
					].from("BAD_REQUEST", {
						...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"BASE_ERROR_CODES"
						].MISSING_FIELD,
						message: `${key} is required`,
					});
			}
			return parsedData;
		}
		function parseUserInput(options, user = {}, action) {
			return parseInputData(user, {
				fields: getFields(options, "user", "input"),
				action,
			});
		}
		function parseAdditionalUserInput(options, user) {
			const schema = getFields(options, "user", "input");
			return parseInputData(user || {}, {
				fields: schema,
			});
		}
		function parseAccountInput(options, account) {
			return parseInputData(account, {
				fields: getFields(options, "account", "input"),
			});
		}
		function parseSessionInput(options, session, action) {
			return parseInputData(session, {
				fields: getFields(options, "session", "input"),
				action,
			});
		}
		function getSessionDefaultFields(options) {
			const fields = getFields(options, "session", "input");
			const defaults = {};
			for (const key in fields)
				if (fields[key].defaultValue !== void 0)
					defaults[key] =
						typeof fields[key].defaultValue === "function"
							? fields[key].defaultValue()
							: fields[key].defaultValue;
			return defaults;
		}
		function mergeSchema(schema, newSchema) {
			if (!newSchema) return schema;
			for (const table in newSchema) {
				const newModelName = newSchema[table]?.modelName;
				if (newModelName) schema[table].modelName = newModelName;
				for (const field in schema[table].fields) {
					const newField = newSchema[table]?.fields?.[field];
					if (!newField) continue;
					schema[table].fields[field].fieldName = newField;
				}
			}
			return schema;
		}
		//# sourceMappingURL=schema.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/get-schema.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getSchema", () => getSchema]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/get-tables.mjs [middleware] (ecmascript)",
			);
		//#region src/db/get-schema.ts
		function getSchema(config) {
			const tables = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getAuthTables"
			])(config);
			const schema = {};
			for (const key in tables) {
				const table = tables[key];
				const fields = table.fields;
				const actualFields = {};
				Object.entries(fields).forEach(([key, field]) => {
					actualFields[field.fieldName || key] = field;
					if (field.references) {
						const refTable = tables[field.references.model];
						if (refTable)
							actualFields[field.fieldName || key].references = {
								...field.references,
								model: refTable.modelName,
								field: field.references.field,
							};
					}
				});
				if (schema[table.modelName]) {
					schema[table.modelName].fields = {
						...schema[table.modelName].fields,
						...actualFields,
					};
					continue;
				}
				schema[table.modelName] = {
					fields: actualFields,
					order: table.order || Infinity,
				};
			}
			return schema;
		}
		//# sourceMappingURL=get-schema.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/field-converter.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"convertFromDB",
			() => convertFromDB,
			"convertToDB",
			() => convertToDB,
		]);
		//#region src/db/field-converter.ts
		function convertToDB(fields, values) {
			const result = values.id
				? {
						id: values.id,
					}
				: {};
			for (const key in fields) {
				const field = fields[key];
				const value = values[key];
				if (value === void 0) continue;
				result[field.fieldName || key] = value;
			}
			return result;
		}
		function convertFromDB(fields, values) {
			if (!values) return null;
			const result = {
				id: values.id,
			};
			for (const [key, value] of Object.entries(fields))
				result[key] = values[value.fieldName || key];
			return result;
		}
		//# sourceMappingURL=field-converter.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/with-hooks.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getWithHooks", () => getWithHooks]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/transaction.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [middleware] (ecmascript)",
			);
		//#region src/db/with-hooks.ts
		function getWithHooks(adapter, ctx) {
			const hooks = ctx.hooks;
			async function createWithHooks(data, model, customCreateFn) {
				const context = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getCurrentAuthContext"
				])().catch(() => null);
				let actualData = data;
				for (const hook of hooks || []) {
					const toRun = hook[model]?.create?.before;
					if (toRun) {
						const result = await toRun(actualData, context);
						if (result === false) return null;
						if (typeof result === "object" && "data" in result)
							actualData = {
								...actualData,
								...result.data,
							};
					}
				}
				let created = null;
				if (!customCreateFn || customCreateFn.executeMainFn)
					created = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).create({
						model,
						data: actualData,
						forceAllowId: true,
					});
				if (customCreateFn?.fn)
					created = await customCreateFn.fn(created ?? actualData);
				for (const hook of hooks || []) {
					const toRun = hook[model]?.create?.after;
					if (toRun)
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"queueAfterTransactionHook"
						])(async () => {
							await toRun(created, context);
						});
				}
				return created;
			}
			async function updateWithHooks(data, where, model, customUpdateFn) {
				const context = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getCurrentAuthContext"
				])().catch(() => null);
				let actualData = data;
				for (const hook of hooks || []) {
					const toRun = hook[model]?.update?.before;
					if (toRun) {
						const result = await toRun(data, context);
						if (result === false) return null;
						if (typeof result === "object" && "data" in result)
							actualData = {
								...actualData,
								...result.data,
							};
					}
				}
				const customUpdated = customUpdateFn
					? await customUpdateFn.fn(actualData)
					: null;
				const updated =
					!customUpdateFn || customUpdateFn.executeMainFn
						? await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).update({
								model,
								update: actualData,
								where,
							})
						: customUpdated;
				for (const hook of hooks || []) {
					const toRun = hook[model]?.update?.after;
					if (toRun)
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"queueAfterTransactionHook"
						])(async () => {
							await toRun(updated, context);
						});
				}
				return updated;
			}
			async function updateManyWithHooks(data, where, model, customUpdateFn) {
				const context = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getCurrentAuthContext"
				])().catch(() => null);
				let actualData = data;
				for (const hook of hooks || []) {
					const toRun = hook[model]?.update?.before;
					if (toRun) {
						const result = await toRun(data, context);
						if (result === false) return null;
						if (typeof result === "object" && "data" in result)
							actualData = {
								...actualData,
								...result.data,
							};
					}
				}
				const customUpdated = customUpdateFn
					? await customUpdateFn.fn(actualData)
					: null;
				const updated =
					!customUpdateFn || customUpdateFn.executeMainFn
						? await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).updateMany({
								model,
								update: actualData,
								where,
							})
						: customUpdated;
				for (const hook of hooks || []) {
					const toRun = hook[model]?.update?.after;
					if (toRun)
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"queueAfterTransactionHook"
						])(async () => {
							await toRun(updated, context);
						});
				}
				return updated;
			}
			async function deleteWithHooks(where, model, customDeleteFn) {
				const context = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getCurrentAuthContext"
				])().catch(() => null);
				let entityToDelete = null;
				try {
					entityToDelete =
						(
							await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).findMany({
								model,
								where,
								limit: 1,
							})
						)[0] || null;
				} catch {}
				if (entityToDelete)
					for (const hook of hooks || []) {
						const toRun = hook[model]?.delete?.before;
						if (toRun) {
							if ((await toRun(entityToDelete, context)) === false) return null;
						}
					}
				const customDeleted = customDeleteFn
					? await customDeleteFn.fn(where)
					: null;
				const deleted =
					(!customDeleteFn || customDeleteFn.executeMainFn) && entityToDelete
						? await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).delete({
								model,
								where,
							})
						: customDeleted;
				if (entityToDelete)
					for (const hook of hooks || []) {
						const toRun = hook[model]?.delete?.after;
						if (toRun)
							await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"queueAfterTransactionHook"
							])(async () => {
								await toRun(entityToDelete, context);
							});
					}
				return deleted;
			}
			async function deleteManyWithHooks(where, model, customDeleteFn) {
				const context = await (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getCurrentAuthContext"
				])().catch(() => null);
				let entitiesToDelete = [];
				try {
					entitiesToDelete = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model,
						where,
					});
				} catch {}
				for (const entity of entitiesToDelete)
					for (const hook of hooks || []) {
						const toRun = hook[model]?.delete?.before;
						if (toRun) {
							if ((await toRun(entity, context)) === false) return null;
						}
					}
				const customDeleted = customDeleteFn
					? await customDeleteFn.fn(where)
					: null;
				const deleted =
					!customDeleteFn || customDeleteFn.executeMainFn
						? await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).deleteMany({
								model,
								where,
							})
						: customDeleted;
				for (const entity of entitiesToDelete)
					for (const hook of hooks || []) {
						const toRun = hook[model]?.delete?.after;
						if (toRun)
							await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"queueAfterTransactionHook"
							])(async () => {
								await toRun(entity, context);
							});
					}
				return deleted;
			}
			return {
				createWithHooks,
				updateWithHooks,
				updateManyWithHooks,
				deleteWithHooks,
				deleteManyWithHooks,
			};
		}
		//# sourceMappingURL=with-hooks.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/verification-token-storage.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"getStorageOption",
			() => getStorageOption,
			"processIdentifier",
			() => processIdentifier,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/base64.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/hash.mjs [middleware] (ecmascript)",
			);
		//#region src/db/verification-token-storage.ts
		const defaultKeyHasher = async (identifier) => {
			const hash = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createHash"
			])("SHA-256").digest(new TextEncoder().encode(identifier));
			return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$1$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"base64Url"
			].encode(new Uint8Array(hash), {
				padding: false,
			});
		};
		async function processIdentifier(identifier, option) {
			if (!option || option === "plain") return identifier;
			if (option === "hashed") return defaultKeyHasher(identifier);
			if (typeof option === "object" && "hash" in option)
				return option.hash(identifier);
			return identifier;
		}
		function getStorageOption(identifier, config) {
			if (!config) return;
			if (typeof config === "object" && "default" in config) {
				if (config.overrides) {
					for (const [prefix, option] of Object.entries(config.overrides))
						if (identifier.startsWith(prefix)) return option;
				}
				return config.default;
			}
			return config;
		}
		//# sourceMappingURL=verification-token-storage.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/internal-adapter.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"createInternalAdapter",
			() => createInternalAdapter,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$get$2d$request$2d$ip$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/get-request-ip.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/utils/date.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/verification-token-storage.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/with-hooks.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/transaction.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/id.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/utils/json.mjs [middleware] (ecmascript)",
			);
		//#region src/db/internal-adapter.ts
		function getTTLSeconds(expiresAt, now = Date.now()) {
			const expiresMs =
				typeof expiresAt === "number" ? expiresAt : expiresAt.getTime();
			return Math.max(Math.floor((expiresMs - now) / 1e3), 0);
		}
		const createInternalAdapter = (adapter, ctx) => {
			const logger = ctx.logger;
			const options = ctx.options;
			const secondaryStorage = options.secondaryStorage;
			const sessionExpiration = options.session?.expiresIn || 3600 * 24 * 7;
			const {
				createWithHooks,
				updateWithHooks,
				updateManyWithHooks,
				deleteWithHooks,
				deleteManyWithHooks,
			} = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getWithHooks"
			])(adapter, ctx);
			async function refreshUserSessions(user) {
				if (!secondaryStorage) return;
				const listRaw = await secondaryStorage.get(
					`active-sessions-${user.id}`,
				);
				if (!listRaw) return;
				const now = Date.now();
				const validSessions = (
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"safeJSONParse"
					])(listRaw) || []
				).filter((s) => s.expiresAt > now);
				await Promise.all(
					validSessions.map(async ({ token }) => {
						const cached = await secondaryStorage.get(token);
						if (!cached) return;
						const parsed = (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"safeJSONParse"
						])(cached);
						if (!parsed) return;
						const sessionTTL = getTTLSeconds(parsed.session.expiresAt, now);
						await secondaryStorage.set(
							token,
							JSON.stringify({
								session: parsed.session,
								user,
							}),
							Math.floor(sessionTTL),
						);
					}),
				);
			}
			return {
				createOAuthUser: async (user, account) => {
					return (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"runWithTransaction"
					])(adapter, async () => {
						const createdUser = await createWithHooks(
							{
								createdAt: /* @__PURE__ */ new Date(),
								updatedAt: /* @__PURE__ */ new Date(),
								...user,
							},
							"user",
							void 0,
						);
						return {
							user: createdUser,
							account: await createWithHooks(
								{
									...account,
									userId: createdUser.id,
									createdAt: /* @__PURE__ */ new Date(),
									updatedAt: /* @__PURE__ */ new Date(),
								},
								"account",
								void 0,
							),
						};
					});
				},
				createUser: async (user) => {
					return await createWithHooks(
						{
							createdAt: /* @__PURE__ */ new Date(),
							updatedAt: /* @__PURE__ */ new Date(),
							...user,
							email: user.email?.toLowerCase(),
						},
						"user",
						void 0,
					);
				},
				createAccount: async (account) => {
					return await createWithHooks(
						{
							createdAt: /* @__PURE__ */ new Date(),
							updatedAt: /* @__PURE__ */ new Date(),
							...account,
						},
						"account",
						void 0,
					);
				},
				listSessions: async (userId, options) => {
					if (secondaryStorage) {
						const currentList = await secondaryStorage.get(
							`active-sessions-${userId}`,
						);
						if (!currentList) return [];
						const list =
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"safeJSONParse"
							])(currentList) || [];
						const now = Date.now();
						const seenTokens = /* @__PURE__ */ new Set();
						const sessions = [];
						for (const { token, expiresAt } of list) {
							if (expiresAt <= now || seenTokens.has(token)) continue;
							seenTokens.add(token);
							const data = await secondaryStorage.get(token);
							if (!data) continue;
							try {
								const parsed =
									typeof data === "string" ? JSON.parse(data) : data;
								if (!parsed?.session) continue;
								sessions.push(
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"parseSessionOutput"
									])(ctx.options, {
										...parsed.session,
										expiresAt: new Date(parsed.session.expiresAt),
									}),
								);
							} catch {}
						}
						return sessions;
					}
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model: "session",
						where: [
							{
								field: "userId",
								value: userId,
							},
							...(options?.onlyActiveSessions
								? [
										{
											field: "expiresAt",
											value: /* @__PURE__ */ new Date(),
											operator: "gt",
										},
									]
								: []),
						],
					});
				},
				listUsers: async (limit, offset, sortBy, where) => {
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model: "user",
						limit,
						offset,
						sortBy,
						where,
					});
				},
				countTotalUsers: async (where) => {
					const total = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).count({
						model: "user",
						where,
					});
					if (typeof total === "string") return parseInt(total);
					return total;
				},
				deleteUser: async (userId) => {
					if (!secondaryStorage || options.session?.storeSessionInDatabase)
						await deleteManyWithHooks(
							[
								{
									field: "userId",
									value: userId,
								},
							],
							"session",
							void 0,
						);
					await deleteManyWithHooks(
						[
							{
								field: "userId",
								value: userId,
							},
						],
						"account",
						void 0,
					);
					await deleteWithHooks(
						[
							{
								field: "id",
								value: userId,
							},
						],
						"user",
						void 0,
					);
				},
				createSession: async (
					userId,
					dontRememberMe,
					override,
					overrideAll,
				) => {
					const headers = await (async () => {
						const ctx = await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAuthContext"
						])().catch(() => null);
						return ctx?.headers || ctx?.request?.headers;
					})();
					const storeInDb = options.session?.storeSessionInDatabase;
					const { id: _, ...rest } = override || {};
					const defaultAdditionalFields = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getSessionDefaultFields"
					])(options);
					const data = {
						ipAddress: headers
							? (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$get$2d$request$2d$ip$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getIp"
								])(headers, options) || ""
							: "",
						userAgent: headers?.get("user-agent") || "",
						...rest,
						expiresAt: dontRememberMe
							? (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getDate"
								])(3600 * 24, "sec")
							: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getDate"
								])(sessionExpiration, "sec"),
						userId,
						token: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"generateId"
						])(32),
						createdAt: /* @__PURE__ */ new Date(),
						updatedAt: /* @__PURE__ */ new Date(),
						...defaultAdditionalFields,
						...(overrideAll ? rest : {}),
					};
					return await createWithHooks(
						data,
						"session",
						secondaryStorage
							? {
									fn: async (sessionData) => {
										/**
										 * store the session token for the user
										 * so we can retrieve it later for listing sessions
										 */ const currentList = await secondaryStorage.get(
											`active-sessions-${userId}`,
										);
										let list = [];
										const now = Date.now();
										if (currentList) {
											list =
												(0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
													"safeJSONParse"
												])(currentList) || [];
											list = list.filter(
												(session) =>
													session.expiresAt > now &&
													session.token !== data.token,
											);
										}
										const sorted = [
											...list,
											{
												token: data.token,
												expiresAt: data.expiresAt.getTime(),
											},
										].sort((a, b) => a.expiresAt - b.expiresAt);
										const furthestSessionTTL = getTTLSeconds(
											sorted.at(-1)?.expiresAt ?? data.expiresAt.getTime(),
											now,
										);
										if (furthestSessionTTL > 0)
											await secondaryStorage.set(
												`active-sessions-${userId}`,
												JSON.stringify(sorted),
												furthestSessionTTL,
											);
										const user = await (
											await (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
												"getCurrentAdapter"
											])(adapter)
										).findOne({
											model: "user",
											where: [
												{
													field: "id",
													value: userId,
												},
											],
										});
										const sessionTTL = getTTLSeconds(data.expiresAt, now);
										if (sessionTTL > 0)
											await secondaryStorage.set(
												data.token,
												JSON.stringify({
													session: sessionData,
													user,
												}),
												sessionTTL,
											);
										return sessionData;
									},
									executeMainFn: storeInDb,
								}
							: void 0,
					);
				},
				findSession: async (token) => {
					if (secondaryStorage) {
						const sessionStringified = await secondaryStorage.get(token);
						if (!sessionStringified && !options.session?.storeSessionInDatabase)
							return null;
						if (sessionStringified) {
							const s = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"safeJSONParse"
							])(sessionStringified);
							if (!s) return null;
							return {
								session: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"parseSessionOutput"
								])(ctx.options, {
									...s.session,
									expiresAt: new Date(s.session.expiresAt),
									createdAt: new Date(s.session.createdAt),
									updatedAt: new Date(s.session.updatedAt),
								}),
								user: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"parseUserOutput"
								])(ctx.options, {
									...s.user,
									createdAt: new Date(s.user.createdAt),
									updatedAt: new Date(s.user.updatedAt),
								}),
							};
						}
					}
					const result = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "session",
						where: [
							{
								value: token,
								field: "token",
							},
						],
						join: {
							user: true,
						},
					});
					if (!result) return null;
					const { user, ...session } = result;
					if (!user) return null;
					return {
						session: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseSessionOutput"
						])(ctx.options, session),
						user: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"parseUserOutput"
						])(ctx.options, user),
					};
				},
				findSessions: async (sessionTokens, options) => {
					if (secondaryStorage) {
						const sessions = [];
						for (const sessionToken of sessionTokens) {
							const sessionStringified =
								await secondaryStorage.get(sessionToken);
							if (sessionStringified)
								try {
									const s =
										typeof sessionStringified === "string"
											? JSON.parse(sessionStringified)
											: sessionStringified;
									if (!s) return [];
									const expiresAt = new Date(s.session.expiresAt);
									if (
										options?.onlyActiveSessions &&
										expiresAt <= /* @__PURE__ */ new Date()
									)
										continue;
									const session = {
										session: {
											...s.session,
											expiresAt: new Date(s.session.expiresAt),
										},
										user: {
											...s.user,
											createdAt: new Date(s.user.createdAt),
											updatedAt: new Date(s.user.updatedAt),
										},
									};
									sessions.push(session);
								} catch {}
						}
						return sessions;
					}
					const sessions = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model: "session",
						where: [
							{
								field: "token",
								value: sessionTokens,
								operator: "in",
							},
							...(options?.onlyActiveSessions
								? [
										{
											field: "expiresAt",
											value: /* @__PURE__ */ new Date(),
											operator: "gt",
										},
									]
								: []),
						],
						join: {
							user: true,
						},
					});
					if (!sessions.length) return [];
					if (sessions.some((session) => !session.user)) return [];
					return sessions.map((_session) => {
						const { user, ...session } = _session;
						return {
							session,
							user,
						};
					});
				},
				updateSession: async (sessionToken, session) => {
					return await updateWithHooks(
						session,
						[
							{
								field: "token",
								value: sessionToken,
							},
						],
						"session",
						secondaryStorage
							? {
									async fn(data) {
										const currentSession =
											await secondaryStorage.get(sessionToken);
										if (!currentSession) return null;
										const parsedSession = (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"safeJSONParse"
										])(currentSession);
										if (!parsedSession) return null;
										const mergedSession = {
											...parsedSession.session,
											...data,
											expiresAt: new Date(
												data.expiresAt ?? parsedSession.session.expiresAt,
											),
											createdAt: new Date(parsedSession.session.createdAt),
											updatedAt: new Date(
												data.updatedAt ?? parsedSession.session.updatedAt,
											),
										};
										const updatedSession = (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"parseSessionOutput"
										])(ctx.options, mergedSession);
										const now = Date.now();
										const expiresMs = new Date(
											updatedSession.expiresAt,
										).getTime();
										const sessionTTL = getTTLSeconds(expiresMs, now);
										if (sessionTTL > 0) {
											await secondaryStorage.set(
												sessionToken,
												JSON.stringify({
													session: updatedSession,
													user: parsedSession.user,
												}),
												sessionTTL,
											);
											const listKey = `active-sessions-${updatedSession.userId}`;
											const listRaw = await secondaryStorage.get(listKey);
											const sorted = (
												listRaw
													? (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
															"safeJSONParse"
														])(listRaw) || []
													: []
											)
												.filter(
													(s) => s.token !== sessionToken && s.expiresAt > now,
												)
												.concat([
													{
														token: sessionToken,
														expiresAt: expiresMs,
													},
												])
												.sort((a, b) => a.expiresAt - b.expiresAt);
											const furthestSessionExp = sorted.at(-1)?.expiresAt;
											if (furthestSessionExp && furthestSessionExp > now)
												await secondaryStorage.set(
													listKey,
													JSON.stringify(sorted),
													getTTLSeconds(furthestSessionExp, now),
												);
											else await secondaryStorage.delete(listKey);
										}
										return updatedSession;
									},
									executeMainFn: options.session?.storeSessionInDatabase,
								}
							: void 0,
					);
				},
				deleteSession: async (token) => {
					if (secondaryStorage) {
						const data = await secondaryStorage.get(token);
						if (data) {
							const { session } =
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"safeJSONParse"
								])(data) ?? {};
							if (!session) {
								logger.error("Session not found in secondary storage");
								return;
							}
							const userId = session.userId;
							const currentList = await secondaryStorage.get(
								`active-sessions-${userId}`,
							);
							if (currentList) {
								const list =
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"safeJSONParse"
									])(currentList) || [];
								const now = Date.now();
								const filtered = list.filter(
									(session) =>
										session.expiresAt > now && session.token !== token,
								);
								const furthestSessionExp = filtered
									.sort((a, b) => a.expiresAt - b.expiresAt)
									.at(-1)?.expiresAt;
								if (
									filtered.length > 0 &&
									furthestSessionExp &&
									furthestSessionExp > Date.now()
								)
									await secondaryStorage.set(
										`active-sessions-${userId}`,
										JSON.stringify(filtered),
										getTTLSeconds(furthestSessionExp, now),
									);
								else await secondaryStorage.delete(`active-sessions-${userId}`);
							} else
								logger.error(
									"Active sessions list not found in secondary storage",
								);
						}
						await secondaryStorage.delete(token);
						if (
							!options.session?.storeSessionInDatabase ||
							ctx.options.session?.preserveSessionInDatabase
						)
							return;
					}
					await deleteWithHooks(
						[
							{
								field: "token",
								value: token,
							},
						],
						"session",
						void 0,
					);
				},
				deleteAccounts: async (userId) => {
					await deleteManyWithHooks(
						[
							{
								field: "userId",
								value: userId,
							},
						],
						"account",
						void 0,
					);
				},
				deleteAccount: async (accountId) => {
					await deleteWithHooks(
						[
							{
								field: "id",
								value: accountId,
							},
						],
						"account",
						void 0,
					);
				},
				deleteSessions: async (userIdOrSessionTokens) => {
					if (secondaryStorage) {
						if (typeof userIdOrSessionTokens === "string") {
							const activeSession = await secondaryStorage.get(
								`active-sessions-${userIdOrSessionTokens}`,
							);
							const sessions = activeSession
								? (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
										"safeJSONParse"
									])(activeSession)
								: [];
							if (!sessions) return;
							for (const session of sessions)
								await secondaryStorage.delete(session.token);
							await secondaryStorage.delete(
								`active-sessions-${userIdOrSessionTokens}`,
							);
						} else
							for (const sessionToken of userIdOrSessionTokens)
								if (await secondaryStorage.get(sessionToken))
									await secondaryStorage.delete(sessionToken);
						if (
							!options.session?.storeSessionInDatabase ||
							ctx.options.session?.preserveSessionInDatabase
						)
							return;
					}
					await deleteManyWithHooks(
						[
							{
								field: Array.isArray(userIdOrSessionTokens)
									? "token"
									: "userId",
								value: userIdOrSessionTokens,
								operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0,
							},
						],
						"session",
						void 0,
					);
				},
				findOAuthUser: async (email, accountId, providerId) => {
					const account = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "account",
						where: [
							{
								value: accountId,
								field: "accountId",
							},
							{
								value: providerId,
								field: "providerId",
							},
						],
						join: {
							user: true,
						},
					});
					if (account)
						if (account.user)
							return {
								user: account.user,
								linkedAccount: account,
								accounts: [account],
							};
						else {
							const user = await (
								await (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"getCurrentAdapter"
								])(adapter)
							).findOne({
								model: "user",
								where: [
									{
										value: email.toLowerCase(),
										field: "email",
									},
								],
							});
							if (user)
								return {
									user,
									linkedAccount: account,
									accounts: [account],
								};
							return null;
						}
					else {
						const user = await (
							await (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"getCurrentAdapter"
							])(adapter)
						).findOne({
							model: "user",
							where: [
								{
									value: email.toLowerCase(),
									field: "email",
								},
							],
						});
						if (user)
							return {
								user,
								linkedAccount: null,
								accounts:
									(await (
										await (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
											"getCurrentAdapter"
										])(adapter)
									).findMany({
										model: "account",
										where: [
											{
												value: user.id,
												field: "userId",
											},
										],
									})) || [],
							};
						else return null;
					}
				},
				findUserByEmail: async (email, options) => {
					const result = await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "user",
						where: [
							{
								value: email.toLowerCase(),
								field: "email",
							},
						],
						join: {
							...(options?.includeAccounts
								? {
										account: true,
									}
								: {}),
						},
					});
					if (!result) return null;
					const { account: accounts, ...user } = result;
					return {
						user,
						accounts: accounts ?? [],
					};
				},
				findUserById: async (userId) => {
					if (!userId) return null;
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "user",
						where: [
							{
								field: "id",
								value: userId,
							},
						],
					});
				},
				linkAccount: async (account) => {
					return await createWithHooks(
						{
							createdAt: /* @__PURE__ */ new Date(),
							updatedAt: /* @__PURE__ */ new Date(),
							...account,
						},
						"account",
						void 0,
					);
				},
				updateUser: async (userId, data) => {
					const user = await updateWithHooks(
						data,
						[
							{
								field: "id",
								value: userId,
							},
						],
						"user",
						void 0,
					);
					await refreshUserSessions(user);
					return user;
				},
				updateUserByEmail: async (email, data) => {
					const user = await updateWithHooks(
						data,
						[
							{
								field: "email",
								value: email.toLowerCase(),
							},
						],
						"user",
						void 0,
					);
					await refreshUserSessions(user);
					return user;
				},
				updatePassword: async (userId, password) => {
					await updateManyWithHooks(
						{
							password,
						},
						[
							{
								field: "userId",
								value: userId,
							},
							{
								field: "providerId",
								value: "credential",
							},
						],
						"account",
						void 0,
					);
				},
				findAccounts: async (userId) => {
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model: "account",
						where: [
							{
								field: "userId",
								value: userId,
							},
						],
					});
				},
				findAccount: async (accountId) => {
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "account",
						where: [
							{
								field: "accountId",
								value: accountId,
							},
						],
					});
				},
				findAccountByProviderId: async (accountId, providerId) => {
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findOne({
						model: "account",
						where: [
							{
								field: "accountId",
								value: accountId,
							},
							{
								field: "providerId",
								value: providerId,
							},
						],
					});
				},
				findAccountByUserId: async (userId) => {
					return await (
						await (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getCurrentAdapter"
						])(adapter)
					).findMany({
						model: "account",
						where: [
							{
								field: "userId",
								value: userId,
							},
						],
					});
				},
				updateAccount: async (id, data) => {
					return await updateWithHooks(
						data,
						[
							{
								field: "id",
								value: id,
							},
						],
						"account",
						void 0,
					);
				},
				createVerificationValue: async (data) => {
					const storageOption = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getStorageOption"
					])(data.identifier, options.verification?.storeIdentifier);
					const storedIdentifier = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"processIdentifier"
					])(data.identifier, storageOption);
					return await createWithHooks(
						{
							createdAt: /* @__PURE__ */ new Date(),
							updatedAt: /* @__PURE__ */ new Date(),
							...data,
							identifier: storedIdentifier,
						},
						"verification",
						secondaryStorage
							? {
									async fn(verificationData) {
										const ttl = getTTLSeconds(verificationData.expiresAt);
										if (ttl > 0)
											await secondaryStorage.set(
												`verification:${storedIdentifier}`,
												JSON.stringify(verificationData),
												ttl,
											);
										return verificationData;
									},
									executeMainFn: options.verification?.storeInDatabase,
								}
							: void 0,
					);
				},
				findVerificationValue: async (identifier) => {
					const storageOption = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getStorageOption"
					])(identifier, options.verification?.storeIdentifier);
					const storedIdentifier = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"processIdentifier"
					])(identifier, storageOption);
					if (secondaryStorage) {
						const cached = await secondaryStorage.get(
							`verification:${storedIdentifier}`,
						);
						if (cached) {
							const parsed = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"safeJSONParse"
							])(cached);
							if (parsed) return parsed;
						}
						if (storageOption && storageOption !== "plain") {
							const plainCached = await secondaryStorage.get(
								`verification:${identifier}`,
							);
							if (plainCached) {
								const parsed = (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
									"safeJSONParse"
								])(plainCached);
								if (parsed) return parsed;
							}
						}
						if (!options.verification?.storeInDatabase) return null;
					}
					const currentAdapter = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"getCurrentAdapter"
					])(adapter);
					async function findByIdentifier(id) {
						return currentAdapter.findMany({
							model: "verification",
							where: [
								{
									field: "identifier",
									value: id,
								},
							],
							sortBy: {
								field: "createdAt",
								direction: "desc",
							},
							limit: 1,
						});
					}
					let verification = await findByIdentifier(storedIdentifier);
					if (
						!verification.length &&
						storageOption &&
						storageOption !== "plain"
					)
						verification = await findByIdentifier(identifier);
					if (!options.verification?.disableCleanup)
						await deleteManyWithHooks(
							[
								{
									field: "expiresAt",
									value: /* @__PURE__ */ new Date(),
									operator: "lt",
								},
							],
							"verification",
							void 0,
						);
					return verification[0] || null;
				},
				deleteVerificationByIdentifier: async (identifier) => {
					const storedIdentifier = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"processIdentifier"
					])(
						identifier,
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getStorageOption"
						])(identifier, options.verification?.storeIdentifier),
					);
					if (secondaryStorage)
						await secondaryStorage.delete(`verification:${storedIdentifier}`);
					if (!secondaryStorage || options.verification?.storeInDatabase)
						await deleteWithHooks(
							[
								{
									field: "identifier",
									value: storedIdentifier,
								},
							],
							"verification",
							void 0,
						);
				},
				updateVerificationByIdentifier: async (identifier, data) => {
					const storedIdentifier = await (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
						"processIdentifier"
					])(
						identifier,
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
							"getStorageOption"
						])(identifier, options.verification?.storeIdentifier),
					);
					if (secondaryStorage) {
						const cached = await secondaryStorage.get(
							`verification:${storedIdentifier}`,
						);
						if (cached) {
							const parsed = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
								"safeJSONParse"
							])(cached);
							if (parsed) {
								const updated = {
									...parsed,
									...data,
								};
								const expiresAt = updated.expiresAt ?? parsed.expiresAt;
								const ttl = getTTLSeconds(
									expiresAt instanceof Date ? expiresAt : new Date(expiresAt),
								);
								if (ttl > 0)
									await secondaryStorage.set(
										`verification:${storedIdentifier}`,
										JSON.stringify(updated),
										ttl,
									);
								if (!options.verification?.storeInDatabase) return updated;
							}
						}
					}
					if (!secondaryStorage || options.verification?.storeInDatabase)
						return await updateWithHooks(
							data,
							[
								{
									field: "identifier",
									value: storedIdentifier,
								},
							],
							"verification",
							void 0,
						);
					return data;
				},
			};
		};
		//# sourceMappingURL=internal-adapter.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/to-zod.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["toZodSchema", () => toZodSchema]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/index.js [middleware] (ecmascript)",
			);
		//#region src/db/to-zod.ts
		function toZodSchema({ fields, isClientSide }) {
			const zodFields = Object.keys(fields).reduce((acc, key) => {
				const field = fields[key];
				if (!field) return acc;
				if (isClientSide && field.input === false) return acc;
				let schema;
				if (field.type === "json")
					schema =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.json
							? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.json()
							: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.any();
				else if (field.type === "string[]" || field.type === "number[]")
					schema =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.array(
							field.type === "string[]"
								? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.string()
								: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.number(),
						);
				else if (Array.isArray(field.type))
					schema =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.any();
				else
					schema =
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							field.type
						]();
				if (field?.required === false) schema = schema.optional();
				if (!isClientSide && field?.returned === false) return acc;
				return {
					...acc,
					[key]: schema,
				};
			}, {});
			return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__.object(
				zodFields,
			);
		}
		//# sourceMappingURL=to-zod.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/index.mjs [middleware] (ecmascript) <locals>",
	(__turbopack_context__) => {
		__turbopack_context__.s(["db_exports", () => db_exports]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$_virtual$2f$_rolldown$2f$runtime$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/_virtual/_rolldown/runtime.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/get-schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$field$2d$converter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/field-converter.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/schema.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/with-hooks.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/internal-adapter.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$to$2d$zod$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/to-zod.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/index.mjs [middleware] (ecmascript)",
			);
		//#region src/db/index.ts
		var db_exports = /* @__PURE__ */ (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$_virtual$2f$_rolldown$2f$runtime$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
			"__exportAll"
		])({
			convertFromDB: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$field$2d$converter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"convertFromDB"
				],
			convertToDB: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$field$2d$converter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"convertToDB"
				],
			createInternalAdapter: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"createInternalAdapter"
				],
			getSchema: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getSchema"
				],
			getSessionDefaultFields: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getSessionDefaultFields"
				],
			getWithHooks: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getWithHooks"
				],
			mergeSchema: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"mergeSchema"
				],
			parseAccountInput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseAccountInput"
				],
			parseAccountOutput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseAccountOutput"
				],
			parseAdditionalUserInput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseAdditionalUserInput"
				],
			parseInputData: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseInputData"
				],
			parseSessionInput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseSessionInput"
				],
			parseSessionOutput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseSessionOutput"
				],
			parseUserInput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseUserInput"
				],
			parseUserOutput: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"parseUserOutput"
				],
			toZodSchema: () =>
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$to$2d$zod$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"toZodSchema"
				],
		});
		(0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$_virtual$2f$_rolldown$2f$runtime$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
			"__reExport"
		])(
			db_exports,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__,
		);
		//# sourceMappingURL=index.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/adapter-base.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getBaseAdapter", () => getBaseAdapter]);
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
		//#region src/db/adapter-base.ts
		async function getBaseAdapter(options, handleDirectDatabase) {
			let adapter;
			if (!options.database) {
				const tables = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getAuthTables"
				])(options);
				const memoryDB = Object.keys(tables).reduce((acc, key) => {
					acc[key] = [];
					return acc;
				}, {});
				const { memoryAdapter } = await __turbopack_context__.A(
					"[project]/node_modules/.pnpm/@better-auth+memory-adapter@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@bet_6767e133838caa42ec8202f423dd4d25/node_modules/@better-auth/memory-adapter/dist/index.mjs [middleware] (ecmascript, async loader)",
				);
				adapter = memoryAdapter(memoryDB)(options);
			} else if (typeof options.database === "function")
				adapter = options.database(options);
			else adapter = await handleDirectDatabase(options);
			if (!adapter.transaction) {
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"logger"
				].warn(
					"Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.",
				);
				adapter.transaction = async (cb) => {
					return cb(adapter);
				};
			}
			return adapter;
		}
		//# sourceMappingURL=adapter-base.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/adapter-kysely.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s(["getAdapter", () => getAdapter]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$base$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/adapter-base.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/error/index.mjs [middleware] (ecmascript) <locals>",
			);
		//#region src/db/adapter-kysely.ts
		async function getAdapter(options) {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$base$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getBaseAdapter"
			])(options, async (opts) => {
				const { createKyselyAdapter } = await __turbopack_context__.A(
					"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/adapters/kysely-adapter/index.mjs [middleware] (ecmascript, async loader)",
				);
				const { kysely, databaseType, transaction } =
					await createKyselyAdapter(opts);
				if (!kysely)
					throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
						"BetterAuthError"
					]("Failed to initialize database adapter");
				const { kyselyAdapter } = await __turbopack_context__.A(
					"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/adapters/kysely-adapter/index.mjs [middleware] (ecmascript, async loader)",
				);
				return kyselyAdapter(kysely, {
					type: databaseType || "sqlite",
					debugLogs:
						opts.database && "debugLogs" in opts.database
							? opts.database.debugLogs
							: false,
					transaction,
				})(opts);
			});
		}
		//# sourceMappingURL=adapter-kysely.mjs.map
	},
	"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/get-migration.mjs [middleware] (ecmascript)",
	(__turbopack_context__) => {
		__turbopack_context__.s([
			"getMigrations",
			() => getMigrations,
			"matchType",
			() => matchType,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/better-auth@1.5.5_drizzle-kit@0.31.9_drizzle-orm@0.45.1_kysely@0.28.11_postgres@3.4.8___c895ff4b0cee42a06c42fa7318fe39b6/node_modules/better-auth/dist/db/get-schema.mjs [middleware] (ecmascript)",
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$bet_5f9802a6f0eb6c1ddba8f37c39695dee$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+kysely-adapter@1.5.5_@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@bet_5f9802a6f0eb6c1ddba8f37c39695dee/node_modules/@better-auth/kysely-adapter/dist/index.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/adapter/index.mjs [middleware] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@better-auth+core@1.5.5_@better-auth+utils@0.3.1_@better-fetch+fetch@1.1.21_better-call_67579310e3d032f6266823a7be698d9a/node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs [middleware] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/kysely@0.28.11/node_modules/kysely/dist/esm/raw-builder/sql.js [middleware] (ecmascript)",
			);
		//#region src/db/get-migration.ts
		const map = {
			postgres: {
				string: ["character varying", "varchar", "text", "uuid"],
				number: [
					"int4",
					"integer",
					"bigint",
					"smallint",
					"numeric",
					"real",
					"double precision",
				],
				boolean: ["bool", "boolean"],
				date: ["timestamptz", "timestamp", "date"],
				json: ["json", "jsonb"],
			},
			mysql: {
				string: ["varchar", "text", "uuid"],
				number: [
					"integer",
					"int",
					"bigint",
					"smallint",
					"decimal",
					"float",
					"double",
				],
				boolean: ["boolean", "tinyint"],
				date: ["timestamp", "datetime", "date"],
				json: ["json"],
			},
			sqlite: {
				string: ["TEXT"],
				number: ["INTEGER", "REAL"],
				boolean: ["INTEGER", "BOOLEAN"],
				date: ["DATE", "INTEGER"],
				json: ["TEXT"],
			},
			mssql: {
				string: ["varchar", "nvarchar", "uniqueidentifier"],
				number: ["int", "bigint", "smallint", "decimal", "float", "double"],
				boolean: ["bit", "smallint"],
				date: ["datetime2", "date", "datetime"],
				json: ["varchar", "nvarchar"],
			},
		};
		function matchType(columnDataType, fieldType, dbType) {
			function normalize(type) {
				return type.toLowerCase().split("(")[0].trim();
			}
			if (fieldType === "string[]" || fieldType === "number[]")
				return columnDataType.toLowerCase().includes("json");
			const types = map[dbType];
			return (
				Array.isArray(fieldType)
					? types["string"].map((t) => t.toLowerCase())
					: types[fieldType].map((t) => t.toLowerCase())
			).includes(normalize(columnDataType));
		}
		/**
		 * Get the current PostgreSQL schema (search_path) for the database connection
		 * Returns the first schema in the search_path, defaulting to 'public' if not found
		 */ async function getPostgresSchema(db) {
			try {
				const result =
					await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
						"sql"
					]`SHOW search_path`.execute(db);
				const searchPath =
					result.rows[0]?.search_path ?? result.rows[0]?.searchPath;
				if (searchPath)
					return (
						searchPath
							.split(",")
							.map((s) => s.trim())
							.map((s) => s.replace(/^["']|["']$/g, ""))
							.filter((s) => !s.startsWith("$") && !s.startsWith("\\$"))[0] ||
						"public"
					);
			} catch {}
			return "public";
		}
		async function getMigrations(config) {
			const betterAuthSchema = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$5$2e$5_drizzle$2d$kit$40$0$2e$31$2e$9_drizzle$2d$orm$40$0$2e$45$2e$1_kysely$40$0$2e$28$2e$11_postgres$40$3$2e$4$2e$8_$5f$_c895ff4b0cee42a06c42fa7318fe39b6$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"getSchema"
			])(config);
			const logger = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createLogger"
			])(config.logger);
			let { kysely: db, databaseType: dbType } = await (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$5$2e$5_$40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$bet_5f9802a6f0eb6c1ddba8f37c39695dee$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"createKyselyAdapter"
			])(config);
			if (!dbType) {
				logger.warn(
					"Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.",
				);
				dbType = "sqlite";
			}
			if (!db) {
				logger.error(
					"Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.",
				);
				process.exit(1);
			}
			let currentSchema = "public";
			if (dbType === "postgres") {
				currentSchema = await getPostgresSchema(db);
				logger.debug(
					`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`,
				);
				try {
					const schemaCheck =
						await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"sql"
						]`
				SELECT schema_name
				FROM information_schema.schemata
				WHERE schema_name = ${currentSchema}
			`.execute(db);
					if (
						!(
							schemaCheck.rows[0]?.schema_name ??
							schemaCheck.rows[0]?.schemaName
						)
					)
						logger.warn(
							`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`,
						);
				} catch (error) {
					logger.debug(
						`Could not verify schema existence: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
			const allTableMetadata = await db.introspection.getTables();
			let tableMetadata = allTableMetadata;
			if (dbType === "postgres")
				try {
					const tablesInSchema =
						await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"sql"
						]`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db);
					const tableNamesInSchema = new Set(
						tablesInSchema.rows.map((row) => row.table_name ?? row.tableName),
					);
					tableMetadata = allTableMetadata.filter(
						(table) =>
							table.schema === currentSchema &&
							tableNamesInSchema.has(table.name),
					);
					logger.debug(
						`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t) => t.name).join(", ") || "(none)"}`,
					);
				} catch (error) {
					logger.warn(
						`Could not filter tables by schema. Using all discovered tables. Error: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			const toBeCreated = [];
			const toBeAdded = [];
			for (const [key, value] of Object.entries(betterAuthSchema)) {
				const table = tableMetadata.find((t) => t.name === key);
				if (!table) {
					const tIndex = toBeCreated.findIndex((t) => t.table === key);
					const tableData = {
						table: key,
						fields: value.fields,
						order: value.order || Infinity,
					};
					const insertIndex = toBeCreated.findIndex(
						(t) => (t.order || Infinity) > tableData.order,
					);
					if (insertIndex === -1)
						if (tIndex === -1) toBeCreated.push(tableData);
						else
							toBeCreated[tIndex].fields = {
								...toBeCreated[tIndex].fields,
								...value.fields,
							};
					else toBeCreated.splice(insertIndex, 0, tableData);
					continue;
				}
				const toBeAddedFields = {};
				for (const [fieldName, field] of Object.entries(value.fields)) {
					const column = table.columns.find((c) => c.name === fieldName);
					if (!column) {
						toBeAddedFields[fieldName] = field;
						continue;
					}
					if (matchType(column.dataType, field.type, dbType)) continue;
					else
						logger.warn(
							`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`,
						);
				}
				if (Object.keys(toBeAddedFields).length > 0)
					toBeAdded.push({
						table: key,
						fields: toBeAddedFields,
						order: value.order || Infinity,
					});
			}
			const migrations = [];
			const useUUIDs = config.advanced?.database?.generateId === "uuid";
			const useNumberId = config.advanced?.database?.generateId === "serial";
			function getType(field, fieldName) {
				const type = field.type;
				const provider = dbType || "sqlite";
				const typeMap = {
					string: {
						sqlite: "text",
						postgres: "text",
						mysql: field.unique
							? "varchar(255)"
							: field.references
								? "varchar(36)"
								: field.sortable
									? "varchar(255)"
									: field.index
										? "varchar(255)"
										: "text",
						mssql:
							field.unique || field.sortable
								? "varchar(255)"
								: field.references
									? "varchar(36)"
									: "varchar(8000)",
					},
					boolean: {
						sqlite: "integer",
						postgres: "boolean",
						mysql: "boolean",
						mssql: "smallint",
					},
					number: {
						sqlite: field.bigint ? "bigint" : "integer",
						postgres: field.bigint ? "bigint" : "integer",
						mysql: field.bigint ? "bigint" : "integer",
						mssql: field.bigint ? "bigint" : "integer",
					},
					date: {
						sqlite: "date",
						postgres: "timestamptz",
						mysql: "timestamp(3)",
						mssql: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
							"sql"
						]`datetime2(3)`,
					},
					json: {
						sqlite: "text",
						postgres: "jsonb",
						mysql: "json",
						mssql: "varchar(8000)",
					},
					id: {
						postgres: useNumberId
							? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
									"sql"
								]`integer GENERATED BY DEFAULT AS IDENTITY`
							: useUUIDs
								? "uuid"
								: "text",
						mysql: useNumberId
							? "integer"
							: useUUIDs
								? "varchar(36)"
								: "varchar(36)",
						mssql: useNumberId
							? "integer"
							: useUUIDs
								? "varchar(36)"
								: "varchar(36)",
						sqlite: useNumberId ? "integer" : "text",
					},
					foreignKeyId: {
						postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
						mysql: useNumberId
							? "integer"
							: useUUIDs
								? "varchar(36)"
								: "varchar(36)",
						mssql: useNumberId
							? "integer"
							: useUUIDs
								? "varchar(36)"
								: "varchar(36)",
						sqlite: useNumberId ? "integer" : "text",
					},
					"string[]": {
						sqlite: "text",
						postgres: "jsonb",
						mysql: "json",
						mssql: "varchar(8000)",
					},
					"number[]": {
						sqlite: "text",
						postgres: "jsonb",
						mysql: "json",
						mssql: "varchar(8000)",
					},
				};
				if (fieldName === "id" || field.references?.field === "id") {
					if (fieldName === "id") return typeMap.id[provider];
					return typeMap.foreignKeyId[provider];
				}
				if (Array.isArray(type)) return "text";
				if (!(type in typeMap))
					throw new Error(
						`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`,
					);
				return typeMap[type][provider];
			}
			const getModelName = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"initGetModelName"
			])({
				schema: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getAuthTables"
				])(config),
				usePlural: false,
			});
			const getFieldName = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
				"initGetFieldName"
			])({
				schema: (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$5$2e$5_$40$better$2d$auth$2b$utils$40$0$2e$3$2e$1_$40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$21_better$2d$call_67579310e3d032f6266823a7be698d9a$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__[
					"getAuthTables"
				])(config),
				usePlural: false,
			});
			function getReferencePath(model, field) {
				try {
					return `${getModelName(model)}.${getFieldName({
						model,
						field,
					})}`;
				} catch {
					return `${model}.${field}`;
				}
			}
			if (toBeAdded.length)
				for (const table of toBeAdded)
					for (const [fieldName, field] of Object.entries(table.fields)) {
						const type = getType(field, fieldName);
						const builder = db.schema.alterTable(table.table);
						if (field.index) {
							const indexName = `${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`;
							const indexBuilder = db.schema
								.createIndex(indexName)
								.on(table.table)
								.columns([fieldName]);
							migrations.push(
								field.unique ? indexBuilder.unique() : indexBuilder,
							);
						}
						const built = builder.addColumn(fieldName, type, (col) => {
							col = field.required !== false ? col.notNull() : col;
							if (field.references)
								col = col
									.references(
										getReferencePath(
											field.references.model,
											field.references.field,
										),
									)
									.onDelete(field.references.onDelete || "cascade");
							if (field.unique) col = col.unique();
							if (
								field.type === "date" &&
								typeof field.defaultValue === "function" &&
								(dbType === "postgres" ||
									dbType === "mysql" ||
									dbType === "mssql")
							)
								if (dbType === "mysql")
									col =
										col.defaultTo(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
												"sql"
											]`CURRENT_TIMESTAMP(3)`,
										);
								else
									col =
										col.defaultTo(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
												"sql"
											]`CURRENT_TIMESTAMP`,
										);
							return col;
						});
						migrations.push(built);
					}
			const toBeIndexed = [];
			if (toBeCreated.length)
				for (const table of toBeCreated) {
					const idType = getType(
						{
							type: useNumberId ? "number" : "string",
						},
						"id",
					);
					let dbT = db.schema
						.createTable(table.table)
						.addColumn("id", idType, (col) => {
							if (useNumberId) {
								if (dbType === "postgres") return col.primaryKey().notNull();
								else if (dbType === "sqlite") return col.primaryKey().notNull();
								else if (dbType === "mssql")
									return col.identity().primaryKey().notNull();
								return col.autoIncrement().primaryKey().notNull();
							}
							if (useUUIDs) {
								if (dbType === "postgres")
									return col
										.primaryKey()
										.defaultTo(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
												"sql"
											]`pg_catalog.gen_random_uuid()`,
										)
										.notNull();
								return col.primaryKey().notNull();
							}
							return col.primaryKey().notNull();
						});
					for (const [fieldName, field] of Object.entries(table.fields)) {
						const type = getType(field, fieldName);
						dbT = dbT.addColumn(fieldName, type, (col) => {
							col = field.required !== false ? col.notNull() : col;
							if (field.references)
								col = col
									.references(
										getReferencePath(
											field.references.model,
											field.references.field,
										),
									)
									.onDelete(field.references.onDelete || "cascade");
							if (field.unique) col = col.unique();
							if (
								field.type === "date" &&
								typeof field.defaultValue === "function" &&
								(dbType === "postgres" ||
									dbType === "mysql" ||
									dbType === "mssql")
							)
								if (dbType === "mysql")
									col =
										col.defaultTo(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
												"sql"
											]`CURRENT_TIMESTAMP(3)`,
										);
								else
									col =
										col.defaultTo(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$11$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
												"sql"
											]`CURRENT_TIMESTAMP`,
										);
							return col;
						});
						if (field.index) {
							const builder = db.schema
								.createIndex(
									`${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`,
								)
								.on(table.table)
								.columns([fieldName]);
							toBeIndexed.push(field.unique ? builder.unique() : builder);
						}
					}
					migrations.push(dbT);
				}
			if (toBeIndexed.length)
				for (const index of toBeIndexed) migrations.push(index);
			async function runMigrations() {
				for (const migration of migrations) await migration.execute();
			}
			async function compileMigrations() {
				return migrations.map((m) => m.compile().sql).join(";\n\n") + ";";
			}
			return {
				toBeCreated,
				toBeAdded,
				runMigrations,
				compileMigrations,
			};
		}
		//# sourceMappingURL=get-migration.mjs.map
	},
];

//# sourceMappingURL=d0383_better-auth_dist_db_1b139c43._.js.map
