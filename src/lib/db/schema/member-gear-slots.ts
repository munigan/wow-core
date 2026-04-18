import { integer, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { members } from "./members";

/** Cached armory gear rows for a member (refreshed by Trigger task). */
export const memberGearSlots = pgTable(
	"member_gear_slots",
	{
		memberId: uuid()
			.notNull()
			.references(() => members.id, { onDelete: "cascade" }),
		sortOrder: integer("sort_order").notNull(),
		slotLabel: text("slot_label").notNull(),
		itemId: integer("item_id"),
		itemName: text("item_name"),
		itemLevel: integer("item_level"),
		quality: integer(),
		enchantStatus: text("enchant_status").notNull(),
		gemStatus: text("gem_status").notNull(),
	},
	(table) => [unique().on(table.memberId, table.sortOrder)],
);
