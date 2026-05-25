import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from './category.types.js';

export type CalendarCategoryDTO = {
  id: CalendarCategoryId;
  title: string;
  calendarId: CalendarId;
  createdAt: Date;
};
