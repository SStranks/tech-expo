ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_user_id_user_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint