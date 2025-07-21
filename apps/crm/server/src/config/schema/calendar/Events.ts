import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { char, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { CalendarTable } from './Calendar.js';
import { CalendarCategoriesTable } from './Categories.js';

// ---------- TABLES -------- //
export type TCalendarEventsTableInsert = InferInsertModel<typeof CalendarEventsTable>;
export type TCalendarEventsTableSelect = InferSelectModel<typeof CalendarEventsTable>;
export const CalendarEventsTable = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  calendarId: uuid('calendar_id')
    .references(() => CalendarTable.id)
    .notNull()
    .$type<UUID>(),
  categoryId: uuid('category_id')
    .references(() => CalendarCategoriesTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  color: char('color_hex_6', { length: 7 }),
  description: text('description').notNull(),
  eventStart: timestamp('event_start', { mode: 'date' }).notNull(),
  eventEnd: timestamp('event_end', { mode: 'date' }).notNull(),
});

// -------- RELATIONS ------- //
export const CalendarEventsTableRelations = relations(CalendarEventsTable, ({ one }) => {
  return {
    calendar: one(CalendarTable, {
      fields: [CalendarEventsTable.calendarId],
      references: [CalendarTable.id],
    }),
    category: one(CalendarCategoriesTable, {
      fields: [CalendarEventsTable.categoryId],
      references: [CalendarCategoriesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarEventsSchema = createInsertSchema(CalendarEventsTable);
export const selectCalendarEventsSchema = createSelectSchema(CalendarEventsTable);
export type TInsertCalendarEventsSchema = z.infer<typeof insertCalendarEventsSchema>;
export type TSelectCalendarEventsSchema = z.infer<typeof selectCalendarEventsSchema>;

export default CalendarEventsTable;
