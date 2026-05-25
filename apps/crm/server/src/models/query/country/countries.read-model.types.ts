import type { CountryId } from '#Models/domain/country/country.types.js';

export type CountryReadRow = {
  id: CountryId;
  numCode: number;
  alpha2Code: string;
  alpha3Code: string;
  shortName: string;
  nationality: string;
};
