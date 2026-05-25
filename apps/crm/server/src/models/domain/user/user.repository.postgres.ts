import type { PersistedUserProfile } from './profile/profile.js';
import type { UserProfileId } from './profile/profile.types.js';
import type { PersistedUser } from './user.js';
import type { UserRepository } from './user.repository.js';
import type { UserId } from './user.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

import { userProfileRowToDomain } from './profile/profile.mapper.js';
import { userRowToDomain } from './user.mapper.js';

export class PostgresUserRepository implements UserRepository {
  constructor() {}

  findUserProfileById(id: UserProfileId): Promise<PersistedUserProfile | null> {
    return postgresDBCall(async () => {
      const row = await postgresDB.query.UserProfileTable.findFirst({
        where: (userProfile, { eq }) => eq(userProfile.id, id),
      });

      return row ? userProfileRowToDomain(row) : null;
    });
  }

  findUsersByIds(ids: UserId[]): Promise<PersistedUser[]> {
    return postgresDBCall(async () => {
      const rows = await postgresDB.query.UserTable.findMany({
        where: (user, { inArray }) => inArray(user.id, ids),
      });
      return rows.map((row) => userRowToDomain(row));
    });
  }

  findUserProfilesByIds(ids: UserProfileId[]): Promise<PersistedUserProfile[]> {
    return postgresDBCall(async () => {
      const rows = await postgresDB.query.UserProfileTable.findMany({
        where: (userProfile, { inArray }) => inArray(userProfile.id, ids),
      });
      return rows.map((row) => userProfileRowToDomain(row));
    });
  }
}
