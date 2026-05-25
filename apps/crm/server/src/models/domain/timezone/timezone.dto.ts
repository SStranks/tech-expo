import type { CountryId } from '../country/country.types.js';
import type { TimeZoneId } from './timezone.types.js';

export type TimeZoneDTO = {
  id: TimeZoneId;
  alpha2Code: string;
  gmtOffset: string;
  countryId: CountryId;
};
