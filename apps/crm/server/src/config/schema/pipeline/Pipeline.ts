import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, DealsTable, PipelineStagesTable } from '../index.js';

// ---------- TABLES -------- //
export type TPipelineTableInsert = InferInsertModel<typeof PipelineTable>;
export type TPipelineTableSelect = InferSelectModel<typeof PipelineTable>;
export const PipelineTable = pgTable('pipeline', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const PipelineTableRelations = relations(PipelineTable, ({ many, one }) => {
  return {
    deals: many(DealsTable),
    stages: many(PipelineStagesTable),
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

export default PipelineTable;
