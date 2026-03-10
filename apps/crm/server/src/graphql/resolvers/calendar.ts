import type { UUID } from '@apps/crm-shared';

import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import z from 'zod';

import { updateCalendarSchema } from '#Config/schema/calendar/Calendar.js';
import { insertCalendarCategoriesSchema, selectCalendarCategoriesSchema } from '#Config/schema/calendar/Categories.js';
import { insertCalendarEventsSchema, updateCalendarEventsSchema } from '#Config/schema/calendar/Events.js';
import { invalidInputError } from '#Graphql/errors.js';
import { asCalendarId } from '#Models/domain/calendar/calendar.mapper.js';
import {
  asCalendarCategoryId,
  calendarCategoryDomainToCalendarCategoryDTO,
} from '#Models/domain/calendar/categories/category.mapper.js';
import {
  asCalendarEventId,
  calendarEventDomainToCalendarEventDTO,
} from '#Models/domain/calendar/events/event.mapper.js';
import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';
import { userProfileReadRowToAvatarDTO } from '#Models/query/user/users.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

const calendarResolver: Resolvers = {
  Query: {
    calendarInitialData: async (_, { input }, { auth, services }) => {
      const { calendarId, companyId, month, year } = input;
      const parsedArgs = z
        .object({
          calendarId: z.uuid(),
          companyId: z.uuid(),
          month: z.number().gte(1).lte(12),
          year: z.number().gte(1900).lte(2100),
        })
        .safeParse({ calendarId, companyId, month, year });
      if (!parsedArgs.success) {
        const { fieldErrors, formErrors } = z.flattenError(parsedArgs.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { calendarId: asCalendarId(calendarId), companyId: asCompanyId(companyId), month, year };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const { categories, events } = await services.Calendar.getCalendarInitialData(command, context);
      return {
        id: stableId('calendar-initial', { companyId, month, year }),
        categories,
        events,
      };
    },

    calendarByMonth: async (_, { input }, { auth, services }) => {
      const { calendarId, companyId, month, year } = input;
      const parsedArgs = z
        .object({
          calendarId: z.uuid(),
          companyId: z.uuid(),
          month: z.number().gte(1).lte(12),
          year: z.number().gte(1900).lte(2100),
        })
        .safeParse({ calendarId, companyId, month, year });
      if (!parsedArgs.success) {
        const { fieldErrors, formErrors } = z.flattenError(parsedArgs.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { calendarId: asCalendarId(calendarId), companyId: asCompanyId(companyId), month, year };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const events = await services.Calendar.findCalendarEventsByDate(command, context);

      return {
        id: stableId('calendar-month', { companyId, month, year }),
        events,
      };
    },

    calendarCategories: async (_, { input }, { auth, services }) => {
      const { calendarId, companyId } = input;
      const companyIdInput = z.object({ companyId: z.uuid() }).safeParse({ companyId });
      if (!companyIdInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(companyIdInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const calendarIdInput = z.object({ calendarId: z.uuid() }).safeParse({ calendarId });
      if (!calendarIdInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(calendarIdInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { calendarId: asCalendarId(calendarId), companyId: asCompanyId(companyId) };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarCategories = await services.Calendar.findCalendarCategoriesByCompanyId(command, context);
      return {
        id: `calendar-categories:byCompanyId:${companyId}`,
        calendarCategories,
      };
    },

    calendarEvent: async (_, { input }, { auth, services }) => {
      const { calendarId, calendarEventId } = input;
      const calendarEventIdInput = z.object({ calendarEventId: z.uuid() }).safeParse({ calendarEventId });
      if (!calendarEventIdInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(calendarEventIdInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const calendarIdInput = z.object({ calendarId: z.uuid() }).safeParse({ calendarId });
      if (!calendarIdInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(calendarIdInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { calendarId: asCalendarId(calendarId), calendarEventId: asCalendarEventId(calendarEventId) };
      const context = { user: asUserId(auth.client_id), role: auth.role };
      const { calendarEvent, participants } = await services.Calendar.getCalendarEventById(command, context);

      return {
        id: stableId('calendar-event', { calendarEventId }),
        calendarEvent,
        participants: participants.map((p) => userProfileReadRowToAvatarDTO(p)),
      };
    },
  },

  Mutation: {
    createEvent: async (_, { input }, { auth, services }) => {
      const { participants: participantsArg, ...event } = input;
      const eventInput = insertCalendarEventsSchema.safeParse(event);
      if (!eventInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(eventInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const participantsSchema = z.array(z.uuid().transform((v) => v as UUID));
      const participantsInput = participantsSchema.safeParse(participantsArg);
      if (!participantsInput.success) {
        const tree = z.treeifyError(participantsInput.error);

        const fieldErrors: Record<string, string[]> = {};
        tree.items?.forEach((item, index) => {
          if (item.errors.length > 0) {
            fieldErrors[`participants[${index}]`] = item.errors;
          }
        });
        throw invalidInputError('Invalid inputs UUIDs', fieldErrors, tree.errors);
      }

      const command = {
        ...eventInput.data,
        calendarId: asCalendarId(eventInput.data.calendarId),
        categoryId: asCalendarCategoryId(eventInput.data.categoryId),
        color: eventInput.data.color ?? null,
        participants: participantsInput.data.map((id) => asUserProfileId(id)),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const { calendarEvent, participants } = await services.Calendar.addCalendarEvent(command, context);
      return {
        id: `calendar-event:create:${calendarEvent.id}`,
        calendarEvent: calendarEventDomainToCalendarEventDTO(calendarEvent),
        participants: participants.map((p) => userProfileReadRowToAvatarDTO(p)),
      };
    },

    updateEvent: async (_, { input }, { auth, services }) => {
      const { participants: participantsArg, ...event } = input;
      const eventInput = updateCalendarEventsSchema.safeParse(event);
      if (!eventInput.success) {
        const { fieldErrors, formErrors } = z.flattenError(eventInput.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const participantsSchema = z.array(z.uuid().transform((v) => v as UUID));
      const participantsInput = participantsSchema.safeParse(participantsArg);
      if (!participantsInput.success) {
        const tree = z.treeifyError(participantsInput.error);

        const fieldErrors: Record<string, string[]> = {};
        tree.items?.forEach((item, index) => {
          if (item.errors.length > 0) {
            fieldErrors[`participants[${index}]`] = item.errors;
          }
        });
        throw invalidInputError('Invalid inputs UUIDs', fieldErrors, tree.errors);
      }

      const command = {
        ...eventInput.data,
        id: asCalendarEventId(eventInput.data.id),
        calendarId: asCalendarId(eventInput.data.calendarId),
        categoryId: asCalendarCategoryId(eventInput.data.categoryId),
        color: eventInput.data.color ?? null,
        participants: participantsInput.data.map((id) => asUserProfileId(id)),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const { calendarEvent, participants } = await services.Calendar.updateCalendarEvent(command, context);
      return {
        id: `calendar-event:update:${calendarEvent.id}`,
        calendarEvent: calendarEventDomainToCalendarEventDTO(calendarEvent),
        participants: participants.map((p) => userProfileReadRowToAvatarDTO(p)),
      };
    },

    removeEvent: async (_, { input }, { auth, services }) => {
      const { calendarId, calendarEventId } = input;
      const inputCalendarId = updateCalendarSchema.safeParse({ id: calendarId });
      if (!inputCalendarId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCalendarId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputCalendarEventId = updateCalendarEventsSchema.safeParse({ id: calendarEventId });
      if (!inputCalendarEventId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputCalendarEventId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        calendarId: asCalendarId(inputCalendarId.data.id),
        calendarEventId: asCalendarEventId(inputCalendarEventId.data.id),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarEventIdReturn = await services.Calendar.removeCalendarEvent(command, context);
      return calendarEventIdReturn;
    },

    createCategory: async (_, { input }, { auth, services }) => {
      const result = insertCalendarCategoriesSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        ...result.data,
        calendarId: asCalendarId(result.data.calendarId),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarCategory = await services.Calendar.addCalendarCategory(command, context);
      return {
        id: `calendar-category:create:${calendarCategory.id}`,
        calendarCategory: calendarCategoryDomainToCalendarCategoryDTO(calendarCategory),
      };
    },

    removeCategory: async (_, { input }, { auth, services }) => {
      const result = selectCalendarCategoriesSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        calendarId: asCalendarId(result.data.calendarId),
        calendarCategoryId: asCalendarCategoryId(result.data.id),
      };
      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };

      const calendarCategoryIdReturn = await services.Calendar.removeCalendarCategory(command, context);
      return calendarCategoryIdReturn;
    },
  },
};

export default calendarResolver;
