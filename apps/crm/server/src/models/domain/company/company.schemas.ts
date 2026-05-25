import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type {
  CompaniesOverviewFiltersInput,
  CompaniesOverviewInput,
  CompanyInput,
  CreateCompanyInput,
  CreateCompanyNoteInput,
  PaginationInput,
  RemoveCompanyInput,
  RemoveCompanyNoteInput,
  UpdateCompanyInput,
  UpdateCompanyNoteInput,
} from '#Graphql/generated/graphql.gen.js';
import type { ZodShapeFrom, ZodShapeFromSchema } from '#Types/zod.js';

import type { ContactId } from '../contact/contact.types.js';
import type { CountryId } from '../country/country.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { CompanyNoteId } from './note/note.types.js';

import z from 'zod';

import { zErrorMessages } from '#Utils/zod/zSchemaErrorMapper.js';

import { BUSINESS_TYPE, COMPANY_SIZE, type CompanyId } from './company.types.js';

export const companyShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyId),
  name: z.string().trim().min(1, zErrorMessages.EMPTY('Company name')),
  businessType: z.enum(BUSINESS_TYPE, zErrorMessages.ENUM('Business-type')),
  countryId: z.uuid(zErrorMessages.UUID).transform((v) => v as CountryId),
  industry: z.string().trim().min(1, zErrorMessages.EMPTY('Industry')),
  salesOwner: z.uuid(zErrorMessages.UUID).transform((v) => v as UserProfileId),
  size: z.enum(COMPANY_SIZE, zErrorMessages.ENUM('Company-size')),
  totalRevenue: z.string().trim().min(1, zErrorMessages.EMPTY('Total-Revenue')),
  website: z.string().trim().min(1, zErrorMessages.EMPTY('Website')).optional(),
} satisfies ZodShapeFromSchema<CompaniesTableSelect>;

export const companyNoteShape = {
  id: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyNoteId),
  companyId: z.uuid(zErrorMessages.UUID).transform((v) => v as CompanyId),
  createdByUserProfileId: z.uuid(zErrorMessages.UUID).transform((v) => v as UserProfileId),
  note: z.string().trim().min(1, zErrorMessages.EMPTY('Note')),
} satisfies Partial<{ [K in keyof CompaniesNotesTableSelect]: z.ZodTypeAny }>;

const queryCompanyShape = { id: companyShape.id } satisfies ZodShapeFrom<CompanyInput>;
export const queryCompanySchema = z.object(queryCompanyShape);

const companiesOverviewFiltersSchema = z.object({
  contactIds: z.array(z.uuid().transform((v) => v as ContactId)).optional(),
  searchCompanyName: z.string().optional(),
  salesOwnerId: z
    .uuid()
    .transform((v) => v as UserProfileId)
    .optional(),
} satisfies ZodShapeFrom<CompaniesOverviewFiltersInput>);

const paginationSchema = z.object({
  page: z.number().int().gte(1).default(1),
  pageSize: z.number().int().gte(1).default(12),
} satisfies ZodShapeFrom<PaginationInput>);

const queryCompanyOverviewShape = {
  filters: companiesOverviewFiltersSchema.default({}),
  pagination: paginationSchema,
} satisfies ZodShapeFrom<CompaniesOverviewInput>;
export const queryCompanyOverviewSchema = z.object(queryCompanyOverviewShape);

const mutationCreateCompanyShape = {
  name: companyShape.name,
  businessType: companyShape.businessType,
  countryId: companyShape.countryId,
  industry: companyShape.industry,
  salesOwner: companyShape.salesOwner,
  size: companyShape.size,
  totalRevenue: companyShape.totalRevenue,
  website: companyShape.website.nullish().transform((v) => v ?? null),
} satisfies ZodShapeFrom<CreateCompanyInput>;
export const mutationCreateCompanySchema = z.object(mutationCreateCompanyShape);

const mutationUpdateCompanyShape = {
  id: companyShape.id,
  name: companyShape.name.optional(),
  businessType: companyShape.businessType.optional(),
  countryId: companyShape.countryId.optional(),
  industry: companyShape.industry.optional(),
  size: companyShape.size.optional(),
  totalRevenue: companyShape.totalRevenue.optional(),
  website: companyShape.website.nullish(),
} satisfies ZodShapeFrom<UpdateCompanyInput>;
export const mutationUpdateCompanySchema = z.object(mutationUpdateCompanyShape);

const mutationRemoveCompanyShape = {
  id: companyShape.id,
} satisfies ZodShapeFrom<RemoveCompanyInput>;
export const mutationRemoveCompanySchema = z.object(mutationRemoveCompanyShape);

const mutationCreateCompanyNoteShape = {
  companyId: companyShape.id,
  note: companyNoteShape.note,
} satisfies ZodShapeFrom<CreateCompanyNoteInput>;
export const mutationCreateCompanyNoteSchema = z.object(mutationCreateCompanyNoteShape);

const mutationUpdateCompanyNoteShape = {
  companyId: companyShape.id,
  companyNoteId: companyNoteShape.id,
  note: companyNoteShape.note,
} satisfies ZodShapeFrom<UpdateCompanyNoteInput>;
export const mutationUpdateCompanyNoteSchema = z.object(mutationUpdateCompanyNoteShape);

const mutationRemoveCompanyNoteShape = {
  companyId: companyShape.id,
  companyNoteId: companyNoteShape.id,
} satisfies ZodShapeFrom<RemoveCompanyNoteInput>;
export const mutationRemoveCompanyNoteSchema = z.object(mutationRemoveCompanyNoteShape);
