import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { PipelineDealsOrderTable, PipelineTable } from '../index.js';

// ---------- TABLES -------- //
export type TPipelineStagesTableInsert = InferInsertModel<typeof PiplineStagesTable>;
export type TPipelineStagesTableSelect = InferSelectModel<typeof PiplineStagesTable>;
export const PiplineStagesTable = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  pipelineTableId: uuid('pipeline_table_id')
    .references(() => PipelineTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const PipelineStagesTableRelations = relations(PiplineStagesTable, ({ many, one }) => {
  return {
    dealsOrder: many(PipelineDealsOrderTable),
    pipeline: one(PipelineTable, {
      fields: [PiplineStagesTable.pipelineTableId],
      references: [PipelineTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPiplineStagesSchema = createInsertSchema(PiplineStagesTable);
export const selectPiplineStagesSchema = createSelectSchema(PiplineStagesTable);
export type TInsertPiplineStagesSchema = z.infer<typeof insertPiplineStagesSchema>;
export type TSelectPiplineStagesSchema = z.infer<typeof selectPiplineStagesSchema>;

export default PiplineStagesTable;
