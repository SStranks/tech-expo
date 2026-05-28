import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { CompanyRoles, UserProfileId } from './profile.types.js';

export type UserProfileDTO = {
  id: UserProfileId;
  companyRole: CompanyRoles;
  countryId: CountryId;
  email: string;
  firstName: string;
  image: string | null;
  lastName: string;
  mobile: string | null;
  telephone: string | null;
  timezoneId: TimeZoneId | null;
  updatedAt: Date;
};
