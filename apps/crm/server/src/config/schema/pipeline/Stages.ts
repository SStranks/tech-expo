import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { PipelineStageClientId } from '#Models/domain/pipeline/stage/stage.types.js';

import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import PipelineTable from './Pipeline.js';

// ---------- TABLES -------- //
export type PipelineStagesTableInsert = InferInsertModel<typeof PipelineStagesTable>;
export type PipelineStagesTableSelect = InferSelectModel<typeof PipelineStagesTable>;
export type PipelineStagesTableUpdate = Partial<Omit<PipelineStagesTableInsert, 'id'>>;
export const PipelineStagesTable = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  isPermanent: boolean().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  pipelineId: uuid('pipeline_id')
    .references(() => PipelineTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const PipelineStagesTableRelations = relations(PipelineStagesTable, ({ one }) => {
  return {
    pipeline: one(PipelineTable, {
      fields: [PipelineStagesTable.pipelineId],
      references: [PipelineTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineStagesSchema = createInsertSchema(PipelineStagesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as PipelineStageClientId,
    pipelineId: v.pipelineId as UUID,
  }));

export const selectPipelineStagesSchema = createSelectSchema(PipelineStagesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as PipelineStageClientId,
  pipelineId: v.pipelineId as UUID,
}));

export const updatePipelineStagesSchema = createInsertSchema(PipelineStagesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as PipelineStageClientId,
    pipelineId: v.pipelineId as UUID,
  }));

export type InsertPiplineStagesSchema = z.infer<typeof insertPipelineStagesSchema>;
export type SelectPiplineStagesSchema = z.infer<typeof selectPipelineStagesSchema>;

export default PipelineStagesTable;
