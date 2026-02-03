import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { CalendarTableInsert } from '#Config/schema/calendar/Calendar.ts';
import type {
  CalendarCategoriesTableInsert,
  CalendarCategoriesTableSelect,
} from '#Config/schema/calendar/Categories.ts';
import type { CalendarEventsTableInsert, CalendarEventsTableSelect } from '#Config/schema/calendar/Events.ts';
import type { CalendarEventsParticipantsTableInsert } from '#Config/schema/calendar/EventsParticipants.ts';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import CalendarTable from '#Config/schema/calendar/Calendar.js';
import CalendarCategoriesTable from '#Config/schema/calendar/Categories.js';
import CalendarEventsTable from '#Config/schema/calendar/Events.js';
import CalendarEventsParticipantsTable from '#Config/schema/calendar/EventsParticipants.js';
import CompaniesTable from '#Config/schema/companies/Companies.js';
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

export default async function seedCalendar(db: PostgresClient) {
  const primaryCompany = await db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.name, COMPANY_NAME),
  });
  if (!primaryCompany) throw new Error(`Error: Could not source ${COMPANY_NAME} from company table`);

  // ------------ CALENDAR TABLE ----------- //
  const calendarInsertionData: CalendarTableInsert[] = [];
  // eslint-disable-next-line unicorn/no-immediate-mutation
  calendarInsertionData.push({ companyId: primaryCompany.id });

  const calendarReturnData = await db
    .insert(CalendarTable)
    .values(calendarInsertionData)
    .returning({ calendarId: CalendarTable.id });

  const PRIMARY_COMPANY_CALENDAR_ID = calendarReturnData[0].calendarId;

  // ------ CALENDAR CATEGORIES TABLE ------ //
  const calendarCategoriesInsertionData: CalendarCategoriesTableInsert[] = [];

  // Generate 4 - 6 event categories; sourced from JSON
  const calendarCategories = faker.helpers.arrayElements(CalendarEventsJSON.categories, {
    max: CALENDAR_EVENTS_MAX,
    min: CALENDAR_EVENTS_MIN,
  });
  calendarCategories.forEach((category) => {
    calendarCategoriesInsertionData.push({ calendarId: PRIMARY_COMPANY_CALENDAR_ID, title: category });
  });

  const calendarCategoriesReturnData: CalendarCategoriesTableSelect[] = await db
    .insert(CalendarCategoriesTable)
    .values(calendarCategoriesInsertionData)
    .returning();

  // -------- CALENDAR EVENTS TABLE -------- //
  const calendarEventsInsertionData: CalendarEventsTableInsert[] = [];

  // For each type of calendar event category; insert the 5 events listed in JSON data
  calendarCategoriesReturnData.forEach(({ calendarId, id: categoryId, title }) => {
    const eventsOfCategory = CalendarEventsJSON.categoryTitles[title as keyof typeof CalendarEventsJSON.categoryTitles];
    eventsOfCategory.forEach((event) => {
      calendarEventsInsertionData.push({
        calendarId,
        categoryId,
        description: event.description,
        eventEndAt: new Date(event.end_timestamp),
        eventStartAt: new Date(event.start_timestamp),
        title: event.title,
      });
    });
  });

  const calendarEventsReturnData: Pick<CalendarEventsTableSelect, 'id'>[] = await db
    .insert(CalendarEventsTable)
    .values(calendarEventsInsertionData)
    .returning({ id: CalendarEventsTable.id });

  // -- CALENDAR EVENT-PARTICIPANTS TABLE -- //
  const CalendarEventsParticipantsInsertionData: CalendarEventsParticipantsTableInsert[] = [];

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
