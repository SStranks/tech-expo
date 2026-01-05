import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type {
  CompaniesTableInsert,
  CompaniesTableSelect,
  CompaniesTableUpdate,
} from '#Config/schema/companies/Companies.js';
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';

import type { CompanyQuery, CompanyWithRelations } from './Company.js';
import type { CompanyRepository } from './CompanyRepository.js';

import { insertCompaniesSchema, updateCompaniesSchema } from '#Config/schema/companies/Companies.js';

import crypto from 'node:crypto';

// TODO: Switch in my custom error classes throughout the InMemory repo

export const createInMemoryRepository = (seed?: {
  companies?: CompaniesTableSelect[];
  contacts?: ContactsTableSelect[];
  owners?: UserProfileTableSelect[];
}): CompanyRepository => {
  const companiesMap = new Map<string, CompaniesTableSelect>(seed?.companies?.map((c) => [c.id, c]));
  const contacts = seed?.contacts ?? [];
  const owners = seed?.owners ?? [];

  const InMemoryCompanyRepository: CompanyRepository = {
    async deleteById(id: UUID): Promise<CompaniesTableSelect['id']> {
      const existed = companiesMap.delete(id);

      if (!existed) throw new Error(`Company ${id} not found`);
      return id;
    },

    async deleteByIds(ids: UUID[]): Promise<CompaniesTableSelect['id'][]> {
      for (const id of ids) {
        const existed = companiesMap.delete(id);
        if (!existed) throw new Error(`Company ${id} not found`);
      }
      return ids;
    },

    async findById(id: UUID): Promise<CompaniesTableSelect | null> {
      return companiesMap.get(id) ?? null;
    },

    async findByIds(ids: UUID[]): Promise<CompaniesTableSelect[]> {
      const result: CompaniesTableSelect[] = [];

      for (const id of ids) {
        const company = companiesMap.get(id);
        if (company) result.push(company);
      }

      return result;
    },

    async findManyWithContactsAndOwner(query: CompanyQuery): Promise<CompanyWithRelations[]> {
      let filtered = [...companiesMap.values()];

      // search by name
      if (query.filters?.search) {
        const searchLower = query.filters.search.toLowerCase();
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(searchLower));
      }

      // filter by salesOwnerId
      if (query.filters?.salesOwnerId) {
        filtered = filtered.filter((c) =>
          owners.some((o) => o.company === c.id && o.id === query.filters.salesOwnerId)
        );
      }

      // filter by contactIds
      if (query.filters?.contactIds?.length) {
        filtered = filtered.filter((c) =>
          contacts.some((ct) => ct.company === c.id && query.filters.contactIds!.includes(ct.id))
        );
      }

      // order by createdAt
      filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      // pagination
      const { limit, offset } = query.pagination;
      const page = filtered.slice(offset, offset + limit);

      // attach contacts and owner
      return page.map((company) => {
        const companyContacts = contacts.filter((c) => c.company === company.id);
        const companyOwner = owners.find((o) => o.company === company.id);
        return {
          company,
          contacts: companyContacts,
          salesOwner: companyOwner,
        };
      });
    },

    async insert(company: CompaniesTableInsert): Promise<CompaniesTableSelect> {
      const validatedCompany = insertCompaniesSchema.parse(company);
      for (const existing of companiesMap.values()) {
        if (existing.name === validatedCompany.name) {
          throw new Error('duplicate key value violates unique constraint "companies_name_key"');
        }
      }

      const record: CompaniesTableSelect = {
        ...company,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        website: company.website ?? null,
      };

      companiesMap.set(record.id, record);
      return record;
    },

    async insertMany(companies: CompaniesTableInsert[]): Promise<CompaniesTableSelect[]> {
      const records: CompaniesTableSelect[] = [];

      for (const company of companies) {
        const validatedCompany = insertCompaniesSchema.parse(company);
        for (const existing of companiesMap.values()) {
          if (existing.name === validatedCompany.name) {
            throw new Error('duplicate key value violates unique constraint "companies_name_key"');
          }
        }

        const record = {
          ...company,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          website: company.website ?? null,
        };

        companiesMap.set(record.id, record);
        records.push(record);
      }
      return records;
    },

    async updateById(id: UUID, patch: CompaniesTableUpdate): Promise<CompaniesTableSelect> {
      let company = companiesMap.get(id);
      if (!company) throw new Error(`Company ${id} not found`);
      updateCompaniesSchema.parse(patch);

      company = { ...company, ...patch };
      companiesMap.set(id, company);
      return company;
    },

    async updateByIds(ids: UUID[], patch: CompaniesTableUpdate): Promise<CompaniesTableSelect[]> {
      const companies: CompaniesTableSelect[] = [];
      const idsSet = new Set<UUID>();

      for (const id of ids) {
        if (idsSet.has(id)) throw new Error('duplicate key value violates unique constraint "companies_name_key"');
        idsSet.add(id);
      }

      updateCompaniesSchema.parse(patch);

      for (const id of ids) {
        let company = companiesMap.get(id);
        if (!company) throw new Error(`Company ${id} not found`);

        company = { ...company, ...patch };
        companiesMap.set(id, company);
        companies.push(company);
      }

      return companies;
    },
  };

  return InMemoryCompanyRepository;
};
