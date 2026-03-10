import type { UUID } from '@apps/crm-shared';

import type { CalendarCategoryDTO } from '#Models/domain/calendar/categories/categories.dto.js';

import type { UserAvatarReadDTO } from '../user/users.read-model.dto.js';

export type CalendarCategoryReadDTO = {
  id: UUID;
  title: string;
};

export type CalendarEventReadDTO = {
  id: UUID;
  title: string;
  description: string | null;
  color: string | null;
  startTime: Date;
  endTime: Date;
  category: CalendarCategoryDTO | null;
  participants: UserAvatarReadDTO[];
};
