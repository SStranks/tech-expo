import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactDTO } from '#Models/domain/contact/contact.dto.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { CountryDTO } from '#Models/domain/country/country.dto.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { QuoteDTO } from '#Models/domain/quote/quote.dto.js';
import type { QuoteId } from '#Models/domain/quote/quote.types.js';
import type { TimeZoneDTO } from '#Models/domain/timezone/timezone.dto.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { UserProfileDTO } from '#Models/domain/user/profile/profile.dto.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { CompanyReadModel } from '#Models/query/company/companies.read-model.js';
import type { ContactReadModel } from '#Models/query/contact/contacts.read-model.js';
import type { CountryReadModel } from '#Models/query/country/countries.read-model.js';
import type { QuoteReadModel } from '#Models/query/quote/quotes.read-model.js';
import type { TimezoneReadModel } from '#Models/query/timezone/timezone.read-model.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';

import DataLoader from 'dataloader';

import { asCompanyId, companyReadRowToCompanyDTO } from '#Models/domain/company/company.mapper.js';
import { asContactId, contactReadRowToContactDTO } from '#Models/domain/contact/contact.mapper.js';
import { countryReadRowToCountryDTO } from '#Models/domain/country/country.mapper.js';
import { quoteReadRowToQuoteDTO } from '#Models/domain/quote/quote.mapper.js';
import { timeZoneReadRowToTimeZoneDTO } from '#Models/domain/timezone/timezone.mapper.js';
import { userProfileReadRowToUserProfileDTO } from '#Models/domain/user/user.mapper.js';

export type CountryDataLoader = DataLoader<CountryId, CountryDTO | null>;
export const createCountryLoader = (countryReadModel: CountryReadModel) =>
  new DataLoader<CountryId, CountryDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const countries = await countryReadModel.findCountriesByIds(uniqueIds);
    const countriesMap = new Map(countries.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = countriesMap.get(id);
      if (!row) return null;
      return countryReadRowToCountryDTO(row);
    });
  });

export type CompanyDataLoader = DataLoader<CompanyId, CompanyDTO | null>;
export const createCompanyLoader = (companyReadModel: CompanyReadModel) =>
  new DataLoader<CompanyId, CompanyDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const companies = await companyReadModel.findCompaniesByIds(uniqueIds);
    const companiesMap = new Map(companies.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = companiesMap.get(asCompanyId(id));
      if (!row) return null;
      return companyReadRowToCompanyDTO(row);
    });
  });

export type ContactDataLoader = DataLoader<ContactId, ContactDTO | null>;
export const createContactLoader = (contactReadModel: ContactReadModel) =>
  new DataLoader<ContactId, ContactDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const contacts = await contactReadModel.findContactsByIds(uniqueIds);
    const contactsMap = new Map(contacts.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = contactsMap.get(asContactId(id));
      if (!row) return null;
      return contactReadRowToContactDTO(row);
    });
  });

export type QuoteDataLoader = DataLoader<QuoteId, QuoteDTO | null>;
export const createQuoteLoader = (quoteReadModel: QuoteReadModel) =>
  new DataLoader<QuoteId, QuoteDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const quotes = await quoteReadModel.findQuotesByIds(uniqueIds);
    const quotesMap = new Map(quotes.map((q) => [q.id, q]));

    return ids.map((id) => {
      const row = quotesMap.get(id);
      if (!row) return null;
      return quoteReadRowToQuoteDTO(row);
    });
  });

export type TimezoneDataLoader = DataLoader<TimeZoneId, TimeZoneDTO | null>;
export const createTimezoneLoader = (timezoneReadModel: TimezoneReadModel) =>
  new DataLoader<TimeZoneId, TimeZoneDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const timezones = await timezoneReadModel.getTimezonesByIds(uniqueIds);
    const timezonesMap = new Map(timezones.map((q) => [q.id, q]));

    return ids.map((id) => {
      const row = timezonesMap.get(id);
      if (!row) return null;
      return timeZoneReadRowToTimeZoneDTO(row);
    });
  });

export type UserProfileDataLoader = DataLoader<UserProfileId, UserProfileDTO | null>;
export const createUserProfileLoader = (userReadModel: UserReadModel) =>
  new DataLoader<UserProfileId, UserProfileDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const usersProfiles = await userReadModel.findUserProfilesByUserProfileIds(uniqueIds);
    const usersProfilesMap = new Map(usersProfiles.map((q) => [q.id, q]));

    return ids.map((id) => {
      const row = usersProfilesMap.get(id);
      if (!row) return null;
      return userProfileReadRowToUserProfileDTO(row);
    });
  });
