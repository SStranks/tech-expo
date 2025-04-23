CREATE TABLE "pipeline_deals_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_order" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"column_id" uuid NOT NULL,
	"pipeline_id" uuid NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "kanban_tasks_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_order" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"column_id" uuid NOT NULL,
	"kanban_id" uuid NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "deals" RENAME TO "pipeline_deals";--> statement-breakpoint
ALTER TABLE "pipeline_deals" DROP CONSTRAINT "deals_company_name_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "pipeline_deals" DROP CONSTRAINT "deals_deal_owner_user_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "pipeline_deals" DROP CONSTRAINT "deals_deal_contact_contacts_id_fk";
--> statement-breakpoint
ALTER TABLE "pipeline_deals" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD COLUMN "serial" varchar(6) NOT NULL;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD COLUMN "pipeline_stage" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "kanban_tasks" ADD COLUMN "serial" varchar(6) NOT NULL;--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ADD CONSTRAINT "pipeline_deals_order_column_id_pipeline_stages_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ADD CONSTRAINT "pipeline_deals_order_pipeline_id_pipeline_id_fk" FOREIGN KEY ("pipeline_id") REFERENCES "public"."pipeline"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ADD CONSTRAINT "kanban_tasks_order_column_id_kanban_stages_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."kanban_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ADD CONSTRAINT "kanban_tasks_order_kanban_id_kanban_id_fk" FOREIGN KEY ("kanban_id") REFERENCES "public"."kanban"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_company_name_companies_id_fk" FOREIGN KEY ("company_name") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_pipeline_stage_pipeline_stages_id_fk" FOREIGN KEY ("pipeline_stage") REFERENCES "public"."pipeline_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_deal_owner_user_profile_id_fk" FOREIGN KEY ("deal_owner") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_deal_contact_contacts_id_fk" FOREIGN KEY ("deal_contact") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" DROP COLUMN "deal_stage";--> statement-breakpoint
DROP TYPE "public"."deal_stage";