import type { TCompaniesTableSelect, TCountriesTableSelect } from '#Config/schema/index.js';

export type TCompanyDTO = TCompaniesTableSelect;

export type TCompanyDTOWithCountry = Omit<TCompaniesTableSelect, 'country'> & {
  country: TCountriesTableSelect;
};
