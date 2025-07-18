CREATE TYPE "public"."entity_action" AS ENUM('INSERT', 'UPDATE', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."business_type" AS ENUM('B2B', 'B2C');--> statement-breakpoint
CREATE TYPE "public"."company_size" AS ENUM('MICRO', 'SMALL', 'MEDIUM', 'LARGE');--> statement-breakpoint
CREATE TYPE "public"."contact_stage" AS ENUM('NEW', 'CONTACTED', 'INTERESTED', 'UNQUALIFIED', 'QUALIFIED', 'NEGOTIATION', 'LOST', 'WON', 'CHURNED');--> statement-breakpoint
CREATE TYPE "public"."quote_stage" AS ENUM('DRAFT', 'SENT', 'ACCEPTED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ROOT', 'ADMIN', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TYPE "public"."company_role" AS ENUM('ADMIN', 'SALES_MANAGER', 'SALES_PERSON', 'SALES_INTERN');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" varchar(255) NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_action" "entity_action" NOT NULL,
	"entity_timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"values_original" jsonb,
	"values_new" jsonb
);
--> statement-breakpoint
CREATE TABLE "calendar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "calendar_event_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"calendar_id" uuid NOT NULL,
	CONSTRAINT "calendar_event_categories_title_calendar_id_unique" UNIQUE("title","calendar_id")
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"calendar_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"color_hex_6" char(7),
	"description" text NOT NULL,
	"event_start" timestamp NOT NULL,
	"event_end" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_event_participants" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"company_size" "company_size" NOT NULL,
	"total_revenue" double precision NOT NULL,
	"industry" varchar(100) NOT NULL,
	"business_type" "business_type" NOT NULL,
	"country_id" uuid NOT NULL,
	"website" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_company_name_unique" UNIQUE("company_name")
);
--> statement-breakpoint
CREATE TABLE "companies_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_text" text NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(255) NOT NULL,
	"company_id" uuid NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"stage" "contact_stage" NOT NULL,
	"timezone_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_text" text NOT NULL,
	"contact_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"num_code" integer NOT NULL,
	"alpha_2_code" varchar NOT NULL,
	"alpha_3_code" varchar NOT NULL,
	"short_name" varchar(100) NOT NULL,
	"nationality" varchar(100) NOT NULL,
	CONSTRAINT "countries_num_code_unique" UNIQUE("num_code"),
	CONSTRAINT "countries_alpha_2_code_unique" UNIQUE("alpha_2_code"),
	CONSTRAINT "countries_alpha_3_code_unique" UNIQUE("alpha_3_code"),
	CONSTRAINT "countries_short_name_unique" UNIQUE("short_name")
);
--> statement-breakpoint
CREATE TABLE "kanban_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"kanban_table_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanban" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanban_task_checklist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"task_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanban_task_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by_user_id" uuid,
	"comment_text" text
);
--> statement-breakpoint
CREATE TABLE "kanban_tasks_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_order" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"column_id" uuid NOT NULL,
	"kanban_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "kanban_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" varchar(6) NOT NULL,
	"title" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false,
	"stage" uuid NOT NULL,
	"description_text" text,
	"due_date" timestamp,
	"assigned_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_deals_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_order" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"column_id" uuid NOT NULL,
	"pipeline_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pipeline_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" varchar(6) NOT NULL,
	"title" varchar(255) NOT NULL,
	"company_name" uuid NOT NULL,
	"pipeline_stage" uuid NOT NULL,
	"total_revenue" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"deal_owner" uuid NOT NULL,
	"deal_contact" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"pipeline_table_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"price" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"discount" numeric(4, 2) DEFAULT '0.00' NOT NULL,
	"total" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"quote_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_text" text NOT NULL,
	"quote_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"company_id" uuid NOT NULL,
	"total" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"sales_tax" numeric(4, 2) DEFAULT '20.00' NOT NULL,
	"quote_stage" "quote_stage" NOT NULL,
	"prepared_for_contact_id" uuid NOT NULL,
	"prepared_by_user_id" uuid NOT NULL,
	"issued_at" timestamp,
	"due_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quotes_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "time_zones_utc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alpha_2_code" char(2) NOT NULL,
	"gmt_offset" char(6) NOT NULL,
	"country_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(255),
	"telephone" varchar(255),
	"timezone_id" uuid,
	"country_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"company_role" "company_role" NOT NULL,
	"profile_image" char(32),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_tokens" (
	"jti" uuid PRIMARY KEY NOT NULL,
	"iat" integer NOT NULL,
	"exp" integer NOT NULL,
	"acc" integer DEFAULT 0 NOT NULL,
	"activated" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"user_role" "user_role" DEFAULT 'USER' NOT NULL,
	"password" varchar(255) DEFAULT '' NOT NULL,
	"password_changed_at" timestamp DEFAULT now() NOT NULL,
	"password_reset_token" varchar(64),
	"password_reset_expires" timestamp,
	"account_created_at" timestamp DEFAULT now() NOT NULL,
	"account_updated_at" timestamp DEFAULT now() NOT NULL,
	"account_frozen_at" timestamp DEFAULT now(),
	"account_frozen" boolean DEFAULT true NOT NULL,
	"account_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event_categories" ADD CONSTRAINT "calendar_event_categories_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_category_id_calendar_event_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."calendar_event_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event_participants" ADD CONSTRAINT "calendar_event_participants_event_id_calendar_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event_participants" ADD CONSTRAINT "calendar_event_participants_user_id_user_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies_notes" ADD CONSTRAINT "companies_notes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies_notes" ADD CONSTRAINT "companies_notes_created_by_user_id_user_profile_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_timezone_id_time_zones_utc_id_fk" FOREIGN KEY ("timezone_id") REFERENCES "public"."time_zones_utc"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts_notes" ADD CONSTRAINT "contacts_notes_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts_notes" ADD CONSTRAINT "contacts_notes_created_by_user_id_user_profile_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_stages" ADD CONSTRAINT "kanban_stages_kanban_table_id_kanban_id_fk" FOREIGN KEY ("kanban_table_id") REFERENCES "public"."kanban"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban" ADD CONSTRAINT "kanban_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_task_checklist" ADD CONSTRAINT "kanban_task_checklist_task_id_kanban_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."kanban_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_task_comments" ADD CONSTRAINT "kanban_task_comments_task_id_kanban_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."kanban_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_task_comments" ADD CONSTRAINT "kanban_task_comments_created_by_user_id_user_profile_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ADD CONSTRAINT "kanban_tasks_order_column_id_kanban_stages_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."kanban_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ADD CONSTRAINT "kanban_tasks_order_kanban_id_kanban_id_fk" FOREIGN KEY ("kanban_id") REFERENCES "public"."kanban"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks" ADD CONSTRAINT "kanban_tasks_stage_kanban_stages_id_fk" FOREIGN KEY ("stage") REFERENCES "public"."kanban_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_tasks" ADD CONSTRAINT "kanban_tasks_assigned_user_id_user_profile_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ADD CONSTRAINT "pipeline_deals_order_column_id_pipeline_stages_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ADD CONSTRAINT "pipeline_deals_order_pipeline_id_pipeline_id_fk" FOREIGN KEY ("pipeline_id") REFERENCES "public"."pipeline"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_company_name_companies_id_fk" FOREIGN KEY ("company_name") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_pipeline_stage_pipeline_stages_id_fk" FOREIGN KEY ("pipeline_stage") REFERENCES "public"."pipeline_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_deal_owner_user_profile_id_fk" FOREIGN KEY ("deal_owner") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_deals" ADD CONSTRAINT "pipeline_deals_deal_contact_contacts_id_fk" FOREIGN KEY ("deal_contact") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_pipeline_table_id_pipeline_id_fk" FOREIGN KEY ("pipeline_table_id") REFERENCES "public"."pipeline"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline" ADD CONSTRAINT "pipeline_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_services" ADD CONSTRAINT "quote_services_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes_notes" ADD CONSTRAINT "quotes_notes_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes_notes" ADD CONSTRAINT "quotes_notes_created_by_user_id_user_profile_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_prepared_for_contact_id_contacts_id_fk" FOREIGN KEY ("prepared_for_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_prepared_by_user_id_user_profile_id_fk" FOREIGN KEY ("prepared_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_zones_utc" ADD CONSTRAINT "time_zones_utc_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_timezone_id_time_zones_utc_id_fk" FOREIGN KEY ("timezone_id") REFERENCES "public"."time_zones_utc"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_index" ON "user" USING btree ("email");