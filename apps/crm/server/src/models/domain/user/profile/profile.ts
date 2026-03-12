import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { UserId } from '../user.types.js';
import type { CompanyRoles, UserProfileClientId, UserProfileId } from './profile.types.js';

import { randomUUID } from 'node:crypto';

type UserProfileProps = {
  timezoneId?: TimeZoneId;
  countryId: CountryId;
  companyId: CompanyId;
  userId: UserId;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  telephone?: string;
  companyRole: CompanyRoles;
  image?: string;
  updatedAt: Date;
  clientId?: UserProfileClientId;
};

type UserProfileCreateProps = UserProfileProps;
type UserProfileHydrationProps = UserProfileCreateProps & { id: UserProfileId; createdAt: Date };
type UserProfileUpdateProps = Partial<UserProfileProps> & { id: UserProfileId };

export interface NewUserProfile extends UserProfile {
  isPersisted(): this is PersistedUserProfile;
}

export interface PersistedUserProfile extends UserProfile {
  readonly id: UserProfileId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedUserProfile;
}

class UserProfileState {
  dirtyFields: Set<keyof UserProfileProps> = new Set();
}

export abstract class UserProfile {
  private readonly _props: UserProfileProps & { clientId: UserProfileClientId };
  protected _internal: UserProfileState;

  constructor(props: UserProfileProps) {
    this._props = { ...props, clientId: props.clientId || (randomUUID() as UserProfileClientId) };
    this._internal = new UserProfileState();
  }

  static create(props: UserProfileCreateProps): NewUserProfile {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level UserProfile.create() call!
    return new NewUserProfileImpl(props);
  }

  static rehydrate(props: UserProfileHydrationProps): PersistedUserProfile {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level UserProfile.rehydrate() call!
    return new PersistedUserProfileImpl(props);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get timezoneId() {
    return this._props.timezoneId;
  }

  get countryId() {
    return this._props.countryId;
  }

  get companyId() {
    return this._props.companyId;
  }

  get userId() {
    return this._props.userId;
  }

  get firstName() {
    return this._props.firstName;
  }

  get lastName() {
    return this._props.lastName;
  }

  get email() {
    return this._props.email;
  }

  get mobile() {
    return this._props.mobile;
  }

  get telephone() {
    return this._props.telephone;
  }

  get companyRole() {
    return this._props.companyRole;
  }

  get image() {
    return this._props.image;
  }

  get updatedAt() {
    return this._props.updatedAt;
  }

  get clientId(): UserProfileClientId {
    return this._props.clientId;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof UserProfileProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<UserProfileProps> {
    const update: Partial<UserProfileProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof UserProfileProps>(key: K) => {
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
  updateUserProfile(_input: UserProfileUpdateProps) {}
  // #endregion actions/user
}

class NewUserProfileImpl extends UserProfile {
  constructor(props: UserProfileCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedUserProfile {
    return false;
  }
}

class PersistedUserProfileImpl extends UserProfile {
  private readonly _id: UserProfileId;
  private readonly _createdAt: Date;

  constructor(props: UserProfileHydrationProps) {
    super(props);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedUserProfile {
    return true;
  }
}
