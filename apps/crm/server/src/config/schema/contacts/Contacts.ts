import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactClientGeneratedId, ContactId } from '#Models/domain/contact/contact.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import { relations } from 'drizzle-orm';
import { char, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { CONTACT_STAGE } from '#Models/domain/contact/contact.types.js';

import CompaniesTable from '../companies/Companies.js';
import PipelineDealsTable from '../pipeline/Deals.js';
import QuotesTable from '../quotes/Quotes.js';
import TimeZoneTable from '../TimeZones.js';
import ContactsNotesTable from './ContactsNotes.js';

// ---------- ENUMS --------- //
export const ContactStageEnum = pgEnum('contact_stage', CONTACT_STAGE);

// ---------- TABLES -------- //
export type ContactsTableInsert = InferInsertModel<typeof ContactsTable>;
export type ContactsTableSelect = InferSelectModel<typeof ContactsTable>;
export type ContactsTableUpdate = Partial<Omit<ContactsTableInsert, 'id'>>;
export const ContactsTable = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom().$type<ContactId>(),
  clientGeneratedId: uuid('client_generated_id').unique().$type<ContactClientGeneratedId>(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('telephone', { length: 255 }).notNull(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<CompanyId>(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  stage: ContactStageEnum('stage').notNull(),
  timezoneId: uuid('timezone_id')
    .references(() => TimeZoneTable.id)
    .$type<TimeZoneId>(),
  image: char('profile_image', { length: 32 }), // MD5 hash of UUID (used as image name)
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const ContactsTableRelations = relations(ContactsTable, ({ many, one }) => {
  return {
    notes: many(ContactsNotesTable),
    pipelineDeals: many(PipelineDealsTable),
    quote: many(QuotesTable),
    company: one(CompaniesTable, {
      fields: [ContactsTable.companyId],
      references: [CompaniesTable.id],
    }),
    timezone: one(TimeZoneTable, {
      fields: [ContactsTable.timezoneId],
      references: [TimeZoneTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertContactsSchema = createInsertSchema(ContactsTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as ContactClientGeneratedId,
    companyId: v.companyId as CompanyId,
    timezoneId: v.timezoneId as TimeZoneId,
  }));

export const selectContactsSchema = createSelectSchema(ContactsTable).transform((v) => ({
  ...v,
  id: v.id as ContactId,
  clientGeneratedId: v.clientGeneratedId as ContactClientGeneratedId,
  companyId: v.companyId as CompanyId,
  timezoneId: v.timezoneId as TimeZoneId,
}));

export const updateContactsSchema = createInsertSchema(ContactsTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as ContactId,
    clientGeneratedId: v.clientGeneratedId as ContactClientGeneratedId,
    companyId: v.companyId as CompanyId,
    timezoneId: v.timezoneId as TimeZoneId,
  }));

export type InsertContactsSchema = z.infer<typeof insertContactsSchema>;
export type SelectContactsSchema = z.infer<typeof selectContactsSchema>;

export default ContactsTable;
