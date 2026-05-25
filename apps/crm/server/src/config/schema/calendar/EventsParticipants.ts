import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CalendarEventId } from '#Models/domain/calendar/event/event.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { UserProfileTable } from '../user/UserProfile.js';
import { CalendarEventsTable } from './Events.js';

// ---------- TABLES -------- //
export type CalendarEventsParticipantsTableInsert = InferInsertModel<typeof CalendarEventsParticipantsTable>;
export type CalendarEventsParticipantsTableSelect = InferSelectModel<typeof CalendarEventsParticipantsTable>;
export const CalendarEventsParticipantsTable = pgTable(
  'calendar_event_participants',
  {
    eventId: uuid('event_id')
      .references(() => CalendarEventsTable.id, { onDelete: 'cascade' })
      .notNull()
      .$type<CalendarEventId>(),
    userProfileId: uuid('user_profile_id')
      .references(() => UserProfileTable.id, { onDelete: 'cascade' })
      .notNull()
      .$type<UserProfileId>(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userProfileId] })]
);

// -------- RELATIONS ------- //
export const CalendarEventsParticipantsTableRelations = relations(CalendarEventsParticipantsTable, ({ one }) => {
  return {
    event: one(CalendarEventsTable, {
      fields: [CalendarEventsParticipantsTable.eventId],
      references: [CalendarEventsTable.id],
    }),
    userProfile: one(UserProfileTable, {
      fields: [CalendarEventsParticipantsTable.userProfileId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCalendarEventsParticipantsSchema = createInsertSchema(CalendarEventsParticipantsTable).transform(
  (v) => ({ ...v, eventId: v.eventId as CalendarEventId, userId: v.userProfileId as UserProfileId })
);

export const selectCalendarEventsParticipantsSchema = createSelectSchema(CalendarEventsParticipantsTable).transform(
  (v) => ({ ...v, eventId: v.eventId as CalendarEventId, userId: v.userProfileId as UserProfileId })
);

export type InsertCalendarEventsParticipantsSchema = z.infer<typeof insertCalendarEventsParticipantsSchema>;
export type SelectCalendarEventsParticipantsSchema = z.infer<typeof selectCalendarEventsParticipantsSchema>;

export default CalendarEventsParticipantsTable;
