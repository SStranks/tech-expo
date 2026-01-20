import type { PersistedCountry } from './country.js';
import type { CountryId } from './country.types.js';

export interface CountryRepository {
  findCountryById(id: CountryId): Promise<PersistedCountry | null>;
}
