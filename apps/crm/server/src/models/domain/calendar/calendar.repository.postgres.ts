/* eslint-disable perfectionist/sort-objects */
import type { PostgresTransaction } from '#Config/dbPostgres.js';
import type { CalendarCategoriesTableInsert } from '#Config/schema/calendar/Categories.js';
import type { CalendarEventsTableInsert } from '#Config/schema/calendar/Events.js';

import type { NewCalendar, PersistedCalendar } from './calendar.js';
import type { CalendarRepository } from './calendar.repository.js';
import type { CalendarId } from './calendar.types.js';
import type { PersistedCalendarCategory } from './category/category.js';
import type { PersistedCalendarEvent } from './event/event.js';

import { and, eq, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CalendarTable from '#Config/schema/calendar/Calendar.js';
import CalendarCategoriesTable from '#Config/schema/calendar/Categories.js';
import CalendarEventsTable from '#Config/schema/calendar/Events.js';
import CalendarEventsParticipantsTable from '#Config/schema/calendar/EventsParticipants.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { Calendar } from './calendar.js';
import { calendarRowToDomain } from './calendar.mapper.js';
import { CalendarCategory } from './category/category.js';
import { CalendarEvent } from './event/event.js';

export class PostgresCalendarRepository implements CalendarRepository {
  constructor() {}

  async findCalendarById(id: CalendarId): Promise<PersistedCalendar | null> {
    return postgresDBCall(async () => {
      const row = await postgresDB.query.CalendarTable.findFirst({
        where: (calendar, { eq }) => eq(calendar.id, id),
      });
      return row ? calendarRowToDomain(row) : null;
    });
  }

  async save(calendar: NewCalendar | PersistedCalendar): Promise<PersistedCalendar> {
    return postgresDBCall(async () => {
      const persistedCalendar = await postgresDB.transaction(async (tx) => {
        const persistedCalendar = calendar.isPersisted() ? calendar : await this.insert(tx, calendar);

        if (persistedCalendar.hasDirtyFields()) await this.update(tx, persistedCalendar);

        await this.syncCategories(tx, persistedCalendar);
        await this.syncEvents(tx, persistedCalendar);
        await this.syncEventsParticipants(tx, persistedCalendar);

        persistedCalendar.commit();
        return persistedCalendar;
      });

      return persistedCalendar;
    });
  }

  async remove(id: CalendarId): Promise<CalendarId> {
    return postgresDBCall(async () => {
      const rows = await postgresDB
        .delete(CalendarTable)
        .where(eq(CalendarTable.id, id))
        .returning({ id: CalendarTable.id });

      if (rows.length === 0 || rows[0] === undefined)
        throw new PostgresError({ kind: 'NOT_FOUND', message: `Calendar ${id} not found` });
      if (rows.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple calendars deleted' });

      return rows[0].id;
    });
  }

  private async insert(tx: PostgresTransaction, calendar: NewCalendar): Promise<PersistedCalendar> {
    const rows = await tx
      .insert(CalendarTable)
      .values({
        companyId: calendar.companyId,
      })
      .returning();

    if (rows.length === 0 || rows[0] === undefined)
      throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Failed to create Calendar' });

    return Calendar.promote(calendar, { id: rows[0].id, createdAt: rows[0].createdAt });
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
              clientGeneratedId: c.clientGeneratedId,
            })
          )
        )
        .returning();

      persistedCategories = rows.map((row) => {
        const tempId = row.clientGeneratedId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted category missing clientGeneratedId',
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
          id: row.id,
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
              clientGeneratedId: e.clientGeneratedId,
            })
          )
        )
        .returning();

      persistedEvents = rows.map((row) => {
        const tempId = row.clientGeneratedId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted event missing clientGeneratedId',
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
          id: row.id,
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

  private async syncEventsParticipants(tx: PostgresTransaction, calendar: PersistedCalendar) {
    const { events } = calendar.pullEvents();

    for (const [id, event] of events) {
      const { addedParticipants, removedParticipants } = event.pullParticipantChanges();
      if (addedParticipants.size > 0) {
        await tx.insert(CalendarEventsParticipantsTable).values(
          [...addedParticipants].map((userProfileId) => ({
            eventId: id,
            userProfileId,
          }))
        );
      }

      if (removedParticipants.size > 0) {
        await tx
          .delete(CalendarEventsParticipantsTable)
          .where(
            and(
              eq(CalendarEventsParticipantsTable.eventId, id),
              inArray(CalendarEventsParticipantsTable.userProfileId, [...removedParticipants])
            )
          );
      }

      event.commitEventParticipants();
    }
  }
}
