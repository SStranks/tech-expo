import type { NewCalendar, PersistedCalendar } from './calendar.js';
import type { CalendarId } from './calendar.types.js';

export interface CalendarRepository {
  save(company: NewCalendar | PersistedCalendar): Promise<PersistedCalendar>;
  remove(id: CalendarId): Promise<CalendarId>;
  findCalendarById(id: CalendarId): Promise<PersistedCalendar | null>;
}
