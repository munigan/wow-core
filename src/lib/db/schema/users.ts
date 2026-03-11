import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamptz = () => timestamp({ withTimezone: true });

export const users = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean().notNull().default(false),
	image: text(),
	createdAt: timestamptz().notNull().defaultNow(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
