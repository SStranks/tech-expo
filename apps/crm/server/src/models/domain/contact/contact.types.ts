import type { UUID } from '@apps/crm-shared';

import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { PersistedContact } from './contact.js';
import type { PersistedContactNote } from './note/note.js';
import type { ContactNoteId } from './note/note.types.js';

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

export type ContactId = UUID & { readonly __contactId: unique symbol };

export type CreateContactCommand = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: CompanyId;
  jobTitle: string;
  stage: ContactStage;
  timezoneId?: TimeZoneId;
  image?: string;
};

export type UpdateContactCommand = {
  id: ContactId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyId?: CompanyId;
  jobTitle?: string;
  stage?: ContactStage;
  timezoneId?: TimeZoneId;
  image?: string;
  addNotes?: { body: string }[];
  removeNotesIds?: ContactNoteId[];
};

export type AddContactNoteCommand = {
  contactId: ContactId;
  note: string;
};

export type AddContactNoteReturn = { contact: PersistedContact; contactNote: PersistedContactNote };
export type UpdateContactNoteReturn = { contact: PersistedContact; contactNote: PersistedContactNote };

export type UpdateContactNoteCommand = {
  contactId: ContactId;
  contactNoteId: ContactNoteId;
  note: string;
};

export type RemoveContactNoteCommand = {
  contactId: ContactId;
  contactNoteId: ContactNoteId;
};
