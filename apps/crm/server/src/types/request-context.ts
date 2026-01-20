import type { UserRoles } from '@apps/crm-shared';

import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

export type RequestContext = {
  user: UserId;
  userProfile: UserProfileId;
  role: UserRoles;
};
