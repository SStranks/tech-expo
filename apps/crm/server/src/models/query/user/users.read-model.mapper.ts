/* eslint-disable perfectionist/sort-objects */
import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';

import type { UserAvatarReadDTO } from './users.read-model.dto.js';
import type { UserProfileReadRow } from './users.read-model.types.js';

export function userProfileRowToReadRow(row: UserProfileTableSelect): UserProfileReadRow {
  return {
    id: row.id,
    userId: row.userId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    mobile: row.mobile,
    telephone: row.telephone,
    timezoneId: row.timezoneId,
    countryId: row.countryId,
    companyId: row.companyId,
    companyRole: row.companyRole,
    image: row.image,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function userProfileReadRowToAvatarDTO(row: UserProfileReadRow): UserAvatarReadDTO {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    image: row.image,
  };
}
