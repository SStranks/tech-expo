import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from './category.types.js';

export type CalendarCategoryDTO = {
  id: CalendarCategoryId;
  calendarId: CalendarId;
  createdAt: Date;
  title: string;
};
