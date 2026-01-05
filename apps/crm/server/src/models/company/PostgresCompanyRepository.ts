import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CompanyRepository } from './CompanyRepository.js';

import { and, eq, exists, ilike, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CompaniesTable, {
  CompaniesTableInsert,
  CompaniesTableSelect,
  CompaniesTableUpdate,
} from '#Config/schema/companies/Companies.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import UserProfileTable from '#Config/schema/user/UserProfile.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { CompanyQuery, CompanyWithRelations } from './Company.js';

const PostgresCompanyRepository: CompanyRepository = {
  async deleteById(id: UUID): Promise<CompaniesTableSelect['id']> {
    return postgresDBCall(async () => {
      const result = await postgresDB
        .delete(CompaniesTable)
        .where(eq(CompaniesTable.id, id))
        .returning({ id: CompaniesTable.id });

      if (result.length === 0) throw new PostgresError({ kind: 'NOT_FOUND', message: `Company ${id} not found` });
      if (result.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple companies deleted' });

      return result[0].id;
    });
  },

  async deleteByIds(ids: UUID[]): Promise<CompaniesTableSelect['id'][]> {
    if (ids.length === 0)
      throw new PostgresError({ kind: 'INVALID_STATE', message: 'Cannot delete companies: no IDs provided' });

    return postgresDBCall(async () => {
      const result = await postgresDB
        .delete(CompaniesTable)
        .where(inArray(CompaniesTable.id, ids))
        .returning({ id: CompaniesTable.id });

      if (result.length !== ids.length)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple companies deleted' });

      return result.map(({ id }) => id);
    });
  },

  async findById(id: UUID): Promise<CompaniesTableSelect | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CompaniesTable.findFirst({
        where: (company, { eq }) => eq(company.id, id),
      });
      return result ?? null;
    });
  },

  async findByIds(ids: UUID[]): Promise<CompaniesTableSelect[]> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CompaniesTable.findMany({
        where: (company, { inArray }) => inArray(company.id, ids),
      });
      return result;
    });
  },

  async findManyWithContactsAndOwner(query: CompanyQuery): Promise<CompanyWithRelations[]> {
    return postgresDBCall(async () => {
      let sqlQuery = postgresDB.select({ company: CompaniesTable }).from(CompaniesTable).$dynamic();
      const whereConditions = [];

      if (query.filters?.search) {
        whereConditions.push(ilike(CompaniesTable.name, `%${query.filters.search}%`));
      }

      if (query.filters?.salesOwnerId) {
        whereConditions.push(
          exists(
            postgresDB
              .select()
              .from(UserProfileTable)
              .where(
                and(
                  eq(UserProfileTable.company, CompaniesTable.id),
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
                and(eq(ContactsTable.company, CompaniesTable.id), inArray(ContactsTable.id, query.filters.contactIds))
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

      if (companies.length === 0) return [];

      const companyIds = companies.map((c) => c.company.id);

      const salesOwners = await postgresDB
        .select()
        .from(UserProfileTable)
        .where(inArray(UserProfileTable.company, companyIds));

      const contacts = await postgresDB.select().from(ContactsTable).where(inArray(ContactsTable.company, companyIds));

      const companyMap = new Map<string, CompanyWithRelations>();

      for (const { company } of companies) {
        companyMap.set(company.id, { company, contacts: [], salesOwner: undefined });
      }

      for (const owner of salesOwners) {
        const entry = companyMap.get(owner.company);
        if (entry) entry.salesOwner = owner;
      }

      for (const contact of contacts) {
        const entry = companyMap.get(contact.company);
        if (entry) entry.contacts.push(contact);
      }

      return [...companyMap.values()];
    });
  },

  async insert(company: CompaniesTableInsert): Promise<CompaniesTableSelect> {
    return postgresDBCall(async () => {
      const [row] = await postgresDB.insert(CompaniesTable).values(company).returning();
      return row;
    });
  },

  async insertMany(companies: CompaniesTableInsert[]): Promise<CompaniesTableSelect[]> {
    return postgresDBCall(async () => {
      return await postgresDB.insert(CompaniesTable).values(companies).returning();
    });
  },

  async updateById(id: UUID, patch: CompaniesTableUpdate): Promise<CompaniesTableSelect> {
    return postgresDBCall(async () => {
      const [row] = await postgresDB.update(CompaniesTable).set(patch).where(eq(CompaniesTable.id, id)).returning();
      return row;
    });
  },

  async updateByIds(ids: UUID[], patch: CompaniesTableUpdate): Promise<CompaniesTableSelect[]> {
    return postgresDBCall(async () => {
      return postgresDB.update(CompaniesTable).set(patch).where(inArray(CompaniesTable.id, ids));
    });
  },
};

export default PostgresCompanyRepository;

/*
 * NOTE: For drizzle implementation reference only. Do not use here - no hydrated results/relationships.
 * NOTE: Setting 'columns-country-false' narrows the drizzle return type;
 * otherwise it would be a country object with an intersection with its foreign-key.
 */
// async findAllWithCountry(): Promise<CompanyDTOWithCountry[]> {
//   return await postgresDB.query.CompaniesTable.findMany({
//     columns: { country: false },
//     with: { country: {} },
//   });
// },

// async findByIdWithCountry(id: UUID): Promise<CompanyDTOWithCountry | null> {
//   const result = await postgresDB.query.CompaniesTable.findFirst({
//     columns: { country: false },
//     with: { country: {} },
//     where: (company, { eq }) => eq(company.id, id),
//   });
//   if (!result) return null;
//   return result;
// },
