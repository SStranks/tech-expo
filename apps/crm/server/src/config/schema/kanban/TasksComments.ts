import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { KanbanTasksTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type KanbanTaskCommentsTableInsert = InferInsertModel<typeof KanbanTaskCommentsTable>;
export type KanbanTaskCommentsTableSelect = InferSelectModel<typeof KanbanTaskCommentsTable>;
export const KanbanTaskCommentsTable = pgTable('kanban_task_comments', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  taskId: uuid('task_id')
    .references(() => KanbanTasksTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  createdBy: uuid('created_by_user_id')
    .references(() => UserProfileTable.id)
    .$type<UUID>(),
  comment: text('comment_text'),
});

// ---------- RELATIONS -------- //
export const KanbanTaskCommentsTableRelations = relations(KanbanTaskCommentsTable, ({ one }) => {
  return {
    task: one(KanbanTasksTable, {
      fields: [KanbanTaskCommentsTable.taskId],
      references: [KanbanTasksTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [KanbanTaskCommentsTable.createdBy],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTaskCommentsSchema = createInsertSchema(KanbanTaskCommentsTable);
export const selectKanbanTaskCommentsSchema = createSelectSchema(KanbanTaskCommentsTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export type InsertKanbanTaskCommentsSchema = z.infer<typeof insertKanbanTaskCommentsSchema>;
export type SelectKanbanTaskCommentsSchema = z.infer<typeof selectKanbanTaskCommentsSchema>;

export default KanbanTaskCommentsTable;
