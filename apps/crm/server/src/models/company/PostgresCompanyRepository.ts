import type { UUID } from 'node:crypto';

import type { TCompanyDTO, TCompanyDTOWithCountry } from './Company.js';
import type { ICompanyRepository } from './CompanyRepository.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

const PostgresCompanyRepository: ICompanyRepository = {
  async findAll(): Promise<TCompanyDTO[]> {
    return postgresDBCall(async () => {
      return await postgresDB.query.CompaniesTable.findMany({});
    });
  },

  /*
   * NOTE: For implementation reference only.
   * NOTE: Setting 'columns-country-false' narrows the drizzle return type;
   * otherwise it would be a country object with an intersection with its foreign-key.
   */
  async findAllWithCountry(): Promise<TCompanyDTOWithCountry[]> {
    return await postgresDB.query.CompaniesTable.findMany({
      columns: { country: false },
      with: { country: {} },
    });
  },

  async findById(id: UUID): Promise<TCompanyDTO | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CompaniesTable.findFirst({
        where: (company, { eq }) => eq(company.id, id),
      });
      if (!result) return null;
      return result;
    });
  },

  // NOTE:  For implementation reference only
  async findByIdWithCountry(id: UUID): Promise<TCompanyDTOWithCountry | null> {
    const result = await postgresDB.query.CompaniesTable.findFirst({
      columns: { country: false },
      with: { country: {} },
      where: (company, { eq }) => eq(company.id, id),
    });
    if (!result) return null;
    return result;
  },
};

export default PostgresCompanyRepository;
