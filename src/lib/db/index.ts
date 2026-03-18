import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const globalForDb = globalThis as unknown as {
	pgClient: ReturnType<typeof postgres> | undefined;
};

const client =
	globalForDb.pgClient ?? postgres(process.env.DATABASE_URL!, { max: 10 });

if (process.env.NODE_ENV !== "production") {
	globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
