import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { KanbanStageSymbol } from '#Models/domain/kanban/stage/stage.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import KanbanTable from './Kanban.js';

// ---------- TABLES -------- //
export type KanbanStagesTableInsert = InferInsertModel<typeof KanbanStagesTable>;
export type KanbanStagesTableSelect = InferSelectModel<typeof KanbanStagesTable>;
export type KanbanStagesTableUpdate = Partial<Omit<KanbanStagesTableInsert, 'id'>>;
export const KanbanStagesTable = pgTable('kanban_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
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
export const insertKanbanStagesSchema = createInsertSchema(KanbanStagesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as KanbanStageSymbol,
    kanbanId: v.kanbanId as UUID,
  }));

export const selectKanbanStagesSchema = createSelectSchema(KanbanStagesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as KanbanStageSymbol,
  kanbanId: v.kanbanId as UUID,
}));

export const updateKanbanStagesSchema = createInsertSchema(KanbanStagesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanStageSymbol,
    kanbanId: v.kanbanId as UUID,
  }));

export type InsertKanbanStagesSchema = z.infer<typeof insertKanbanStagesSchema>;
export type SelectKanbanStagesSchema = z.infer<typeof selectKanbanStagesSchema>;

export default KanbanStagesTable;
