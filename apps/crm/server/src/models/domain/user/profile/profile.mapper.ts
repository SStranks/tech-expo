import type { UUID } from '@apps/crm-shared';

import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';
import type { UserProfileAvatar } from '#Graphql/generated/graphql.gen.js';

import type { UserProfileDTO } from './profile.dto.js';
import type { PersistedUserProfile } from './profile.js';
import type { UserProfileId } from './profile.types.js';

import { UserProfile } from './profile.js';

export function asUserProfileId(id: UUID): UserProfileId {
  return id as UserProfileId;
}

export function userProfileDomainToUserProfileDTO(userProfile: PersistedUserProfile): UserProfileDTO {
  return {
    id: userProfile.id,
    companyRole: userProfile.companyRole,
    countryId: userProfile.countryId,
    email: userProfile.email,
    firstName: userProfile.firstName,
    image: userProfile.image ?? null,
    lastName: userProfile.lastName,
    mobile: userProfile.mobile ?? null,
    telephone: userProfile.telephone ?? null,
    timezoneId: userProfile.timezoneId ?? null,
    updatedAt: userProfile.updatedAt,
  };
}

export function userProfileRowToDomain(row: UserProfileTableSelect): PersistedUserProfile {
  return UserProfile.rehydrate({
    id: row.id,
    companyRole: row.companyRole,
    countryId: row.countryId,
    createdAt: row.createdAt,
    email: row.email,
    firstName: row.firstName,
    image: row.image ?? undefined,
    lastName: row.lastName,
    mobile: row.mobile ?? undefined,
    telephone: row.telephone ?? undefined,
    timezoneId: row.timezoneId ?? undefined,
    updatedAt: row.updatedAt,
    userId: row.userId,
  });
}

export function userProfileDomainToAvatarDTO(userProfile: PersistedUserProfile): UserProfileAvatar {
  return {
    id: userProfile.id,
    firstName: userProfile.firstName,
    image: userProfile.image,
    lastName: userProfile.lastName,
  };
}
