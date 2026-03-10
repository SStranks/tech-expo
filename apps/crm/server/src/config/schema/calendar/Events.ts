import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

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
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  calendarId: uuid('calendar_id')
    .references(() => CalendarTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  categoryId: uuid('category_id')
    .references(() => CalendarCategoriesTable.id)
    .notNull()
    .$type<UUID>(),
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
export const insertCalendarEventsSchema = createInsertSchema(CalendarEventsTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  calendarId: v.calendarId as UUID,
  categoryId: v.categoryId as UUID,
  clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
}));

export const selectCalendarEventsSchema = createSelectSchema(CalendarEventsTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  calendarId: v.calendarId as UUID,
  categoryId: v.categoryId as UUID,
  clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
}));

export const updateCalendarEventsSchema = createInsertSchema(CalendarEventsTable)
  .partial()
  .required({ calendarId: true, categoryId: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    calendarId: v.calendarId as UUID,
    categoryId: v.categoryId as UUID,
    clientTemporaryId: v.clientTemporaryId ? (v.clientTemporaryId as UUID) : null,
  }));

export type InsertCalendarEventsSchema = z.infer<typeof insertCalendarEventsSchema>;
export type SelectCalendarEventsSchema = z.infer<typeof selectCalendarEventsSchema>;

export default CalendarEventsTable;
