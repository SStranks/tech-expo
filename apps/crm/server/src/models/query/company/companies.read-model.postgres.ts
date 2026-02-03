/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { PersistedCompanyNote } from '#Models/domain/company/note/note.js';

import type { CompanyReadModel } from './companies.read-model.js';
import type {
  CompaniesOverviewPaginated,
  CompaniesOverviewQuery,
  CompanyNoteReadRow,
  CompanyQuery,
  CompanyReadRow,
} from './companies.read-model.types.js';

import { and, count, eq, exists, ilike, inArray, sql } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CompaniesTable from '#Config/schema/companies/Companies.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import PipelineDealsTable from '#Config/schema/pipeline/Deals.js';
import UserProfileTable from '#Config/schema/user/UserProfile.js';
import { asCompanyId, toCompanyNoteDomain } from '#Models/domain/company/company.mapper.js';
import { asCompanyNoteId } from '#Models/domain/company/note/note.mapper.js';
import { asCountryId } from '#Models/domain/country/country.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

import { toCompaniesOverviewRow } from './companies.read-model.mapper.js';

export type CompanyWithRelations = {
  company: CompaniesTableSelect;
  salesOwner: UserProfileTableSelect | undefined;
  openDealsAmount: string;
  contacts: ContactsTableSelect[];
};

export class PostgresCompanyReadModel implements CompanyReadModel {
  constructor() {}

  async count(query?: CompanyQuery): Promise<number> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB.select({ count: count() }).from(CompaniesTable).$dynamic();
      const whereConditions = [];

      if (query?.businessType) {
        whereConditions.push(eq(CompaniesTable.businessType, query.businessType));
      }

      if (query?.countryId) {
        whereConditions.push(eq(CompaniesTable.countryId, query.countryId));
      }

      if (query?.industry) {
        whereConditions.push(eq(CompaniesTable.countryId, query.industry));
      }

      if (query?.size) {
        whereConditions.push(eq(CompaniesTable.size, query.size));
      }

      if (whereConditions.length > 0) {
        sqlQuery = sqlQuery.where(and(...whereConditions));
      }

      const [result] = await sqlQuery;
      return result.count;
    });
  }

  async findCompanyNoteByCompanyNoteId(id: CompanyId): Promise<PersistedCompanyNote | null> {
    return postgresDBCall(async () => {
      const companyNote = await postgresDB.query.CompaniesNotesTable.findFirst({
        where: (companyNote, { eq }) => eq(companyNote.companyId, id),
      });

      return companyNote ? toCompanyNoteDomain(companyNote) : null;
    });
  }

  async findCompanyNotesByCompanyId(id: CompanyId): Promise<CompanyNoteReadRow[]> {
    return postgresDBCall(async () => {
      const companyNotes = await postgresDB.query.CompaniesNotesTable.findMany({
        where: (companyNote, { eq }) => eq(companyNote.companyId, id),
      });

      return companyNotes.map((cN) => ({
        id: asCompanyNoteId(cN.id),
        note: cN.note,
        companyId: asCompanyId(cN.companyId),
        createdAt: cN.createdAt,
        createdByUserProfileId: asUserProfileId(cN.createdByUserProfileId),
      }));
    });
  }

  async findCompanyOverview(query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB
        .select({ company: CompaniesTable, totalCount: sql<number>`COUNT(*) OVER()` })
        .from(CompaniesTable)
        .$dynamic();
      const whereConditions = [];

      if (query.filters?.searchCompanyName) {
        whereConditions.push(ilike(CompaniesTable.name, `%${query.filters.searchCompanyName}%`));
      }

      if (query.filters?.salesOwnerId) {
        whereConditions.push(
          exists(
            postgresDB
              .select()
              .from(UserProfileTable)
              .where(
                and(
                  eq(UserProfileTable.companyId, CompaniesTable.id),
                  eq(UserProfileTable.id, query.filters.salesOwnerId)
                )
              )
          )
        );
      }

      if (query.filters?.contactIds?.length) {
        whereConditions.push(
          exists(
            postgresDB
              .select()
              .from(ContactsTable)
              .where(
                and(eq(ContactsTable.companyId, CompaniesTable.id), inArray(ContactsTable.id, query.filters.contactIds))
              )
          )
        );
      }

      if (whereConditions.length > 0) {
        sqlQuery = sqlQuery.where(and(...whereConditions));
      }

      sqlQuery = sqlQuery
        .orderBy(CompaniesTable.createdAt)
        .limit(query.pagination.limit)
        .offset(query.pagination.offset);

      const companies = await sqlQuery;
      if (companies.length === 0) return { items: [], totalCount: 0 };

      const companyIds = companies.map((c) => c.company.id);

      const salesOwners = await postgresDB
        .select()
        .from(UserProfileTable)
        .where(inArray(UserProfileTable.companyId, companyIds));

      const openDealsTotals = await postgresDB
        .select({
          companyId: PipelineDealsTable.companyId,
          total: sql<string>`coalesce(sum(${PipelineDealsTable.value}), 0)`,
        })
        .from(PipelineDealsTable)
        .where(inArray(PipelineDealsTable.companyId, companyIds))
        .groupBy(PipelineDealsTable.companyId);

      // TODO: Need to get max 5 full contacts max, then the total count also;
      const contacts = await postgresDB
        .select()
        .from(ContactsTable)
        .where(inArray(ContactsTable.companyId, companyIds));

      const companyMap = new Map<string, CompanyWithRelations>();

      for (const { company } of companies) {
        companyMap.set(company.id, { company, contacts: [], openDealsAmount: '', salesOwner: undefined });
      }

      for (const owner of salesOwners) {
        const entry = companyMap.get(owner.companyId);
        if (entry) entry.salesOwner = owner;
      }

      for (const { companyId, total } of openDealsTotals) {
        const entry = companyMap.get(companyId);
        if (entry) entry.openDealsAmount = total;
      }

      for (const contact of contacts) {
        const entry = companyMap.get(contact.companyId);
        if (entry) entry.contacts.push(contact);
      }

      return {
        items: [...companyMap.values()].map((c) => toCompaniesOverviewRow(c)),
        totalCount: companies[0].totalCount,
      };
    });
  }

  async findCompaniesByIds(ids: UUID[]): Promise<CompanyReadRow[]> {
    return postgresDBCall(async () => {
      const companies = await postgresDB.query.CompaniesTable.findMany({
        where: (company, { inArray }) => inArray(company.id, ids),
      });

      return companies.map((c) => ({
        id: asCompanyId(c.id),
        name: c.name,
        size: c.size,
        totalRevenue: c.totalRevenue,
        industry: c.industry,
        businessType: c.businessType,
        countryId: asCountryId(c.countryId),
        website: c.website,
      }));
    });
  }
}
