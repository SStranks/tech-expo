import type { TSelectUserSchema } from "#Config/schema/user/User.js";

export default (overrides: Partial<TSelectUserSchema> = {}): TSelectUserSchema => {
  const User: TSelectUserSchema = {
    password: "hashed_password_123",
    id: "123e4567-e89b-12d3-a456-426614174000",
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
