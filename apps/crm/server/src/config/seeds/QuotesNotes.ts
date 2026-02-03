import type { PostgresClient } from '#Config/dbPostgres.js';
import type { QuotesNotesTableInsert } from '#Config/schema/quotes/QuotesNotes.ts';

import QuotesNotesTable from '#Config/schema/quotes/QuotesNotes.js';

import { generateQuoteNote } from './generators/QuotesNotes.js';

export type SeedQuoteNotesQuotes = Awaited<ReturnType<typeof getQuotes>>[number];

const getQuotes = async (db: PostgresClient) => {
  return await db.query.QuotesTable.findMany({
    columns: { id: true, dueAt: true, preparedByUserProfileId: true },
    with: { company: { columns: { name: true } }, preparedFor: { columns: { firstName: true } } },
  });
};

export default async function seedQuotesServices(db: PostgresClient) {
  const quotesNotesInsertionData: QuotesNotesTableInsert[] = [];
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
