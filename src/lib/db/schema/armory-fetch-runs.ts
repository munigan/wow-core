import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { members } from "./members";

const timestamptz = () => timestamp({ withTimezone: true });

/**
 * Tracks Trigger.dev run ids for in-flight `fetch-member-armory-gear` jobs
 * (one row per member; reconciled when the task finishes).
 */
export const armoryFetchRuns = pgTable(
	"armory_fetch_runs",
	{
		runId: text("run_id").primaryKey().notNull(),
		memberId: uuid("member_id")
			.notNull()
			.references(() => members.id, { onDelete: "cascade" }),
		coreId: uuid("core_id")
			.notNull()
			.references(() => cores.id, { onDelete: "cascade" }),
		createdAt: timestamptz().notNull().defaultNow(),
	},
	(table) => [unique().on(table.memberId)],
);
