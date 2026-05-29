/* eslint-disable perfectionist/sort-objects */
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
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    mobile: userProfile.mobile ?? null,
    telephone: userProfile.telephone ?? null,
    timezoneId: userProfile.timezoneId ?? null,
    countryId: userProfile.countryId,
    companyRole: userProfile.companyRole,
    image: userProfile.image ?? null,
    updatedAt: userProfile.updatedAt,
  };
}

export function userProfileRowToDomain(row: UserProfileTableSelect): PersistedUserProfile {
  return UserProfile.rehydrate({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    mobile: row.mobile ?? undefined,
    telephone: row.telephone ?? undefined,
    timezoneId: row.timezoneId ?? undefined,
    countryId: row.countryId,
    userId: row.userId,
    companyRole: row.companyRole,
    image: row.image ?? undefined,
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  });
}

export function userProfileDomainToAvatarDTO(userProfile: PersistedUserProfile): UserProfileAvatar {
  return {
    id: userProfile.id,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    image: userProfile.image,
  };
}
