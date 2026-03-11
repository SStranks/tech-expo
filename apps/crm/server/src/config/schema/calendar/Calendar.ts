import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CalendarClientId } from '#Models/domain/calendar/calendar.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<CalendarClientId>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'cascade' })
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
export const insertCalendarSchema = createInsertSchema(CalendarTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as CalendarClientId) : null,
    companyId: v.companyId as UUID,
  }));

export const selectCalendarSchema = createSelectSchema(CalendarTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as CalendarClientId) : null,
  companyId: v.companyId as UUID,
}));

export const updateCalendarSchema = createInsertSchema(CalendarTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as CalendarClientId) : null,
    companyId: v.companyId as UUID,
  }));

export type InsertCalendarSchema = z.infer<typeof insertCalendarSchema>;
export type SelectCalendarSchema = z.infer<typeof selectCalendarSchema>;

export default CalendarTable;
