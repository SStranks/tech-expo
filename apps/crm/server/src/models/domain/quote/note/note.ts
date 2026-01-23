import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { QuoteId } from '../quote.types.js';
import type { QuoteNoteId } from './note.types.js';

import { randomUUID, type UUID as UUIDv4 } from 'node:crypto';

type QuoteProps = {
  note: string;
  quote: QuoteId;
  createdByUserProfileId: UserProfileId;
  symbol?: UUIDv4;
};

type QuoteNoteCreateProps = QuoteProps;
type QuoteNoteHydrationProps = QuoteProps & { id: QuoteNoteId; createdAt: Date };

export type NewQuoteNote = InstanceType<typeof NewQuoteNoteImpl>;
export type PersistedQuoteNote = InstanceType<typeof PersistedQuoteNoteImpl>;

export abstract class QuoteNote {
  private readonly _quote: QuoteId;
  private readonly _createdByUserProfileId: UserProfileId;
  private readonly _symbol: UUIDv4;
  private _note: string;

  constructor(props: QuoteProps) {
    this._note = props.note;
    this._quote = props.quote;
    this._createdByUserProfileId = props.createdByUserProfileId;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: QuoteNoteCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteNote.create() call!
    return new NewQuoteNoteImpl(props);
  }

  static rehydrate(props: QuoteNoteHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteNote.rehydrate() call!
    return new PersistedQuoteNoteImpl(props);
  }

  get note() {
    return this._note;
  }

  get quote() {
    return this._quote;
  }

  get createdByUserProfileId() {
    return this._createdByUserProfileId;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
}

class NewQuoteNoteImpl extends QuoteNote {
  constructor(props: QuoteNoteCreateProps) {
    super(props);
  }

  isPersisted(): this is NewQuoteNoteImpl {
    return false;
  }
}

class PersistedQuoteNoteImpl extends QuoteNote {
  private readonly _id: QuoteNoteId;
  private readonly _createdAt: Date;

  constructor(props: QuoteNoteHydrationProps) {
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

  isPersisted(): this is PersistedQuoteNoteImpl {
    return true;
  }
}
