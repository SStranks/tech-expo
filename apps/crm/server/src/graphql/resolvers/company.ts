/* eslint-disable perfectionist/sort-objects */
import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import { z } from 'zod';

import { insertCompaniesSchema, updateCompaniesSchema } from '#Config/schema/companies/Companies.js';
import { updateCompaniesNotesSchema } from '#Config/schema/companies/CompanyNotes.js';
import pinoLogger from '#Lib/pinoLogger.js';
import { asCompanyId, companyDomainToCompanyDTO } from '#Models/domain/company/company.mapper.js';
import { asCompanyNoteId, companyNoteDomainToDTO } from '#Models/domain/company/note/note.mapper.js';
import { asContactId } from '#Models/domain/contact/contact.mapper.js';
import { asCountryId } from '#Models/domain/country/country.mapper.js';
import { asUserProfileId, userProfileDomainToAvatarDTO } from '#Models/domain/user/profile/profile.mapper.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';
import {
  companyContactSummaryRowToDTO,
  companyDealSummaryRowToDTO,
  companyQuoteSummaryRowToDTO,
  toCompaniesOverviewDTO,
} from '#Models/query/company/companies.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

import { dbInconsistencyError, invalidInputError } from '../errors.js';

const companyResolver: Resolvers = {
  Query: {
    company: async (_, { input }, { services }) => {
      const { id } = input;
      const parsedArgs = z.object({ id: z.uuid() }).safeParse({ id });
      if (!parsedArgs.success) throw invalidInputError('Invalid company UUID');

      const company = await services.Company.getCompanyById(asCompanyId(id));
      return companyDomainToCompanyDTO(company);
    },

    companiesOverview: async (_, { input }, { services }) => {
      const { filters, pagination } = input;
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 12;
      const searchCompanyName = filters?.searchCompanyName ?? undefined;
      const salesOwnerId = filters?.salesOwnerId ? asUserProfileId(filters.salesOwnerId) : undefined;
      const query = {
        filters: {
          searchCompanyName,
          salesOwnerId,
          contactIds: filters?.contactIds?.map((cI) => asContactId(cI)),
        },
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      };

      const result = await services.Company.findCompaniesOverview(query);

      return {
        id: stableId('companies-overview', { page, pageSize, searchCompanyName, salesOwnerId }),
        items: result.items.map((r) => toCompaniesOverviewDTO(r)),
        totalCount: result.totalCount,
      };
    },
  },

  Mutation: {
    createCompany: async (_, { input }, { services }) => {
      const result = insertCompaniesSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        ...result.data,
        website: result.data.website ?? undefined,
      };

      const company = await services.Company.createCompany(command);
      return companyDomainToCompanyDTO(company);
    },

    updateCompany: async (_, { input }, { services }) => {
      const result = updateCompaniesSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        ...result.data,
        id: asCompanyId(result.data.id),
        country: result.data.countryId ? asCountryId(result.data.countryId) : undefined,
        website: result.data.website ?? undefined,
      };

      const company = await services.Company.updateCompanyById(command);
      return companyDomainToCompanyDTO(company);
    },

    removeCompany: async (_, { input }, { services }) => {
      const result = updateCompaniesSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const companyId = asCompanyId(result.data.id);
      const companyIdReturn = await services.Company.removeCompanyById(companyId);
      return companyIdReturn;
    },

    createCompanyNote: async (_, { input }, { auth, services }) => {
      const { companyId, note } = input;
      const inputCompanyId = updateCompaniesSchema.pick({ id: true }).safeParse({ id: companyId });
      if (!inputCompanyId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCompanyId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputNote = updateCompaniesNotesSchema.pick({ note: true }).required({ note: true }).safeParse({ note });
      if (!inputNote.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputNote.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = { companyId: asCompanyId(inputCompanyId.data.id), note: inputNote.data.note };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
      const { company, companyNote } = await services.Company.addCompanyNote(command, context);

      return {
        id: `companies-note:create:${companyNote.id}`,
        company: companyDomainToCompanyDTO(company),
        companyNote: {
          ...companyNoteDomainToDTO(companyNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    updateCompanyNote: async (_, { input }, { auth, services }) => {
      const { companyId, companyNoteId, note } = input;
      const inputCompanyId = updateCompaniesSchema.safeParse({ id: companyId });
      if (!inputCompanyId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCompanyId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputNote = updateCompaniesNotesSchema
        .pick({ id: true, note: true })
        .required({ note: true })
        .safeParse({ id: companyNoteId, note });
      if (!inputNote.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputNote.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = {
        companyId: asCompanyId(inputCompanyId.data.id),
        companyNoteId: asCompanyNoteId(inputNote.data.id),
        note: inputNote.data.note,
      };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
      const { company, companyNote } = await services.Company.updateCompanyNote(command, context);

      return {
        id: `companies-note:update:${companyNote.id}`,
        company: companyDomainToCompanyDTO(company),
        companyNote: {
          ...companyNoteDomainToDTO(companyNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    removeCompanyNote: async (_, { input }, { auth, services }) => {
      const { companyId, companyNoteId } = input;
      const inputCompanyId = updateCompaniesSchema.safeParse({ id: companyId });
      if (!inputCompanyId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCompanyId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputCompanyNoteId = updateCompaniesNotesSchema.safeParse({ id: companyNoteId });
      if (!inputCompanyNoteId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCompanyNoteId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = {
        companyId: asCompanyId(inputCompanyId.data.id),
        companyNoteId: asCompanyNoteId(inputCompanyNoteId.data.id),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
      const companyNoteIdReturn = await services.Company.removeCompanyNote(command, context);

      return companyNoteIdReturn;
    },
  },

  CompanyDetailed: {
    salesOwner: async (company, _, { loaders }) => {
      const result = await loaders.UserProfile.load(company.id);

      if (!result) {
        const errorMessage = `[GraphQL] DB integrity issue: Company ${company.id} could not locate associated UserProfile`;
        const error = dbInconsistencyError(errorMessage);
        pinoLogger.server.error(error, errorMessage);
        throw error;
      }

      return result;
    },

    country: async (company, _, { loaders }) => {
      const result = await loaders.Country.load(company.countryId);

      if (!result) {
        const errorMessage = `[GraphQL] DB integrity issue: Company ${company.id} has invalid country ID ${company.countryId}`;
        const error = dbInconsistencyError(errorMessage);
        pinoLogger.server.error(error, errorMessage);
        throw error;
      }

      return result;
    },

    contacts: async (company, { pagination }, { services }) => {
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 12;
      const query = {
        companyId: asCompanyId(company.id),
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      };

      const result = await services.Contact.getPaginatedContactsForCompany(query);

      return {
        id: stableId('companies-contacts', { page, pageSize, companyId: company.id }),
        items: result.items.map((r) => companyContactSummaryRowToDTO(r)),
        totalCount: result.totalCount,
      };
    },

    deals: async (company, { pagination }, { services }) => {
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 12;
      const query = {
        companyId: asCompanyId(company.id),
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      };

      const result = await services.Pipeline.getPaginatedDealsForCompany(query);

      return {
        id: stableId('companies-deals', { page, pageSize, companyId: company.id }),
        items: result.items.map((r) => companyDealSummaryRowToDTO(r)),
        totalCount: result.totalCount,
      };
    },

    quotes: async (company, { pagination }, { services }) => {
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 12;
      const query = {
        companyId: asCompanyId(company.id),
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      };

      const result = await services.Quote.getPaginatedQuotesForCompany(query);

      return {
        id: stableId('companies-quotes', { page, pageSize, companyId: company.id }),
        items: result.items.map((r) => companyQuoteSummaryRowToDTO(r)),
        totalCount: result.totalCount,
      };
    },

    notes: async (company, _, { services, loaders }) => {
      const notes = await services.Company.findNotesForCompanyById(asCompanyId(company.id));
      const userIds = notes.map((n) => n.createdByUserProfileId);
      const userProfiles = await loaders.UserProfile.loadMany(userIds);

      return notes
        .map((note, i) => {
          // eslint-disable-next-line security/detect-object-injection
          const userProfile = userProfiles[i];

          if (!userProfile || userProfile instanceof Error) {
            const errorMessage = `[GraphQL] DB integrity issue: Note ${note.id} has invalid createdBy ${note.createdByUserProfileId}`;
            const error = dbInconsistencyError(errorMessage);
            pinoLogger.server.error(error, errorMessage);
            return null;
          }

          return {
            id: note.id,
            note: note.note,
            createdAt: note.createdAt,
            createdBy: userProfile,
          };
        })
        .filter((note) => note !== null);
    },
  },
};

export default companyResolver;
