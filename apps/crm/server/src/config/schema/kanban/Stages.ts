import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { KanbanTable, KanbanTasksOrderTable } from '../index.js';

// ---------- TABLES -------- //
export type KanbanStagesTableInsert = InferInsertModel<typeof KanbanStagesTable>;
export type KanbanStagesTableSelect = InferSelectModel<typeof KanbanStagesTable>;
export const KanbanStagesTable = pgTable('kanban_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  kanbanTableId: uuid('kanban_table_id')
    .references(() => KanbanTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const KanbanStagesTableRelations = relations(KanbanStagesTable, ({ many, one }) => {
  return {
    taskOrder: many(KanbanTasksOrderTable),
    kanban: one(KanbanTable, {
      fields: [KanbanStagesTable.kanbanTableId],
      references: [KanbanTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanStagesTableSchema = createInsertSchema(KanbanStagesTable);
export const selectKanbanStagesTableSchema = createSelectSchema(KanbanStagesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export type InsertKanbanStagesTableSchema = z.infer<typeof insertKanbanStagesTableSchema>;
export type SelectKanbanStagesTableSchema = z.infer<typeof selectKanbanStagesTableSchema>;

export default KanbanStagesTable;
