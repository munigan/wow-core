import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const encounterPlayers = pgTable("encounter_players", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	playerName: text().notNull(),
	class: text(),
	spec: text(),
	damage: bigint({ mode: "number" }).notNull(),
	damageTaken: bigint({ mode: "number" }).notNull(),
});
