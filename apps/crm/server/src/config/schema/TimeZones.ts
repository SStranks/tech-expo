import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { char, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import ContactsTable from './contacts/Contacts.js';
import CountriesTable from './Countries.js';
import UserProfileTable from './user/UserProfile.js';

// ---------- TABLES -------- //
export type TimeZoneTableInsert = InferInsertModel<typeof TimeZoneTable>;
export type TimeZoneTableSelect = InferSelectModel<typeof TimeZoneTable>;
export type TimeZoneTableUpdate = Partial<Omit<TimeZoneTableInsert, 'id'>>;
export const TimeZoneTable = pgTable('time_zones_utc', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  alpha2Code: char('alpha_2_code', { length: 2 }).notNull(),
  gmtOffset: char('gmt_offset', { length: 6 }).notNull(),
  countryId: uuid('country_id')
    .references(() => CountriesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const TimeZoneTableRelations = relations(TimeZoneTable, ({ many, one }) => {
  return {
    contacts: many(ContactsTable),
    user: many(UserProfileTable),
    country: one(CountriesTable, {
      fields: [TimeZoneTable.countryId],
      references: [CountriesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertTimeZoneSchema = createInsertSchema(TimeZoneTable);
export const selectTimeZoneSchema = createSelectSchema(TimeZoneTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateTimeZoneSchema = insertTimeZoneSchema.omit({ id: true }).partial();
export type InsertTimeZoneSchema = z.infer<typeof insertTimeZoneSchema>;
export type SelectTimeZoneSchema = z.infer<typeof selectTimeZoneSchema>;

export default TimeZoneTable;
