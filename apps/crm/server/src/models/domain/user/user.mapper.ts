import type { UUID } from '@apps/crm-shared';

import type { UserReadRow } from '#Models/query/user/users.read-model.types.js';

import type { UserId } from './user.types.js';

import { User } from './user.js';

export function asUserId(id: UUID): UserId {
  return id as UserId;
}

export function toUserDomain(user: UserReadRow): User {
  return User.rehydrate({
    id: asUserId(user.id),
    accountActive: user.accountActive,
    accountCreatedAt: user.accountCreatedAt,
    accountFrozen: user.accountFrozen,
    accountFrozenAt: user.accountFrozenAt,
    accountUpdatedAt: user.accountUpdatedAt,
    email: user.email,
    password: user.password,
    passwordChangedAt: user.passwordChangedAt,
    passwordResetExpires: user.passwordResetExpires,
    passwordResetToken: user.passwordResetToken,
    role: user.role,
  });
}
