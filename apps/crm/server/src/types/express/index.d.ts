import type { UserRoles, UUID } from '@apps/crm-shared';

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
    client_id: UUID;
    role: UserRoles;
  };
};
