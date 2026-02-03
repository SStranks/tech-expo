/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { UserAvatar } from '#Graphql/generated/graphql.gen.js';
import type { UserProfileReadRow } from '#Models/query/user/users.read-model.types.js';

import type { UserProfileDTO } from './profile.dto.js';
import type { PersistedUserProfile } from './profile.js';
import type { UserProfileId } from './profile.types.js';

import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asCountryId } from '#Models/domain/country/country.mapper.js';
import { asTimeZoneId } from '#Models/domain/timezone/timezone.mapper.js';

import { asUserId } from '../user.mapper.js';
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
    companyId: userProfile.companyId,
    companyRole: userProfile.companyRole,
    image: userProfile.image ?? null,
    updatedAt: userProfile.updatedAt,
  };
}

export function toUserProfileDomain(row: UserProfileReadRow): PersistedUserProfile {
  return UserProfile.rehydrate({
    id: asUserProfileId(row.id),
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    mobile: row.mobile ?? undefined,
    telephone: row.telephone ?? undefined,
    timezoneId: row.timezoneId ? asTimeZoneId(row.timezoneId) : undefined,
    countryId: asCountryId(row.countryId),
    companyId: asCompanyId(row.companyId),
    userId: asUserId(row.userId),
    companyRole: row.companyRole,
    image: row.image ?? undefined,
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  });
}

export function userProfileDomainToAvatarDTO(userProfile: PersistedUserProfile): UserAvatar {
  return {
    id: userProfile.id,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    image: userProfile.image,
  };
}
