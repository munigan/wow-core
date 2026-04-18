CREATE TABLE "armory_fetch_runs" (
	"run_id" text PRIMARY KEY NOT NULL,
	"member_id" uuid NOT NULL,
	"core_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "armory_fetch_runs_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "member_armory_meta" (
	"member_id" uuid PRIMARY KEY NOT NULL,
	"synced_at" timestamp with time zone,
	"fetch_error" text
);
--> statement-breakpoint
CREATE TABLE "member_gear_slots" (
	"member_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"slot_label" text NOT NULL,
	"item_id" integer,
	"item_name" text,
	"item_level" integer,
	"quality" integer,
	"enchant_status" text NOT NULL,
	"gem_status" text NOT NULL,
	CONSTRAINT "member_gear_slots_memberId_sort_order_unique" UNIQUE("member_id","sort_order")
);
--> statement-breakpoint
ALTER TABLE "armory_fetch_runs" ADD CONSTRAINT "armory_fetch_runs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armory_fetch_runs" ADD CONSTRAINT "armory_fetch_runs_core_id_cores_id_fk" FOREIGN KEY ("core_id") REFERENCES "public"."cores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_armory_meta" ADD CONSTRAINT "member_armory_meta_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_gear_slots" ADD CONSTRAINT "member_gear_slots_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;