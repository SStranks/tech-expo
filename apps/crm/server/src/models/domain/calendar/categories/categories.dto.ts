import type { UUID } from '@apps/crm-shared';

export type CalendarCategoryDTO = {
  id: UUID;
  title: string;
  calendarId: UUID;
  createdAt: Date;
};
