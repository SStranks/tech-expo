import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { char, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CalendarTable } from './Calendar.js';
import { CalendarCategoriesTable } from './Categories.js';

// ---------- TABLES -------- //
export type CalendarEventsTableInsert = InferInsertModel<typeof CalendarEventsTable>;
export type CalendarEventsTableSelect = InferSelectModel<typeof CalendarEventsTable>;
export type CalendarEventsTableUpdate = Partial<Omit<CalendarEventsTableInsert, 'id'>>;
export const CalendarEventsTable = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
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
export const selectCalendarEventsSchema = createSelectSchema(CalendarEventsTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateCalendarEventsSchema = insertCalendarEventsSchema.omit({ id: true }).partial();
export type InsertCalendarEventsSchema = z.infer<typeof insertCalendarEventsSchema>;
export type SelectCalendarEventsSchema = z.infer<typeof selectCalendarEventsSchema>;

export default CalendarEventsTable;
