/* eslint-disable perfectionist/sort-objects */
import type { Resolvers } from '#Graphql/generated/graphql.gen.js';
import type { TCompanyDTO } from '#Models/company/Company.js';

import { z } from 'zod';

import { pinoLogger } from '#Lib/index.js';

import { dbInconsistencyError, invalidInputError } from '../errors.js';

const companyResolver: Resolvers = {
  Query: {
    company: async (_, { id }, { services }): Promise<TCompanyDTO> => {
      const parsedArgs = z.object({ id: z.string().uuid() }).safeParse({ id });
      if (!parsedArgs.success) throw invalidInputError('Invalid company UUID');

      return await services.Company.getCompanyById(id);
    },
    companies: async (_, __, { services }): Promise<TCompanyDTO[]> => {
      return await services.Company.getAllCompanies();
    },
  },
  Company: {
    country: async (company, _, { loaders }) => {
      const result = await loaders.Country.load(company.country);

      if (!result) {
        const errorMessage = `[GraphQL] DB integrity issue: Company ${company.id} has invalid country ID ${company.country}`;
        const error = dbInconsistencyError(errorMessage);
        pinoLogger.server.error(error, errorMessage);
        throw error;
      }

      return result;
    },
  },
};

export default companyResolver;
