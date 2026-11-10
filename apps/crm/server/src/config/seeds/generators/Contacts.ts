/* eslint-disable security/detect-object-injection */
import type { ContactsTableInsert } from '#Config/schema/contacts/Contacts.ts';
import type { ContactClientGeneratedId } from '#Models/domain/contact/contact.types.js';

import type { SeedContactCompanies } from '../Contacts.js';
import type { DigitalIndustryJSON } from '../types/types.js';

import { createMockUUID } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import { CONTACT_STAGE } from '#Models/domain/contact/contact.types.js';

import { importJSONSeed } from '../utils/import.js';

const DigitalIndustryJSON = importJSONSeed<DigitalIndustryJSON>('DigitalIndustry.json');

const { jobTitles } = DigitalIndustryJSON;

export function generateContact(company: SeedContactCompanies): ContactsTableInsert {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const provider = company.website?.split('//')[1];
  const stage = faker.helpers.arrayElement(CONTACT_STAGE);
  const { industry } = company;

  if (!(industry in jobTitles))
    throw new Error(`Data mismatch; check JSON structure and companies seeding; industry: ${industry}`);

  return {
    clientGeneratedId: createMockUUID() as ContactClientGeneratedId,
    companyId: company.id,
    email: faker.internet.email({ firstName, lastName, provider }),
    firstName,
    jobTitle: faker.helpers.arrayElement(jobTitles[industry]!),
    lastName,
    phone: faker.phone.number({ style: 'international' }),
    stage,
    timezoneId: company.timezone,
  };
}
