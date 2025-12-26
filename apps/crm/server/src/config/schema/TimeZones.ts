import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { char, pgTable, uuid } from 'drizzle-orm/pg-core';

import { ContactsTable, CountriesTable, UserProfileTable } from './index.js';

// ---------- TABLES -------- //
export type TimeZoneTableInsert = InferInsertModel<typeof TimeZoneTable>;
export type TimeZoneTableSelect = InferSelectModel<typeof TimeZoneTable>;
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

export default TimeZoneTable;
