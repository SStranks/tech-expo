import type { UserRoles } from '@apps/crm-shared';

import type { UserId } from '#Models/domain/user/user.types.js';

export type RequestContext = {
  user: UserId;
  role: UserRoles;
};
