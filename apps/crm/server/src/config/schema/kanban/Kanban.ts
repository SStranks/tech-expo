import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { KanbanClientGeneratedId, KanbanId } from '#Models/domain/kanban/kanban.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<KanbanId>(),
  clientGeneratedId: uuid('client_generated_id').unique().$type<KanbanClientGeneratedId>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<CompanyId>(),
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
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as KanbanClientGeneratedId,
    companyId: v.companyId as CompanyId,
  }));

export const selectKanbanSchema = createSelectSchema(KanbanTable).transform((v) => ({
  ...v,
  id: v.id as KanbanId,
  clientGeneratedId: v.clientGeneratedId as KanbanClientGeneratedId,
  companyId: v.companyId as CompanyId,
}));

export const updateKanbanSchema = createInsertSchema(KanbanTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as KanbanId,
    clientGeneratedId: v.clientGeneratedId as KanbanClientGeneratedId,
    companyId: v.companyId as CompanyId,
  }));

export type InsertKanbanSchema = z.infer<typeof insertKanbanSchema>;
export type SelectKanbanSchema = z.infer<typeof selectKanbanSchema>;

export default KanbanTable;
