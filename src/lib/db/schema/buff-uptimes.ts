import { pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { encounters } from "./encounters";

export const buffUptimes = pgTable("buff_uptimes", {
	id: uuid().primaryKey().defaultRandom(),
	encounterId: uuid()
		.notNull()
		.references(() => encounters.id, { onDelete: "cascade" }),
	playerGuid: text().notNull(),
	flaskUptimePercent: real().notNull(),
	foodUptimePercent: real().notNull(),
});
