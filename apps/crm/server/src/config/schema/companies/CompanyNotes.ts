import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyNoteSymbol } from '#Models/domain/company/note/note.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserProfileTable from '../user/UserProfile.js';
import CompaniesTable from './Companies.js';

// ---------- TABLES -------- //
export type CompaniesNotesTableInsert = InferInsertModel<typeof CompaniesNotesTable>;
export type CompaniesNotesTableSelect = InferSelectModel<typeof CompaniesNotesTable>;
export type CompaniesNotesTableUpdate = Partial<Omit<CompaniesNotesTableInsert, 'id'>>;
export const CompaniesNotesTable = pgTable('companies_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  note: text('note_text').notNull(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdByUserProfileId: uuid('created_by_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const CompaniesNotesTableRelations = relations(CompaniesNotesTable, ({ one }) => {
  return {
    company: one(CompaniesTable, {
      fields: [CompaniesNotesTable.companyId],
      references: [CompaniesTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [CompaniesNotesTable.createdByUserProfileId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCompaniesNotesSchema = createInsertSchema(CompaniesNotesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as CompanyNoteSymbol,
    companyId: v.companyId as UUID,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
  }));

export const selectCompaniesNotesSchema = createSelectSchema(CompaniesNotesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as CompanyNoteSymbol,
  companyId: v.companyId as UUID,
  createdByUserProfileId: v.createdByUserProfileId as UUID,
}));

export const updateCompaniesNotesSchema = createInsertSchema(CompaniesNotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as CompanyNoteSymbol,
    companyId: v.companyId as UUID,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
  }));

export type InsertCompaniesNotesSchema = z.infer<typeof insertCompaniesNotesSchema>;
export type SelectCompaniesNotesSchema = z.infer<typeof selectCompaniesNotesSchema>;

export default CompaniesNotesTable;
