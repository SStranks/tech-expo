/* eslint-disable security/detect-object-injection */
import type { QuotesNotesTableInsert } from '#Config/schema/quotes/QuotesNotes.ts';
import type { QuoteNoteClientGeneratedId } from '#Models/domain/quote/note/note.types.js';

import type { SeedQuoteNotesQuotes } from '../QuotesNotes.js';
import type { QuotesNotesJSON } from '../types/types.js';

import { faker } from '@faker-js/faker';

import { randomUUID } from 'node:crypto';

import { importJSONSeed } from '../utils/import.js';

const QuotesNotesJSON = importJSONSeed<QuotesNotesJSON>('QuotesNotes.json');
const FORMAL_NOTES = Object.keys(QuotesNotesJSON.formal_notes);

export function generateQuoteNote(quote: SeedQuoteNotesQuotes) {
  const clientGeneratedId = randomUUID() as QuoteNoteClientGeneratedId;
  // Pick one formal note from 4 categories. Pick one informal note to add to end
  let content = '';
  const formalNotesKeys = faker.helpers.arrayElements(FORMAL_NOTES, 4);

  formalNotesKeys.forEach((key) => {
    if (QuotesNotesJSON.formal_notes[key] === undefined) throw new Error(`Incongruency. ${key} not in format_notes`);
    const formalNote = faker.helpers.arrayElement(QuotesNotesJSON.formal_notes[key]);
    content += `${formalNote.title} - ${formalNote.description} \n`;
  });

  const informalNote = faker.helpers
    .arrayElement(QuotesNotesJSON.informal_notes)
    .replaceAll('{COMPANY_NAME}', quote.company.name)
    .replaceAll('{USER_NAME}', quote.preparedFor.firstName)
    .replaceAll('{DUE_DATE}', quote.dueAt?.toLocaleDateString() ?? '{DUE_DATE}');

  content += informalNote.trimEnd();

  const quoteNote: QuotesNotesTableInsert = {
    clientGeneratedId,
    content,
    quoteId: quote.id,
  };

  return quoteNote;
}
