import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CalendarTable } from './Calendar';
import { CalendarEventsTable } from './Events';

// ---------- TABLES -------- //
export type TCalendarCategoriesTable = InferInsertModel<typeof CalendarCategoriesTable>;
export const CalendarCategoriesTable = pgTable(
  'calendar_event_categories',
  {
    id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
    title: varchar('title', { length: 255 }).notNull(),
    calendarId: uuid('calendar_id')
      .references(() => CalendarTable.id)
      .notNull(),
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
export const insertCalendarCategoriesSchema = createInsertSchema(CalendarCategoriesTable);
export const selectCalendarCategoriesSchema = createSelectSchema(CalendarCategoriesTable);
export type TInsertCalendarCategoriesSchema = z.infer<typeof insertCalendarCategoriesSchema>;
export type TSelectCalendarCategoriesSchema = z.infer<typeof selectCalendarCategoriesSchema>;
