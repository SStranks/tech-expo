import type { UUID } from '@apps/crm-shared';

import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { ContactAvatar } from '#Graphql/generated/graphql.gen.js';
import type { ContactReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { ContactDTO } from './contact.dto.js';
import type { PersistedContact } from './contact.js';
import type { ContactId } from './contact.types.js';

import { Contact } from './contact.js';

export function asContactId(id: UUID): ContactId {
  return id as ContactId;
}

export function contactReadRowToContactDTO(contact: ContactReadRow): ContactDTO {
  return {
    id: contact.id,
    clientGeneratedId: contact.clientGeneratedId,
    companyId: contact.companyId,
    email: contact.email,
    firstName: contact.firstName,
    image: contact.image,
    jobTitle: contact.jobTitle,
    lastName: contact.lastName,
    phone: contact.phone,
    stage: contact.stage,
    timezoneId: contact.timezoneId,
  };
}

export function contactRowToDomain(row: ContactsTableSelect): PersistedContact {
  return Contact.rehydrate({
    id: row.id,
    companyId: row.companyId,
    createdAt: row.createdAt,
    email: row.email,
    firstName: row.firstName,
    image: row.image,
    jobTitle: row.jobTitle,
    lastName: row.lastName,
    phone: row.phone,
    stage: row.stage,
    timezoneId: row.timezoneId ?? null,
  });
}

export function contactDomainToContactDTO(contact: PersistedContact): ContactDTO {
  return {
    id: contact.id,
    clientGeneratedId: contact.clientGeneratedId,
    companyId: contact.companyId,
    email: contact.email,
    firstName: contact.firstName,
    image: contact.image ?? null,
    jobTitle: contact.jobTitle,
    lastName: contact.lastName,
    phone: contact.phone,
    stage: contact.stage,
    timezoneId: contact.timezoneId ?? null,
  };
}

export function contactReadRowToCompanyAvatarContact(contact: ContactReadRow): ContactAvatar {
  return {
    id: contact.id,
    firstName: contact.firstName,
    image: contact.image,
    lastName: contact.lastName,
  };
}
