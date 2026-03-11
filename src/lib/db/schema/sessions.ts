import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const sessions = pgTable("sessions", {
	id: uuid().primaryKey().defaultRandom(),
	expiresAt: timestamptz().notNull(),
	token: text().notNull().unique(),
	ipAddress: text(),
	userAgent: text(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamptz().notNull().defaultNow(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
