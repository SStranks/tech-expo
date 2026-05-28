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

export type ContactId = UUID & { readonly __contactId: 'ContactId' };
export type ContactClientGeneratedId = UUID & { readonly __contactClientGeneratedId: 'ContactClientGeneratedId' };

export type CreateContactCommand = {
  companyId: CompanyId;
  email: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  phone: string;
  stage: ContactStage;
  image?: string | null;
  timezoneId?: TimeZoneId;
};

export type UpdateContactCommand = {
  id: ContactId;
  addNotes?: { body: string }[];
  companyId?: CompanyId;
  email?: string;
  firstName?: string;
  image?: string | null;
  jobTitle?: string;
  lastName?: string;
  phone?: string;
  removeNotesIds?: ContactNoteId[];
  stage?: ContactStage;
  timezoneId?: TimeZoneId;
};

export type AddContactNoteCommand = {
  contactId: ContactId;
  note: string;
};
export type AddContactNoteReturn = { contact: PersistedContact; contactNote: PersistedContactNote };

export type UpdateContactNoteCommand = {
  contactId: ContactId;
  contactNoteId: ContactNoteId;
  note: string;
};
export type UpdateContactNoteReturn = { contact: PersistedContact; contactNote: PersistedContactNote };

export type RemoveContactNoteCommand = {
  contactId: ContactId;
  contactNoteId: ContactNoteId;
};
