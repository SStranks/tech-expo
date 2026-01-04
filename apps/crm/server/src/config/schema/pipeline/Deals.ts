import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
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
export type PipelineDealsTableUpdate = Partial<PipelineDealsTableInsert>;
export const PipelineDealsTable = pgTable('pipeline_deals', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  orderKey: varchar({ length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  company: uuid('company_name')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  stage: uuid('pipeline_stage')
    .references(() => PipelineStagesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  value: numeric('total_revenue', { precision: 14, scale: 2 }).default('0.00').notNull(),
  dealOwner: uuid('deal_owner')
    .references(() => UserProfileTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  dealContact: uuid('deal_contact')
    .references(() => ContactsTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const PipelineDealsTableRelations = relations(PipelineDealsTable, ({ one }) => {
  return {
    company: one(CompaniesTable, {
      fields: [PipelineDealsTable.company],
      references: [CompaniesTable.id],
    }),
    dealContact: one(ContactsTable, {
      fields: [PipelineDealsTable.dealContact],
      references: [ContactsTable.id],
    }),
    dealOwner: one(UserProfileTable, {
      fields: [PipelineDealsTable.dealOwner],
      references: [UserProfileTable.id],
    }),
    stage: one(PipelineStagesTable, {
      fields: [PipelineDealsTable.stage],
      references: [PipelineStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertPipelineDealsSchema = createInsertSchema(PipelineDealsTable);
export const selectPipelineDealsSchema = createSelectSchema(PipelineDealsTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export type InsertPipelineDealsSchema = z.infer<typeof insertPipelineDealsSchema>;
export type SelectPipelineDealsSchema = z.infer<typeof selectPipelineDealsSchema>;

export default PipelineDealsTable;
