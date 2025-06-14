import type { UUID } from 'node:crypto';

import type { TCountryDTO } from '#Models/index.js';

import pinoLogger from '#Lib/pinoLogger.js';
import { PostgresCountryRepository } from '#Models/index.js';

export type TCountryService = {
  getCountriesById(ids: UUID[]): Promise<TCountryDTO[]>;
};

export async function getCountriesById(ids: UUID[]) {
  const countries = await PostgresCountryRepository.findCountriesById(ids);

  if (countries.length !== ids.length) {
    pinoLogger.warn(
      { found: countries.map((c) => c.id), requested: ids },
      '[CountryService]: getCountriesById; Some countries not found'
    );
  }

  return countries;
}
