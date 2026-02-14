import type { UserRoles, UUID } from '@apps/crm-shared';

import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    authJWT?: string;
    refreshJWT?: string;
  }
}

export type AuthenticatedLocals = {
  user: {
    client_id: UUID;
    role: UserRoles;
  };
};
