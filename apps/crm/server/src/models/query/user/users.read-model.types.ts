import type { UserRoles } from '@apps/crm-shared';

import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { CompanyRoles, UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

export type UserReadRow = {
  id: UserId;
  accountActive: boolean;
  accountCreatedAt: Date;
  accountFrozen: boolean;
  accountFrozenAt: Date | null;
  accountUpdatedAt: Date;
  email: string;
  password: string;
  passwordChangedAt: Date;
  passwordResetExpires: Date | null;
  passwordResetToken: string | null;
  role: UserRoles;
};

export type UserProfileReadRow = {
  id: UserProfileId;
  companyRole: CompanyRoles;
  countryId: CountryId;
  createdAt: Date;
  email: string;
  firstName: string;
  image: string | null;
  lastName: string;
  mobile: string | null;
  telephone: string | null;
  timezoneId: TimeZoneId | null;
  updatedAt: Date;
  userId: UserId;
};
