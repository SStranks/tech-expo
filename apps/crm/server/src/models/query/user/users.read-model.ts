import type { PersistedUserProfile } from '#Models/domain/user/profile/profile.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

import type { UserProfileReadRow } from './users.read-model.types.js';

export interface UserReadModel {
  findUserProfilesByUserProfileIds(ids: UserProfileId[]): Promise<UserProfileReadRow[]>;
  findUserProfileByUserId(id: UserId): Promise<PersistedUserProfile | null>;
}
