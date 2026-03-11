import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { KanbanSymbol } from '#Models/domain/kanban/kanban.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import CompaniesTable from '../companies/Companies.js';
import KanbanStagesTable from './Stages.js';
import KanbanTasksTable from './Tasks.js';

// ---------- TABLES -------- //
export type KanbanTableInsert = InferInsertModel<typeof KanbanTable>;
export type KanbanTableSelect = InferSelectModel<typeof KanbanTable>;
export type KanbanTableUpdate = Partial<Omit<KanbanTableInsert, 'id'>>;
export const KanbanTable = pgTable('kanban', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const KanbanTableRelations = relations(KanbanTable, ({ many, one }) => {
  return {
    stages: many(KanbanStagesTable),
    tasks: many(KanbanTasksTable),
    company: one(CompaniesTable, {
      fields: [KanbanTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanSchema = createInsertSchema(KanbanTable)
  .omit({ id: true })
  .transform((v) => ({ ...v, clientTemporaryId: v.clientTemporaryId as KanbanSymbol, companyId: v.companyId as UUID }));

export const selectKanbanSchema = createSelectSchema(KanbanTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as KanbanSymbol,
  companyId: v.companyId as UUID,
}));

export const updateKanbanSchema = createInsertSchema(KanbanTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanSymbol,
    companyId: v.companyId as UUID,
  }));

export type InsertKanbanSchema = z.infer<typeof insertKanbanSchema>;
export type SelectKanbanSchema = z.infer<typeof selectKanbanSchema>;

export default KanbanTable;
