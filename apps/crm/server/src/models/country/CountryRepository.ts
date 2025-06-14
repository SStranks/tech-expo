import type { UUID } from 'node:crypto';

import type { TCountryDTO } from './Country.js';

export interface ICountryRepository {
  findCountriesById(ids: UUID[]): Promise<TCountryDTO[]>;
}
