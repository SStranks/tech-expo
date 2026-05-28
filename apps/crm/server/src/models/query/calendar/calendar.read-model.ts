import type { CalendarId } from '#Models/domain/calendar/calendar.types.js';

import type { CalendarCategoryId } from '../../domain/calendar/category/category.types.js';
import type { CalendarEventId } from '../../domain/calendar/event/event.types.js';
import type {
  CalendarCategoryReadRow,
  CalendarEventReadRow,
  CalendarEventReturn,
} from './calendar.read-model.types.js';

export interface CalendarReadModel {
  findCalendarCategoriesByCalendarId(id: CalendarId): Promise<CalendarCategoryReadRow[]>;
  findCalendarCategoryByCalendarCategoryId(id: CalendarCategoryId): Promise<CalendarCategoryReadRow | null>;
  findCalendarEventsByDate(id: CalendarId, month: number, year: number): Promise<CalendarEventReadRow[]>;
  getCalendarEventByCalendarEventId(id: CalendarEventId): Promise<CalendarEventReturn>;
}
