import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';

import type { UserAvatarReadDTO } from './users.read-model.dto.js';
import type { UserProfileReadRow } from './users.read-model.types.js';

export function userProfileRowToReadRow(row: UserProfileTableSelect): UserProfileReadRow {
  return {
    id: row.id,
    companyRole: row.companyRole,
    countryId: row.countryId,
    createdAt: row.createdAt,
    email: row.email,
    firstName: row.firstName,
    image: row.image,
    lastName: row.lastName,
    mobile: row.mobile,
    telephone: row.telephone,
    timezoneId: row.timezoneId,
    updatedAt: row.updatedAt,
    userId: row.userId,
  };
}

export function userProfileReadRowToAvatarDTO(row: UserProfileReadRow): UserAvatarReadDTO {
  return {
    id: row.id,
    firstName: row.firstName,
    image: row.image,
    lastName: row.lastName,
  };
}
