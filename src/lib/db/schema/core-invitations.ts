import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const coreInvitations = pgTable("core_invitations", {
	id: uuid().primaryKey().defaultRandom(),
	email: text().notNull(),
	inviterId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	role: text().notNull().default("member"),
	status: text().notNull().default("pending"),
	createdAt: timestamptz().notNull().defaultNow(),
	expiresAt: timestamptz().notNull(),
});
