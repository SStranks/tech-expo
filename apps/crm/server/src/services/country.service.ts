import type { CountryRepository } from '#Models/domain/country/country.repository.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ICountryService {}

export class CountryService implements ICountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  // ------- COMMANDs ------ //

  // ------- QUERIES ------- //
}
