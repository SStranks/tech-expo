import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { ContactsTable } from './contacts/Contacts';
import { CountriesTable } from './Countries';
import { UserProfileTable } from './user/UserProfile';

// ---------- TABLES -------- //
export type TTimeZoneTable = InferInsertModel<typeof TimeZoneTable>;
export const TimeZoneTable = pgTable('time_zones_utc', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  alpha2Code: varchar('alpha_2_code')
    .references(() => CountriesTable.alpha2Code)
    .notNull(),
  gmtOffset: varchar('gmt_offset').notNull(),
});

// -------- RELATIONS ------- //
export const TimeZoneTableRelations = relations(TimeZoneTable, ({ many, one }) => {
  return {
    contacts: many(ContactsTable),
    user: many(UserProfileTable),
    country: one(CountriesTable, {
      fields: [TimeZoneTable.alpha2Code],
      references: [CountriesTable.alpha2Code],
    }),
  };
});

export default TimeZoneTable;
