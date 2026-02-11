import type { PostgresClient } from '#Config/dbPostgres.js';
import type { QuoteServicesTableInsert } from '#Config/schema/quotes/Services.ts';

import { eq } from 'drizzle-orm';

import { QuotesTable } from '#Config/schema/quotes/Quotes.js';
import QuoteServicesTable from '#Config/schema/quotes/Services.js';

import { generateQuoteServices } from './generators/QuotesServices.js';

export type SeedQuoteServicesQuotes = Awaited<ReturnType<typeof getQuotes>>[number];

const getQuotes = async (db: PostgresClient) => {
  return db.query.QuotesTable.findMany({ columns: { id: true } });
};

export default async function seedQuotesServices(db: PostgresClient) {
  const quotesServicesInsertionData: QuoteServicesTableInsert[] = [];
  const quotes = await getQuotes(db);

  // -------- QUOTES SERVICES -------- //
  for (const quote of quotes) {
    const services = generateQuoteServices(quote);
    const quoteTotal = services.reduce((acc, service) => acc + Number(service.totalAmount), 0).toString();
    quotesServicesInsertionData.push(...services);
    await db.update(QuotesTable).set({ totalAmount: quoteTotal }).where(eq(QuotesTable.id, quote.id));
  }

  await db.insert(QuoteServicesTable).values(quotesServicesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Services.ts');
}
