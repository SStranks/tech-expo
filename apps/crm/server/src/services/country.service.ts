import type { CountryRepository } from '#Models/domain/country/country.repository.js';

interface CountryServiceDependencies {
  countryRepository: CountryRepository;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ICountryService {}

export class CountryService implements ICountryService {
  private readonly countryRepository: CountryRepository;

  constructor({ countryRepository }: CountryServiceDependencies) {
    this.countryRepository = countryRepository;
  }

  // ------- COMMANDs ------ //

  // ------- QUERIES ------- //
}
