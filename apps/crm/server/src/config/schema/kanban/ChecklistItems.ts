import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import KanbanTasksTable from './Tasks.js';

// ---------- TABLES -------- //
export type KanbanTaskChecklistItemTableInsert = InferInsertModel<typeof KanbanTaskChecklistItemTable>;
export type KanbanTaskChecklistItemTableSelect = InferSelectModel<typeof KanbanTaskChecklistItemTable>;
export type KanbanTaskChecklistItemTableUpdate = Partial<Omit<KanbanTaskChecklistItemTableInsert, 'id'>>;
export const KanbanTaskChecklistItemTable = pgTable('kanban_task_checklist', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
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
export const insertKanbanTaskChecklistItemSchema = createInsertSchema(KanbanTaskChecklistItemTable);
export const selectKanbanTaskChecklistItemSchema = createSelectSchema(KanbanTaskChecklistItemTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateKanbanTaskChecklistItemSchema = insertKanbanTaskChecklistItemSchema.omit({ id: true }).partial();
export type InsertKanbanTaskChecklistItemsSchema = z.infer<typeof insertKanbanTaskChecklistItemSchema>;
export type SelectKanbanTaskChecklistItemsSchema = z.infer<typeof selectKanbanTaskChecklistItemSchema>;

export default KanbanTaskChecklistItemTable;
