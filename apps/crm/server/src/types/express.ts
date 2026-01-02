import type { UserRoles } from '@apps/crm-shared/src/types/api/auth.js';
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

export type AuthenticatedLocals = {
  user: {
    client_id: UUID;
    role: UserRoles;
  };
};
