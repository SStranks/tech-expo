import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { TasksTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type TTaskCommentsTableInsert = InferInsertModel<typeof TaskCommentsTable>;
export type TTaskCommentsTableSelect = InferSelectModel<typeof TaskCommentsTable>;
export const TaskCommentsTable = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  taskId: uuid('task_id')
    .references(() => TasksTable.id)
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
export const TaskCommentsTableRelations = relations(TaskCommentsTable, ({ one }) => {
  return {
    task: one(TasksTable, {
      fields: [TaskCommentsTable.taskId],
      references: [TasksTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [TaskCommentsTable.createdBy],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertTaskCommentsSchema = createInsertSchema(TaskCommentsTable);
export const selectTaskCommentsSchema = createSelectSchema(TaskCommentsTable);
export type TInsertTaskCommentsSchema = z.infer<typeof insertTaskCommentsSchema>;
export type TSelectTaskCommentsSchema = z.infer<typeof selectTaskCommentsSchema>;

export default TaskCommentsTable;
