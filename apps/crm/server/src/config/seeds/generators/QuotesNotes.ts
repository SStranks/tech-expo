import type { QuotesNotesTableInsert } from '#Config/schema/quotes/QuotesNotes.ts';

import type { SeedQuoteNotesQuotes } from '../QuotesNotes.js';

import { faker } from '@faker-js/faker';

import QuotesNotes from '#Data/QuotesNotes.json';

const FORMAL_NOTES = Object.keys(QuotesNotes.formal_notes) as [keyof (typeof QuotesNotes)['formal_notes']];

export function generateQuoteNote(quote: SeedQuoteNotesQuotes) {
  // Pick one formal note from 4 categories. Pick one informal note to add to end
  let note = '';
  const formalNotesKeys = faker.helpers.arrayElements(FORMAL_NOTES, 4);

  formalNotesKeys.forEach((key) => {
    const formalNote = faker.helpers.arrayElement(QuotesNotes.formal_notes[`${key}`]);
    note += `${formalNote.title} - ${formalNote.description} \n`;
  });

  const informalNote = faker.helpers
    .arrayElement(QuotesNotes.informal_notes)
    .replaceAll('{COMPANY_NAME}', quote.company.name)
    .replaceAll('{USER_NAME}', quote.preparedFor.firstName)
    .replaceAll('{DUE_DATE}', quote.dueAt?.toLocaleDateString() ?? '{DUE_DATE}');

  note += informalNote.trimEnd();

  const quoteNote: QuotesNotesTableInsert = {
    createdByUserProfileId: quote.preparedByUserProfileId,
    note,
    quoteId: quote.id,
  };

  return quoteNote;
}
