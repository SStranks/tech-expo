import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import PipelineTable from './Pipeline.js';

// ---------- TABLES -------- //
export type PipelineStagesTableInsert = InferInsertModel<typeof PipelineStagesTable>;
export type PipelineStagesTableSelect = InferSelectModel<typeof PipelineStagesTable>;
export const PipelineStagesTable = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  isPermanent: boolean().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  pipelineTableId: uuid('pipeline_table_id')
    .references(() => PipelineTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const PipelineStagesTableRelations = relations(PipelineStagesTable, ({ one }) => {
  return {
    pipeline: one(PipelineTable, {
      fields: [PipelineStagesTable.pipelineTableId],
      references: [PipelineTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPiplineStagesSchema = createInsertSchema(PipelineStagesTable);
export const selectPiplineStagesSchema = createSelectSchema(PipelineStagesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export type InsertPiplineStagesSchema = z.infer<typeof insertPiplineStagesSchema>;
export type SelectPiplineStagesSchema = z.infer<typeof selectPiplineStagesSchema>;

export default PipelineStagesTable;
