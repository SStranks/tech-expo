import type { CountryId } from '../country/country.types.js';
import type { TimeZoneClientId, TimeZoneId } from './timezone.types.js';

import { randomUUID } from 'node:crypto';

type TimeZoneProps = {
  alpha2Code: string;
  gmtOffset: string;
  countryId: CountryId;
  clientId?: TimeZoneClientId;
};

type TimeZoneHydrationProps = TimeZoneProps & { id: TimeZoneId; createdAt: Date };

export interface PersistedTimeZone extends TimeZone {
  readonly id: TimeZoneId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedTimeZone;
}

export abstract class TimeZone {
  private readonly _props: TimeZoneProps;

  constructor(props: TimeZoneProps) {
    this._props = { ...props, clientId: props.clientId || (randomUUID() as TimeZoneClientId) };
  }

  static rehydrate(props: TimeZoneHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level TimeZone.rehydrate() call!
    return new PersistedTimeZoneImpl(props);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get alpha2Code() {
    return this._props.alpha2Code;
  }

  get gmtOffset() {
    return this._props.gmtOffset;
  }

  get countryId() {
    return this._props.countryId;
  }

  get clientId() {
    return this._props.clientId;
  }
  // #endregion getters
}

class PersistedTimeZoneImpl extends TimeZone {
  private readonly _id: TimeZoneId;
  private readonly _createdAt: Date;

  constructor(props: TimeZoneHydrationProps) {
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

  isPersisted(): this is PersistedTimeZone {
    return true;
  }
}
