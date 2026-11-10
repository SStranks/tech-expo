/* eslint-disable security/detect-object-injection */
import type { CompaniesNotesTableInsert } from '#Config/schema/companies/CompanyNotes.ts';
import type { CompanyNoteClientGeneratedId } from '#Models/domain/company/note/note.types.js';

import type { CompaniesQueryCompaniesNotes, SeedCompaniesNotesAllUsers } from '../CompaniesNotes.js';
import type { CompaniesNotesJSON } from '../types/types.js';

import { createMockUUID } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import { importJSONSeed } from '../utils/import.js';
import { generateCommentDates, replaceCommentPlaceholders } from './utils.js';

const CompaniesNotesJSON = importJSONSeed<CompaniesNotesJSON>('CompaniesNotes.json');
const { chain_notes: CHAIN_NOTES, non_chain_notes: NON_CHAIN_NOTES } = CompaniesNotesJSON;

export function generateCompaniesNotes(company: CompaniesQueryCompaniesNotes, allUsers: SeedCompaniesNotesAllUsers[]) {
  const returnCompaniesNotes: CompaniesNotesTableInsert[] = [];
  const { industry, name } = company;

  // Pick a random chain-notes array and userIDs for each comment
  const randChainNotesArray = [...faker.helpers.arrayElement(CHAIN_NOTES)];

  // Push an additional non-chain note from the specific industry of the company
  const industryChainNotesArray = NON_CHAIN_NOTES[industry];
  if (industryChainNotesArray === undefined)
    throw new Error(`Incongruency. Industry '${industry}' not found in JSON data`);

  const finalComment = faker.helpers.arrayElement(industryChainNotesArray);
  const totalComments = randChainNotesArray.push({ comment: finalComment });

  // Gather random users and randomize dates for the comments 'createdAt'
  const userIds = faker.helpers.arrayElements(allUsers, totalComments);
  const commentsCreatedAt = generateCommentDates(totalComments);

  for (const [i, note] of randChainNotesArray.entries()) {
    let { comment } = note;
    const userName = userIds[i - 1]?.firstName;
    comment = replaceCommentPlaceholders(comment, { companyName: name, industry, userName });

    if (userIds[i] === undefined) throw new Error(`generateCompaniesNotes: userIds[${i}] undefined`);

    const companyNote: CompaniesNotesTableInsert = {
      clientGeneratedId: createMockUUID() as CompanyNoteClientGeneratedId,
      companyId: company.id,
      createdAt: commentsCreatedAt[i],
      createdByUserProfileId: userIds[i].id,
      note: comment,
    };

    returnCompaniesNotes.push(companyNote);
  }

  return returnCompaniesNotes;
}
