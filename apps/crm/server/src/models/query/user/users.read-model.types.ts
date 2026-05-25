import type { UserRoles } from '@apps/crm-shared';

import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { CompanyRoles, UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

export type UserReadRow = {
  id: UserId;
  email: string;
  role: UserRoles;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  accountCreatedAt: Date;
  accountUpdatedAt: Date;
  accountFrozenAt: Date | null;
  accountFrozen: boolean;
  accountActive: boolean;
};

export type UserProfileReadRow = {
  id: UserProfileId;
  userId: UserId;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  telephone: string | null;
  timezoneId: TimeZoneId | null;
  countryId: CountryId;
  companyRole: CompanyRoles;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};
