import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import PipelineTable from './Pipeline.js';

// ---------- TABLES -------- //
export type PipelineStagesTableInsert = InferInsertModel<typeof PipelineStagesTable>;
export type PipelineStagesTableSelect = InferSelectModel<typeof PipelineStagesTable>;
export type PipelineStagesTableUpdate = Partial<Omit<PipelineStagesTableInsert, 'id'>>;
export const PipelineStagesTable = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  isPermanent: boolean().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  pipelineTableId: uuid('pipeline_table_id')
    .references(() => PipelineTable.id, { onDelete: 'cascade' })
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
export const insertPipelineStagesSchema = createInsertSchema(PipelineStagesTable);
export const selectPipelineStagesSchema = createSelectSchema(PipelineStagesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updatePipelineStagesSchema = insertPipelineStagesSchema.omit({ id: true }).partial();
export type InsertPiplineStagesSchema = z.infer<typeof insertPipelineStagesSchema>;
export type SelectPiplineStagesSchema = z.infer<typeof selectPipelineStagesSchema>;

export default PipelineStagesTable;
