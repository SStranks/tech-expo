ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "entity_action" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."entity_action";--> statement-breakpoint
CREATE TYPE "public"."entity_action" AS ENUM('INSERT', 'UPDATE', 'DELETE');--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "entity_action" SET DATA TYPE "public"."entity_action" USING "entity_action"::"public"."entity_action";--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "values_new" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;
