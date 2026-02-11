import type { CountriesTableSelect } from '#Config/schema/Countries.js';

import type { PersistedCountry } from './country.js';
import type { CountryRepository } from './country.repository.js';
import type { CountryId } from './country.types.js';

import { toCountryDomain } from './country.mapper.js';

export class InMemoryCountryRepository implements CountryRepository {
  public countriesMap: Map<string, CountriesTableSelect>;

  constructor(seed?: { countries?: CountriesTableSelect[] }) {
    this.countriesMap = new Map<string, CountriesTableSelect>(seed?.countries?.map((c) => [c.id, c]));
  }

  async findCountryById(id: CountryId): Promise<PersistedCountry | null> {
    const result = this.countriesMap.get(id);
    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
    return Promise.resolve(result ? toCountryDomain(result) : null);
  }
}
