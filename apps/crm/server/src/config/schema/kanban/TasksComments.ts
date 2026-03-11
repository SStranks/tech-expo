import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { KanbanTaskCommentClientId } from '#Models/domain/kanban/task/task.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserProfileTable from '../user/UserProfile.js';
import KanbanTasksTable from './Tasks.js';

// ---------- TABLES -------- //
export type KanbanTaskCommentsTableInsert = InferInsertModel<typeof KanbanTaskCommentsTable>;
export type KanbanTaskCommentsTableSelect = InferSelectModel<typeof KanbanTaskCommentsTable>;
export type KanbanTaskCommentsTableUpdate = Partial<Omit<KanbanTaskCommentsTableInsert, 'id'>>;
export const KanbanTaskCommentsTable = pgTable('kanban_task_comments', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  taskId: uuid('task_id')
    .references(() => KanbanTasksTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  createdByUserProfileId: uuid('created_by_id')
    .references(() => UserProfileTable.id)
    .$type<UUID>(),
  comment: text('comment_text'),
});

// ---------- RELATIONS -------- //
export const KanbanTaskCommentsTableRelations = relations(KanbanTaskCommentsTable, ({ one }) => {
  return {
    task: one(KanbanTasksTable, {
      fields: [KanbanTaskCommentsTable.taskId],
      references: [KanbanTasksTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [KanbanTaskCommentsTable.createdByUserProfileId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTaskCommentsSchema = createInsertSchema(KanbanTaskCommentsTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskCommentClientId,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
    taskId: v.taskId as UUID,
  }));

export const selectKanbanTaskCommentsSchema = createSelectSchema(KanbanTaskCommentsTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as KanbanTaskCommentClientId,
  createdByUserProfileId: v.createdByUserProfileId as UUID,
  taskId: v.taskId as UUID,
}));

export const updateKanbanTaskCommentsSchema = createInsertSchema(KanbanTaskCommentsTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskCommentClientId,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
    taskId: v.taskId as UUID,
  }));

export type InsertKanbanTaskCommentsSchema = z.infer<typeof insertKanbanTaskCommentsSchema>;
export type SelectKanbanTaskCommentsSchema = z.infer<typeof selectKanbanTaskCommentsSchema>;

export default KanbanTaskCommentsTable;
