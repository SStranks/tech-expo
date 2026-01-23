import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import CompaniesTable from '../companies/Companies.js';
import ContactsTable from '../contacts/Contacts.js';
import UserProfileTable from '../user/UserProfile.js';
import PipelineStagesTable from './Stages.js';

// ---------- TABLES -------- //
export type PipelineDealsTableInsert = InferInsertModel<typeof PipelineDealsTable>;
export type PipelineDealsTableSelect = InferSelectModel<typeof PipelineDealsTable>;
export type PipelineDealsTableUpdate = Partial<Omit<PipelineDealsTableInsert, 'id'>>;
export const PipelineDealsTable = pgTable('pipeline_deals', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  orderKey: varchar({ length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  companyId: uuid('company_name')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  stageId: uuid('pipeline_stage_id')
    .references(() => PipelineStagesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  value: numeric('total_revenue', { precision: 14, scale: 2 }).default('0.00').notNull(),
  dealOwnerUserProfileId: uuid('deal_owner_id')
    .references(() => UserProfileTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  dealContactId: uuid('deal_contact_id')
    .references(() => ContactsTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
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
export const insertPipelineDealsSchema = createInsertSchema(PipelineDealsTable);
export const selectPipelineDealsSchema = createSelectSchema(PipelineDealsTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updatePipelineDealsSchema = insertPipelineDealsSchema.omit({ id: true }).partial();
export type InsertPipelineDealsSchema = z.infer<typeof insertPipelineDealsSchema>;
export type SelectPipelineDealsSchema = z.infer<typeof selectPipelineDealsSchema>;

export default PipelineDealsTable;
