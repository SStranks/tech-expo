import type { CalendarCategoryId } from '#Models/domain/calendar/category/category.types.js';
import type { CalendarEventId } from '#Models/domain/calendar/event/event.types.js';

import type { CalendarCategoryDTO } from '../../domain/calendar/category/category.dto.js';
import type { UserAvatarReadDTO } from '../user/users.read-model.dto.js';

export type CalendarCategoryReadDTO = {
  id: CalendarCategoryId;
  title: string;
};

export type CalendarEventReadDTO = {
  id: CalendarEventId;
  category: CalendarCategoryDTO | null;
  color: string | null;
  description: string | null;
  endTime: Date;
  participants: UserAvatarReadDTO[];
  startTime: Date;
  title: string;
};
