import type { CalendarCategoriesTableSelect } from '#Config/schema/calendar/Categories.js';
import type { CalendarEventsTableSelect } from '#Config/schema/calendar/Events.js';

import type { CalendarCategoryReadRow, CalendarEventReadRow } from './calendar.read-model.types.js';

import { asCalendarId } from '#Models/domain/calendar/calendar.mapper.js';
import { asCalendarCategoryId } from '#Models/domain/calendar/categories/category.mapper.js';
import { asCalendarEventId } from '#Models/domain/calendar/events/event.mapper.js';

export function calendarCategoryRowToReadRow(row: CalendarCategoriesTableSelect): CalendarCategoryReadRow {
  return {
    id: asCalendarCategoryId(row.id),
    calendarId: asCalendarId(row.calendarId),
    createdAt: row.createdAt,
    title: row.title,
  };
}

export function calendarEventRowToReadRow(row: CalendarEventsTableSelect): CalendarEventReadRow {
  return {
    id: asCalendarEventId(row.id),
    calendarId: asCalendarId(row.calendarId),
    categoryId: asCalendarCategoryId(row.categoryId),
    color: row.color ?? null,
    createdAt: row.createdAt,
    description: row.description,
    eventEndAt: row.eventEndAt,
    eventStartAt: row.eventStartAt,
    title: row.title,
  };
}
