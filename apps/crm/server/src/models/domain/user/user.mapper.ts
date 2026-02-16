import type { UUID } from '@apps/crm-shared';

import type { UserTableSelect } from '#Config/schema/user/User.js';

import type { PersistedUser } from './user.js';
import type { UserId } from './user.types.js';

import { User } from './user.js';

export function asUserId(id: UUID): UserId {
  return id as UserId;
}

export function userRowToDomain(row: UserTableSelect): PersistedUser {
  return User.rehydrate({
    id: asUserId(row.id),
    accountActive: row.accountActive,
    accountCreatedAt: row.accountCreatedAt,
    accountFrozen: row.accountFrozen,
    accountFrozenAt: row.accountFrozenAt,
    accountUpdatedAt: row.accountUpdatedAt,
    email: row.email,
    password: row.password,
    passwordChangedAt: row.passwordChangedAt,
    passwordResetExpires: row.passwordResetExpires,
    passwordResetToken: row.passwordResetToken,
    role: row.role,
  });
}
