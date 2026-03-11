import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamptz = () => timestamp({ withTimezone: true });

export const verifications = pgTable("verifications", {
	id: uuid().primaryKey().defaultRandom(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamptz().notNull(),
	createdAt: timestamptz().notNull().defaultNow(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
