import type { UserRoles } from '@apps/crm-shared';

import type { UserId } from './user.types.js';

type UserProps = {
  email: string;
  role: UserRoles;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  accountCreatedAt: Date;
  accountUpdatedAt: Date;
  accountFrozenAt: Date | null;
  accountFrozen: boolean;
  accountActive: boolean;
};

type UserCreateProps = UserProps;
type UserHydrationProps = UserCreateProps & { id: UserId };

export interface NewUser extends User {
  isPersisted(): this is PersistedUser;
}

export interface PersistedUser extends User {
  readonly id: UserId;
  isPersisted(): this is PersistedUser;
}

export abstract class User {
  private readonly _email: string;
  private readonly _role: UserRoles;
  private readonly _password: string;
  private readonly _passwordChangedAt: Date;
  private readonly _passwordResetToken: string | null;
  private readonly _passwordResetExpires: Date | null;
  private readonly _accountCreatedAt: Date;
  private readonly _accountUpdatedAt: Date;
  private readonly _accountFrozenAt: Date | null;
  private readonly _accountFrozen: boolean;
  private readonly _accountActive: boolean;

  constructor(props: UserProps) {
    this._email = props.email;
    this._role = props.role;
    this._password = props.password;
    this._passwordChangedAt = props.passwordChangedAt;
    this._passwordResetToken = props.passwordResetToken;
    this._passwordResetExpires = props.passwordResetExpires;
    this._accountCreatedAt = props.accountCreatedAt;
    this._accountUpdatedAt = props.accountUpdatedAt;
    this._accountFrozenAt = props.accountFrozenAt;
    this._accountFrozen = props.accountFrozen;
    this._accountActive = props.accountActive;
  }

  static create(props: UserCreateProps): NewUser {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level User.create() call!
    return new NewUserImpl(props);
  }

  static rehydrate(props: UserHydrationProps): PersistedUser {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level User.rehydrate() call!
    return new PersistedUserImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  get password() {
    return this._password;
  }

  get passwordChangedAt() {
    return this._passwordChangedAt;
  }

  get passwordResetToken() {
    return this._passwordResetToken;
  }

  get passwordResetExpires() {
    return this._passwordResetExpires;
  }

  get accountCreatedAt() {
    return this._accountCreatedAt;
  }

  get accountUpdatedAt() {
    return this._accountUpdatedAt;
  }

  get accountFrozenAt() {
    return this._accountFrozenAt;
  }

  get accountFrozen() {
    return this._accountFrozen;
  }

  get accountActive() {
    return this._accountActive;
  }
  // #endregion getters

  abstract isPersisted(): boolean;
}

class NewUserImpl extends User {
  constructor(props: UserCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedUser {
    return false;
  }
}

class PersistedUserImpl extends User {
  private readonly _id: UserId;

  constructor(props: UserHydrationProps) {
    super(props);
    this._id = props.id;
  }

  get id() {
    return this._id;
  }

  isPersisted(): this is PersistedUser {
    return false;
  }
}
