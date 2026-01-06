import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import KanbanTable from './Kanban.js';
import KanbanTasksOrderTable from './TasksOrder.js';

// ---------- TABLES -------- //
export type KanbanStagesTableInsert = InferInsertModel<typeof KanbanStagesTable>;
export type KanbanStagesTableSelect = InferSelectModel<typeof KanbanStagesTable>;
export type KanbanStagesTableUpdate = Partial<Omit<KanbanStagesTableInsert, 'id'>>;
export const KanbanStagesTable = pgTable('kanban_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  kanbanTableId: uuid('kanban_table_id')
    .references(() => KanbanTable.id, { onDelete: 'cascade' })
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
export const insertKanbanStagesSchema = createInsertSchema(KanbanStagesTable);
export const selectKanbanStagesSchema = createSelectSchema(KanbanStagesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateKanbanStagesSchema = insertKanbanStagesSchema.omit({ id: true }).partial();
export type InsertKanbanStagesSchema = z.infer<typeof insertKanbanStagesSchema>;
export type SelectKanbanStagesSchema = z.infer<typeof selectKanbanStagesSchema>;

export default KanbanStagesTable;
