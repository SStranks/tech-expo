import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CompanyDTO } from '#Models/company/Company.js';
import type { ContactDTO } from '#Models/contact/Contact.js';
import type { CountryDTO } from '#Models/country/Country.js';
import type { QuoteDTO } from '#Models/quote/Quote.js';
import type { CompanyService } from '#Services/Company.js';
import type { ContactService } from '#Services/Contact.js';
import type { CountryService } from '#Services/Country.js';
import type { QuoteService } from '#Services/Quote.js';

import DataLoader from 'dataloader';

export type CountryDataLoader = DataLoader<UUID, CountryDTO | null>;
export const createCountryLoader = (countryService: CountryService) =>
  new DataLoader<UUID, CountryDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const countries = await countryService.getCountriesByIds(uniqueIds);
    const countryMap = new Map(countries.map((c) => [c.id, c]));

    return ids.map((id) => countryMap.get(id) ?? null);
  });

export type CompanyDataLoader = DataLoader<UUID, CompanyDTO | null>;
export const createCompanyLoader = (companyService: CompanyService) =>
  new DataLoader<UUID, CompanyDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const companies = await companyService.getCompaniesByIds(uniqueIds);
    const companiesMap = new Map(companies.map((c) => [c.id, c]));

    return ids.map((id) => companiesMap.get(id) ?? null);
  });

export type ContactDataLoader = DataLoader<UUID, ContactDTO | null>;
export const createContactLoader = (contactService: ContactService) =>
  new DataLoader<UUID, ContactDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const contacts = await contactService.getContactsByIds(uniqueIds);
    const contactsMap = new Map(contacts.map((c) => [c.id, c]));

    return ids.map((id) => contactsMap.get(id) ?? null);
  });

export type QuoteDataLoader = DataLoader<UUID, QuoteDTO | null>;
export const createQuoteLoader = (quoteService: QuoteService) =>
  new DataLoader<UUID, QuoteDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const quotes = await quoteService.getQuotesByIds(uniqueIds);
    const quotesMap = new Map(quotes.map((q) => [q.id, q]));

    return ids.map((id) => quotesMap.get(id) ?? null);
  });
