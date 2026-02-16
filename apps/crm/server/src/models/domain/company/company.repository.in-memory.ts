/* eslint-disable perfectionist/sort-objects */
import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';
import type { CompanyNoteReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { NewCompany, PersistedCompany } from './company.js';
import type { CompanyRepository } from './company.repository.js';
import type { CompanyId } from './company.types.js';

import PostgresError from '#Utils/errors/PostgresError.js';

import { randomUUID } from 'node:crypto';

import { asUserProfileId } from '../user/profile/profile.mapper.js';
import { companyRowToDomain } from './company.mapper.js';
import { CompanyNote, type PersistedCompanyNote } from './note/note.js';
import { asCompanyNoteId } from './note/note.mapper.js';

// TODO: Switch in my custom error classes throughout the InMemory repo

export class InMemoryCompanyRepository implements CompanyRepository {
  public companiesMap: Map<string, CompaniesTableSelect>;
  public companiesNotesMap: Map<string, CompaniesNotesTableSelect[]>;
  public contacts: ContactsTableSelect[];
  public owners: UserProfileTableSelect[];

  constructor(seed?: {
    companies?: CompaniesTableSelect[];
    companiesNotes?: CompaniesNotesTableSelect[];
    contacts?: ContactsTableSelect[];
    owners?: UserProfileTableSelect[];
  }) {
    this.companiesMap = new Map<string, CompaniesTableSelect>(seed?.companies?.map((c) => [c.id, c]));
    this.companiesNotesMap = (seed?.companiesNotes ?? []).reduce((map, note) => {
      const notes = map.get(note.companyId) ?? [];
      notes.push(note);
      map.set(note.companyId, notes);
      return map;
    }, new Map<string, CompaniesNotesTableSelect[]>());
    this.contacts = seed?.contacts ?? [];
    this.owners = seed?.owners ?? [];
  }

  async save(company: NewCompany | PersistedCompany): Promise<PersistedCompany> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (company.isPersisted()) {
      return this.update(company);
    } else {
      return this.insert(company);
    }
  }

  remove(id: CompanyId): Promise<CompanyId> {
    const company = this.companiesMap.get(id);

    if (!company) throw new PostgresError({ kind: 'NOT_FOUND', message: `Company ${id} not found` });

    const deleted = this.companiesMap.delete(id);

    if (!deleted) {
      throw new PostgresError({
        kind: 'INTERNAL_ERROR',
        message: 'Invariant violation: company not deleted',
      });
    }

    return Promise.resolve(id);
  }

  findCompanyById(id: CompanyId): Promise<PersistedCompany | null> {
    const result = this.companiesMap.get(id);
    return Promise.resolve(result ? companyRowToDomain(result) : null);
  }

  private insert(company: NewCompany): Promise<PersistedCompany> {
    const id = randomUUID();

    if (this.companiesMap.has(id)) {
      throw new PostgresError({
        kind: 'INTERNAL_ERROR',
        message: `Invariant violation: company ${id} already exists`,
      });
    }

    const row: CompaniesTableSelect = {
      id,
      name: company.name,
      size: company.size,
      totalRevenue: company.totalRevenue,
      industry: company.industry,
      businessType: company.businessType,
      countryId: company.countryId,
      website: company.website?.toString() ?? null,
      createdAt: new Date(),
    };

    this.companiesMap.set(id, row);

    return Promise.resolve(companyRowToDomain(row));
  }

  private update(company: PersistedCompany): Promise<PersistedCompany> {
    const existingCompany = this.companiesMap.get(company.id);

    if (!existingCompany) {
      throw new PostgresError({
        kind: 'NOT_FOUND',
        message: `Company ${company.id} not found`,
      });
    }

    if (company.isRootDirty) {
      const updatedCompany: CompaniesTableSelect = {
        ...existingCompany,
        name: company.name,
        size: company.size,
        totalRevenue: company.totalRevenue,
        industry: company.industry,
        businessType: company.businessType,
        countryId: company.countryId,
        website: company.website?.toString() ?? null,
      };

      this.companiesMap.set(company.id, updatedCompany);
    }

    const { addedNotes, removedNoteIds, updatedNotes } = company.pullChanges();

    const persistedCompanyNotes: PersistedCompanyNote[] = [];

    const existingNotes = this.companiesNotesMap.get(company.id) ?? [];

    if (addedNotes.length > 0) {
      for (const note of addedNotes) {
        const persistedNote: CompanyNoteReadRow = {
          id: asCompanyNoteId(randomUUID()),
          companyId: company.id,
          note: note.content,
          createdByUserProfileId: note.createdByUserProfileId,
          createdAt: new Date(),
        };

        existingNotes.push(persistedNote);

        persistedCompanyNotes.push(
          CompanyNote.rehydrate({
            id: asCompanyNoteId(persistedNote.id),
            companyId: company.id,
            content: persistedNote.note,
            createdAt: persistedNote.createdAt,
            createdByUserProfileId: asUserProfileId(persistedNote.createdByUserProfileId),
            symbol: note.symbol, // maps temp_id behavior
          })
        );
      }
    }

    if (removedNoteIds.length > 0) {
      for (const id of removedNoteIds) {
        const index = existingNotes.findIndex((n) => n.id === id);
        if (index !== -1) existingNotes.splice(index, 1);
      }
    }

    if (updatedNotes.length > 0) {
      for (const note of updatedNotes) {
        const existing = existingNotes.find((n) => n.id === note.id);
        if (existing) {
          existing.note = note.content;
        }
      }
    }

    this.companiesNotesMap.set(company.id, existingNotes);

    company.commit(persistedCompanyNotes);

    return Promise.resolve(company);
  }
}
