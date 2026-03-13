import type { CalendarId } from '#Models/domain/calendar/calendar.types.js';

import type { CalendarCategoryId } from '../../domain/calendar/category/category.types.js';
import type { CalendarEventId } from '../../domain/calendar/event/event.types.js';
import type { UserProfileReadRow } from '../user/users.read-model.types.js';

export type CalendarCategoryReadRow = {
  id: CalendarCategoryId;
  title: string;
  calendarId: CalendarId;
  createdAt: Date;
};

export type CalendarEventReadRow = {
  id: CalendarEventId;
  title: string;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  description: string;
  eventStartAt: Date;
  eventEndAt: Date;
  createdAt: Date;
  color: string | null;
};

export type GetCalendarEventCommand = {
  calendarId: CalendarId;
  calendarEventId: CalendarEventId;
};

export type CalendarEventReturn = {
  calendarEvent: CalendarEventReadRow;
  participants: UserProfileReadRow[];
};

export type CalendarEventReadRowWithParticipants = CalendarEventReadRow & {
  user: UserProfileReadRow[];
};
