import type { UUID } from '@apps/crm-shared';

import type { CalendarTableSelect } from '#Config/schema/calendar/Calendar.js';

import type { PersistedCalendar } from './calendar.js';
import type { CalendarId } from './calendar.types.js';

import { asCompanyId } from '../company/company.mapper.js';
import { Calendar } from './calendar.js';

export function asCalendarId(id: UUID): CalendarId {
  return id as CalendarId;
}

export function calendarRowToDomain(row: CalendarTableSelect): PersistedCalendar {
  return Calendar.rehydrate({
    id: asCalendarId(row.id),
    companyId: asCompanyId(row.companyId),
    createdAt: row.createdAt,
  });
}
