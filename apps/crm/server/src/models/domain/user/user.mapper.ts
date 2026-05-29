import type { UUID } from '@apps/crm-shared';

import type { UserTableSelect } from '#Config/schema/user/User.js';
import type { UserProfileReadRow } from '#Models/query/user/users.read-model.types.js';

import type { UserProfileDTO } from './profile/profile.dto.js';
import type { PersistedUser } from './user.js';
import type { UserId } from './user.types.js';

import { User } from './user.js';

export function asUserId(id: UUID): UserId {
  return id as UserId;
}

export function userProfileReadRowToUserProfileDTO(row: UserProfileReadRow): UserProfileDTO {
  return {
    id: row.id,
    companyRole: row.companyRole,
    countryId: row.countryId,
    email: row.email,
    firstName: row.firstName,
    image: row.image,
    lastName: row.lastName,
    mobile: row.mobile,
    telephone: row.telephone,
    timezoneId: row.timezoneId,
    updatedAt: row.updatedAt,
  };
}

export function userRowToDomain(row: UserTableSelect): PersistedUser {
  return User.rehydrate({
    id: row.id,
    accountActive: row.accountActive,
    accountCreatedAt: row.accountCreatedAt,
    accountFrozen: row.accountFrozen,
    accountFrozenAt: row.accountFrozenAt,
    accountUpdatedAt: row.accountUpdatedAt,
    email: row.email,
    password: row.password,
    passwordChangedAt: row.passwordChangedAt,
    passwordResetExpires: row.passwordResetExpires,
    passwordResetToken: row.passwordResetToken,
    role: row.role,
  });
}
