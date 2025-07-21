import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { UserProfileTable } from '../user/UserProfile.js';
import { CalendarEventsTable } from './Events.js';

// ---------- TABLES -------- //
export type TCalendarEventsParticipantsTableInsert = InferInsertModel<typeof CalendarEventsParticipantsTable>;
export type TCalendarEventsParticipantsTableSelect = InferSelectModel<typeof CalendarEventsParticipantsTable>;
export const CalendarEventsParticipantsTable = pgTable('calendar_event_participants', {
  eventId: uuid('event_id')
    .references(() => CalendarEventsTable.id)
    .notNull()
    .$type<UUID>(),
  userId: uuid('user_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const CalendarEventsParticipantsTableRelations = relations(CalendarEventsParticipantsTable, ({ one }) => {
  return {
    event: one(CalendarEventsTable, {
      fields: [CalendarEventsParticipantsTable.eventId],
      references: [CalendarEventsTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [CalendarEventsParticipantsTable.userId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarEventParticipantsSchema = createInsertSchema(CalendarEventsParticipantsTable);
export const selectCalendarEventParticipantsSchema = createSelectSchema(CalendarEventsParticipantsTable);
export type TInsertCalendarEventParticipantsSchema = z.infer<typeof insertCalendarEventParticipantsSchema>;
export type TSelectCalendarEventParticipantsSchema = z.infer<typeof selectCalendarEventParticipantsSchema>;

export default CalendarEventsParticipantsTable;
