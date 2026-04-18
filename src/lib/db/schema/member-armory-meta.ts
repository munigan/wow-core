import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { members } from "./members";

const timestamptz = () => timestamp({ withTimezone: true });

/** Last armory sync outcome per member (error message or null if last run succeeded). */
export const memberArmoryMeta = pgTable("member_armory_meta", {
	memberId: uuid("member_id")
		.primaryKey()
		.notNull()
		.references(() => members.id, { onDelete: "cascade" }),
	syncedAt: timestamptz(),
	fetchError: text(),
});
