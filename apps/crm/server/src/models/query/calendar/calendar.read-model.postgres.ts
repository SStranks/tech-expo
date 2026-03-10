import type { CalendarId } from '#Models/domain/calendar/calendar.types.js';
import type { CalendarCategoryId } from '#Models/domain/calendar/categories/categories.types.js';
import type { CalendarEventId } from '#Models/domain/calendar/events/event.types.js';

import type { CalendarReadModel } from './calendar.read-model.js';
import type {
  CalendarCategoryReadRow,
  CalendarEventReadRow,
  CalendarEventReturn,
} from './calendar.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { userProfileRowToReadRow } from '../user/users.read-model.mapper.js';
import { calendarCategoryRowToReadRow, calendarEventRowToReadRow } from './calendar.read-model.mapper.js';

export class PostgresCalendarReadModel implements CalendarReadModel {
  constructor() {}

  findCalendarCategoryByCalendarCategoryId(id: CalendarCategoryId): Promise<CalendarCategoryReadRow | null> {
    return postgresDBCall(async () => {
      const calendarCategory = await postgresDB.query.CalendarCategoriesTable.findFirst({
        where: (calendarCategory, { eq }) => eq(calendarCategory.id, id),
      });

      return calendarCategory ? calendarCategoryRowToReadRow(calendarCategory) : null;
    });
  }

  async findCalendarCategoriesByCalendarId(calendarId: CalendarId): Promise<CalendarCategoryReadRow[]> {
    return postgresDBCall(async () => {
      const calendarCategories = await postgresDB.query.CalendarCategoriesTable.findMany({
        where: (calendarCategory, { eq }) => eq(calendarCategory.calendarId, calendarId),
      });

      return calendarCategories.map((cC) => calendarCategoryRowToReadRow(cC));
    });
  }

  async findCalendarEventsByDate(calendarId: CalendarId, month: number, year: number): Promise<CalendarEventReadRow[]> {
    return postgresDBCall(async () => {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const calendarEvents = await postgresDB.query.CalendarEventsTable.findMany({
        where: (calendarEvent, { and, eq, gte, lte }) =>
          and(
            eq(calendarEvent.calendarId, calendarId),
            lte(calendarEvent.eventStartAt, endOfMonth),
            gte(calendarEvent.eventEndAt, startOfMonth)
          ),
      });

      return calendarEvents.map((cE) => calendarEventRowToReadRow(cE));
    });
  }

  getCalendarEventByCalendarEventId(id: CalendarEventId): Promise<CalendarEventReturn> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CalendarEventsTable.findFirst({
        with: {
          participants: {
            columns: {},
            with: {
              user: true,
            },
          },
        },
        where: (calendarEvent, { eq }) => eq(calendarEvent.id, id),
      });

      if (!result) throw new PostgresError({ kind: 'NOT_FOUND', message: `CalendarEvent ${id} not found` });
      const { participants, ...event } = result;

      return {
        calendarEvent: calendarEventRowToReadRow(event),
        participants: participants.map(({ user }) => userProfileRowToReadRow(user)),
      };
    });
  }
}
