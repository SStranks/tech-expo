import type { TCountryDTO } from './Country.js';
import type { ICountryRepository } from './CountryRepository.js';

export class InMemoryCountryRepository implements ICountryRepository {
  private companies: TCountryDTO[] = [];

  async findAll(): Promise<TCountryDTO[]> {
    return [...this.countries];
  }
}
