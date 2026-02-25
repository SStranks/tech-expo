import type { Resolvers } from '#Graphql/generated/graphql.gen.js';

import z from 'zod';

import { insertContactsSchema, updateContactsSchema } from '#Config/schema/contacts/Contacts.js';
import { updateContactsNotesSchema } from '#Config/schema/contacts/ContactsNotes.js';
import { dbInconsistencyError, invalidInputError } from '#Graphql/errors.js';
import pinoLogger from '#Lib/pinoLogger.js';
import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asContactId, contactDomainToContactDTO } from '#Models/domain/contact/contact.mapper.js';
import { asContactNoteId, contactNoteDomainToContactNoteDTO } from '#Models/domain/contact/note/note.mapper.js';
import { asTimeZoneId } from '#Models/domain/timezone/timezone.mapper.js';
import { asUserProfileId, userProfileDomainToAvatarDTO } from '#Models/domain/user/profile/profile.mapper.js';
import { asUserId } from '#Models/domain/user/user.mapper.js';
import { contactOverviewRowToContactOverviewDTO } from '#Models/query/contact/contact.read-model.mapper.js';
import { stableId } from '#Utils/stableId.js';

const contactResolver: Resolvers = {
  Query: {
    contact: async (_, { input }, { services }) => {
      const { id } = input;
      const parsedArgs = z.object({ id: z.uuid() }).safeParse({ id });
      if (!parsedArgs.success) throw invalidInputError('Invalid contact UUID');

      const contact = await services.Contact.getContactById(asContactId(id));
      return contactDomainToContactDTO(contact);
    },

    contactsOverview: async (_, { input }, { services }) => {
      const { filters, pagination } = input;
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 12;
      const searchContactName = filters?.searchContactName ?? undefined;
      const searchContactEmail = filters?.searchContactEmail ?? undefined;
      const searchContactJobTitle = filters?.searchContactJobTitle ?? undefined;
      const searchContactStage = filters?.searchContactStage ?? undefined;
      const companyId = filters?.companyId ? asCompanyId(filters.companyId) : undefined;
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
      const result = insertContactsSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        ...result.data,
        companyId: asCompanyId(result.data.companyId),
        image: result.data.image ?? undefined,
        timezoneId: result.data.timezoneId ? asTimeZoneId(result.data.timezoneId) : undefined,
      };

      const contact = await services.Contact.createContact(command);
      return contactDomainToContactDTO(contact);
    },

    updateContact: async (_, { input }, { services }) => {
      const result = updateContactsSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const command = {
        ...result.data,
        id: asContactId(result.data.id),
        companyId: result.data.companyId ? asCompanyId(result.data.companyId) : undefined,
        timezoneId: result.data.timezoneId ? asTimeZoneId(result.data.timezoneId) : undefined,
        image: result.data.image ?? undefined,
      };

      const contact = await services.Contact.updateContactById(command);
      return contactDomainToContactDTO(contact);
    },

    removeContact: async (_, { input }, { services }) => {
      const result = updateContactsSchema.safeParse(input);
      if (!result.success) {
        const { fieldErrors, formErrors } = z.flattenError(result.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const contactId = asContactId(result.data.id);

      const contactIdReturn = await services.Contact.removeContactById(contactId);
      return contactIdReturn;
    },

    createContactNote: async (_, { input }, { auth, services }) => {
      const { contactId, note } = input;
      const inputContactId = updateContactsSchema.pick({ id: true }).safeParse({ id: contactId });
      if (!inputContactId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputContactId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputNote = updateContactsNotesSchema.pick({ note: true }).required({ note: true }).safeParse({ note });
      if (!inputNote.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputNote.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = { contactId: asContactId(inputContactId.data.id), note: inputNote.data.note };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
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
      const { contactId, contactNoteId, note } = input;
      const inputContactId = updateContactsSchema.safeParse({ id: contactId });
      if (!inputContactId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputContactId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputNote = updateContactsNotesSchema
        .pick({ id: true, note: true })
        .required({ note: true })
        .safeParse({ id: contactNoteId, note });
      if (!inputNote.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputNote.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = {
        contactId: asContactId(inputContactId.data.id),
        contactNoteId: asContactNoteId(inputNote.data.id),
        note: inputNote.data.note,
      };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
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
      const { contactId, contactNoteId } = input;
      const inputContactId = updateContactsSchema.safeParse({ id: contactId });
      if (!inputContactId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputContactId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }
      const inputContactNoteId = updateContactsNotesSchema.safeParse({ id: contactNoteId });
      if (!inputContactNoteId.success) {
        const { fieldErrors, formErrors } = z.flattenError(inputContactNoteId.error);
        throw invalidInputError('Invalid inputs', fieldErrors, formErrors);
      }

      const userProfile = await services.UserProfile.findUserProfileByUserId(asUserId(auth.client_id));
      const command = {
        contactId: asContactId(inputContactId.data.id),
        contactNoteId: asContactNoteId(inputContactNoteId.data.id),
      };
      const context = { user: asUserId(auth.client_id), role: auth.role, userProfile: asUserProfileId(userProfile.id) };
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
      const notes = await services.Contact.findNotesForContactById(asContactId(contact.id));
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
