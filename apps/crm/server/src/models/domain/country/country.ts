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
  private readonly _props: CountryProps;

  constructor(props: CountryProps) {
    this._props = { ...props };
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
    return this._props.numCode;
  }

  get alpha2Code() {
    return this._props.alpha2Code;
  }

  get alpha3Code() {
    return this._props.alpha3Code;
  }

  get shortName() {
    return this._props.shortName;
  }

  get nationality() {
    return this._props.nationality;
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
