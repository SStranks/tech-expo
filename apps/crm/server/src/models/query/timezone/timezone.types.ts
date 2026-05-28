import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

export type TimezoneReadRow = {
  id: TimeZoneId;
  alpha2Code: string;
  countryId: CountryId;
  gmtOffset: string;
};
