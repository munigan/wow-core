import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
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
	activeOrganizationId: uuid().references(() => cores.id, {
		onDelete: "set null",
	}),
	createdAt: timestamptz().notNull().defaultNow(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
