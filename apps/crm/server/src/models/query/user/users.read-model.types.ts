import type { UserRoles, UUID } from '@apps/crm-shared';

import type { CompanyRoles } from '#Models/domain/user/profile/profile.types.js';

export type UserReadRow = {
  id: UUID;
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
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  telephone: string | null;
  timezone: string | null;
  country: UUID;
  company: UUID;
  companyRole: CompanyRoles;
  image: string | null;
  updatedAt: Date;
};
