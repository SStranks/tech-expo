import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from '../category/category.types.js';
import type { CalendarEventClientGeneratedId, CalendarEventId } from './event.types.js';

export type CalendarEventDTO = {
  id: CalendarEventId;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  clientGeneratedId: CalendarEventClientGeneratedId;
  color: string | null;
  createdAt: Date;
  description: string | null;
  endTime: Date;
  startTime: Date;
  title: string;
};
