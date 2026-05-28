import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

export type UserAvatarReadDTO = {
  id: UserProfileId;
  firstName: string;
  image: string | null;
  lastName: string;
};
