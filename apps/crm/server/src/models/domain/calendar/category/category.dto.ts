import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryClientGeneratedId, CalendarCategoryId } from './category.types.js';

export type CalendarCategoryDTO = {
  id: CalendarCategoryId;
  calendarId: CalendarId;
  clientGeneratedId: CalendarCategoryClientGeneratedId;
  createdAt: Date;
  title: string;
};
