import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { KanbanTable } from './Kanban';

// ---------- TABLES -------- //
export type TKanbanStagesTable = InferInsertModel<typeof KanbanStagesTable>;
export const KanbanStagesTable = pgTable('kanban_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  kanbanTableId: uuid('kanban_table_id')
    .references(() => KanbanTable.id)
    .notNull(),
});

// -------- RELATIONS ------- //
export const StagesTableRelations = relations(KanbanStagesTable, ({ one }) => {
  return {
    kanbanTable: one(KanbanTable, {
      fields: [KanbanStagesTable.kanbanTableId],
      references: [KanbanTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanStagesTableSchema = createInsertSchema(KanbanStagesTable);
export const selectKanbanStagesTableSchema = createSelectSchema(KanbanStagesTable);
export type TInsertKanbanStagesTableSchema = z.infer<typeof insertKanbanStagesTableSchema>;
export type TSelectKanbanStagesTableSchema = z.infer<typeof selectKanbanStagesTableSchema>;
