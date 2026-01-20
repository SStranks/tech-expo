import type { UserRoles, UUID } from '@apps/crm-shared';

export type AuthenticatedLocals = {
  user: {
    client_id: UUID;
    role: UserRoles;
  };
};
