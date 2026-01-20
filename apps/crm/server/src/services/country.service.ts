import type { CountryRepository } from '#Models/domain/country/country.repository.js';

export interface ICountryService {}

export class CountryService implements ICountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  // ------- COMMANDs ------ //

  // ------- QUERIES ------- //
}
