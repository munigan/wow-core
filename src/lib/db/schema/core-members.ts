import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const coreMembers = pgTable("core_members", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: uuid()
		.notNull()
		.references(() => cores.id, { onDelete: "cascade" }),
	role: text().notNull().default("member"),
	createdAt: timestamptz().notNull().defaultNow(),
});
