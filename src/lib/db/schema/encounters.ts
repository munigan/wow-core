import { integer, pgTable, smallint, text, uuid } from "drizzle-orm/pg-core";
import { raids } from "./raids";

export const encounters = pgTable("encounters", {
	id: uuid().primaryKey().defaultRandom(),
	raidId: uuid()
		.notNull()
		.references(() => raids.id, { onDelete: "cascade" }),
	bossName: text().notNull(),
	startTime: text().notNull(),
	endTime: text().notNull(),
	durationMs: integer().notNull(),
	result: text().notNull(),
	difficulty: text(),
	order: smallint().notNull(),
});
