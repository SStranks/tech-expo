import type { CountryId } from '#Models/domain/country/country.types.js';

import type { CountryReadRow } from './countries.read-model.types.js';

export interface CountryReadModel {
  findCountriesByIds(ids: CountryId[]): Promise<CountryReadRow[]>;
}
