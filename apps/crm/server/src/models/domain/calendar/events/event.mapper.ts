import type { UUID } from '@apps/crm-shared';

import type { CalendarEventDTO } from './event.dto.js';
import type { CalendarEventClientId, CalendarEventId } from './event.types.js';
import type { PersistedCalendarEvent } from './events.js';

export function asCalendarEventId(id: UUID): CalendarEventId {
  return id as CalendarEventId;
}

export function asCalendarEventClientId(id: UUID): CalendarEventClientId {
  return id as CalendarEventClientId;
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
