/* eslint-disable security/detect-object-injection */
import type { UUID } from 'node:crypto';

import type { TCompaniesNotesTableInsert } from '#Config/schema/index.js';

import { faker } from '@faker-js/faker';

import CompaniesNotes from '#Data/CompaniesNotes.json';

const DATE_NOW = new Date();
const DATE_3_DAYS_AGO = new Date(new Date().setDate(new Date().getDate() - 3));

export function chainNotes(companyId: UUID, allUsers: { id: UUID; firstName: string }[]): TCompaniesNotesTableInsert[] {
  // Picks a comment chain from JSON; patches {USER_NAME} placeholder to their first name;
  // Picks from all users at random and assigns their ID to a comment in the chain

  const returnNotes: TCompaniesNotesTableInsert[] = [];

  // Generate insertion data with randomization
  const chainNotesObject = faker.helpers.arrayElements(CompaniesNotes.chain_notes, 1);
  const chainNotes = chainNotesObject[0].comments;
  const userIds = faker.helpers.arrayElements(allUsers, chainNotes.length);
  const recentPastDate = faker.date.recent({ days: 27, refDate: DATE_3_DAYS_AGO });
  const commentsCreatedAt = faker.date.betweens({ count: chainNotes.length, from: recentPastDate, to: DATE_NOW });

  for (let [i, { comment }] of chainNotes.entries()) {
    // If chain comment contains placeholder; insert previous comment users first name
    if (comment.includes('{USER_NAME}')) comment = comment.replace('{USER_NAME}', userIds[i - 1].firstName);

    const companyNote: TCompaniesNotesTableInsert = {
      company: companyId,
      createdAt: commentsCreatedAt[i],
      createdBy: userIds[i].id,
      note: comment,
    };

    returnNotes.push(companyNote);
  }

  return returnNotes;
}

export function nonChainNotes(
  companyId: UUID,
  allUsers: { id: UUID; firstName: string }[]
): TCompaniesNotesTableInsert[] {
  // Generates between 2-4 comments for a particular company;
  // Picks from all users at random and assigns their ID to the comment

  const returnNotes: TCompaniesNotesTableInsert[] = [];

  // Generate insertion data with randomization
  const numberOfComments = faker.number.int({ max: 4, min: 2 });
  const userIds = faker.helpers.arrayElements(allUsers, numberOfComments);
  const nonChainNotes = faker.helpers.arrayElements(CompaniesNotes.non_chain_notes, numberOfComments);
  const recentPastDate = faker.date.recent({ days: 27, refDate: DATE_3_DAYS_AGO });
  const commentsCreatedAt = faker.date.betweens({ count: numberOfComments, from: recentPastDate, to: DATE_NOW });

  for (let i = 0; i < numberOfComments; i++) {
    const companyNote: TCompaniesNotesTableInsert = {
      company: companyId,
      createdAt: commentsCreatedAt[i],
      createdBy: userIds[i].id,
      note: nonChainNotes[i],
    };

    returnNotes.push(companyNote);
  }

  return returnNotes;
}
