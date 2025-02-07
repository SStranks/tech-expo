import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { TasksTable } from './Tasks';

// ---------- TABLES -------- //
export type TTaskChecklistItemTable = InferInsertModel<typeof TaskChecklistItemTable>;
export const TaskChecklistItemTable = pgTable('task_checklist_item', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  taskId: uuid('task_id')
    .references(() => TasksTable.id)
    .notNull(),
});

// ---------- RELATIONS -------- //
export const TaskChecklistItemRelations = relations(TaskChecklistItemTable, ({ one }) => {
  return {
    task: one(TasksTable, {
      fields: [TaskChecklistItemTable.taskId],
      references: [TasksTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertTaskChecklistItemsSchema = createInsertSchema(TaskChecklistItemTable);
export const selectTaskChecklistItemsSchema = createSelectSchema(TaskChecklistItemTable);
export type TInsertTaskChecklistItemsSchema = z.infer<typeof insertTaskChecklistItemsSchema>;
export type TSelectTaskChecklistItemsSchema = z.infer<typeof selectTaskChecklistItemsSchema>;
