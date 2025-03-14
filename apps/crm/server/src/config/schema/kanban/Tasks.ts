import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { KanbanStagesTable, TaskChecklistItemTable, TaskCommentsTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type TTasksTableInsert = InferInsertModel<typeof TasksTable>;
export type TTasksTableSelect = InferSelectModel<typeof TasksTable>;
export const TasksTable = pgTable('kanban_tasks', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  serial: varchar({ length: 6 })
    .notNull()
    .$defaultFn(() => nanoid(6)),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').default(false),
  stage: uuid('stage')
    .references(() => KanbanStagesTable.id)
    .notNull()
    .$type<UUID>(),
  description: text('description_text'),
  dueDate: timestamp('due_date', { mode: 'date' }),
  assignedUser: uuid('assigned_user_id')
    .references(() => UserProfileTable.id)
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ---------- RELATIONS -------- //
export const TaskTableRelations = relations(TasksTable, ({ many, one }) => {
  return {
    checklistItems: many(TaskChecklistItemTable),
    comments: many(TaskCommentsTable),
    assignedUser: one(UserProfileTable, {
      fields: [TasksTable.assignedUser],
      references: [UserProfileTable.id],
    }),
    taskStage: one(KanbanStagesTable, {
      fields: [TasksTable.stage],
      references: [KanbanStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertTasksSchema = createInsertSchema(TasksTable);
export const selectTasksSchema = createSelectSchema(TasksTable);
export type TInsertTasksSchema = z.infer<typeof insertTasksSchema>;
export type TSelectTasksSchema = z.infer<typeof selectTasksSchema>;

export default TasksTable;
