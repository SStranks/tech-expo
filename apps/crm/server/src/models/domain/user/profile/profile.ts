import type { UUID as UUIDv4 } from 'node:crypto';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';

import type { UserId } from '../user.types.js';
import type { CompanyRoles, UserProfileId } from './profile.types.js';

import { randomUUID } from 'node:crypto';

type UserProfileProps = {
  timezone?: TimeZoneId;
  country: CountryId;
  company: CompanyId;
  user: UserId;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  telephone?: string;
  companyRole: CompanyRoles;
  image?: string;
  updatedAt: Date;
  symbol?: UUIDv4;
};

type UserProfileCreateProps = UserProfileProps;
type UserProfileHydrationProps = UserProfileCreateProps & { id: UserProfileId; createdAt: Date };

export type NewUserProfile = InstanceType<typeof NewUserProfileImpl>;
export type PersistedUserProfile = InstanceType<typeof PersistedUserProfileImpl>;

export abstract class UserProfile {
  private readonly _timezone?: TimeZoneId;
  private readonly _country: CountryId;
  private readonly _company: CompanyId;
  private readonly _user: UserId;
  private readonly _symbol: UUIDv4;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _mobile?: string;
  private _telephone?: string;
  private _companyRole: CompanyRoles;
  private _image?: string;
  private _updatedAt: Date;

  constructor(props: UserProfileProps) {
    this._timezone = props.timezone;
    this._country = props.country;
    this._company = props.company;
    this._user = props.user;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._mobile = props.mobile;
    this._telephone = props.telephone;
    this._companyRole = props.companyRole;
    this._image = props.image;
    this._updatedAt = props.updatedAt;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: UserProfileCreateProps): NewUserProfile {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level UserProfile.create() call!
    return new NewUserProfileImpl(props);
  }

  static rehydrate(props: UserProfileHydrationProps): PersistedUserProfile {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level UserProfile.rehydrate() call!
    return new PersistedUserProfileImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get timezone() {
    return this._timezone;
  }

  get country() {
    return this._country;
  }

  get company() {
    return this._company;
  }

  get user() {
    return this._user;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get email() {
    return this._email;
  }

  get mobile() {
    return this._mobile;
  }

  get telephone() {
    return this._telephone;
  }

  get companyRole() {
    return this._companyRole;
  }

  get image() {
    return this._image;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get symbol() {
    return this._symbol;
  }
  // #endregion getters

  abstract isPersisted(): boolean;
}

class NewUserProfileImpl extends UserProfile {
  constructor(props: UserProfileCreateProps) {
    super(props);
  }

  isPersisted(): this is NewUserProfileImpl {
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

  isPersisted(): this is PersistedUserProfileImpl {
    return true;
  }
}
