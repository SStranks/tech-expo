import type { TContactsTableInsert } from '#Config/schema/index.js';

import type { TSeedContactCompanies } from '../Contacts.js';

import { faker } from '@faker-js/faker';

import { CONTACT_STAGE } from '#Config/schema/contacts/Contacts.js';
import DigitalIndustryJson from '#Data/DigitalIndustry.json';

const { jobTitles } = DigitalIndustryJson;
type TJobTitles = typeof jobTitles;

export function generateContact(company: TSeedContactCompanies): TContactsTableInsert {
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
    jobTitle: faker.helpers.arrayElement(jobTitles[industry as keyof TJobTitles]),
    lastName,
    phone: faker.phone.number({ style: 'international' }),
    stage,
    timezone: company.timezone,
  };
}
