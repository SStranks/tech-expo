import type { PersistedCountry } from './country.js';
import type { CountryRepository } from './country.repository.js';
import type { CountryId } from './country.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

import { toCountryDomain } from './country.mapper.js';

export class PostgresCountryRepository implements CountryRepository {
  constructor() {}

  async findCountryById(id: CountryId): Promise<PersistedCountry | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.CountriesTable.findFirst({
        where: (country, { eq }) => eq(country.id, id),
      });

      return result ? toCountryDomain(result) : null;
    });
  }
}
