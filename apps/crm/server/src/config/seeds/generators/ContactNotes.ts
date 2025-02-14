/* eslint-disable perfectionist/sort-objects */
/* eslint-disable security/detect-object-injection */
import type { UUID } from 'node:crypto';

import type { TContactsNotesTableInsert } from '#Config/schema/index.js';

import type { TContactsQueryContactsNotes } from '../ContactsNotes.js';

import { faker } from '@faker-js/faker';

import ContactsNotes from '#Data/ContactsNotes.json';

const DATE_NOW = new Date();
const DATE_3_DAYS_AGO = new Date(new Date().setDate(new Date().getDate() - 3));

const { chain_notes: CHAIN_NOTES, non_chain_notes: NON_CHAIN_NOTES } = ContactsNotes;

// For the current 'contact stage' (key), appropriate previous 'contact stage' (value)
const CHAIN_NOTES_MAP = {
  new: 'new',
  contacted: 'new',
  interested: 'contacted',
  unqualified: 'interested',
  qualified: 'interested',
  negotiation: 'qualified',
  lost: 'negotiation',
  won: 'negotiation',
  churned: 'lost',
} as const;

// Take chain-notes from previous stage and push on a non-chain-note from current stage.
export function generateContactNotes(
  contact: TContactsQueryContactsNotes,
  allUsers: { id: UUID; firstName: string }[]
): TContactsNotesTableInsert[] {
  const returnNotes: TContactsNotesTableInsert[] = [];
  const {
    stage,
    company: { industry },
  } = contact;

  // Get appropriate previous 'contact stage' chain-notes
  const previousStage = CHAIN_NOTES_MAP[stage];
  const allChainNotesFromStage = CHAIN_NOTES[previousStage];
  const randChainNotesArray = [...faker.helpers.arrayElement(allChainNotesFromStage)];

  // Push additional non-chain note from the appropriate industry for the current 'contact stage'
  const finalComment = NON_CHAIN_NOTES[industry as keyof typeof NON_CHAIN_NOTES][stage];
  const totalComments = randChainNotesArray.push({ comment: finalComment });

  // Gather random users and randomize dates for the comments 'createdAt'
  const userIds = faker.helpers.arrayElements(allUsers, totalComments);
  const recentPastDate = faker.date.recent({ days: 27, refDate: DATE_3_DAYS_AGO });
  const commentsCreatedAt = faker.date.betweens({ count: totalComments, from: recentPastDate, to: DATE_NOW });

  for (let [i, { comment }] of randChainNotesArray.entries()) {
    // Replace any placeholders in the comment
    // {USER_NAME} - insert previous comment users first name
    if (comment.includes('{USER_NAME}')) comment = comment.replace('{USER_NAME}', userIds[i - 1].firstName);
    if (comment.includes('{CONTACT_NAME}')) comment = comment.replace('{CONTACT_NAME}', contact.firstName);
    if (comment.includes('{COMPANY_NAME}')) comment = comment.replace('{COMPANY_NAME}', contact.company.companyName);

    const contactNote: TContactsNotesTableInsert = {
      contactId: contact.id,
      createdAt: commentsCreatedAt[i],
      createdBy: userIds[i].id,
      note: comment,
    };

    returnNotes.push(contactNote);
  }

  return returnNotes;
}
