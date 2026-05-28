import type { CountryId } from './country.types.js';

export type CountryDTO = {
  id: CountryId;
  alpha2Code: string;
  alpha3Code: string;
  nationality: string;
  numCode: number;
  shortName: string;
};
