import type { PersistedUserProfile } from '#Models/domain/user/profile/profile.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

import type { UserReadModel } from './users.read-model.js';
import type { UserProfileReadRow } from './users.read-model.types.js';

export class InMemoryUserReadModel implements UserReadModel {
  constructor() {}

  findUserProfilesByUserProfileIds(_ids: UserProfileId[]): Promise<UserProfileReadRow[]> {
    throw new Error('Method not implemented.');
  }

  findUserProfileByUserId(_id: UserId): Promise<PersistedUserProfile | null> {
    throw new Error('Method not implemented.');
  }
}
