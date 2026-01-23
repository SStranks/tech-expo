import type { PersistedUserProfile } from './profile/profile.js';
import type { UserProfileId } from './profile/profile.types.js';
import type { User } from './user.js';
import type { UserRepository } from './user.repository.js';
import type { UserId } from './user.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

import { toUserProfileDomain } from './profile/profile.mapper.js';
import { toUserDomain } from './user.mapper.js';

export class PostgresUserRepository implements UserRepository {
  constructor() {}

  findUsersByIds(ids: UserId[]): Promise<User[]> {
    return postgresDBCall(async () => {
      const users = await postgresDB.query.UserTable.findMany({
        where: (user, { inArray }) => inArray(user.id, ids),
      });
      return users.map((u) => toUserDomain(u));
    });
  }

  findUserProfilesByIds(ids: UserProfileId[]): Promise<PersistedUserProfile[]> {
    return postgresDBCall(async () => {
      const userProfiles = await postgresDB.query.UserProfileTable.findMany({
        where: (userProfile, { inArray }) => inArray(userProfile.id, ids),
      });
      return userProfiles.map((uP) => toUserProfileDomain(uP));
    });
  }
}
