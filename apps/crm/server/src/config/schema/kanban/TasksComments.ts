import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type {
  KanbanTaskCommentClientGeneratedId,
  KanbanTaskCommentId,
  KanbanTaskId,
} from '#Models/domain/kanban/task/task.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<KanbanTaskCommentId>(),
  clientGeneratedId: uuid('client_generated_id').unique().notNull().$type<KanbanTaskCommentClientGeneratedId>(),
  taskId: uuid('task_id')
    .references(() => KanbanTasksTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<KanbanTaskId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  createdByUserProfileId: uuid('created_by_id')
    .references(() => UserProfileTable.id)
    .$type<UserProfileId>(),
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
    clientGeneratedId: v.clientGeneratedId as KanbanTaskCommentClientGeneratedId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
    taskId: v.taskId as KanbanTaskId,
  }));

export const selectKanbanTaskCommentsSchema = createSelectSchema(KanbanTaskCommentsTable).transform((v) => ({
  ...v,
  id: v.id as KanbanTaskCommentId,
  clientGeneratedId: v.clientGeneratedId as KanbanTaskCommentClientGeneratedId,
  createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
  taskId: v.taskId as KanbanTaskId,
}));

export const updateKanbanTaskCommentsSchema = createInsertSchema(KanbanTaskCommentsTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as KanbanTaskCommentId,
    clientGeneratedId: v.clientGeneratedId as KanbanTaskCommentClientGeneratedId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
    taskId: v.taskId as KanbanTaskId,
  }));

export type InsertKanbanTaskCommentsSchema = z.infer<typeof insertKanbanTaskCommentsSchema>;
export type SelectKanbanTaskCommentsSchema = z.infer<typeof selectKanbanTaskCommentsSchema>;

export default KanbanTaskCommentsTable;
