import type { CalendarCategoriesTableSelect } from '#Config/schema/calendar/Categories.js';
import type { CalendarEventsTableSelect } from '#Config/schema/calendar/Events.js';

import type { CalendarCategoryReadRow, CalendarEventReadRow } from './calendar.read-model.types.js';

export function calendarCategoryRowToReadRow(row: CalendarCategoriesTableSelect): CalendarCategoryReadRow {
  return {
    id: row.id,
    calendarId: row.calendarId,
    createdAt: row.createdAt,
    title: row.title,
  };
}

export function calendarEventRowToReadRow(row: CalendarEventsTableSelect): CalendarEventReadRow {
  return {
    id: row.id,
    calendarId: row.calendarId,
    categoryId: row.categoryId,
    color: row.color ?? null,
    createdAt: row.createdAt,
    description: row.description,
    eventEndAt: row.eventEndAt,
    eventStartAt: row.eventStartAt,
    title: row.title,
  };
}
