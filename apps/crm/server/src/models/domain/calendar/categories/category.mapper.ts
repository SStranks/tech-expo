/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CalendarCategoriesTableSelect } from '#Config/schema/calendar/Categories.js';

import type { CalendarCategoryDTO } from './categories.dto.js';
import type { PersistedCalendarCategory } from './categories.js';
import type { CalendarCategoryId, CalendarCategorySymbol } from './categories.types.js';

import { asCalendarId } from '../calendar.mapper.js';
import { CalendarCategory } from './categories.js';

export function asCalendarCategoryId(id: UUID): CalendarCategoryId {
  return id as CalendarCategoryId;
}

export function asCalendarCategorySymbol(id: UUID): CalendarCategorySymbol {
  return id as CalendarCategorySymbol;
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
