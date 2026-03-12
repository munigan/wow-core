import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamptz = () => timestamp({ withTimezone: true });

export const cores = pgTable("cores", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	slug: text().notNull().unique(),
	logo: text(),
	metadata: text(),
	realm: text().notNull(),
	raidSize: text().notNull(),
	createdAt: timestamptz().notNull().defaultNow(),
});
