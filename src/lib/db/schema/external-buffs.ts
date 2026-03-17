import { integer, pgTable, real, smallint, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const externalBuffs = pgTable("external_buffs", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	spellId: integer().notNull(),
	spellName: text().notNull(),
	sourceGuid: text().notNull(),
	sourceName: text().notNull(),
	count: smallint().notNull(),
	uptimePercent: real().notNull(),
});
