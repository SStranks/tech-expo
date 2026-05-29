import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import z from 'zod';

import { invalidInputError } from '#Graphql/errors.js';
import { quoteNoteDomainToQuoteNoteDTO } from '#Models/domain/quote/note/note.mapper.js';
import { quoteDomainToQuoteDTO } from '#Models/domain/quote/quote.mapper.js';
import {
  mutationCreateQuoteNoteSchema,
  mutationCreateQuoteSchema,
  mutationCreateQuoteServiceSchema,
  mutationRemoveQuoteNoteSchema,
  mutationRemoveQuoteSchema,
  mutationRemoveQuoteServiceSchema,
  mutationUpdateQuoteNoteSchema,
  mutationUpdateQuoteSchema,
  mutationUpdateQuoteServiceSchema,
  queryQuoteOverviewSchema,
  queryQuoteSchema,
} from '#Models/domain/quote/quote.schemas.js';
import { quoteServiceDomainToQuoteServiceDTO } from '#Models/domain/quote/service/service.mapper.js';
import {
  quoteNoteReadRowToQuoteNoteDTO,
  quoteOverviewRowToQuoteOverviewDTO,
  quoteServiceReadRowToQuoteServiceDTO,
} from '#Models/query/quote/quotes.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

const quoteResolver: Resolvers = {
  Query: {
    quote: async (_, { input }, { services }) => {
      const { data, error, success } = queryQuoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const quote = await services.Quote.getQuoteById(data.id);
      return quoteDomainToQuoteDTO(quote);
    },
    quotesOverview: async (_, { input }, { services }) => {
      const { data, error, success } = queryQuoteOverviewSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const { page, pageSize } = data.pagination;
      const { searchCompanyById, searchPreparedByUserProfileId, searchQuoteTitle, searchStage } = data.filters;
      // const { } = data.sort;

      const query = {
        filters: {
          searchCompanyById,
          searchPreparedByUserProfileId,
          searchQuoteTitle,
          searchStage,
        },
        pagination: {
          limit: data.pagination.pageSize,
          offset: (page - 1) * pageSize,
        },
        sort: data.sort,
      };

      const result = await services.Quote.findQuotesOverview(query);

      return {
        id: stableId('quotes-overview', {
          page,
          pageSize,
          searchCompanyById,
          searchPreparedByUserProfileId,
          searchQuoteTitle,
          searchStage,
        }),
        items: result.items.map((r) => quoteOverviewRowToQuoteOverviewDTO(r)),
        totalCount: result.totalCount,
      };
    },
  },

  Mutation: {
    createQuote: async (_, { input }, { services }) => {
      const { data, error, success } = mutationCreateQuoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const quote = await services.Quote.createQuote(command);
      return quoteDomainToQuoteDTO(quote);
    },
    updateQuote: async (_, { input }, { services }) => {
      const { data, error, success } = mutationUpdateQuoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const quote = await services.Quote.updateQuoteById(command);
      return quoteDomainToQuoteDTO(quote);
    },
    removeQuote: async (_, { input }, { services }) => {
      const { data, error, success } = mutationRemoveQuoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { id } = data;
      const quoteIdReturn = await services.Quote.removeQuoteById(id);
      return quoteIdReturn;
    },
    createQuoteService: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateQuoteServiceSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { quote, quoteService } = await services.Quote.addQuoteService(command, context);

      return {
        id: `quote-service:create:${quoteService.id}`,
        quote: quoteDomainToQuoteDTO(quote),
        quoteService: quoteServiceDomainToQuoteServiceDTO(quoteService),
      };
    },
    updateQuoteService: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationUpdateQuoteServiceSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { quote, quoteService } = await services.Quote.updateQuoteService(command, context);

      return {
        id: `quote-service:update:${quoteService.id}`,
        quote: quoteDomainToQuoteDTO(quote),
        quoteService: quoteServiceDomainToQuoteServiceDTO(quoteService),
      };
    },
    removeQuoteService: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveQuoteServiceSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const quoteServiceIdReturn = await services.Quote.removeQuoteService(command, context);

      return quoteServiceIdReturn;
    },
    createQuoteNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateQuoteNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { quote, quoteNote } = await services.Quote.addQuoteNote(command, context);

      return {
        id: `quote-note:create:${quoteNote.id}`,
        quote: quoteDomainToQuoteDTO(quote),
        quoteNote: quoteNoteDomainToQuoteNoteDTO(quoteNote),
      };
    },
    updateQuoteNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationUpdateQuoteNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { quote, quoteNote } = await services.Quote.updateQuoteNote(command, context);

      return {
        id: `quote-note:update:${quoteNote.id}`,
        quote: quoteDomainToQuoteDTO(quote),
        quoteNote: quoteNoteDomainToQuoteNoteDTO(quoteNote),
      };
    },
    removeQuoteNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveQuoteNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const quoteNoteIdReturn = await services.Quote.removeQuoteNote(command, context);

      return quoteNoteIdReturn;
    },
  },

  QuoteDetailed: {
    services: async (quote, _, { services }) => {
      const quoteServices = await services.Quote.findQuoteServicesByQuoteId(quote.id);
      return quoteServices.map((service) => quoteServiceReadRowToQuoteServiceDTO(service));
    },

    note: async (quote, _, { services }) => {
      const note = await services.Quote.findQuoteNoteByQuoteId(quote.id);
      return note ? quoteNoteReadRowToQuoteNoteDTO(note) : null;
    },
  },
};

export default quoteResolver;
