import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { KanbanTasksTable } from '../index.js';

// ---------- TABLES -------- //
export type TKanbanTaskChecklistItemTableInsert = InferInsertModel<typeof KanbanTaskChecklistItemTable>;
export type TKanbanTaskChecklistItemTableSelect = InferSelectModel<typeof KanbanTaskChecklistItemTable>;
export const KanbanTaskChecklistItemTable = pgTable('kanban_task_checklist', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  taskId: uuid('task_id')
    .references(() => KanbanTasksTable.id)
    .notNull()
    .$type<UUID>(),
});

// ---------- RELATIONS -------- //
export const KanbanTaskChecklistItemRelations = relations(KanbanTaskChecklistItemTable, ({ one }) => {
  return {
    task: one(KanbanTasksTable, {
      fields: [KanbanTaskChecklistItemTable.taskId],
      references: [KanbanTasksTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTaskChecklistItemsSchema = createInsertSchema(KanbanTaskChecklistItemTable);
export const selectKanbanTaskChecklistItemsSchema = createSelectSchema(KanbanTaskChecklistItemTable);
export type TInsertKanbanTaskChecklistItemsSchema = z.infer<typeof insertKanbanTaskChecklistItemsSchema>;
export type TSelectKanbanTaskChecklistItemsSchema = z.infer<typeof selectKanbanTaskChecklistItemsSchema>;

export default KanbanTaskChecklistItemTable;
