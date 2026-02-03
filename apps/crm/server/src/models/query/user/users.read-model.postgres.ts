/* eslint-disable perfectionist/sort-objects */
import type { PersistedUserProfile } from '#Models/domain/user/profile/profile.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

import type { UserReadModel } from './users.read-model.js';
import type { UserProfileReadRow } from './users.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import { toUserProfileDomain } from '#Models/domain/user/profile/profile.mapper.js';

export class PostgresUserReadModel implements UserReadModel {
  constructor() {}

  async findUserProfilesByUserProfileIds(ids: UserProfileId[]): Promise<UserProfileReadRow[]> {
    return postgresDBCall(async () => {
      const userProfiles = await postgresDB.query.UserProfileTable.findMany({
        where: (userProfile, { inArray }) => inArray(userProfile.id, ids),
      });

      return userProfiles.map((uP) => ({
        id: uP.id,
        userId: uP.userId,
        firstName: uP.firstName,
        lastName: uP.lastName,
        email: uP.email,
        mobile: uP.mobile,
        telephone: uP.telephone,
        timezoneId: uP.timezoneId,
        countryId: uP.countryId,
        companyId: uP.companyId,
        companyRole: uP.companyRole,
        image: uP.image,
        createdAt: uP.createdAt,
        updatedAt: uP.updatedAt,
      }));
    });
  }

  async findUserProfileByUserId(id: UserId): Promise<PersistedUserProfile | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.UserProfileTable.findFirst({
        where: (userProfile, { eq }) => eq(userProfile.userId, id),
      });

      return result ? toUserProfileDomain(result) : null;
    });
  }
}
