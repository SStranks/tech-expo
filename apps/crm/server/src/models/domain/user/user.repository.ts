import type { PersistedUserProfile } from './profile/profile.js';
import type { UserProfileId } from './profile/profile.types.js';
import type { PersistedUser } from './user.js';
import type { UserId } from './user.types.js';

export interface UserRepository {
  // save(userProfile: UserProfile): Promise<UserProfile>;
  // remove(id: UserProfileId): Promise<UserProfileId>;
  findUserProfileById(id: UserProfileId): Promise<PersistedUserProfile | null>;
  findUsersByIds(ids: UserId[]): Promise<PersistedUser[]>;
  findUserProfilesByIds(ids: UserProfileId[]): Promise<PersistedUserProfile[]>;
  // count(query?: CompanyQuery): Promise<number>;
}
