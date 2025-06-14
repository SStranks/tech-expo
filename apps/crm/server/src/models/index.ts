export type { TCompanyDTO } from './company/Company.ts';
export type { ICompanyRepository } from './company/CompanyRepository.js';

export type { TCountryDTO } from './country/Country.ts';
export type { ICountryRepository } from './country/CountryRepository.js';

export { default as PostgresCompanyRepository } from './company/PostgresCompanyRepository.js';
export { default as PostgresCountryRepository } from './country/PostgresCountryRepository.js';
