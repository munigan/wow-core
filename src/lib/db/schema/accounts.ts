import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

const timestamptz = () => timestamp({ withTimezone: true });

export const accounts = pgTable("accounts", {
	id: uuid().primaryKey().defaultRandom(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamptz(),
	refreshTokenExpiresAt: timestamptz(),
	scope: text(),
	password: text(),
	createdAt: timestamptz().notNull().defaultNow(),
	updatedAt: timestamptz().notNull().defaultNow(),
});
