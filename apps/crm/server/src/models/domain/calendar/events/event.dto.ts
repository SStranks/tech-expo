import type { UUID } from '@apps/crm-shared';

export type CalendarEventDTO = {
  id: UUID;
  color: string | null;
  description: string | null;
  title: string;
  createdAt: Date;
  calendarId: UUID;
  categoryId: UUID;
  startTime: Date;
  endTime: Date;
};
