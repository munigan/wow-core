import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";

const timestamptz = () => timestamp({ withTimezone: true });

export const members = pgTable(
	"members",
	{
		id: uuid().primaryKey().defaultRandom(),
		coreId: uuid()
			.notNull()
			.references(() => cores.id, { onDelete: "cascade" }),
		name: text().notNull(),
		class: text(),
		spec: text(),
		role: text(),
		createdAt: timestamptz().notNull().defaultNow(),
		updatedAt: timestamptz().notNull().defaultNow(),
	},
	(table) => [unique().on(table.coreId, table.name)],
);
