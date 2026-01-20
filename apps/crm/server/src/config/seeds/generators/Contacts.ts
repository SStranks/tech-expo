import type { ContactsTableInsert } from '#Config/schema/contacts/Contacts.ts';

import type { SeedContactCompanies } from '../Contacts.js';

import { faker } from '@faker-js/faker';

import DigitalIndustryJson from '#Data/DigitalIndustry.json';
import { CONTACT_STAGE } from '#Models/domain/contact/contact.types.js';

const { jobTitles } = DigitalIndustryJson;
type JobTitles = typeof jobTitles;

export function generateContact(company: SeedContactCompanies): ContactsTableInsert {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const provider = company.website?.split('//')[1];
  const stage = faker.helpers.arrayElement(CONTACT_STAGE);
  const { industry } = company;

  if (!(industry in jobTitles))
    throw new Error(`Data mismatch; check JSON structure and companies seeding; industry: ${industry}`);

  return {
    company: company.id,
    email: faker.internet.email({ firstName, lastName, provider }),
    firstName,
    jobTitle: faker.helpers.arrayElement(jobTitles[industry as keyof JobTitles]),
    lastName,
    phone: faker.phone.number({ style: 'international' }),
    stage,
    timezone: company.timezone,
  };
}
