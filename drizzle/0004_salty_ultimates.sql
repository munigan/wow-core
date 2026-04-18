CREATE TABLE "wotlk_items" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quality" integer NOT NULL,
	"icon" text NOT NULL,
	"tooltip_html" text NOT NULL,
	"fetched_for_realm" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
