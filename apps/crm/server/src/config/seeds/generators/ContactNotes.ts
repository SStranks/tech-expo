/* eslint-disable perfectionist/sort-objects */
/* eslint-disable security/detect-object-injection */
import type { TContactsNotesTableInsert } from '#Config/schema/index.js';

import type { TSeedContactNotesContact, TSeedContactNotesUsers } from '../ContactsNotes.js';

import { faker } from '@faker-js/faker';

import ContactsNotes from '#Data/ContactsNotes.json';

import { generateCommentDates, replaceCommentPlaceholders } from './utils.js';

const { chain_notes: CHAIN_NOTES, non_chain_notes: NON_CHAIN_NOTES } = ContactsNotes;

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

// Take chain-notes from previous stage and push on a non-chain-note from current stage.
export function generateContactNotes(
  contact: TSeedContactNotesContact,
  allUsers: TSeedContactNotesUsers
): TContactsNotesTableInsert[] {
  const returnContactNotes: TContactsNotesTableInsert[] = [];
  const {
    stage,
    company: { industry },
  } = contact;

  // Get appropriate previous 'contact stage' chain-notes
  const previousStage = CHAIN_NOTES_MAP[stage];
  const allChainNotesFromStage = CHAIN_NOTES[previousStage];
  const randChainNotesArray = [...faker.helpers.arrayElement(allChainNotesFromStage)];

  // Push additional non-chain note from the appropriate industry for the current 'contact stage'
  const finalComment =
    NON_CHAIN_NOTES[industry as keyof typeof NON_CHAIN_NOTES][stage.toLowerCase() as Lowercase<typeof stage>];
  const totalComments = randChainNotesArray.push({ comment: finalComment });

  // Gather random users and randomize dates for the comments 'createdAt'
  const users = faker.helpers.arrayElements(allUsers, totalComments);
  const commentsCreatedAt = generateCommentDates(totalComments);

  for (let [i, { comment }] of randChainNotesArray.entries()) {
    const companyName = contact.company.name;
    const contactName = contact.firstName;
    const userName = users[i - 1]?.firstName;
    comment = replaceCommentPlaceholders(comment, { companyName, contactName, industry, userName });

    const contactNote: TContactsNotesTableInsert = {
      contactId: contact.id,
      createdAt: commentsCreatedAt[i],
      createdBy: users[i].id,
      note: comment,
    };

    returnContactNotes.push(contactNote);
  }

  return returnContactNotes;
}
