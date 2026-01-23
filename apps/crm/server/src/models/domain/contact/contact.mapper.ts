/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { ContactAvatar } from '#Graphql/generated/graphql.gen.js';
import type { ContactReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { ContactDTO } from './contact.dto.js';
import type { PersistedContact } from './contact.js';
import type { ContactId } from './contact.types.js';

import { asCompanyId } from '../company/company.mapper.js';
import { asTimeZoneId } from '../timezone/timezone.mapper.js';
import { Contact } from './contact.js';

export function asContactId(id: UUID): ContactId {
  return id as ContactId;
}

export function contactReadRowToDTO(contact: ContactReadRow): ContactDTO {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    companyId: contact.companyId,
    jobTitle: contact.jobTitle,
    stage: contact.stage,
    timezoneId: contact.timezoneId,
    image: contact.image,
  };
}

export function toContactDomain(row: ContactsTableSelect): PersistedContact {
  return Contact.rehydrate({
    id: asContactId(row.id),
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    companyId: asCompanyId(row.companyId),
    jobTitle: row.jobTitle,
    stage: row.stage,
    timezoneId: row.timezoneId ? asTimeZoneId(row.timezoneId) : null,
    image: row.image,
    createdAt: row.createdAt,
  });
}

export function contactDomainToContactDTO(contact: PersistedContact): ContactDTO {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    companyId: contact.companyId,
    jobTitle: contact.jobTitle,
    stage: contact.stage,
    timezoneId: contact.timezoneId,
    image: contact.image,
  };
}

export function contactReadRowToCompanyAvatarContact(contact: ContactReadRow): ContactAvatar {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    image: contact.image,
  };
}
