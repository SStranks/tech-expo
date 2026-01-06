import { UUID } from '@apps/crm-shared/src/types/api/base.js';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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
    title: varchar('title', { length: 255 }).notNull(),
    calendarId: uuid('calendar_id')
      .references(() => CalendarTable.id, { onDelete: 'cascade' })
      .notNull()
      .$type<UUID>(),
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
export const selectCalendarCategoriesSchema = createSelectSchema(CalendarCategoriesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateCalendarCategoriesSchema = insertCalendarCategoriesSchema.omit({ id: true }).partial();
export type InsertCalendarCategoriesSchema = z.infer<typeof insertCalendarCategoriesSchema>;
export type SelectCalendarCategoriesSchema = z.infer<typeof selectCalendarCategoriesSchema>;

export default CalendarCategoriesTable;
