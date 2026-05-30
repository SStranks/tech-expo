import type { CalendarId } from '#Models/domain/calendar/calendar.types.js';

import type {
  CalendarCategoryClientGeneratedId,
  CalendarCategoryId,
} from '../../domain/calendar/category/category.types.js';
import type { CalendarEventClientGeneratedId, CalendarEventId } from '../../domain/calendar/event/event.types.js';
import type { UserProfileReadRow } from '../user/users.read-model.types.js';

export type CalendarCategoryReadRow = {
  id: CalendarCategoryId;
  calendarId: CalendarId;
  clientGeneratedId: CalendarCategoryClientGeneratedId;
  createdAt: Date;
  title: string;
};

export type CalendarEventReadRow = {
  id: CalendarEventId;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  clientGeneratedId: CalendarEventClientGeneratedId;
  color: string | null;
  createdAt: Date;
  description: string;
  eventEndAt: Date;
  eventStartAt: Date;
  title: string;
};

export type GetCalendarEventCommand = {
  calendarEventId: CalendarEventId;
  calendarId: CalendarId;
};

export type CalendarEventReturn = {
  calendarEvent: CalendarEventReadRow;
  participants: UserProfileReadRow[];
};

export type CalendarEventReadRowWithParticipants = CalendarEventReadRow & {
  user: UserProfileReadRow[];
};
