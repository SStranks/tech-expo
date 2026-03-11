import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { KanbanTaskChecklistSymbol } from '#Models/domain/kanban/task/task.types.js';

import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import KanbanTasksTable from './Tasks.js';

// ---------- TABLES -------- //
export type KanbanTaskChecklistItemTableInsert = InferInsertModel<typeof KanbanTaskChecklistItemTable>;
export type KanbanTaskChecklistItemTableSelect = InferSelectModel<typeof KanbanTaskChecklistItemTable>;
export type KanbanTaskChecklistItemTableUpdate = Partial<Omit<KanbanTaskChecklistItemTableInsert, 'id'>>;
export const KanbanTaskChecklistItemTable = pgTable('kanban_task_checklist', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  taskId: uuid('task_id')
    .references(() => KanbanTasksTable.id, { onDelete: 'cascade' })
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
export const insertKanbanTaskChecklistItemSchema = createInsertSchema(KanbanTaskChecklistItemTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskChecklistSymbol,
    taskId: v.taskId as UUID,
  }));

export const selectKanbanTaskChecklistItemSchema = createSelectSchema(KanbanTaskChecklistItemTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as KanbanTaskChecklistSymbol,
  taskId: v.taskId as UUID,
}));

export const updateKanbanTaskChecklistItemSchema = createInsertSchema(KanbanTaskChecklistItemTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskChecklistSymbol,
    taskId: v.taskId as UUID,
  }));

export type InsertKanbanTaskChecklistItemsSchema = z.infer<typeof insertKanbanTaskChecklistItemSchema>;
export type SelectKanbanTaskChecklistItemsSchema = z.infer<typeof selectKanbanTaskChecklistItemSchema>;

export default KanbanTaskChecklistItemTable;
