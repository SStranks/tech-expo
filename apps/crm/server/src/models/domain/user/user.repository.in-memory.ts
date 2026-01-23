import type { PersistedUserProfile } from './profile/profile.js';
import type { UserProfileId } from './profile/profile.types.js';
import type { User } from './user.js';
import type { UserRepository } from './user.repository.js';
import type { UserId } from './user.types.js';

export class InMemoryUserRepository implements UserRepository {
  constructor() {}
  findUsersByIds(_ids: UserId[]): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  findUserProfilesByIds(_ids: UserProfileId[]): Promise<PersistedUserProfile[]> {
    throw new Error('Method not implemented.');
  }
}
