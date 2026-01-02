import type { UserRoleDTO } from '@apps/crm-shared/src/types/api/auth.js';

import type { SelectUserSchema } from '#Config/schema/user/User.js';

type UserRoleRow = Pick<SelectUserSchema, 'id' | 'role'>;

export function toUserRoleDTO(row: UserRoleRow): UserRoleDTO {
  return {
    client_id: row.id,
    role: row.role,
  };
}
