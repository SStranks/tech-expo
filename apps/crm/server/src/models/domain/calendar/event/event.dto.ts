import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from '../category/category.types.js';
import type { CalendarEventId } from './event.types.js';

export type CalendarEventDTO = {
  id: CalendarEventId;
  color: string | null;
  description: string | null;
  title: string;
  createdAt: Date;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  startTime: Date;
  endTime: Date;
};
