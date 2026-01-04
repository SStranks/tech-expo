import type { CountriesTableSelect } from '#Config/schema/Countries.js';

export type CountryDTO = {
  id: string;
  numCode: number;
  alpha2Code: string;
  alpha3Code: string;
  shortName: string;
  nationality: string;
};

export const toCountryDTO = (country: CountriesTableSelect): CountryDTO => ({
  id: country.id,
  alpha2Code: country.alpha2Code,
  alpha3Code: country.alpha3Code,
  nationality: country.nationality,
  numCode: country.numCode,
  shortName: country.shortName,
});
