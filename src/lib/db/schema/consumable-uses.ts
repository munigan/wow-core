import {
	boolean,
	integer,
	pgTable,
	smallint,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const consumableUses = pgTable("consumable_uses", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	spellId: integer().notNull(),
	spellName: text().notNull(),
	type: text().notNull(),
	prePot: boolean().notNull(),
	count: smallint().notNull(),
});
