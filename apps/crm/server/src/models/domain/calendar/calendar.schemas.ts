import type { CalendarTableSelect } from '#Config/schema/calendar/Calendar.js';
import type { CalendarCategoriesTableSelect } from '#Config/schema/calendar/Categories.js';
import type { CalendarEventsTableSelect } from '#Config/schema/calendar/Events.js';
import type {
  CalendarByMonthInput,
  CalendarCategoriesInput,
  CalendarEventInput,
  CalendarIntitialDataInput,
  CreateCategoryInput,
  CreateEventInput,
  RemoveCategoryInput,
  RemoveEventInput,
  UpdateEventInput,
} from '#Graphql/generated/graphql.gen.js';
import type { ZodShapeFrom, ZodShapeFromSchema } from '#Types/zod.js';

import type { CompanyId } from '../company/company.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { CalendarId } from './calendar.types.js';
import type { CalendarCategoryId } from './category/category.types.js';
import type { CalendarEventId } from './event/event.types.js';

import z from 'zod';

import { zErrorMessages } from '#Utils/zod/zSchemaErrorMapper.js';

export const calendarShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarId),
  companyId: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyId),
} satisfies ZodShapeFromSchema<CalendarTableSelect>;

export const calendarEventShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarEventId),
  calendarId: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarId),
  categoryId: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarCategoryId),
  color: z.string().regex(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i, zErrorMessages.FORMAT('Hexidecimal colour')),
  description: z.string().trim().min(1, zErrorMessages.EMPTY('Description')),
  eventEndAt: z.iso.datetime(zErrorMessages.DATETIME('EventEndAt')).transform((v) => new Date(v)),
  eventStartAt: z.iso.datetime(zErrorMessages.DATETIME('EventStartAt')).transform((v) => new Date(v)),
  title: z.string().trim().min(1, zErrorMessages.EMPTY('Title')),
} satisfies ZodShapeFromSchema<CalendarEventsTableSelect>;

export const calendarCategoryShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarCategoryId),
  calendarId: z.uuid(zErrorMessages.UUID).transform((v) => v as CalendarId),
  title: z.string().trim().min(1, zErrorMessages.EMPTY('Title')),
} satisfies ZodShapeFromSchema<CalendarCategoriesTableSelect>;

export const queryCalendarInitialDataShape = {
  calendarId: calendarEventShape.calendarId,
  companyId: calendarShape.companyId,
  month: z.int().gte(1).lte(12),
  year: z.int().gte(1900).lte(2100),
} satisfies ZodShapeFrom<CalendarIntitialDataInput>;
export const queryCalendarInitialDataSchema = z.object(queryCalendarInitialDataShape);

export const queryCalendarByMonthShape = {
  calendarId: calendarEventShape.calendarId,
  companyId: calendarShape.companyId,
  month: z.int().gte(1).lte(12),
  year: z.int().gte(1900).lte(2100),
} satisfies ZodShapeFrom<CalendarByMonthInput>;
export const queryCalendarByMonthSchema = z.object(queryCalendarByMonthShape);

export const queryCalendarCategoriesShape = {
  calendarId: calendarEventShape.calendarId,
  companyId: calendarShape.companyId,
} satisfies ZodShapeFrom<CalendarCategoriesInput>;
export const queryCalendarCategoriesSchema = z.object(queryCalendarCategoriesShape);

export const queryCalendarEventShape = {
  calendarEventId: calendarEventShape.id,
  calendarId: calendarEventShape.calendarId,
} satisfies ZodShapeFrom<CalendarEventInput>;
export const queryCalendarEventSchema = z.object(queryCalendarEventShape);

export const mutationCreateEventShape = {
  calendarId: calendarEventShape.calendarId,
  categoryId: calendarEventShape.categoryId,
  color: calendarEventShape.color.nullish(),
  description: calendarEventShape.description,
  endTime: calendarEventShape.eventEndAt,
  participants: z.array(z.uuid().transform((v) => v as UserProfileId)),
  startTime: calendarEventShape.eventStartAt,
  title: calendarEventShape.title,
} satisfies ZodShapeFrom<CreateEventInput>;
export const mutationCreateEventSchema = z.object(mutationCreateEventShape);

export const mutationUpdateEventShape = {
  id: calendarEventShape.id,
  calendarId: calendarShape.id,
  categoryId: calendarEventShape.categoryId.optional(),
  color: calendarEventShape.color.nullish(),
  description: calendarEventShape.description.optional(),
  endTime: calendarEventShape.eventEndAt.optional(),
  participants: z.array(z.uuid().transform((v) => v as UserProfileId)).optional(),
  startTime: calendarEventShape.eventStartAt.optional(),
  title: calendarEventShape.title.optional(),
} satisfies ZodShapeFrom<UpdateEventInput>;
export const mutationUpdateEventSchema = z.object(mutationUpdateEventShape);

export const mutationRemoveEventShape = {
  calendarEventId: calendarEventShape.id,
  calendarId: calendarShape.id,
} satisfies ZodShapeFrom<RemoveEventInput>;
export const mutationRemoveEventSchema = z.object(mutationRemoveEventShape);

export const mutationCreateCategoryShape = {
  calendarId: calendarShape.id,
  title: calendarCategoryShape.title,
} satisfies ZodShapeFrom<CreateCategoryInput>;
export const mutationCreateCategorySchema = z.object(mutationCreateCategoryShape);

export const mutationRemoveCategoryShape = {
  calendarCategoryId: calendarCategoryShape.id,
  calendarId: calendarShape.id,
} satisfies ZodShapeFrom<RemoveCategoryInput>;
export const mutationRemoveCategorySchema = z.object(mutationRemoveCategoryShape);
