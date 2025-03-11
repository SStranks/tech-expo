import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TQuoteServicesTableInsert } from '#Config/schema/index.js';

import { eq } from 'drizzle-orm';

import { QuotesTable } from '#Config/schema/quotes/Quotes.js';
import QuoteServicesTable from '#Config/schema/quotes/Services.js';

import { generateQuoteServices } from './generators/QuotesServices.js';

export type TSeedQuoteServicesQuotes = Awaited<ReturnType<typeof getQuotes>>[number];

const getQuotes = async (db: TPostgresDB) => {
  return await db.query.QuotesTable.findMany({ columns: { id: true } });
};

export default async function seedQuotesServices(db: TPostgresDB) {
  const quotesServicesData: TQuoteServicesTableInsert[] = [];
  const quotes = await getQuotes(db);

  // -------- QUOTES SERVICES -------- //
  quotes.forEach(async (quote) => {
    const services = generateQuoteServices(quote);
    const quoteTotal = services.reduce((acc, service) => acc + Number(service.total), 0).toString();
    quotesServicesData.push(...services);
    await db.update(QuotesTable).set({ total: quoteTotal }).where(eq(QuotesTable.id, quote.id));
  });

  await db.insert(QuoteServicesTable).values(quotesServicesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Services.ts');
}
