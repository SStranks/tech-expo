import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TQuotesNotesTableInsert } from '#Config/schema/index.js';

import { QuotesNotesTable } from '#Config/schema/index.js';

import { generateQuoteNote } from './generators/QuotesNotes.js';

export type TSeedQuoteNotesQuotes = Awaited<ReturnType<typeof getQuotes>>[number];

const getQuotes = async (db: TPostgresDB) => {
  return await db.query.QuotesTable.findMany({
    columns: { id: true, dueAt: true, preparedBy: true },
    with: { company: { columns: { name: true } }, preparedFor: { columns: { firstName: true } } },
  });
};

export default async function seedQuotesServices(db: TPostgresDB) {
  const quotesNotesInsertionData: TQuotesNotesTableInsert[] = [];
  const quotes = await getQuotes(db);

  // ---------- QUOTES NOTES --------- //
  quotes.forEach(async (quote) => {
    const note = generateQuoteNote(quote);
    quotesNotesInsertionData.push(note);
  });

  await db.insert(QuotesNotesTable).values(quotesNotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: QuotesNotes.ts');
}
