/* eslint-disable perfectionist/sort-objects */

import type { UUID as UUIDv4 } from 'node:crypto';

import type { CompanyNoteReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { NewCompany, PersistedCompany } from './company.js';
import type { CompanyRepository } from './company.repository.js';
import type { CompanyId } from './company.types.js';
import type { PersistedCompanyNote } from './note/note.js';

import { eq, inArray, sql } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import CompaniesTable from '#Config/schema/companies/Companies.js';
import CompaniesNotesTable from '#Config/schema/companies/CompanyNotes.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { asUserProfileId } from '../user/profile/profile.mapper.js';
import { asCompanyId, toCompanyDomain } from './company.mapper.js';
import { CompanyNote } from './note/note.js';
import { asCompanyNoteId } from './note/note.mapper.js';

export class PostgresCompanyRepository implements CompanyRepository {
  constructor() {}

  async findCompanyById(id: CompanyId): Promise<PersistedCompany | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CompaniesTable.findFirst({
        where: (company, { eq }) => eq(company.id, id),
      });
      return result ? toCompanyDomain(result) : null;
    });
  }

  async save(company: NewCompany | PersistedCompany): Promise<PersistedCompany> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (company.isPersisted()) {
      return await this.update(company);
    } else {
      return await this.insert(company);
    }
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

  private async insert(company: NewCompany): Promise<PersistedCompany> {
    return postgresDBCall(async () => {
      const [row] = await postgresDB
        .insert(CompaniesTable)
        .values({
          name: company.name,
          size: company.size,
          totalRevenue: company.totalRevenue,
          industry: company.industry,
          businessType: company.businessType,
          country: company.country,
          website: company.website?.toString() ?? null,
        })
        .returning();

      return toCompanyDomain(row);
    });
  }

  private async update(company: PersistedCompany): Promise<PersistedCompany> {
    return postgresDBCall(async () => {
      let persistedCompanyNotes: PersistedCompanyNote[] = [];

      await postgresDB.transaction(async (tx) => {
        if (company.isRootDirty) {
          tx.update(CompaniesTable)
            .set({
              name: company.name,
              size: company.size,
              totalRevenue: company.totalRevenue,
              industry: company.industry,
              businessType: company.businessType,
              country: company.country,
              website: company.website?.toString() ?? null,
            })
            .where(eq(CompaniesTable.id, company.id));
        }

        const { addedNotes, removedNoteIds, updatedNotes } = company.pullChanges();

        if (addedNotes.length > 0) {
          const valuesSql = sql.join(
            addedNotes.map((note) => sql`(${company.id}, ${note.content}, ${note.createdBy}, ${note.symbol})`),
            sql`, `
          );

          const insertedNotes: (CompanyNoteReadRow & { temp_id: UUIDv4 })[] = await tx.execute(
            sql`
    WITH rows (
      ${CompaniesNotesTable.company},
      ${CompaniesNotesTable.note},
      ${CompaniesNotesTable.createdBy},
      temp_id
    ) AS (
      VALUES ${valuesSql}
    )
    INSERT INTO ${CompaniesNotesTable} (
      ${CompaniesNotesTable.company},
      ${CompaniesNotesTable.note},
      ${CompaniesNotesTable.createdBy}
    )
    SELECT
      ${CompaniesNotesTable.company},
      ${CompaniesNotesTable.note},
      ${CompaniesNotesTable.createdBy}
    FROM rows
    RETURNING
      ${CompaniesNotesTable.id},
      rows.temp_id;
  `
          );

          persistedCompanyNotes = insertedNotes.map((row) => {
            return CompanyNote.rehydrate({
              id: asCompanyNoteId(row.id),
              company: asCompanyId(row.company),
              content: row.note,
              createdAt: row.createdAt,
              createdBy: asUserProfileId(row.createdBy),
              symbol: row.temp_id,
            });
          });
        }

        if (removedNoteIds.length > 0) {
          tx.delete(CompaniesNotesTable).where(
            inArray(
              CompaniesNotesTable.id,
              removedNoteIds.map((id) => id)
            )
          );
        }

        if (updatedNotes.length > 0) {
          for (const note of updatedNotes) {
            await tx.update(CompaniesNotesTable).set({ note: note.content }).where(eq(CompaniesNotesTable.id, note.id));
          }
        }
      });

      company.commit(persistedCompanyNotes);
      return company;
    });
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
