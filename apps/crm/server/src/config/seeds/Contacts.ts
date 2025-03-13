import type { UUID } from 'node:crypto';

import type { TPostgresDB } from '#Config/dbPostgres.js';

import { faker } from '@faker-js/faker';
import { eq, ne } from 'drizzle-orm';

import {
  CompaniesTable,
  ContactsTable,
  CountriesTable,
  TContactsTableInsert,
  TimeZoneTable,
} from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateContact } from './generators/Contacts.js';

const { COMPANY_CONTACTS_MAX, COMPANY_CONTACTS_MIN, COMPANY_NAME } = seedSettings;

export interface ICompanyObject {
  id: UUID;
  companyName: string;
  countryAlpha2: string | null;
  industry: string;
  timezone: UUID | null;
  website: string | null;
}

export default async function seedContacts(db: TPostgresDB) {
  // ----------- CONTACTS ------------ //
  const contactsData: TContactsTableInsert[] = [];

  // Selects all the companies (except the primary company);
  // Joins the associated country of the company
  // Joins the associated timezones of the country
  // SelectDistinctOn; countries can have multiple timezones; narrow the results by using the company ID
  const companies = await db
    .selectDistinctOn([CompaniesTable.id], {
      id: CompaniesTable.id,
      companyName: CompaniesTable.companyName,
      countryAlpha2: CountriesTable.alpha2Code,
      industry: CompaniesTable.industry,
      timezone: TimeZoneTable.id,
      website: CompaniesTable.website,
    })
    .from(CompaniesTable)
    .where(ne(CompaniesTable.companyName, COMPANY_NAME))
    .leftJoin(CountriesTable, eq(CountriesTable.id, CompaniesTable.country))
    .leftJoin(TimeZoneTable, eq(TimeZoneTable.countryId, CountriesTable.id));

  // Generate between 2 - 6 contacts per company
  companies.forEach((company: ICompanyObject) => {
    const randNumOfContacts = faker.number.int({ max: COMPANY_CONTACTS_MAX, min: COMPANY_CONTACTS_MIN });

    for (let i = 0; i < randNumOfContacts; i++) {
      contactsData.push(generateContact(company));
    }
  });

  await db.insert(ContactsTable).values(contactsData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Contacts.ts');
}
