import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CalendarCategoriesTable, CalendarEventsTable, CompaniesTable } from '../index.js';

// ---------- TABLES -------- //
export type CalendarTableInsert = InferInsertModel<typeof CalendarTable>;
export type CalendarTableSelect = InferSelectModel<typeof CalendarTable>;
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
export const selectCalendarSchema = createSelectSchema(CalendarTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export type InsertCalendarSchema = z.infer<typeof insertCalendarSchema>;
export type SelectCalendarSchema = z.infer<typeof selectCalendarSchema>;

export default CalendarTable;
