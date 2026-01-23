import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import KanbanTable from './Kanban.js';

// ---------- TABLES -------- //
export type KanbanStagesTableInsert = InferInsertModel<typeof KanbanStagesTable>;
export type KanbanStagesTableSelect = InferSelectModel<typeof KanbanStagesTable>;
export type KanbanStagesTableUpdate = Partial<Omit<KanbanStagesTableInsert, 'id'>>;
export const KanbanStagesTable = pgTable('kanban_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  kanbanId: uuid('kanban_id')
    .references(() => KanbanTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const KanbanStagesTableRelations = relations(KanbanStagesTable, ({ one }) => {
  return {
    kanban: one(KanbanTable, {
      fields: [KanbanStagesTable.kanbanId],
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
