import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { members } from "./members";
import { raids } from "./raids";

const timestamptz = () => timestamp({ withTimezone: true });

export const raidMembers = pgTable(
	"raid_members",
	{
		id: uuid().primaryKey().defaultRandom(),
		raidId: uuid()
			.notNull()
			.references(() => raids.id, { onDelete: "cascade" }),
		memberId: uuid()
			.notNull()
			.references(() => members.id, { onDelete: "cascade" }),
		createdAt: timestamptz().notNull().defaultNow(),
	},
	(table) => [unique().on(table.raidId, table.memberId)],
);
