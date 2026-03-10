import type { UUID } from '@apps/crm-shared';

import type { CalendarEventDTO } from './event.dto.js';
import type { CalendarEventId, CalendarEventSymbol } from './event.types.js';
import type { PersistedCalendarEvent } from './events.js';

export function asCalendarEventId(id: UUID): CalendarEventId {
  return id as CalendarEventId;
}

export function asCalendarEventSymbol(id: UUID): CalendarEventSymbol {
  return id as CalendarEventSymbol;
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
