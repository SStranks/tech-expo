import type { PostgresClient } from '#Config/dbPostgres.js';
import type { ContactsTableInsert } from '#Config/schema/contacts/Contacts.js';

import { faker } from '@faker-js/faker';
import { eq, ne } from 'drizzle-orm';

import CompaniesTable from '#Config/schema/companies/Companies.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import CountriesTable from '#Config/schema/Countries.js';
import TimeZoneTable from '#Config/schema/TimeZones.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateContact } from './generators/Contacts.js';

const { COMPANY_CONTACTS_MAX, COMPANY_CONTACTS_MIN, COMPANY_NAME } = seedSettings;

export type SeedContactCompanies = Awaited<ReturnType<typeof getCompanies>>[number];
const getCompanies = async (db: PostgresClient) => {
  // Selects all the companies (except the primary company);
  // Joins the associated country of the company
  // Joins the associated timezones of the country
  // SelectDistinctOn; countries can have multiple timezones; narrow the results by using the company ID
  return db
    .selectDistinctOn([CompaniesTable.id], {
      id: CompaniesTable.id,
      companyName: CompaniesTable.name,
      countryAlpha2: CountriesTable.alpha2Code,
      industry: CompaniesTable.industry,
      timezone: TimeZoneTable.id,
      website: CompaniesTable.website,
    })
    .from(CompaniesTable)
    .where(ne(CompaniesTable.name, COMPANY_NAME))
    .leftJoin(CountriesTable, eq(CountriesTable.id, CompaniesTable.countryId))
    .leftJoin(TimeZoneTable, eq(TimeZoneTable.countryId, CountriesTable.id));
};

export default async function seedContacts(db: PostgresClient) {
  // ----------- CONTACTS TABLE ------------ //
  const contactsInsertionData: ContactsTableInsert[] = [];
  const companies = await getCompanies(db);

  // Generate between 2 - 6 contacts per company
  companies.forEach((company: SeedContactCompanies) => {
    const randNumOfContacts = faker.number.int({ max: COMPANY_CONTACTS_MAX, min: COMPANY_CONTACTS_MIN });

    for (let i = 0; i < randNumOfContacts; i++) {
      contactsInsertionData.push(generateContact(company));
    }
  });

  await db.insert(ContactsTable).values(contactsInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Contacts.ts');
}
