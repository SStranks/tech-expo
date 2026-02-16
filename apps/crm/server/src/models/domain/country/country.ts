import type { CountryId } from './country.types.js';

type CountryProps = {
  numCode: number;
  alpha2Code: string;
  alpha3Code: string;
  shortName: string;
  nationality: string;
};

type NewCountryProps = CountryProps;
type CountryHydrationProps = NewCountryProps & { id: CountryId };

export interface PersistedCountry extends Country {
  readonly id: CountryId;
  isPersisted(): this is PersistedCountry;
}

export abstract class Country {
  private readonly _numCode: number;
  private readonly _alpha2Code: string;
  private readonly _alpha3Code: string;
  private readonly _shortName: string;
  private readonly _nationality: string;

  constructor(props: CountryProps) {
    this._numCode = props.numCode;
    this._alpha2Code = props.alpha2Code;
    this._alpha3Code = props.alpha3Code;
    this._shortName = props.shortName;
    this._nationality = props.nationality;
  }

  static rehydrate(props: CountryHydrationProps): PersistedCountry {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Country.rehydrate() call!
    return new PersistedCountryImpl(props);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get numCode() {
    return this._numCode;
  }

  get alpha2Code() {
    return this._alpha2Code;
  }

  get alpha3Code() {
    return this._alpha3Code;
  }

  get shortName() {
    return this._shortName;
  }

  get nationality() {
    return this._nationality;
  }
  // #endregion getters
}

class PersistedCountryImpl extends Country {
  private readonly _id: CountryId;

  constructor(props: CountryHydrationProps) {
    super(props);
    this._id = props.id;
  }

  get id() {
    return this._id;
  }

  isPersisted(): this is PersistedCountry {
    return true;
  }
}
