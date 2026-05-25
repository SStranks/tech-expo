import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { PipelineDealClientGeneratedId, PipelineDealId } from '#Models/domain/pipeline/deal/deal.types.js';
import type { PipelineStageId } from '#Models/domain/pipeline/stage/stage.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import { relations } from 'drizzle-orm';
import { numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import CompaniesTable from '../companies/Companies.js';
import ContactsTable from '../contacts/Contacts.js';
import UserProfileTable from '../user/UserProfile.js';
import PipelineStagesTable from './Stages.js';

// ---------- TABLES -------- //
export type PipelineDealsTableInsert = InferInsertModel<typeof PipelineDealsTable>;
export type PipelineDealsTableSelect = InferSelectModel<typeof PipelineDealsTable>;
export type PipelineDealsTableUpdate = Partial<Omit<PipelineDealsTableInsert, 'id'>>;
export const PipelineDealsTable = pgTable('pipeline_deals', {
  id: uuid('id').primaryKey().defaultRandom().$type<PipelineDealId>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<PipelineDealClientGeneratedId>(),
  orderKey: varchar({ length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  companyId: uuid('company_name')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<CompanyId>(),
  stageId: uuid('pipeline_stage_id')
    .references(() => PipelineStagesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<PipelineStageId>(),
  value: numeric('total_revenue', { precision: 14, scale: 2 }).default('0.00').notNull(),
  dealOwnerUserProfileId: uuid('deal_owner_id')
    .references(() => UserProfileTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UserProfileId>(),
  dealContactId: uuid('deal_contact_id')
    .references(() => ContactsTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<ContactId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const PipelineDealsTableRelations = relations(PipelineDealsTable, ({ one }) => {
  return {
    company: one(CompaniesTable, {
      fields: [PipelineDealsTable.companyId],
      references: [CompaniesTable.id],
    }),
    dealContact: one(ContactsTable, {
      fields: [PipelineDealsTable.dealContactId],
      references: [ContactsTable.id],
    }),
    dealOwner: one(UserProfileTable, {
      fields: [PipelineDealsTable.dealOwnerUserProfileId],
      references: [UserProfileTable.id],
    }),
    stage: one(PipelineStagesTable, {
      fields: [PipelineDealsTable.stageId],
      references: [PipelineStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineDealsSchema = createInsertSchema(PipelineDealsTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as PipelineDealClientGeneratedId,
    companyId: v.companyId as CompanyId,
    dealContactId: v.dealContactId as ContactId,
    dealOwnerUserProfileId: v.dealOwnerUserProfileId as UserProfileId,
    stageId: v.stageId as PipelineStageId,
  }));

export const selectPipelineDealsSchema = createSelectSchema(PipelineDealsTable).transform((v) => ({
  ...v,
  id: v.id as PipelineDealId,
  clientTemporaryId: v.clientTemporaryId as PipelineDealClientGeneratedId,
  companyId: v.companyId as CompanyId,
  dealContactId: v.dealContactId as ContactId,
  dealOwnerUserProfileId: v.dealOwnerUserProfileId as UserProfileId,
  stageId: v.stageId as PipelineStageId,
}));

export const updatePipelineDealsSchema = createInsertSchema(PipelineDealsTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as PipelineDealId,
    clientTemporaryId: v.clientTemporaryId as PipelineDealClientGeneratedId,
    companyId: v.companyId as CompanyId,
    dealContactId: v.dealContactId as ContactId,
    dealOwnerUserProfileId: v.dealOwnerUserProfileId as UserProfileId,
    stageId: v.stageId as PipelineStageId,
  }));

export type InsertPipelineDealsSchema = z.infer<typeof insertPipelineDealsSchema>;
export type SelectPipelineDealsSchema = z.infer<typeof selectPipelineDealsSchema>;

export default PipelineDealsTable;
