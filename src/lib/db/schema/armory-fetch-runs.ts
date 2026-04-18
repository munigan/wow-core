import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { cores } from "./cores";
import { members } from "./members";

const timestamptz = () => timestamp({ withTimezone: true });

/**
 * Tracks Trigger.dev run ids for armory fetches so `getArmoryRefreshStatus` can
 * validate `runId` against the active core (prevents cross-tenant probing).
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
