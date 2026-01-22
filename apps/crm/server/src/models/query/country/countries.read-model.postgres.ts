/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CountryReadModel } from './countries.read-model.js';
import type { CountryReadRow } from './countries.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

export class PostgresCountryReadModel implements CountryReadModel {
  constructor() {}

  async findCountriesByIds(ids: UUID[]): Promise<CountryReadRow[]> {
    return postgresDBCall(async () => {
      const countries = await postgresDB.query.CountriesTable.findMany({
        where: (country, { inArray }) => inArray(country.id, ids),
      });

      return countries.map((c) => ({
        id: c.id,
        numCode: c.numCode,
        alpha2Code: c.alpha2Code,
        alpha3Code: c.alpha3Code,
        shortName: c.shortName,
        nationality: c.nationality,
      }));
    });
  }
}
