import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import z from 'zod';

import { dbInconsistencyError, invalidInputError } from '#Graphql/errors.js';
import pinoLogger from '#Lib/pinoLogger.js';
import { contactDomainToContactDTO } from '#Models/domain/contact/contact.mapper.js';
import {
  mutationCreateContactNoteSchema,
  mutationCreateContactSchema,
  mutationRemoveContactNoteSchema,
  mutationRemoveContactSchema,
  mutationUpdateContactNoteSchema,
  mutationUpdateContactSchema,
  queryContactOverviewSchema,
  queryContactSchema,
} from '#Models/domain/contact/contact.schemas.js';
import { contactNoteDomainToContactNoteDTO } from '#Models/domain/contact/note/note.mapper.js';
import { userProfileDomainToAvatarDTO } from '#Models/domain/user/profile/profile.mapper.js';
import { contactOverviewRowToContactOverviewDTO } from '#Models/query/contact/contact.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

const contactResolver: Resolvers = {
  Query: {
    contact: async (_, { input }, { services }) => {
      const { data, error, success } = queryContactSchema.safeParse({ id: input.id });
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid contact UUID', fieldErrors, formErrors);
      }

      const contact = await services.Contact.getContactById(data.id);
      return contactDomainToContactDTO(contact);
    },

    contactsOverview: async (_, { input }, { services }) => {
      const { data, error, success } = queryContactOverviewSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const { page, pageSize } = data.pagination;
      const { companyId, searchContactEmail, searchContactJobTitle, searchContactName, searchContactStage } =
        data.filters;
      const { sort } = data.sort;

      const query = {
        filters: {
          searchContactName,
          searchContactEmail,
          searchContactJobTitle,
          searchContactStage,
          companyId,
        },
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
        sort,
      };

      const result = await services.Contact.findContactsOverview(query);

      return {
        id: stableId('contacts-overview', {
          page,
          pageSize,
          searchContactName,
          searchContactEmail,
          searchContactJobTitle,
          searchContactStage,
          companyId,
        }),
        items: result.items.map((r) => contactOverviewRowToContactOverviewDTO(r)),
        totalCount: result.totalCount,
      };
    },
  },

  Mutation: {
    createContact: async (_, { input }, { services }) => {
      const { data, error, success } = mutationCreateContactSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const contact = await services.Contact.createContact(command);
      return contactDomainToContactDTO(contact);
    },

    updateContact: async (_, { input }, { services }) => {
      const { data, error, success } = mutationUpdateContactSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = { ...data };
      const contact = await services.Contact.updateContactById(command);
      return contactDomainToContactDTO(contact);
    },

    removeContact: async (_, { input }, { services }) => {
      const { data, error, success } = mutationRemoveContactSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const { id } = data;
      const contactIdReturn = await services.Contact.removeContactById(id);
      return contactIdReturn;
    },

    createContactNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationCreateContactNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { contact, contactNote } = await services.Contact.addContactNote(command, context);

      return {
        id: `contact-note:create:${contactNote.id}`,
        contact: contactDomainToContactDTO(contact),
        contactNote: {
          ...contactNoteDomainToContactNoteDTO(contactNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    updateContactNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationUpdateContactNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const { contact, contactNote } = await services.Contact.updateContactNote(command, context);

      return {
        id: `contact-note:update:${contactNote.id}`,
        contact: contactDomainToContactDTO(contact),
        contactNote: {
          ...contactNoteDomainToContactNoteDTO(contactNote),
          createdBy: userProfileDomainToAvatarDTO(userProfile),
        },
      };
    },

    removeContactNote: async (_, { input }, { auth, services }) => {
      const { data, error, success } = mutationRemoveContactNoteSchema.safeParse(input);
      if (!success) {
        const { fieldErrors, formErrors } = z.flattenError(error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(auth.client_id);
      const command = { ...data };
      const context = { user: auth.client_id, role: auth.role, userProfile: userProfile.id };
      const contactNoteIdReturn = await services.Contact.removeContactNote(command, context);

      return contactNoteIdReturn;
    },
  },

  ContactDetailed: {
    company: async (contact, _, { loaders }) => {
      const result = await loaders.Company.load(contact.companyId);

      if (!result) {
        const errorMessage = `[GraphQL] DB integrity issue: Contact ${contact.id} has invalid company ID ${contact.companyId}`;
        const error = dbInconsistencyError(errorMessage);
        pinoLogger.server.error(error, errorMessage);
        throw error;
      }

      return result;
    },

    timezone: async (contact, _, { loaders }) => {
      if (!contact.timezoneId) return null;
      const result = await loaders.Timezone.load(contact.timezoneId);

      if (!result) {
        const errorMessage = `[GraphQL] DB integrity issue: Contact ${contact.id} has invalid timezone ID ${contact.timezoneId}`;
        const error = dbInconsistencyError(errorMessage);
        pinoLogger.server.error(error, errorMessage);
        throw error;
      }

      return result;
    },

    notes: async (contact, _, { loaders, services }) => {
      const notes = await services.Contact.findNotesForContactById(contact.id);
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

export default contactResolver;
