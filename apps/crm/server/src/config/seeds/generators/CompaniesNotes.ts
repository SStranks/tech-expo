/* eslint-disable security/detect-object-injection */
import type { TCompaniesNotesTableInsert } from '#Config/schema/index.js';

import type { TCompaniesQueryCompaniesNotes, TSeedCompaniesNotesAllUsers } from '../CompaniesNotes.js';

import { faker } from '@faker-js/faker';

import CompaniesNotes from '#Data/CompaniesNotes.json';

import { generateCommentDates, replaceCommentPlaceholders } from './utils.js';

const { chain_notes: CHAIN_NOTES, non_chain_notes: NON_CHAIN_NOTES } = CompaniesNotes;

export function generateCompaniesNotes(
  company: TCompaniesQueryCompaniesNotes,
  allUsers: TSeedCompaniesNotesAllUsers[]
) {
  const returnCompaniesNotes: TCompaniesNotesTableInsert[] = [];
  const { industry, name } = company;

  // Pick a random chain-notes array and userIDs for each comment
  const randChainNotesArray = [...faker.helpers.arrayElement(CHAIN_NOTES)];

  // Push an additional non-chain note from the specific industry of the company
  const finalComment = faker.helpers.arrayElement(NON_CHAIN_NOTES[industry as keyof typeof NON_CHAIN_NOTES]);
  const totalComments = randChainNotesArray.push({ comment: finalComment });

  // Gather random users and randomize dates for the comments 'createdAt'
  const userIds = faker.helpers.arrayElements(allUsers, totalComments);
  const commentsCreatedAt = generateCommentDates(totalComments);

  for (let [i, { comment }] of randChainNotesArray.entries()) {
    const userName = userIds[i - 1]?.firstName;
    comment = replaceCommentPlaceholders(comment, { companyName: name, industry, userName });

    const companyNote: TCompaniesNotesTableInsert = {
      company: company.id,
      createdAt: commentsCreatedAt[i],
      createdBy: userIds[i].id,
      note: comment,
    };

    returnCompaniesNotes.push(companyNote);
  }

  return returnCompaniesNotes;
}
