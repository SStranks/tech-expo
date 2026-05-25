import type { CountryId } from './country.types.js';

export type CountryDTO = {
  id: CountryId;
  numCode: number;
  alpha2Code: string;
  alpha3Code: string;
  shortName: string;
  nationality: string;
};
