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
type UserUpdateProps = Partial<UserProps> & { id: UserProps };

export interface NewUser extends User {
  isPersisted(): this is PersistedUser;
}

export interface PersistedUser extends User {
  readonly id: UserId;
  isPersisted(): this is PersistedUser;
}

class UserState {
  dirtyFields: Set<keyof UserProps> = new Set();
}

export abstract class User {
  private readonly _props: UserProps;
  protected _internal: UserState;

  constructor(props: UserProps, newUser?: NewUserImpl) {
    this._props = { ...props };
    this._internal = newUser?._internal ?? new UserState();
  }

  static create(props: UserCreateProps): NewUser {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level User.create() call!
    return new NewUserImpl(props);
  }

  static rehydrate(props: UserHydrationProps): PersistedUser {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level User.rehydrate() call!
    return new PersistedUserImpl(props);
  }

  static promote(newUser: NewUserImpl, persisted: { id: UserId; createdAt: Date }): PersistedUser {
    const props = { ...newUser._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.promote() call!
    return new PersistedUserImpl(props, newUser);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get email() {
    return this._props.email;
  }

  get role() {
    return this._props.role;
  }

  get password() {
    return this._props.password;
  }

  get passwordChangedAt() {
    return this._props.passwordChangedAt;
  }

  get passwordResetToken() {
    return this._props.passwordResetToken;
  }

  get passwordResetExpires() {
    return this._props.passwordResetExpires;
  }

  get accountCreatedAt() {
    return this._props.accountCreatedAt;
  }

  get accountUpdatedAt() {
    return this._props.accountUpdatedAt;
  }

  get accountFrozenAt() {
    return this._props.accountFrozenAt;
  }

  get accountFrozen() {
    return this._props.accountFrozen;
  }

  get accountActive() {
    return this._props.accountActive;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof UserProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<UserProps> {
    const update: Partial<UserProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof UserProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }
  // #endregion actions/internal

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit

  commit() {
    this._internal.dirtyFields.clear();
  }
  // #endregion actions/commit

  // --------------------------
  // Domain actions – User
  // --------------------------
  // #region actions/user
  updateUser(_input: UserUpdateProps) {}
  // #endregion actions/user
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

  constructor(props: UserHydrationProps, newUser?: NewUserImpl) {
    super(props, newUser);
    this._id = props.id;
  }

  get id() {
    return this._id;
  }

  isPersisted(): this is PersistedUser {
    return false;
  }
}
