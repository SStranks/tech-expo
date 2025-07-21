import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { PipelineStagesTable, PipelineTable } from '../index.js';

// ---------- TABLES -------- //
export type TPipelineDealsOrderTableInsert = InferInsertModel<typeof PipelineDealsOrderTable>;
export type TPipelineDealsOrderTableSelect = InferSelectModel<typeof PipelineDealsOrderTable>;
export const PipelineDealsOrderTable = pgTable('pipeline_deals_order', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  dealOrder: text('deal_order')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  columnId: uuid('column_id')
    .references(() => PipelineStagesTable.id)
    .notNull()
    .$type<UUID>(),
  pipelineId: uuid('pipeline_id')
    .references(() => PipelineTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});

// ---------- RELATIONS -------- //
export const PipelineDealOrderTableRelations = relations(PipelineDealsOrderTable, ({ one }) => {
  return {
    pipeline: one(PipelineTable, {
      fields: [PipelineDealsOrderTable.pipelineId],
      references: [PipelineTable.id],
    }),
    stage: one(PipelineStagesTable, {
      fields: [PipelineDealsOrderTable.columnId],
      references: [PipelineStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineDealsOrderSchema = createInsertSchema(PipelineDealsOrderTable);
export const selectPipelineDealsOrderSchema = createSelectSchema(PipelineDealsOrderTable);
export type TInsertPipelineDealsOrderSchema = z.infer<typeof insertPipelineDealsOrderSchema>;
export type TSelectPipelineDealsOrderSchema = z.infer<typeof selectPipelineDealsOrderSchema>;

export default PipelineDealsOrderTable;
