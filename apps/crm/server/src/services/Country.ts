import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { TCountryDTO } from '#Models/country/Country.js';

import { toDbUUIDArray } from '#Helpers/helpers.js';
import pinoLogger from '#Lib/pinoLogger.js';
import PostgresCountryRepository from '#Models/country/PostgresCountryRepository.js';

export interface CountryService {
  getCountriesById(ids: UUID[]): Promise<TCountryDTO[]>;
}
export class CountryService implements CountryService {
  constructor() {}

  async getCountriesById(ids: UUID[]) {
    const countries = await PostgresCountryRepository.findCountriesById(toDbUUIDArray(ids));

    if (countries.length !== ids.length) {
      pinoLogger.app.warn(
        { found: countries.map((c) => c.id), requested: ids },
        '[CountryService]: getCountriesById; Some countries not found'
      );
    }

    return countries;
  }
}
