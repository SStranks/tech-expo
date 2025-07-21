import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { CalendarCategoriesTable, CalendarEventsTable, CompaniesTable } from '../index.js';

// ---------- TABLES -------- //
export type TCalendarTableInsert = InferInsertModel<typeof CalendarTable>;
export type TCalendarTableSelect = InferSelectModel<typeof CalendarTable>;
export const CalendarTable = pgTable('calendar', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .unique()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const CalendarTableRelations = relations(CalendarTable, ({ many, one }) => {
  return {
    categories: many(CalendarCategoriesTable),
    events: many(CalendarEventsTable),
    company: one(CompaniesTable, {
      fields: [CalendarTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarSchema = createInsertSchema(CalendarTable);
export const selectCalendarSchema = createSelectSchema(CalendarTable);
export type TInsertCalendarSchema = z.infer<typeof insertCalendarSchema>;
export type TSelectCalendarSchema = z.infer<typeof selectCalendarSchema>;

export default CalendarTable;
