import type { SelectUserSchema } from "#Config/schema/user/User.js";
import { asUserId } from "#Models/domain/user/user.mapper.js";
import { createMockUUID } from "@apps/crm-shared/utils";

export default (overrides: Partial<SelectUserSchema> = {}): SelectUserSchema => {
  const User: SelectUserSchema = {
    password: "hashed_password_123",
    id: asUserId(createMockUUID()),
    email: "mock@example.com",
    role: "USER",
    passwordChangedAt: new Date(),
    passwordResetToken: null,
    passwordResetExpires: null,
    accountCreatedAt: new Date(),
    accountUpdatedAt: new Date(),
    accountFrozenAt: null,
    accountFrozen: false,
    accountActive: true,
  };

  return { ...User, ...overrides }
};
