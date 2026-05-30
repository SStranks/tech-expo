import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { PipelineClientGeneratedId, PipelineId } from '#Models/domain/pipeline/pipeline.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import CompaniesTable from '../companies/Companies.js';
import PipelineDealsTable from './Deals.js';
import PipelineStagesTable from './Stages.js';

// ---------- TABLES -------- //
export type PipelineTableInsert = InferInsertModel<typeof PipelineTable>;
export type PipelineTableSelect = InferSelectModel<typeof PipelineTable>;
export type PipelineTableUpdate = Partial<Omit<PipelineTableInsert, 'id'>>;
export const PipelineTable = pgTable('pipeline', {
  id: uuid('id').primaryKey().defaultRandom().$type<PipelineId>(),
  clientGeneratedId: uuid('client_generated_id').unique().$type<PipelineClientGeneratedId>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<CompanyId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const PipelineTableRelations = relations(PipelineTable, ({ many, one }) => {
  return {
    deals: many(PipelineDealsTable),
    stages: many(PipelineStagesTable),
    company: one(CompaniesTable, {
      fields: [PipelineTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineSchema = createInsertSchema(PipelineTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as PipelineClientGeneratedId,
    companyId: v.companyId as CompanyId,
  }));

export const selectPipelineSchema = createSelectSchema(PipelineTable).transform((v) => ({
  ...v,
  id: v.id as PipelineId,
  clientGeneratedId: v.clientGeneratedId as PipelineClientGeneratedId,
  companyId: v.companyId as CompanyId,
}));

export const updatePipelineSchema = createInsertSchema(PipelineTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as PipelineId,
    clientGeneratedId: v.clientGeneratedId as PipelineClientGeneratedId,
    companyId: v.companyId as CompanyId,
  }));

export type InsertPipelineSchema = z.infer<typeof insertPipelineSchema>;
export type SelectPipelineSchema = z.infer<typeof selectPipelineSchema>;

export default PipelineTable;
