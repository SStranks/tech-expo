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
  const primaryCompany = await db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.name, COMPANY_NAME),
  });
  if (!primaryCompany) throw new Error(`Error: Could not source ${COMPANY_NAME} from company table`);

  // ------------ CALENDAR TABLE ----------- //
  const calendarInsertionData: TCalendarTableInsert[] = [];
  calendarInsertionData.push({ companyId: primaryCompany.id });

  const calendarReturnData = await db
    .insert(CalendarTable)
    .values(calendarInsertionData)
    .returning({ calendarId: CalendarTable.id });

  const PRIMARY_COMPANY_CALENDAR_ID = calendarReturnData[0].calendarId;

  // ------ CALENDAR CATEGORIES TABLE ------ //
  const calendarCategoriesInsertionData: TCalendarCategoriesTableInsert[] = [];

  // Generate 4 - 6 event categories; sourced from JSON
  const calendarCategories = faker.helpers.arrayElements(CalendarEventsJSON.categories, {
    max: CALENDAR_EVENTS_MAX,
    min: CALENDAR_EVENTS_MIN,
  });
  calendarCategories.forEach((category) => {
    calendarCategoriesInsertionData.push({ calendarId: PRIMARY_COMPANY_CALENDAR_ID, title: category });
  });

  const calendarCategoriesReturnData: TCalendarCategoriesTableSelect[] = await db
    .insert(CalendarCategoriesTable)
    .values(calendarCategoriesInsertionData)
    .returning();

  // -------- CALENDAR EVENTS TABLE -------- //
  const calendarEventsInsertionData: TCalendarEventsTableInsert[] = [];

  // For each type of calendar event category; insert the 5 events listed in JSON data
  calendarCategoriesReturnData.forEach(({ calendarId, id: categoryId, title }) => {
    const eventsOfCategory = CalendarEventsJSON.categoryTitles[title as keyof typeof CalendarEventsJSON.categoryTitles];
    eventsOfCategory.forEach((event) => {
      calendarEventsInsertionData.push({
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
    .values(calendarEventsInsertionData)
    .returning({ id: CalendarEventsTable.id });

  // -- CALENDAR EVENT-PARTICIPANTS TABLE -- //
  const CalendarEventsParticipantsInsertionData: TCalendarEventsParticipantsTableInsert[] = [];

  // Get all users for the primary company
  const primaryCompanyUserIds = await db.query.UserProfileTable.findMany({ columns: { id: true } });
  if (primaryCompanyUserIds.length === USER_ENTRY_COUNT)
    throw new Error(`Mismatch in data: Returned length of primary company users != USER_ENTRY_COUNT`);

  // For each event; gather 2 - 6 random User ID's; create an entry per user per event
  calendarEventsReturnData.forEach((event) => {
    const randUserIds = faker.helpers.arrayElements(primaryCompanyUserIds, {
      max: CALENDAR_EVENT_PARTICIPANTS_MAX,
      min: CALENDAR_EVENT_PARTICIPANTS_MIN,
    });
    randUserIds.forEach(({ id }) => {
      CalendarEventsParticipantsInsertionData.push({ eventId: event.id, userId: id });
    });
  });

  await db.insert(CalendarEventsParticipantsTable).values(CalendarEventsParticipantsInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Calendar.ts, Categories.ts, Events.ts, EventsParticipants.ts');
}
