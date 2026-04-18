import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamptz = () => timestamp({ withTimezone: true });

/** Cached WotLK item tooltip rows (Wowhead-shaped) for loot-council / offline queries. */
export const wotlkItems = pgTable("wotlk_items", {
	itemId: integer().primaryKey().notNull(),
	name: text().notNull(),
	quality: integer().notNull(),
	icon: text().notNull(),
	tooltipHtml: text("tooltip_html").notNull(),
	/** Warmane realm string used when this row was last refreshed (see `cores.realm`). */
	fetchedForRealm: text("fetched_for_realm").notNull(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
