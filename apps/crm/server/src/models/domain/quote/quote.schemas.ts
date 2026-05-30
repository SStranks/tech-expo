import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';
import type { QuotesNotesTableSelect } from '#Config/schema/quotes/QuotesNotes.js';
import type { QuoteServicesTableSelect } from '#Config/schema/quotes/QuotesServices.js';
import type {
  CreateQuoteInput,
  CreateQuoteNoteInput,
  CreateQuoteServiceInput,
  PaginationInput,
  QuoteInput,
  QuotesOverviewFiltersInput,
  QuotesOverviewInput,
  QuotesOverviewSort,
  RemoveQuoteInput,
  RemoveQuoteNoteInput,
  RemoveQuoteServiceInput,
  UpdateQuoteInput,
  UpdateQuoteNoteInput,
  UpdateQuoteServiceInput,
} from '#Graphql/generated/graphql.gen.js';
import type { ZodShapeFrom, ZodShapeFromSchema } from '#Types/zod.js';

import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from './note/note.types.js';
import type { QuoteClientGeneratedId, QuoteId } from './quote.types.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service/service.types.js';

import z from 'zod';

import { QuoteSortableField, SortDirection } from '#Graphql/generated/graphql.gen.js';
import { zErrorMessages } from '#Utils/zod/zSchemaErrorMapper.js';

import { QUOTE_STAGE } from './quote.types.js';

const moneyInputSchema = z.object({
  amount: z.string().trim().min(1, zErrorMessages.EMPTY('Amount is required')),
  currency: z.string().trim().min(1, zErrorMessages.EMPTY('Currency is required')),
});

export const quoteShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteId),
  clientGeneratedId: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteClientGeneratedId),
  companyId: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyId),
  dueAt: z.iso.datetime({ error: zErrorMessages.DATETIME('Due-at') }),
  issuedAt: z.iso.datetime({ error: zErrorMessages.DATETIME('Issued-at') }),
  preparedByUserProfileId: z.uuid(zErrorMessages.UUID).transform((v) => v as UserProfileId),
  preparedForContactId: z.uuid(zErrorMessages.UUID).transform((v) => v as ContactId),
  salesTax: z.string().trim().min(1, zErrorMessages.EMPTY('Total-Amount')),
  stage: z.enum(QUOTE_STAGE, zErrorMessages.ENUM('Quote Stage')),
  title: z.string().trim().min(1, zErrorMessages.EMPTY('Title')),
  totalAmount: z.string().trim().min(1, zErrorMessages.EMPTY('Total-Amount')),
} satisfies ZodShapeFromSchema<QuotesTableSelect>;

export const quoteNoteShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteNoteId),
  clientGeneratedId: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteNoteClientGeneratedId),
  content: z.string().trim().min(1, zErrorMessages.EMPTY('Content')),
  quoteId: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteId),
} satisfies Partial<{ [K in keyof QuotesNotesTableSelect]: z.ZodTypeAny }>;

export const quoteServiceShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteServiceId),
  clientGeneratedId: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteServiceClientGeneratedId),
  discount: z.number().gte(0, zErrorMessages.EMPTY('Discount')),
  price: moneyInputSchema,
  quantity: z.number().gte(0, zErrorMessages.EMPTY('Quantity')),
  quoteId: z.uuid(zErrorMessages.UUID).transform((v) => v as QuoteId),
  title: z.string().trim().min(1, zErrorMessages.EMPTY('Title')),
  totalAmount: moneyInputSchema,
} satisfies Partial<{ [K in keyof QuoteServicesTableSelect]: z.ZodTypeAny }>;

const queryQuoteShape = { id: quoteShape.id } satisfies ZodShapeFrom<QuoteInput>;
export const queryQuoteSchema = z.object(queryQuoteShape);

const quotesOverviewFilterSchema = z.object({
  searchCompanyById: z
    .uuid()
    .transform((v) => v as CompanyId)
    .optional(),
  searchPreparedByUserProfileId: z
    .uuid()
    .transform((v) => v as UserProfileId)
    .optional(),
  searchQuoteTitle: z.string().optional(),
  searchStage: z.enum(QUOTE_STAGE).optional(),
} satisfies ZodShapeFrom<QuotesOverviewFiltersInput>);

const paginationSchema = z.object({
  page: z.number().int().gte(1).default(1),
  pageSize: z.number().int().gte(1).default(12),
} satisfies ZodShapeFrom<PaginationInput>);

const quotesOverviewSortSchema = z.array(
  z.object({
    direction: z.enum(SortDirection).optional(),
    field: z.enum(QuoteSortableField),
  } satisfies ZodShapeFrom<QuotesOverviewSort>)
);

const queryQuoteOverviewShape = {
  filters: quotesOverviewFilterSchema.default({}),
  pagination: paginationSchema,
  sort: quotesOverviewSortSchema.default([]),
} satisfies ZodShapeFrom<QuotesOverviewInput>;
export const queryQuoteOverviewSchema = z.object(queryQuoteOverviewShape);

const mutationCreateQuoteShape = {
  clientGeneratedId: quoteShape.clientGeneratedId.optional(),
  companyId: quoteShape.companyId,
  preparedByUserProfileId: quoteShape.preparedByUserProfileId,
  preparedForContactId: quoteShape.preparedForContactId,
  title: quoteShape.title,
} satisfies ZodShapeFrom<CreateQuoteInput>;
export const mutationCreateQuoteSchema = z.object(mutationCreateQuoteShape);

const mutationUpdateQuoteShape = {
  id: quoteShape.id,
  companyId: quoteShape.companyId.optional(),
  preparedByUserProfileId: quoteShape.preparedByUserProfileId.optional(),
  preparedForContactId: quoteShape.preparedForContactId.optional(),
  stage: quoteShape.stage.optional(),
  title: quoteShape.title.optional(),
} satisfies ZodShapeFrom<UpdateQuoteInput>;
export const mutationUpdateQuoteSchema = z.object(mutationUpdateQuoteShape);

export const mutationRemoveQuoteShape = {
  id: quoteShape.id,
} satisfies ZodShapeFrom<RemoveQuoteInput>;
export const mutationRemoveQuoteSchema = z.object(mutationRemoveQuoteShape);

export const mutationCreateQuoteServiceShape = {
  clientGeneratedId: quoteServiceShape.clientGeneratedId.optional(),
  discount: quoteServiceShape.discount,
  price: quoteServiceShape.price,
  quantity: quoteServiceShape.quantity,
  quoteId: quoteServiceShape.quoteId,
  title: quoteServiceShape.title,
  totalAmount: quoteServiceShape.totalAmount,
} satisfies ZodShapeFrom<CreateQuoteServiceInput>;
export const mutationCreateQuoteServiceSchema = z.object(mutationCreateQuoteServiceShape);

export const mutationUpdateQuoteServiceShape = {
  discount: quoteServiceShape.discount.optional(),
  price: quoteServiceShape.price.optional(),
  quantity: quoteServiceShape.quantity.optional(),
  quoteId: quoteServiceShape.quoteId,
  quoteServiceId: quoteServiceShape.id,
  title: quoteServiceShape.title.optional(),
  totalAmount: quoteServiceShape.totalAmount.optional(),
} satisfies ZodShapeFrom<UpdateQuoteServiceInput>;
export const mutationUpdateQuoteServiceSchema = z.object(mutationUpdateQuoteServiceShape);

export const mutationRemoveQuoteServiceShape = {
  quoteId: quoteServiceShape.quoteId,
  quoteServiceId: quoteServiceShape.id,
} satisfies ZodShapeFrom<RemoveQuoteServiceInput>;
export const mutationRemoveQuoteServiceSchema = z.object(mutationRemoveQuoteServiceShape);

export const mutationCreateQuoteNoteShape = {
  clientGeneratedId: quoteNoteShape.clientGeneratedId.optional(),
  content: quoteNoteShape.content,
  quoteId: quoteNoteShape.quoteId,
} satisfies ZodShapeFrom<CreateQuoteNoteInput>;
export const mutationCreateQuoteNoteSchema = z.object(mutationCreateQuoteNoteShape);

export const mutationUpdateQuoteNoteShape = {
  content: quoteNoteShape.content.optional(),
  quoteId: quoteNoteShape.quoteId,
  quoteNoteId: quoteNoteShape.id,
} satisfies ZodShapeFrom<UpdateQuoteNoteInput>;
export const mutationUpdateQuoteNoteSchema = z.object(mutationUpdateQuoteNoteShape);

export const mutationRemoveQuoteNoteShape = {
  quoteId: quoteServiceShape.quoteId,
  quoteNoteId: quoteNoteShape.id,
} satisfies ZodShapeFrom<RemoveQuoteNoteInput>;
export const mutationRemoveQuoteNoteSchema = z.object(mutationRemoveQuoteNoteShape);
