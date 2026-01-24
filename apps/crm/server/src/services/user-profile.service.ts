import type { UserProfileDTO } from '#Models/domain/user/profile/profile.dto.js';
import type { PersistedUserProfile } from '#Models/domain/user/profile/profile.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserRepository } from '#Models/domain/user/user.repository.js';
import type { UserId } from '#Models/domain/user/user.types.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';

import { asUserProfileId, userProfileDomainToUserProfileDTO } from '#Models/domain/user/profile/profile.mapper.js';
import { NotFoundError } from '#Utils/errors/NotFoundError.js';

export interface IUserProfileService {
  getUserProfilesByIds(userProfileIds: UserProfileId[]): Promise<UserProfileDTO[]>;
  findUserProfileByUserId(id: UserId): Promise<PersistedUserProfile>;
}

export class UserProfileService implements IUserProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userReadModel: UserReadModel
  ) {}

  // ------- COMMANDs ------ //

  async getUserProfilesByIds(ids: UserProfileId[]): Promise<UserProfileDTO[]> {
    const userProfileIds = ids.map((id) => asUserProfileId(id));
    const userProfiles = await this.userRepository.findUserProfilesByIds(userProfileIds);
    return userProfiles.map((userProfile) => userProfileDomainToUserProfileDTO(userProfile));
  }

  // ------- QUERIES ------- //

  async findUserProfileByUserId(id: UserId): Promise<PersistedUserProfile> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(id);
    if (!userProfile) throw new NotFoundError({ context: { userId: id }, resource: `Userprofile by UserId` });
    return userProfile;
  }
}
