ALTER TABLE "quotes_notes" ALTER COLUMN "quote_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_title_unique" UNIQUE("title");