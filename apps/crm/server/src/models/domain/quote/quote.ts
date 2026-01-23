import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { QuoteId, QuoteStage } from './quote.types.js';

type QuoteProps = {
  title: string;
  createdAt: Date;
  company: string;
  total: string;
  salesTax: string;
  stage: QuoteStage;
  preparedFor: ContactId;
  preparedBy: UserProfileId;
  issuedAt: Date | null;
  dueAt: Date | null;
};

type QuoteCreateProps = QuoteProps;
type QuoteHydrationProps = QuoteCreateProps & { id: QuoteId; createdAt: Date };

export type NewQuote = InstanceType<typeof NewQuoteImpl>;
export type PersistedQuote = InstanceType<typeof PersistedQuoteImpl>;

export abstract class Quote {
  private _title: string;
  private _company: string;
  private _total: string;
  private _salesTax: string;
  private _stage: QuoteStage;
  private _preparedFor: ContactId;
  private _preparedBy: UserProfileId;
  private _issuedAt: Date | null;
  private _dueAt: Date | null;

  private _rootDirty: boolean = false;

  constructor(props: QuoteProps) {
    this._title = props.title;
    this._company = props.company;
    this._total = props.total;
    this._salesTax = props.salesTax;
    this._stage = props.stage;
    this._preparedFor = props.preparedFor;
    this._preparedBy = props.preparedBy;
    this._issuedAt = props.issuedAt;
    this._dueAt = props.dueAt;
  }

  static create(props: QuoteCreateProps): NewQuote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Quote.create() call!
    return new NewQuoteImpl(props);
  }

  static rehydrate(props: QuoteHydrationProps): PersistedQuote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Quote.create() call!
    return new PersistedQuoteImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get title() {
    return this._title;
  }

  get company() {
    return this._company;
  }

  get total() {
    return this._total;
  }

  get salesTax() {
    return this._salesTax;
  }

  get stage() {
    return this._stage;
  }

  get preparedFor() {
    return this._preparedFor;
  }

  get preparedBy() {
    return this._preparedBy;
  }

  get issuedAt() {
    return this._issuedAt;
  }

  get dueAt() {
    return this._dueAt;
  }

  get isRootDirty() {
    return this._rootDirty;
  }
  // #endregion getters

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Profile updates
  // --------------------------
  // #region actions/profile
  // #endregion actions/profile

  // --------------------------
  // Domain actions – Quote Service
  // --------------------------
  // #region actions/notes
  // #endregion actions/notes

  // --------------------------
  // Domain actions – Quote Note
  // --------------------------
  // #region actions/notes
  // #endregion actions/notes
}

class NewQuoteImpl extends Quote {
  constructor(props: QuoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedQuoteImpl {
    return false;
  }
}

class PersistedQuoteImpl extends Quote {
  private readonly _id: QuoteId;
  private readonly _createdAt: Date;

  constructor(props: QuoteHydrationProps) {
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

  isPersisted(): this is PersistedQuoteImpl {
    return true;
  }
}

// id: UUID;
// title: string;
// createdAt: Date;
// company: string;
// total: string;
// salesTax: string;
// stage: 'DRAFT' | 'SENT' | 'ACCEPTED';
// preparedFor: UUID;
// preparedBy: UUID;
// issuedAt: Date | null;
// dueAt: Date | null;
