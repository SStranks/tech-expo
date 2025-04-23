import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, ContactsNotesTable, PipelineDealsTable, QuotesTable, TimeZoneTable } from '../index.js';

// ---------- ENUMS --------- //
export type TContactStage = (typeof CONTACT_STAGE)[number];
export const CONTACT_STAGE = [
  'new',
  'contacted',
  'interested',
  'unqualified',
  'qualified',
  'negotiation',
  'lost',
  'won',
  'churned',
] as const;
export const ContactStageEnum = pgEnum('contact_stage', CONTACT_STAGE);

// ---------- TABLES -------- //
export type TContactsTableInsert = InferInsertModel<typeof ContactsTable>;
export type TContactsTableSelect = InferSelectModel<typeof ContactsTable>;
export const ContactsTable = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('telephone', { length: 255 }).notNull(),
  company: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  stage: ContactStageEnum('stage').notNull(),
  timezone: uuid('timezone_id')
    .references(() => TimeZoneTable.id)
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const ContactsTableRelations = relations(ContactsTable, ({ many, one }) => {
  return {
    notes: many(ContactsNotesTable),
    pipelineDeals: many(PipelineDealsTable),
    quote: many(QuotesTable),
    company: one(CompaniesTable, {
      fields: [ContactsTable.company],
      references: [CompaniesTable.id],
    }),
    timezone: one(TimeZoneTable, {
      fields: [ContactsTable.timezone],
      references: [TimeZoneTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertContactsSchema = createInsertSchema(ContactsTable);
export const selectContactsSchema = createSelectSchema(ContactsTable);
export type TInsertContactsSchema = z.infer<typeof insertContactsSchema>;
export type TSelectContactsSchema = z.infer<typeof selectContactsSchema>;

export default ContactsTable;
