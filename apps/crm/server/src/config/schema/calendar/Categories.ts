import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import { relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { CalendarTable } from './Calendar.js';
import { CalendarEventsTable } from './Events.js';

// ---------- TABLES -------- //
export type CalendarCategoriesTableInsert = InferInsertModel<typeof CalendarCategoriesTable>;
export type CalendarCategoriesTableSelect = InferSelectModel<typeof CalendarCategoriesTable>;
export type CalendarCategoriesTableUpdate = Partial<Omit<CalendarCategoriesTableInsert, 'id'>>;
export const CalendarCategoriesTable = pgTable(
  'calendar_event_categories',
  {
    id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
    clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
    title: varchar('title', { length: 255 }).notNull(),
    calendarId: uuid('calendar_id')
      .references(() => CalendarTable.id, { onDelete: 'cascade' })
      .notNull()
      .$type<UUID>(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  // Prevent duplicate category titles per calendar table
  (table) => [unique().on(table.title, table.calendarId)]
);

// -------- RELATIONS ------- //
export const CalendarCategoriesTableRelations = relations(CalendarCategoriesTable, ({ many, one }) => {
  return {
    events: many(CalendarEventsTable),
    calendar: one(CalendarTable, {
      fields: [CalendarCategoriesTable.calendarId],
      references: [CalendarTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarCategoriesSchema = createInsertSchema(CalendarCategoriesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  calendarId: v.calendarId as UUID,
  clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
}));

export const selectCalendarCategoriesSchema = createSelectSchema(CalendarCategoriesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  calendarId: v.calendarId as UUID,
  clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
}));

export const updateCalendarCategoriesSchema = createInsertSchema(CalendarCategoriesTable)
  .partial()
  .required({ calendarId: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    calendarId: v.calendarId as UUID,
    clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
  }));

export type InsertCalendarCategoriesSchema = z.infer<typeof insertCalendarCategoriesSchema>;
export type SelectCalendarCategoriesSchema = z.infer<typeof selectCalendarCategoriesSchema>;

export default CalendarCategoriesTable;
