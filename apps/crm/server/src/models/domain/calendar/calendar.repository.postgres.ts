/* eslint-disable perfectionist/sort-objects */
import type { PostgresTransaction } from '#Config/dbPostgres.js';
import type { CalendarCategoriesTableInsert } from '#Config/schema/calendar/Categories.js';
import type { CalendarEventsTableInsert } from '#Config/schema/calendar/Events.js';

import type { NewCalendar, PersistedCalendar } from './calendar.js';
import type { CalendarRepository } from './calendar.repository.js';
import type { CalendarId } from './calendar.types.js';
import type { PersistedCalendarCategory } from './categories/categories.js';
import type { PersistedCalendarEvent } from './events/events.js';

import { eq, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CalendarTable from '#Config/schema/calendar/Calendar.js';
import CalendarCategoriesTable from '#Config/schema/calendar/Categories.js';
import CalendarEventsTable from '#Config/schema/calendar/Events.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { Calendar } from './calendar.js';
import { asCalendarId, calendarRowToDomain } from './calendar.mapper.js';
import { CalendarCategory } from './categories/categories.js';
import { asCalendarCategoryId } from './categories/category.mapper.js';
import { asCalendarEventId } from './events/event.mapper.js';
import { CalendarEvent } from './events/events.js';

export class PostgresCalendarRepository implements CalendarRepository {
  constructor() {}

  async findCalendarById(id: CalendarId): Promise<PersistedCalendar | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CalendarTable.findFirst({
        where: (calendar, { eq }) => eq(calendar.id, id),
      });
      return result ? calendarRowToDomain(result) : null;
    });
  }

  async save(calendar: NewCalendar | PersistedCalendar): Promise<PersistedCalendar> {
    return postgresDBCall(async () => {
      const persistedCalendar = await postgresDB.transaction(async (tx) => {
        const persistedCalendar = calendar.isPersisted() ? calendar : await this.insert(tx, calendar);

        if (persistedCalendar.hasDirtyFields()) await this.update(tx, persistedCalendar);

        await this.syncCategories(tx, persistedCalendar);
        await this.syncEvents(tx, persistedCalendar);

        persistedCalendar.commit();
        return persistedCalendar;
      });

      return persistedCalendar;
    });
  }

  async remove(id: CalendarId): Promise<CalendarId> {
    return postgresDBCall(async () => {
      const result = await postgresDB
        .delete(CalendarTable)
        .where(eq(CalendarTable.id, id))
        .returning({ id: CalendarTable.id });

      if (result.length === 0) throw new PostgresError({ kind: 'NOT_FOUND', message: `Calendar ${id} not found` });
      if (result.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple calendars deleted' });

      return asCalendarId(result[0].id);
    });
  }

  private async insert(tx: PostgresTransaction, calendar: NewCalendar): Promise<PersistedCalendar> {
    const [row] = await tx
      .insert(CalendarTable)
      .values({
        companyId: calendar.companyId,
      })
      .returning();

    return Calendar.promote(calendar, { id: asCalendarId(row.id), createdAt: row.createdAt });
  }

  private async update(tx: PostgresTransaction, calendar: PersistedCalendar): Promise<PersistedCalendar> {
    await tx.update(CalendarTable).set(calendar.pullDirtyFields()).where(eq(CalendarTable.id, calendar.id));
    return calendar;
  }

  private async syncCategories(tx: PostgresTransaction, calendar: PersistedCalendar) {
    const { addedCategory, removedCategoryIds, updatedCategory } = calendar.pullCategoryChanges();
    let persistedCategories: PersistedCalendarCategory[] = [];

    if (addedCategory.size > 0) {
      const rows = await tx
        .insert(CalendarCategoriesTable)
        .values(
          [...addedCategory.values()].map(
            (c): CalendarCategoriesTableInsert => ({
              title: c.title,
              calendarId: c.calendarId,
              clientTemporaryId: c.symbol,
            })
          )
        )
        .returning();

      persistedCategories = rows.map((row) => {
        const tempId = row.clientTemporaryId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted category missing clientTemporaryId',
          });
        }

        const category = addedCategory.get(tempId);
        if (!category) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: `No category found for temporary id ${tempId}`,
          });
        }

        return CalendarCategory.promote(category, {
          id: asCalendarCategoryId(row.id),
          createdAt: row.createdAt,
        });
      });
    }

    if (removedCategoryIds.size > 0) {
      await tx.delete(CalendarCategoriesTable).where(inArray(CalendarCategoriesTable.id, [...removedCategoryIds]));
    }

    if (updatedCategory.size > 0) {
      for (const [UUID, category] of updatedCategory) {
        await tx
          .update(CalendarCategoriesTable)
          .set(category.pullDirtyFields())
          .where(eq(CalendarCategoriesTable.id, UUID));
      }
    }

    calendar.commitCategories(persistedCategories);
  }

  private async syncEvents(tx: PostgresTransaction, calendar: PersistedCalendar) {
    const { addedEvent, removedEventIds, updatedEvent } = calendar.pullEventChanges();
    let persistedEvents: PersistedCalendarEvent[] = [];

    if (addedEvent.size > 0) {
      const rows = await tx
        .insert(CalendarEventsTable)
        .values(
          [...addedEvent.values()].map(
            (e): CalendarEventsTableInsert => ({
              title: e.title,
              calendarId: e.calendarId,
              categoryId: e.categoryId,
              description: e.description,
              color: e.color,
              eventStartAt: e.eventStartAt,
              eventEndAt: e.eventEndAt,
              clientTemporaryId: e.symbol,
            })
          )
        )
        .returning();

      persistedEvents = rows.map((row) => {
        const tempId = row.clientTemporaryId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted event missing clientTemporaryId',
          });
        }

        const event = addedEvent.get(tempId);
        if (!event) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: `No event found for temporary id ${tempId}`,
          });
        }

        return CalendarEvent.promote(event, {
          id: asCalendarEventId(row.id),
          createdAt: row.createdAt,
        });
      });
    }

    if (removedEventIds.size > 0) {
      await tx.delete(CalendarEventsTable).where(inArray(CalendarEventsTable.id, [...removedEventIds]));
    }

    if (updatedEvent.size > 0) {
      for (const [UUID, event] of updatedEvent) {
        await tx.update(CalendarEventsTable).set(event.pullDirtyFields()).where(eq(CalendarEventsTable.id, UUID));
      }
    }

    calendar.commitEvents(persistedEvents);
  }
}
