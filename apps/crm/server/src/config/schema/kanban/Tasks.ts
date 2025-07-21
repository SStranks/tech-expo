import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod/v4';

import {
  KanbanStagesTable,
  KanbanTaskChecklistItemTable,
  KanbanTaskCommentsTable,
  UserProfileTable,
} from '../index.js';

// ---------- TABLES -------- //
export type TKanbanTasksTableInsert = InferInsertModel<typeof KanbanTasksTable>;
export type TKanbanTasksTableSelect = InferSelectModel<typeof KanbanTasksTable>;
export const KanbanTasksTable = pgTable('kanban_tasks', {
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
export const KanbanTaskTableRelations = relations(KanbanTasksTable, ({ many, one }) => {
  return {
    checklistItems: many(KanbanTaskChecklistItemTable),
    comments: many(KanbanTaskCommentsTable),
    assignedUser: one(UserProfileTable, {
      fields: [KanbanTasksTable.assignedUser],
      references: [UserProfileTable.id],
    }),
    taskStage: one(KanbanStagesTable, {
      fields: [KanbanTasksTable.stage],
      references: [KanbanStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTasksSchema = createInsertSchema(KanbanTasksTable);
export const selectKanbanTasksSchema = createSelectSchema(KanbanTasksTable);
export type TInsertKanbanTasksSchema = z.infer<typeof insertKanbanTasksSchema>;
export type TSelectKanbanTasksSchema = z.infer<typeof selectKanbanTasksSchema>;

export default KanbanTasksTable;
