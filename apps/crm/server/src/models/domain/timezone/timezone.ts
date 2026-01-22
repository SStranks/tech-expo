import type { UUID as UUIDv4 } from 'node:crypto';

import type { CountryId } from '../country/country.types.js';
import type { TimeZoneId } from './timezone.types.js';

import { randomUUID } from 'node:crypto';

type TimeZoneProps = {
  alpha2Code: string;
  gmtOffset: string;
  country: CountryId;
  symbol?: UUIDv4;
};

type TimeZoneHydrationProps = TimeZoneProps & { id: TimeZoneId; createdAt: Date };

export abstract class TimeZone {
  private readonly _alpha2Code: string;
  private readonly _gmtOffset: string;
  private readonly _country: CountryId;
  private readonly _symbol: UUIDv4;

  constructor(props: TimeZoneProps) {
    this._alpha2Code = props.alpha2Code;
    this._gmtOffset = props.gmtOffset;
    this._country = props.country;
    this._symbol = props.symbol || randomUUID();
  }

  static rehydrate(props: TimeZoneHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level TimeZone.rehydrate() call!
    return new PersistedTimeZoneImpl(props);
  }

  get alpha2Code() {
    return this._alpha2Code;
  }

  get gmtOffset() {
    return this._gmtOffset;
  }

  get country() {
    return this._country;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
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

  isPersisted(): this is PersistedTimeZoneImpl {
    return true;
  }
}

// type TimeZoneTableSelect = {
//     id: string & {
//         __uuid?: undefined;
//     };
// alpha2Code: string;
// gmtOffset: string;
// countryId: string & {
//     __uuid?: undefined;
// };
// }
