import { z } from 'zod';

import { zErrorMessages } from '#Utils/zod/zSchemaErrorMapper.js';

import { CONTACT_STAGE } from './contact.types.js';

export const ContactIdSchema = z.uuid(zErrorMessages.UUID);

export const FirstNameSchema = z.string().trim().min(1, zErrorMessages.EMPTY('First name'));

export const LastNameSchema = z.string().trim().min(1, zErrorMessages.EMPTY('Last name'));

export const EmailSchema = z.email(zErrorMessages.FORMAT('Email'));

export const PhoneSchema = z
  .string(zErrorMessages.STRING('Phone number'))
  .trim()
  .min(1, zErrorMessages.EMPTY('Phone number'))
  .regex(/^[+\d\s\-().]+$/, zErrorMessages.FORMAT('Phone number'));

export const JobTitleSchema = z.string().trim().min(1);

export const ContactStageSchema = z.enum(CONTACT_STAGE);

export const CompanyIdSchema = z.uuid(zErrorMessages.UUID);

export const TimezoneIdSchema = z.uuid(zErrorMessages.UUID).nullable();

export const AvatarUrlSchema = z.url(zErrorMessages.URL('Contact avatar')).nullable();
