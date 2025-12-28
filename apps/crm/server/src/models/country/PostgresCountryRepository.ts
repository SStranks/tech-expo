import type { UUID } from 'node:crypto';

import type { ICountryRepository } from './CountryRepository.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

import { TCountryDTO } from './Country.js';

const PostgresCountryRepository: ICountryRepository = {
  async findCountriesById(ids: UUID[]): Promise<TCountryDTO[]> {
    return postgresDBCall(async () => {
      return await postgresDB.query.CountriesTable.findMany({
        where: (countries, { inArray }) => inArray(countries.id, ids),
      });
    });
  },
};

export default PostgresCountryRepository;
