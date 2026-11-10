/* eslint-disable security/detect-object-injection */
import type { ContactsNotesTableInsert } from '#Config/schema/contacts/ContactsNotes.js';
import type { ContactNoteClientGeneratedId } from '#Models/domain/contact/note/note.types.js';

import type { SeedContactNotesContact, SeedContactNotesUsers } from '../ContactsNotes.ts';
import type { ContactsNotesJSON } from '../types/types.js';

import { createMockUUID } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import { importJSONSeed } from '../utils/import.js';
import { generateCommentDates, replaceCommentPlaceholders } from './utils.js';

const ContactsNotesJSON = importJSONSeed<ContactsNotesJSON>('ContactsNotes.json');
const { chain_notes: CHAIN_NOTES, non_chain_notes: NON_CHAIN_NOTES } = ContactsNotesJSON;

/* eslint-disable perfectionist/sort-objects */
// For the current 'contact stage' (key), appropriate previous 'contact stage' (value)
const CHAIN_NOTES_MAP = {
  NEW: 'new',
  CONTACTED: 'new',
  INTERESTED: 'contacted',
  UNQUALIFIED: 'interested',
  QUALIFIED: 'interested',
  NEGOTIATION: 'qualified',
  LOST: 'negotiation',
  WON: 'negotiation',
  CHURNED: 'lost',
} as const;
/* eslint-enable perfectionist/sort-objects */

// Take chain-notes from previous stage and push on a non-chain-note from current stage.
export function generateContactNotes(
  contact: SeedContactNotesContact,
  allUsers: SeedContactNotesUsers
): ContactsNotesTableInsert[] {
  const returnContactNotes: ContactsNotesTableInsert[] = [];
  const {
    stage,
    company: { industry },
  } = contact;

  // Get appropriate previous 'contact stage' chain-notes
  const previousStage = CHAIN_NOTES_MAP[stage];
  const allChainNotesFromStage = CHAIN_NOTES[previousStage];

  if (allChainNotesFromStage === undefined) throw new Error(`Incongruency. ${previousStage} not found in chain notes`);
  const randChainNotesArray = [...faker.helpers.arrayElement(allChainNotesFromStage)];

  // Push additional non-chain note from the appropriate industry for the current 'contact stage'
  if (NON_CHAIN_NOTES[industry] === undefined)
    throw new Error(`Incongruency. ${industry} not found in non-chain notes`);

  const stageLowerCase = stage.toLowerCase() as keyof (typeof NON_CHAIN_NOTES)[typeof industry];
  const finalComment = NON_CHAIN_NOTES[industry][stageLowerCase];
  const totalComments = randChainNotesArray.push({ comment: finalComment });

  // Gather random users and randomize dates for the comments 'createdAt'
  const users = faker.helpers.arrayElements(allUsers, totalComments);
  const commentsCreatedAt = generateCommentDates(totalComments);

  for (const [i, note] of randChainNotesArray.entries()) {
    let { comment } = note;
    const companyName = contact.company.name;
    const contactName = contact.firstName;
    const userName = users[i - 1]?.firstName;
    comment = replaceCommentPlaceholders(comment, { companyName, contactName, industry, userName });

    if (users[i] === undefined) throw new Error(`generateContactNotes: users[${i}] undefined`);

    const contactNote: ContactsNotesTableInsert = {
      clientGeneratedId: createMockUUID() as ContactNoteClientGeneratedId,
      contactId: contact.id,
      createdAt: commentsCreatedAt[i],
      createdByUserProfileId: users[i].id,
      note: comment,
    };

    returnContactNotes.push(contactNote);
  }

  return returnContactNotes;
}
