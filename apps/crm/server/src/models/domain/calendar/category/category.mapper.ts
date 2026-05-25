/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CalendarCategoriesTableSelect } from '#Config/schema/calendar/Categories.js';

import type { CalendarCategoryDTO } from './category.dto.js';
import type { PersistedCalendarCategory } from './category.js';
import type { CalendarCategoryClientGeneratedId, CalendarCategoryId } from './category.types.js';

import { asCalendarId } from '../calendar.mapper.js';
import { CalendarCategory } from './category.js';

export function asCalendarCategoryId(id: UUID): CalendarCategoryId {
  return id as CalendarCategoryId;
}

export function asCalendarCategoryClientId(id: UUID): CalendarCategoryClientGeneratedId {
  return id as CalendarCategoryClientGeneratedId;
}

export function calendarCategoryRowToDomain(row: CalendarCategoriesTableSelect): PersistedCalendarCategory {
  return CalendarCategory.rehydrate({
    id: asCalendarCategoryId(row.id),
    calendarId: asCalendarId(row.calendarId),
    title: row.title,
    createdAt: row.createdAt,
  });
}

export function calendarCategoryDomainToCalendarCategoryDTO(
  calendarCategory: PersistedCalendarCategory
): CalendarCategoryDTO {
  return {
    id: calendarCategory.id,
    title: calendarCategory.title,
    calendarId: calendarCategory.calendarId,
    createdAt: calendarCategory.createdAt,
  };
}
