import type { UUID } from '@apps/crm-shared';

import type {
  CalendarCategoryReadRow,
  CalendarEventReadRow,
} from '#Models/query/calendar/calendar.read-model.types.js';
import type { UserProfileReadRow } from '#Models/query/user/users.read-model.types.js';

import type { CompanyId } from '../company/company.types.js';
import type { CalendarCategoryId } from './categories/categories.types.js';
import type { CalendarEventId } from './events/event.types.js';
import type { PersistedCalendarEvent } from './events/events.js';

export type CalendarId = UUID & { readonly __calendarId: unique symbol };

export type CalendarClientId = UUID & { readonly __calendarClientId: unique symbol };

export type InitialCalendarCommand = {
  calendarId: CalendarId;
  companyId: CompanyId;
  month: number;
  year: number;
};

export type InitialCalendarReturn = {
  events: CalendarEventReadRow[];
  categories: CalendarCategoryReadRow[];
};

export type AddCalendarEventCommand = {
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  description: string;
  title: string;
  eventStartAt: Date;
  eventEndAt: Date;
  color: string | null;
};

export type AddCalendarEventReturn = {
  calendarEvent: PersistedCalendarEvent;
  participants: UserProfileReadRow[];
};

export type UpdateCalendarEventCommand = {
  id: CalendarEventId;
  calendarId: CalendarId;
  categoryId?: CalendarCategoryId;
  description?: string;
  title?: string;
  eventStartAt?: Date;
  eventEndAt?: Date;
  color?: string | null;
};

export type UpdateCalendarEventReturn = {
  calendarEvent: PersistedCalendarEvent;
  participants: UserProfileReadRow[];
};

export type RemoveCalendarEventCommand = {
  calendarId: CalendarId;
  calendarEventId: CalendarEventId;
};

export type AddCalendarCategoryCommand = {
  calendarId: CalendarId;
  title: string;
};

export type RemoveCalendarCategoryCommand = {
  calendarId: CalendarId;
  calendarCategoryId: CalendarCategoryId;
};

export type FindCalendarEventsCommand = {
  calendarId: CalendarId;
  companyId: CompanyId;
  month: number;
  year: number;
};

export type FindCalendarCategoriesCommand = {
  calendarId: CalendarId;
  companyId: CompanyId;
};
