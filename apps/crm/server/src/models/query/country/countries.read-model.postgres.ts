import type { CountryId } from '#Models/domain/country/country.types.js';

import type { CountryReadModel } from './countries.read-model.js';
import type { CountryReadRow } from './countries.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

export class PostgresCountryReadModel implements CountryReadModel {
  constructor() {}

  async findCountriesByIds(ids: CountryId[]): Promise<CountryReadRow[]> {
    return postgresDBCall(async () => {
      const countries = await postgresDB.query.CountriesTable.findMany({
        where: (country, { inArray }) => inArray(country.id, ids),
      });

      return countries.map((c) => ({
        id: c.id,
        alpha2Code: c.alpha2Code,
        alpha3Code: c.alpha3Code,
        nationality: c.nationality,
        numCode: c.numCode,
        shortName: c.shortName,
      }));
    });
  }
}
