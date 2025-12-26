import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, PipelineDealsTable, PipelineStagesTable } from '../index.js';

// ---------- TABLES -------- //
export type PipelineTableInsert = InferInsertModel<typeof PipelineTable>;
export type PipelineTableSelect = InferSelectModel<typeof PipelineTable>;
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
    deals: many(PipelineDealsTable),
    stages: many(PipelineStagesTable),
    company: one(CompaniesTable, {
      fields: [PipelineTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineSchema = createInsertSchema(PipelineTable);
export const selectPipelineSchema = createSelectSchema(PipelineTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export type InsertPipelineSchema = z.infer<typeof insertPipelineSchema>;
export type SelectPipelineSchema = z.infer<typeof selectPipelineSchema>;

export default PipelineTable;
