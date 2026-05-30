import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CalendarId } from '#Models/domain/calendar/calendar.types.js';
import type { CalendarCategoryId } from '#Models/domain/calendar/category/category.types.js';

import type {
  CalendarEventClientGeneratedId,
  CalendarEventId,
} from '../../../models/domain/calendar/event/event.types.js';

import { relations } from 'drizzle-orm';
import { char, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { CalendarTable } from './Calendar.js';
import { CalendarCategoriesTable } from './Categories.js';
import CalendarEventsParticipantsTable from './EventsParticipants.js';

// ---------- TABLES -------- //
export type CalendarEventsTableInsert = InferInsertModel<typeof CalendarEventsTable>;
export type CalendarEventsTableSelect = InferSelectModel<typeof CalendarEventsTable>;
export type CalendarEventsTableUpdate = Partial<Omit<CalendarEventsTableInsert, 'id'>>;
export const CalendarEventsTable = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom().$type<CalendarEventId>(),
  clientGeneratedId: uuid('client_generated_id').unique().$type<CalendarEventClientGeneratedId>(),
  title: varchar('title', { length: 255 }).notNull(),
  calendarId: uuid('calendar_id')
    .references(() => CalendarTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<CalendarId>(),
  categoryId: uuid('category_id')
    .references(() => CalendarCategoriesTable.id)
    .notNull()
    .$type<CalendarCategoryId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  color: char('color_hex_6', { length: 7 }),
  description: text('description').notNull(),
  eventStartAt: timestamp('event_start_at', { mode: 'date' }).notNull(),
  eventEndAt: timestamp('event_end_at', { mode: 'date' }).notNull(),
});

// -------- RELATIONS ------- //
export const CalendarEventsTableRelations = relations(CalendarEventsTable, ({ many, one }) => {
  return {
    calendar: one(CalendarTable, {
      fields: [CalendarEventsTable.calendarId],
      references: [CalendarTable.id],
    }),
    category: one(CalendarCategoriesTable, {
      fields: [CalendarEventsTable.categoryId],
      references: [CalendarCategoriesTable.id],
    }),
    participants: many(CalendarEventsParticipantsTable),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarEventsSchema = createInsertSchema(CalendarEventsTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    calendarId: v.calendarId as CalendarId,
    categoryId: v.categoryId as CalendarCategoryId,
    clientGeneratedId: v.clientGeneratedId as CalendarEventClientGeneratedId | null,
  }));

export const selectCalendarEventsSchema = createSelectSchema(CalendarEventsTable).transform((v) => ({
  ...v,
  id: v.id as CalendarEventId,
  calendarId: v.calendarId as CalendarId,
  categoryId: v.categoryId as CalendarCategoryId,
  clientGeneratedId: v.clientGeneratedId as CalendarEventClientGeneratedId | null,
}));

export const updateCalendarEventsSchema = createInsertSchema(CalendarEventsTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as CalendarEventId,
    calendarId: v.calendarId as CalendarId,
    categoryId: v.categoryId as CalendarCategoryId,
    clientGeneratedId: v.clientGeneratedId as CalendarEventClientGeneratedId | null,
  }));

export type InsertCalendarEventsSchema = z.infer<typeof insertCalendarEventsSchema>;
export type SelectCalendarEventsSchema = z.infer<typeof selectCalendarEventsSchema>;

export default CalendarEventsTable;
