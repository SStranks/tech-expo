ALTER TABLE "pipeline_deals_order" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pipeline_deals_order" ADD COLUMN "updated_at" timestamp;