import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import { z } from 'zod';

import pinoLogger from '#Lib/pinoLogger.js';
import { asCompanyId, companyDomainToCompanyDTO } from '#Models/domain/company/company.mapper.js';
import {
  mutationCreateCompanyNoteSchema,
  mutationCreateCompanySchema,
  mutationRemoveCompanyNoteSchema,
  mutationRemoveCompanySchema,
  mutationUpdateCompanyNoteSchema,
  mutationUpdateCompanySchema,
  queryCompanyOverviewSchema,
  queryCompanySchema,
} from '#Models/domain/company/company.schemas.js';
import { companyNoteDomainToCompanyNoteDTO } from '#Models/domain/company/note/note.mapper.js';
import { userProfileDomainToAvatarDTO } from '#Models/domain/user/profile/profile.mapper.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';
import {
  companyContactSummaryRowToCompanyContactSummaryDTO,
  companyDealSummaryRowToCompanyDealSummaryDTO,
  companyOverviewRowToCompanyOverviewDTO,
  companyQuoteSummaryRowToCompanyQuoteSummaryDTO,
} from '#Models/query/company/companies.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

import { dbInconsistencyError, invalidInputError } from '../errors.js';

const companyResolver: Resolvers = {
  Query: {
    company: async (_, { input }, { services }) => {
      const { data, error, success } = queryCompanySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const company = await services.Company.getCompanyById(asCompanyId(data.id));
      return companyDomainToCompanyDTO(company);
    },

    companiesOverview: async (_, { input }, { services }) => {
      const { data, error, success } = queryCompanyOverviewSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const { page, pageSize } = data.pagination;
      const { searchCompanyName, salesOwnerId, contactIds } = data.filters;

      const query = {
        filters: {
          searchCompanyName,
          salesOwnerId,
          contactIds,
        },
        pagination: {
          limit: data.pagination.pageSize,
          offset: (page - 1) * pageSize,
        },
      };

      const result = await services.Company.findCompaniesOverview(query);

      return {
        id: stableId('companies-overview', { page, pageSize, searchCompanyName, salesOwnerId }),
        items: result.items.map((r) => companyOverviewRowToCompanyOverviewDTO(r)),
        totalCount: result.totalCount,
      };
    },
  },

  Mutation: {
    createCompany: async (_, { input }, { services }) => {
      const { data, error, success } = mutationCreateCompanySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const company = await services.Company.createCompany(command);
      return companyDomainToCompanyDTO(company);
    },

    updateCompany: async (_, { input }, { services }) => {
      const { data, error, success } = mutationUpdateCompanySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const company = await services.Company.updateCompanyById(command);
      return companyDomainToCompanyDTO(company);
    },

    removeCompany: async (_, { input }, { services }) => {
      const { data, error, success } = mutationRemoveCompanySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const companyIdReturn = await services.Company.removeCompanyById(data.id);
      return companyIdReturn;
    },

    createCompanyNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateCompanyNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };
      const { company, companyNote, userProfile } = await services.Company.addCompanyNote(command, context);

      return {
        id: `companies-note:create:${companyNote.id}`,
        company: companyDomainToCompanyDTO(company),
        companyNote: {
          ...companyNoteDomainToCompanyNoteDTO(companyNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    updateCompanyNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationUpdateCompanyNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };
      const { company, companyNote, userProfile } = await services.Company.updateCompanyNote(command, context);

      return {
        id: `companies-note:update:${companyNote.id}`,
        company: companyDomainToCompanyDTO(company),
        companyNote: {
          ...companyNoteDomainToCompanyNoteDTO(companyNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    removeCompanyNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveCompanyNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };
      const companyNoteIdReturn = await services.Company.removeCompanyNote(command, context);

      return companyNoteIdReturn;
    },
  },

  CompanyDetailed: {
    salesOwner: async (company, _, { loaders }) => {
      const result = await loaders.UserProfile.load(company.salesOwner);

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
        items: result.items.map((r) => companyContactSummaryRowToCompanyContactSummaryDTO(r)),
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
        items: result.items.map((r) => companyDealSummaryRowToCompanyDealSummaryDTO(r)),
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
        items: result.items.map((r) => companyQuoteSummaryRowToCompanyQuoteSummaryDTO(r)),
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
