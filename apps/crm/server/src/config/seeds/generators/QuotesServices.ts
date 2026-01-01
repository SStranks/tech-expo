import type { QuoteServicesTableInsert } from '#Config/schema/quotes/Services.ts';

import type { SeedQuoteServicesQuotes } from '../QuotesServices.js';

import { faker } from '@faker-js/faker';

import QuotesServices from '#Data/QuotesServices.json';

const SERVICE_TYPES = Object.keys(QuotesServices.services) as [keyof (typeof QuotesServices)['services']];
const DISCOUNTS = [
  { value: 0, weight: 8 },
  { value: 5, weight: 1 },
  { value: 10, weight: 1 },
];

export function generateQuoteServices(quote: SeedQuoteServicesQuotes): QuoteServicesTableInsert[] {
  const quoteServices: QuoteServicesTableInsert[] = [];
  const randServiceTypes = faker.helpers.arrayElements(SERVICE_TYPES, { max: 3, min: 2 });

  randServiceTypes.forEach((serviceType) => {
    const servicesPerType = faker.helpers.arrayElements(QuotesServices.services[`${serviceType}`], { max: 4, min: 2 });

    servicesPerType.forEach((title) => {
      const price = faker.commerce.price({ dec: 2, max: 10_000, min: 500 });
      const quantity = 1;
      const discount = faker.helpers.weightedArrayElement(DISCOUNTS).toString();
      const total = (Number(price) * quantity - ((Number(price) * quantity) / 100) * Number(discount)).toString();

      const service: QuoteServicesTableInsert = {
        discount,
        price,
        quantity,
        quoteId: quote.id,
        title,
        total,
      };

      quoteServices.push(service);
    });
  });

  return quoteServices;
}
