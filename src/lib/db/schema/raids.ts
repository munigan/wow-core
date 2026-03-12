import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";

const timestamptz = () => timestamp({ withTimezone: true });

export const raids = pgTable("raids", {
	id: uuid().primaryKey().defaultRandom(),
	coreId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	name: text().notNull(),
	date: timestamptz().notNull(),
	createdAt: timestamptz().notNull().defaultNow(),
});
