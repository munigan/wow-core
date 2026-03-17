CREATE TABLE "buff_uptimes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"player_guid" text NOT NULL,
	"flask_uptime_percent" real NOT NULL,
	"food_uptime_percent" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consumable_uses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"player_guid" text NOT NULL,
	"spell_id" integer NOT NULL,
	"spell_name" text NOT NULL,
	"type" text NOT NULL,
	"pre_pot" boolean NOT NULL,
	"count" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encounter_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"player_guid" text NOT NULL,
	"player_name" text NOT NULL,
	"class" text,
	"spec" text,
	"damage" bigint NOT NULL,
	"damage_taken" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encounters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raid_id" uuid NOT NULL,
	"boss_name" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"duration_ms" integer NOT NULL,
	"result" text NOT NULL,
	"difficulty" text,
	"order" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_buffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"player_guid" text NOT NULL,
	"spell_id" integer NOT NULL,
	"spell_name" text NOT NULL,
	"source_guid" text NOT NULL,
	"source_name" text NOT NULL,
	"count" smallint NOT NULL,
	"uptime_percent" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_deaths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encounter_id" uuid NOT NULL,
	"player_guid" text NOT NULL,
	"player_name" text NOT NULL,
	"timestamp" bigint NOT NULL,
	"time_into_encounter" integer NOT NULL,
	"killing_blow" jsonb,
	"recap" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "raid_instance" text;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "duration_ms" integer;--> statement-breakpoint
ALTER TABLE "buff_uptimes" ADD CONSTRAINT "buff_uptimes_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumable_uses" ADD CONSTRAINT "consumable_uses_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounter_players" ADD CONSTRAINT "encounter_players_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_raid_id_raids_id_fk" FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_buffs" ADD CONSTRAINT "external_buffs_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_deaths" ADD CONSTRAINT "player_deaths_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;