import type { CountryId } from '#Models/domain/country/country.types.js';

export type CountryReadRow = {
  id: CountryId;
  alpha2Code: string;
  alpha3Code: string;
  nationality: string;
  numCode: number;
  shortName: string;
};
