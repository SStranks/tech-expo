/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { ContactDTO } from '#Models/domain/contact/contact.dto.js';
import type { CountryDTO } from '#Models/domain/country/country.dto.js';
import type { QuoteDTO } from '#Models/domain/quote/quote.dto.js';
import type { UserProfileDTO } from '#Models/domain/user/profile/profile.dto.js';
import type { CompanyReadModel } from '#Models/query/company/companies.read-model.js';
import type { ContactReadModel } from '#Models/query/contact/contacts.read-model.js';
import type { CountryReadModel } from '#Models/query/country/countries.read-model.js';
import type { QuoteReadModel } from '#Models/query/quote/quotes.read-model.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';

import DataLoader from 'dataloader';

import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asContactId } from '#Models/domain/contact/contact.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

export type CountryDataLoader = DataLoader<UUID, CountryDTO | null>;
export const createCountryLoader = (countryReadModel: CountryReadModel) =>
  new DataLoader<UUID, CountryDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const countries = await countryReadModel.findCountriesByIds(uniqueIds);
    const countriesMap = new Map(countries.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = countriesMap.get(id);
      if (!row) return null;
      const dto: CountryDTO = {
        id: row.id,
        numCode: row.numCode,
        alpha2Code: row.alpha2Code,
        alpha3Code: row.alpha3Code,
        shortName: row.shortName,
        nationality: row.nationality,
      };
      return dto;
    });
  });

export type CompanyDataLoader = DataLoader<UUID, CompanyDTO | null>;
export const createCompanyLoader = (companyReadModel: CompanyReadModel) =>
  new DataLoader<UUID, CompanyDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const companies = await companyReadModel.findCompaniesByIds(uniqueIds);
    const companiesMap = new Map(companies.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = companiesMap.get(asCompanyId(id));
      if (!row) return null;
      const dto: CompanyDTO = {
        id: row.id,
        name: row.name,
        size: row.size,
        totalRevenue: row.totalRevenue,
        industry: row.industry,
        businessType: row.businessType,
        country: row.country,
        website: row.website,
      };
      return dto;
    });
  });

export type ContactDataLoader = DataLoader<UUID, ContactDTO | null>;
export const createContactLoader = (contactReadModel: ContactReadModel) =>
  new DataLoader<UUID, ContactDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const contacts = await contactReadModel.findContactsByIds(uniqueIds);
    const contactsMap = new Map(contacts.map((c) => [c.id, c]));

    return ids.map((id) => {
      const row = contactsMap.get(asContactId(id));
      if (!row) return null;
      const dto: ContactDTO = {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        company: row.company,
        jobTitle: row.jobTitle,
        stage: row.stage,
        timezone: row.timezone,
        image: row.image,
      };
      return dto;
    });
  });

export type QuoteDataLoader = DataLoader<UUID, QuoteDTO | null>;
export const createQuoteLoader = (quoteReadModel: QuoteReadModel) =>
  new DataLoader<UUID, QuoteDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids.map((id) => asUserProfileId(id)))];
    const quotes = await quoteReadModel.findQuotesByIds(uniqueIds);
    const quotesMap = new Map(quotes.map((q) => [q.id, q]));

    return ids.map((id) => {
      const row = quotesMap.get(id);
      if (!row) return null;
      const dto: QuoteDTO = {
        id: row.id,
        title: row.title,
        company: row.company,
        totalAmount: row.totalAmount,
        salesTax: row.salesTax,
        stage: row.stage,
        preparedFor: row.preparedFor,
        preparedBy: row.preparedBy,
        issuedAt: row.issuedAt,
        dueAt: row.dueAt,
        createdAt: row.createdAt,
      };
      return dto;
    });
  });

export type UserProfileDataLoader = DataLoader<UUID, UserProfileDTO | null>;
export const createUserProfileLoader = (userReadModel: UserReadModel) =>
  new DataLoader<UUID, UserProfileDTO | null>(async (ids) => {
    const uniqueIds = [...new Set(ids.map((id) => asUserProfileId(id)))];
    const usersProfiles = await userReadModel.findUserProfilesByUserProfileIds(uniqueIds);
    const usersProfilesMap = new Map(usersProfiles.map((q) => [q.id, q]));

    return ids.map((id) => {
      const row = usersProfilesMap.get(id);
      if (!row) return null;
      const dto: UserProfileDTO = {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        mobile: row.mobile,
        telephone: row.telephone,
        timezone: row.timezone,
        country: row.country,
        company: row.company,
        companyRole: row.companyRole,
        image: row.image,
        updatedAt: row.updatedAt,
      };

      return dto;
    });
  });
