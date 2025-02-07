import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable } from '../companies/Companies';
import { DealsTable } from './Deals';
import { StagesTable } from './Stages';

// ---------- TABLES -------- //
export type TPipelineTable = InferInsertModel<typeof PipelineTable>;
export const PipelineTable = pgTable('pipeline', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const PipelineTableRelations = relations(PipelineTable, ({ many, one }) => {
  return {
    deals: many(DealsTable),
    stages: many(StagesTable),
    company: one(CompaniesTable, {
      fields: [PipelineTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineSchema = createInsertSchema(PipelineTable);
export const selectPipelineSchema = createSelectSchema(PipelineTable);
export type TInsertPipelineSchema = z.infer<typeof insertPipelineSchema>;
export type TSelectPipelineSchema = z.infer<typeof selectPipelineSchema>;
