import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import KanbanTable from './Kanban.js';
import KanbanStagesTable from './Stages.js';

// ---------- TABLES -------- //
export type KanbanTasksOrderTableInsert = InferInsertModel<typeof KanbanTasksOrderTable>;
export type KanbanTasksOrderTableSelect = InferSelectModel<typeof KanbanTasksOrderTable>;
export type KanbanTasksOrderTableUpdate = Partial<Omit<KanbanTasksOrderTableInsert, 'id'>>;
export const KanbanTasksOrderTable = pgTable('kanban_tasks_order', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  taskOrder: text('task_order')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  columnId: uuid('column_id')
    .references(() => KanbanStagesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  kanbanId: uuid('kanban_id')
    .references(() => KanbanTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});

// ---------- RELATIONS -------- //
export const KanbanTaskOrderTableRelations = relations(KanbanTasksOrderTable, ({ one }) => {
  return {
    kanban: one(KanbanTable, {
      fields: [KanbanTasksOrderTable.kanbanId],
      references: [KanbanTable.id],
    }),
    stage: one(KanbanStagesTable, {
      fields: [KanbanTasksOrderTable.columnId],
      references: [KanbanStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTasksOrderSchema = createInsertSchema(KanbanTasksOrderTable);
export const selectKanbanTasksOrderSchema = createSelectSchema(KanbanTasksOrderTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateKanbanTasksOrderSchema = insertKanbanTasksOrderSchema.omit({ id: true }).partial();
export type InsertKanbanTasksOrderSchema = z.infer<typeof insertKanbanTasksOrderSchema>;
export type SelectKanbanTasksOrderSchema = z.infer<typeof selectKanbanTasksOrderSchema>;

export default KanbanTasksOrderTable;
