/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';

export type ContactStage = (typeof CONTACT_STAGE)[number];
export const CONTACT_STAGE = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'UNQUALIFIED',
  'QUALIFIED',
  'NEGOTIATION',
  'LOST',
  'WON',
  'CHURNED',
] as const;

export type ContactDTO = {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: UUID;
  jobTitle: string;
  stage: ContactStage;
  timezone: UUID | null;
};

export const toContactDTO = (contact: ContactsTableSelect): ContactDTO => ({
  id: contact.id,
  firstName: contact.firstName,
  lastName: contact.lastName,
  email: contact.email,
  phone: contact.phone,
  company: contact.company,
  jobTitle: contact.jobTitle,
  stage: contact.stage,
  timezone: contact.timezone,
});
