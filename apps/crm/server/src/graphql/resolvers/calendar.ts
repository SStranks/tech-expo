import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import z from 'zod';

import { invalidInputError } from '#Graphql/errors.js';
import {
  mutationCreateCategorySchema,
  mutationCreateEventSchema,
  mutationRemoveCategorySchema,
  mutationRemoveEventSchema,
  mutationUpdateEventSchema,
  queryCalendarByMonthSchema,
  queryCalendarCategoriesSchema,
  queryCalendarEventSchema,
  queryCalendarInitialDataSchema,
} from '#Models/domain/calendar/calendar.schemas.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';
import { userProfileReadRowToAvatarDTO } from '#Models/query/user/users.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

import { calendarCategoryDomainToCalendarCategoryDTO } from '../../models/domain/calendar/category/category.mapper.js';
import {
  calendarEventDomainToCalendarEventDTO,
  calendarEventReadRowToCalendarEventDTO,
} from '../../models/domain/calendar/event/event.mapper.js';

const calendarResolver: Resolvers = {
  Query: {
    calendarInitialData: async (_, { input }, { auth, services }) => {
      const { data, error, success } = queryCalendarInitialDataSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { calendarId, companyId, month, year } = data;
      const command = { calendarId, companyId, month, year };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const { categories, events } = await services.Calendar.getCalendarInitialData(command, context);
      return {
        id: stableId('calendar-initial', { companyId, month, year }),
        categories,
        events: events.map((e) => calendarEventReadRowToCalendarEventDTO(e)),
      };
    },

    calendarByMonth: async (_, { input }, { auth, services }) => {
      const { data, error, success } = queryCalendarByMonthSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { companyId, month, year } = data;
      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const events = await services.Calendar.findCalendarEventsByDate(command, context);

      return {
        id: stableId('calendar-month', { companyId, month, year }),
        events: events.map((e) => calendarEventReadRowToCalendarEventDTO(e)),
      };
    },

    calendarCategories: async (_, { input }, { auth, services }) => {
      const { data, error, success } = queryCalendarCategoriesSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { calendarId, companyId } = data;
      const command = { calendarId, companyId };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarCategories = await services.Calendar.findCalendarCategoriesByCompanyId(command, context);
      return {
        id: `calendar-categories:byCompanyId:${companyId}`,
        calendarCategories,
      };
    },

    calendarEvent: async (_, { input }, { auth, services }) => {
      const { data, error, success } = queryCalendarEventSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { calendarEventId, calendarId } = data;
      const command = { calendarEventId, calendarId };
      const context = { user: asUserId(auth.client_id), role: auth.role };
      const { calendarEvent, participants } = await services.Calendar.getCalendarEventById(command, context);

      return {
        id: stableId('calendar-event', { calendarEventId }),
        calendarEvent: calendarEventReadRowToCalendarEventDTO(calendarEvent),
        participants: participants.map((p) => userProfileReadRowToAvatarDTO(p)),
      };
    },
  },

  Mutation: {
    createEvent: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateEventSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { startTime, endTime, ...rest } = data;
      const command = {
        ...rest,
        eventStartAt: startTime,
        eventEndAt: endTime,
        participants: data.participants.map((id) => asUserProfileId(id)),
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
      const { data, error, success } = mutationUpdateEventSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const { calendarEvent, participants } = await services.Calendar.updateCalendarEvent(command, context);
      return {
        id: `calendar-event:update:${calendarEvent.id}`,
        calendarEvent: calendarEventDomainToCalendarEventDTO(calendarEvent),
        participants: participants.map((p) => userProfileReadRowToAvatarDTO(p)),
      };
    },

    removeEvent: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveEventSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarEventIdReturn = await services.Calendar.removeCalendarEvent(command, context);
      return calendarEventIdReturn;
    },

    createCategory: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateCategorySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const context = { user: asUserId(auth.client_id), role: auth.role };

      const calendarCategory = await services.Calendar.addCalendarCategory(command, context);
      return {
        id: `calendar-category:create:${calendarCategory.id}`,
        calendarCategory: calendarCategoryDomainToCalendarCategoryDTO(calendarCategory),
      };
    },

    removeCategory: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveCategorySchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { calendarId, calendarCategoryId } = data;
      const command = { calendarId, calendarCategoryId };
      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };

      const calendarCategoryIdReturn = await services.Calendar.removeCalendarCategory(command, context);
      return calendarCategoryIdReturn;
    },
  },
};

export default calendarResolver;
