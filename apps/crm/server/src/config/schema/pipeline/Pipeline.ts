import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { PipelineSymbol } from '#Models/domain/pipeline/pipeline.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
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
    clientTemporaryId: v.clientTemporaryId as PipelineSymbol,
    companyId: v.companyId as UUID,
  }));

export const selectPipelineSchema = createSelectSchema(PipelineTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as PipelineSymbol,
  companyId: v.companyId as UUID,
}));

export const updatePipelineSchema = createInsertSchema(PipelineTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as PipelineSymbol,
    companyId: v.companyId as UUID,
  }));

export type InsertPipelineSchema = z.infer<typeof insertPipelineSchema>;
export type SelectPipelineSchema = z.infer<typeof selectPipelineSchema>;

export default PipelineTable;
