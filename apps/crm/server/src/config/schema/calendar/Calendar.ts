import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CalendarClientGeneratedId, CalendarId } from '#Models/domain/calendar/calendar.types.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import CompaniesTable from '../companies/Companies.js';
import CalendarCategoriesTable from './Categories.js';
import CalendarEventsTable from './Events.js';

// ---------- TABLES -------- //
export type CalendarTableInsert = InferInsertModel<typeof CalendarTable>;
export type CalendarTableSelect = InferSelectModel<typeof CalendarTable>;
export type CalendarTableUpdate = Partial<Omit<CalendarTableSelect, 'id'>>;
export const CalendarTable = pgTable('calendar', {
  id: uuid('id').primaryKey().defaultRandom().$type<CalendarId>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<CalendarClientGeneratedId>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique()
    .$type<CompanyId>(),
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
export const insertCalendarSchema = createInsertSchema(CalendarTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId ?? null,
    companyId: v.companyId as CompanyId,
  }));

export const selectCalendarSchema = createSelectSchema(CalendarTable).transform((v) => ({
  ...v,
  id: v.id as CalendarId,
  clientTemporaryId: v.clientTemporaryId as CalendarClientGeneratedId | null,
  companyId: v.companyId as CompanyId,
}));

export const updateCalendarSchema = createInsertSchema(CalendarTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as CalendarId,
    clientTemporaryId: v.clientTemporaryId as CalendarClientGeneratedId | null,
    companyId: v.companyId as CompanyId,
  }));

export type InsertCalendarSchema = z.infer<typeof insertCalendarSchema>;
export type SelectCalendarSchema = z.infer<typeof selectCalendarSchema>;

export default CalendarTable;
