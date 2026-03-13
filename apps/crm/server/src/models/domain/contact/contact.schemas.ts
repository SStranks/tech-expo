import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { ContactsNotesTableSelect } from '#Config/schema/contacts/ContactsNotes.js';
import type {
  ContactInput,
  CreateContactInput,
  CreateContactNoteInput,
  RemoveContactInput,
  RemoveContactNoteInput,
  UpdateContactInput,
  UpdateContactNoteInput,
} from '#Graphql/generated/graphql.gen.js';

import type { CompanyId } from '../company/company.types.js';
import type { TimeZoneId } from '../timezone/timezone.types.js';
import type { ContactId } from './contact.types.js';
import type { ContactNoteId } from './note/note.types.js';

import { z } from 'zod';

import { zErrorMessages } from '#Utils/zod/zSchemaErrorMapper.js';

import { CONTACT_STAGE } from './contact.types.js';

type ZodShapeFrom<T> = {
  [K in keyof T]: z.ZodTypeAny;
};

export const contactShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as ContactId),
  companyId: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyId),
  email: z.email(zErrorMessages.FORMAT('Email')),
  firstName: z.string().trim().min(1, zErrorMessages.EMPTY('First name')),
  image: z.url(zErrorMessages.URL('Contact avatar')).nullable(),
  jobTitle: z.string().trim().min(1),
  lastName: z.string().trim().min(1, zErrorMessages.EMPTY('Last name')),
  stage: z.enum(CONTACT_STAGE),
  phone: z
    .string(zErrorMessages.STRING('Phone number'))
    .trim()
    .min(1, zErrorMessages.EMPTY('Phone number'))
    .regex(/^[+\d\s\-().]+$/, zErrorMessages.FORMAT('Phone number')),
  timezoneId: z
    .uuid(zErrorMessages.UUID)
    .transform((v) => v as TimeZoneId)
    .nullable(),
} satisfies Partial<{ [K in keyof ContactsTableSelect]: z.ZodTypeAny }>;

export const contactNoteShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as ContactNoteId),
  note: z.string().trim().min(1, zErrorMessages.EMPTY('Note')),
} satisfies Partial<{ [K in keyof ContactsNotesTableSelect]: z.ZodTypeAny }>;

const queryContactShape = { id: contactShape.id } satisfies ZodShapeFrom<ContactInput>;
export const queryContactSchema = z.object(queryContactShape);

const mutationCreateContactShape = {
  company: contactShape.companyId,
  email: contactShape.email,
  firstName: contactShape.firstName,
  jobTitle: contactShape.jobTitle,
  lastName: contactShape.lastName,
  phone: contactShape.phone,
  stage: contactShape.stage,
  timezone: contactShape.timezoneId,
} satisfies ZodShapeFrom<CreateContactInput>;
export const mutationCreateContactSchema = z.object(mutationCreateContactShape);

export const mutationUpdateContactShape = {
  id: contactShape.id,
  company: contactShape.companyId,
  email: contactShape.email,
  firstName: contactShape.firstName,
  jobTitle: contactShape.jobTitle,
  lastName: contactShape.lastName,
  phone: contactShape.phone,
  stage: contactShape.stage,
  timezone: contactShape.timezoneId,
} satisfies ZodShapeFrom<UpdateContactInput>;
export const mutationUpdateContactSchema = z.object(mutationUpdateContactShape);

export const mutationRemoveContactShape = {
  id: contactShape.id,
} satisfies ZodShapeFrom<RemoveContactInput>;
export const mutationRemoveContactSchema = z.object(mutationUpdateContactShape);

export const mutationCreateContactNoteShape = {
  contactId: contactShape.id,
  note: contactNoteShape.note,
} satisfies ZodShapeFrom<CreateContactNoteInput>;
export const mutationCreateContactNoteSchema = z.object(mutationCreateContactNoteShape);

export const mutationUpdateContactNoteShape = {
  contactId: contactShape.id,
  contactNoteId: contactNoteShape.id,
  note: contactNoteShape.note,
} satisfies ZodShapeFrom<UpdateContactNoteInput>;
export const mutationUpdateContactNoteSchema = z.object(mutationUpdateContactNoteShape);

export const mutationRemoveContactNoteShape = {
  contactId: contactShape.id,
  contactNoteId: contactNoteShape.id,
} satisfies ZodShapeFrom<RemoveContactNoteInput>;
export const mutationRemoveContactNoteSchema = z.object(mutationRemoveContactNoteShape);
