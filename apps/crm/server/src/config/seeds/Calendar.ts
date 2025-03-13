import type { TPostgresDB } from '#Config/dbPostgres.ts';
import type {
  TCalendarCategoriesTableInsert,
  TCalendarCategoriesTableSelect,
  TCalendarEventsParticipantsTableInsert,
  TCalendarEventsTableInsert,
  TCalendarEventsTableSelect,
  TCalendarTableInsert,
} from '#Config/schema/index.ts';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import {
  CalendarCategoriesTable,
  CalendarEventsParticipantsTable,
  CalendarEventsTable,
  CalendarTable,
  CompaniesTable,
} from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';
import CalendarEventsJSON from '#Data/CalendarEvents.json';

const {
  CALENDAR_EVENT_PARTICIPANTS_MAX,
  CALENDAR_EVENT_PARTICIPANTS_MIN,
  CALENDAR_EVENTS_MAX,
  CALENDAR_EVENTS_MIN,
  COMPANY_NAME,
  USER_ENTRY_COUNT,
} = seedSettings;

export default async function seedCalendar(db: TPostgresDB) {
  // Get primary company ID
  const primaryCompany = await db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.companyName, COMPANY_NAME),
  });

  if (!primaryCompany) throw new Error(`Error: Could not source ${COMPANY_NAME} from company table`);

  // ------------ CALENDAR ----------- //
  const calendarData: TCalendarTableInsert[] = [{ companyId: primaryCompany.id }];

  const calendarReturnData = await db
    .insert(CalendarTable)
    .values(calendarData)
    .returning({ calendarId: CalendarTable.id });

  const calendarId = calendarReturnData[0].calendarId;

  // ------ CALENDAR CATEGORIES ------ //
  const calendarCategoriesData: TCalendarCategoriesTableInsert[] = [];

  // Generate 4 - 6 event categories; sourced from JSON
  const insertCategories = faker.helpers.arrayElements(CalendarEventsJSON.categories, {
    max: CALENDAR_EVENTS_MAX,
    min: CALENDAR_EVENTS_MIN,
  });
  insertCategories.forEach((category) => {
    calendarCategoriesData.push({ calendarId, title: category });
  });

  const calendarCategoriesReturnData: TCalendarCategoriesTableSelect[] = await db
    .insert(CalendarCategoriesTable)
    .values(calendarCategoriesData)
    .returning();

  // -------- CALENDAR EVENTS -------- //
  const calendarEventsData: TCalendarEventsTableInsert[] = [];

  // For each type of calendar event category; insert the 5 events listed in JSON data
  calendarCategoriesReturnData.forEach(({ calendarId, id: categoryId, title }) => {
    const eventsOfCategory = CalendarEventsJSON.categoryTitles[title as keyof typeof CalendarEventsJSON.categoryTitles];
    eventsOfCategory.forEach((event) => {
      calendarEventsData.push({
        calendarId,
        categoryId,
        description: event.description,
        eventEnd: new Date(event.end_timestamp),
        eventStart: new Date(event.start_timestamp),
        title: event.title,
      });
    });
  });

  const calendarEventsReturnData: Pick<TCalendarEventsTableSelect, 'id'>[] = await db
    .insert(CalendarEventsTable)
    .values(calendarEventsData)
    .returning({ id: CalendarEventsTable.id });

  // -- CALENDAR EVENT-PARTICIPANTS -- //
  const CalendarEventsParticipantsData: TCalendarEventsParticipantsTableInsert[] = [];

  // Get all users for the primary company
  const userIds = await db.query.UserProfileTable.findMany({ columns: { id: true } });
  if (userIds.length === USER_ENTRY_COUNT)
    throw new Error(`Error: Could not source the ${USER_ENTRY_COUNT} users of ${COMPANY_NAME}`);

  // For each event; gather 2 - 6 random User ID's; create an entry per user per event
  calendarEventsReturnData.forEach((event) => {
    const randUserIds = faker.helpers.arrayElements(userIds, {
      max: CALENDAR_EVENT_PARTICIPANTS_MAX,
      min: CALENDAR_EVENT_PARTICIPANTS_MIN,
    });
    randUserIds.forEach(({ id }) => {
      CalendarEventsParticipantsData.push({ eventId: event.id, userId: id });
    });
  });

  await db.insert(CalendarEventsParticipantsTable).values(CalendarEventsParticipantsData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Calendar.ts, Categories.ts, Events.ts, EventsParticipants.ts');
}
