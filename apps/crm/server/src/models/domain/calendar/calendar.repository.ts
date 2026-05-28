import type { NewCalendar, PersistedCalendar } from './calendar.js';
import type { CalendarId } from './calendar.types.js';

export interface CalendarRepository {
  findCalendarById(id: CalendarId): Promise<PersistedCalendar | null>;
  remove(id: CalendarId): Promise<CalendarId>;
  save(company: NewCalendar | PersistedCalendar): Promise<PersistedCalendar>;
}
