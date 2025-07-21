import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import KanbanTable from './Kanban.js';
import KanbanStagesTable from './Stages.js';

// ---------- TABLES -------- //
export type TKanbanTasksOrderTableInsert = InferInsertModel<typeof KanbanTasksOrderTable>;
export type TKanbanTasksOrderTableSelect = InferSelectModel<typeof KanbanTasksOrderTable>;
export const KanbanTasksOrderTable = pgTable('kanban_tasks_order', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  taskOrder: text('task_order')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  columnId: uuid('column_id')
    .references(() => KanbanStagesTable.id)
    .notNull()
    .$type<UUID>(),
  kanbanId: uuid('kanban_id')
    .references(() => KanbanTable.id)
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
export const insertTasksOrderSchema = createInsertSchema(KanbanTasksOrderTable);
export const selectTasksOrderSchema = createSelectSchema(KanbanTasksOrderTable);
export type TInsertTasksOrderSchema = z.infer<typeof insertTasksOrderSchema>;
export type TSelectTasksOrderSchema = z.infer<typeof selectTasksOrderSchema>;

export default KanbanTasksOrderTable;
