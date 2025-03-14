import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { PipelineStagesTable, PipelineTable } from '../index.js';

// ---------- TABLES -------- //
export type TDealsOrderTableInsert = InferInsertModel<typeof DealsOrderTable>;
export type TDealsOrderTableSelect = InferSelectModel<typeof DealsOrderTable>;
export const DealsOrderTable = pgTable('pipeline_deals_order', {
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
  updatedAt: timestamp('created_at', { mode: 'date' }),
});

// ---------- RELATIONS -------- //
export const DealOrderTableRelations = relations(DealsOrderTable, ({ one }) => {
  return {
    pipeline: one(PipelineTable, {
      fields: [DealsOrderTable.pipelineId],
      references: [PipelineTable.id],
    }),
    stage: one(PipelineStagesTable, {
      fields: [DealsOrderTable.columnId],
      references: [PipelineStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertDealsOrderSchema = createInsertSchema(DealsOrderTable);
export const selectDealsOrderSchema = createSelectSchema(DealsOrderTable);
export type TInsertDealsOrderSchema = z.infer<typeof insertDealsOrderSchema>;
export type TSelectDealsOrderSchema = z.infer<typeof selectDealsOrderSchema>;

export default DealsOrderTable;
