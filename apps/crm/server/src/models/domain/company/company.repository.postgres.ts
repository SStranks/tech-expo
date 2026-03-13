/* eslint-disable perfectionist/sort-objects */
import type { PostgresTransaction } from '#Config/dbPostgres.js';
import type { CompaniesNotesTableInsert } from '#Config/schema/companies/CompanyNotes.js';

import type { NewCompany, PersistedCompany } from './company.js';
import type { CompanyRepository } from './company.repository.js';
import type { CompanyId } from './company.types.js';
import type { PersistedCompanyNote } from './note/note.js';

import { eq, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CompaniesTable from '#Config/schema/companies/Companies.js';
import CompaniesNotesTable from '#Config/schema/companies/CompanyNotes.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { Company } from './company.js';
import { asCompanyId, companyRowToDomain } from './company.mapper.js';
import { CompanyNote } from './note/note.js';
import { asCompanyNoteId } from './note/note.mapper.js';

export class PostgresCompanyRepository implements CompanyRepository {
  constructor() {}

  async findCompanyById(id: CompanyId): Promise<PersistedCompany | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CompaniesTable.findFirst({
        where: (company, { eq }) => eq(company.id, id),
      });
      return result ? companyRowToDomain(result) : null;
    });
  }

  async save(company: NewCompany | PersistedCompany): Promise<PersistedCompany> {
    return postgresDBCall(async () => {
      const persistedCompany = await postgresDB.transaction(async (tx) => {
        const persistedCompany = company.isPersisted() ? company : await this.insert(tx, company);

        if (persistedCompany.hasDirtyFields()) await this.update(tx, persistedCompany);

        await this.syncNotes(tx, persistedCompany);

        persistedCompany.commit();
        return persistedCompany;
      });

      return persistedCompany;
    });
  }

  async remove(id: CompanyId): Promise<CompanyId> {
    return postgresDBCall(async () => {
      const result = await postgresDB
        .delete(CompaniesTable)
        .where(eq(CompaniesTable.id, id))
        .returning({ id: CompaniesTable.id });

      if (result.length === 0) throw new PostgresError({ kind: 'NOT_FOUND', message: `Company ${id} not found` });
      if (result.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple companies deleted' });

      return asCompanyId(result[0].id);
    });
  }

  private async insert(tx: PostgresTransaction, company: NewCompany): Promise<PersistedCompany> {
    return postgresDBCall(async () => {
      const [row] = await tx
        .insert(CompaniesTable)
        .values({
          name: company.name,
          size: company.size,
          totalRevenue: company.totalRevenue,
          industry: company.industry,
          businessType: company.businessType,
          countryId: company.countryId,
          website: company.website?.toString() ?? null,
        })
        .returning();

      return Company.promote(company, { id: asCompanyId(row.id), createdAt: row.createdAt });
    });
  }

  private async update(tx: PostgresTransaction, company: PersistedCompany): Promise<PersistedCompany> {
    await tx.update(CompaniesTable).set(company.pullDirtyFields()).where(eq(CompaniesTable.id, company.id));
    return company;
  }

  private async syncNotes(tx: PostgresTransaction, company: PersistedCompany) {
    const { addedNotes, removedNoteIds, updatedNotes } = company.pullNoteChanges();
    let persistedNotes: PersistedCompanyNote[] = [];

    if (addedNotes.size > 0) {
      const rows = await tx
        .insert(CompaniesNotesTable)
        .values(
          [...addedNotes.values()].map(
            (n): CompaniesNotesTableInsert => ({
              companyId: n.companyId,
              createdByUserProfileId: n.createdByUserProfileId,
              clientTemporaryId: n.clientId,
              note: n.content,
            })
          )
        )
        .returning();

      persistedNotes = rows.map((row) => {
        const tempId = row.clientTemporaryId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted company-note missing clientTemporaryId',
          });
        }

        const note = addedNotes.get(tempId);
        if (!note) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: `No company-note found for temporary id ${tempId}`,
          });
        }

        return CompanyNote.promote(note, {
          id: asCompanyNoteId(row.id),
          createdAt: row.createdAt,
        });
      });
    }

    if (removedNoteIds.size > 0) {
      await tx.delete(CompaniesNotesTable).where(inArray(CompaniesNotesTable.id, [...removedNoteIds]));
    }

    if (updatedNotes.size > 0) {
      for (const [UUID, note] of updatedNotes) {
        await tx.update(CompaniesNotesTable).set(note.pullDirtyFields()).where(eq(CompaniesNotesTable.id, UUID));
      }
    }

    company.commitNotes(persistedNotes);
  }
}

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
