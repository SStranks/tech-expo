import type { PersistedUserProfile } from './profile/profile.js';
import type { UserProfileId } from './profile/profile.types.js';
import type { User } from './user.js';
import type { UserId } from './user.types.js';

export interface UserRepository {
  // save(userProfile: UserProfile): Promise<UserProfile>;
  // remove(id: UserProfileId): Promise<UserProfileId>;
  // findById(id: UserProfileId): Promise<UserProfile | null>;
  findUsersByIds(ids: UserId[]): Promise<User[]>;
  findUserProfilesByIds(ids: UserProfileId[]): Promise<PersistedUserProfile[]>;
  // count(query?: CompanyQuery): Promise<number>;
}
