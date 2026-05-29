import type { UUID } from '@apps/crm-shared';

import type { CalendarEventReadRow } from '#Models/query/calendar/calendar.read-model.types.js';

import type { CalendarEventDTO } from './event.dto.js';
import type { PersistedCalendarEvent } from './event.js';
import type { CalendarEventClientGeneratedId, CalendarEventId } from './event.types.js';

export function asCalendarEventId(id: UUID): CalendarEventId {
  return id as CalendarEventId;
}

export function asCalendarEventClientGeneratedId(id: UUID): CalendarEventClientGeneratedId {
  return id as CalendarEventClientGeneratedId;
}

export function calendarEventDomainToCalendarEventDTO(calendarEvent: PersistedCalendarEvent): CalendarEventDTO {
  return {
    id: calendarEvent.id,
    calendarId: calendarEvent.calendarId,
    categoryId: calendarEvent.categoryId,
    color: calendarEvent.color,
    createdAt: calendarEvent.createdAt,
    description: calendarEvent.description,
    endTime: calendarEvent.eventEndAt,
    startTime: calendarEvent.eventStartAt,
    title: calendarEvent.title,
  };
}

export function calendarEventReadRowToCalendarEventDTO(calendarEvent: CalendarEventReadRow): CalendarEventDTO {
  return {
    id: calendarEvent.id,
    calendarId: calendarEvent.calendarId,
    categoryId: calendarEvent.categoryId,
    color: calendarEvent.color,
    createdAt: calendarEvent.createdAt,
    description: calendarEvent.description,
    endTime: calendarEvent.eventEndAt,
    startTime: calendarEvent.eventStartAt,
    title: calendarEvent.title,
  };
}
