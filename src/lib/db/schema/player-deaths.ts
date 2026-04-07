import {
	bigint,
	integer,
	jsonb,
	pgTable,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const playerDeaths = pgTable("player_deaths", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	playerName: text().notNull(),
	timestamp: bigint({ mode: "number" }).notNull(),
	timeIntoEncounter: integer().notNull(),
	killingBlow: jsonb(),
	recap: jsonb().notNull(),
});
