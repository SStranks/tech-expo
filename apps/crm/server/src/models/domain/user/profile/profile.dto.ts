import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { CompanyRoles, UserProfileId } from './profile.types.js';

export type UserProfileDTO = {
  id: UserProfileId;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  telephone: string | null;
  timezoneId: TimeZoneId | null;
  countryId: CountryId;
  companyRole: CompanyRoles;
  image: string | null;
  updatedAt: Date;
};
