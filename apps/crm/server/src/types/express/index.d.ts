import type { UserRoles } from '@apps/crm-shared';

import type { UserId } from '#Models/domain/user/user.types.ts';

declare global {
  namespace Express {
    export interface Request {
      authJWT?: string;
      refreshJWT?: string;
    }
  }
}

export type AuthenticatedLocals = {
  user: {
    client_id: UserId;
    role: UserRoles;
  };
};
