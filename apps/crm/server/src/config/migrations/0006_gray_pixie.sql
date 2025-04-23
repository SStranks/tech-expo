ALTER TABLE "task_checklist_item" RENAME TO "kanban_task_checklist";--> statement-breakpoint
ALTER TABLE "task_comments" RENAME TO "kanban_task_comments";--> statement-breakpoint
ALTER TABLE "kanban_task_checklist" DROP CONSTRAINT "task_checklist_item_task_id_kanban_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "kanban_task_comments" DROP CONSTRAINT "task_comments_task_id_kanban_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "kanban_task_comments" DROP CONSTRAINT "task_comments_created_by_user_id_user_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kanban_tasks_order" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "kanban_task_checklist" ADD CONSTRAINT "kanban_task_checklist_task_id_kanban_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."kanban_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_task_comments" ADD CONSTRAINT "kanban_task_comments_task_id_kanban_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."kanban_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_task_comments" ADD CONSTRAINT "kanban_task_comments_created_by_user_id_user_profile_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;