import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { QuoteId } from '../quote.types.js';
import type { QuoteNoteClientId, QuoteNoteId } from './note.types.js';

import { randomUUID } from 'node:crypto';

type QuoteNoteProps = {
  content: string;
  quote: QuoteId;
  createdByUserProfileId: UserProfileId;
  clientId?: QuoteNoteClientId;
};

export type QuoteNoteCreateProps = QuoteNoteProps;
export type QuoteNoteHydrationProps = QuoteNoteProps & { id: QuoteNoteId; createdAt: Date };
export type QuoteNoteUpdateProps = Partial<QuoteNoteProps> & { id: QuoteNoteId };

export interface NewQuoteNote extends QuoteNote {
  isPersisted(): this is PersistedQuoteNote;
}

export interface PersistedQuoteNote extends QuoteNote {
  readonly id: QuoteNoteId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedQuoteNote;
}

class QuoteNoteState {
  dirtyFields: Set<keyof QuoteNoteProps> = new Set();
}

export abstract class QuoteNote {
  private readonly _props: QuoteNoteProps & { clientId: QuoteNoteClientId };
  protected _internal: QuoteNoteState;

  constructor(props: QuoteNoteProps, newQuoteNote?: NewQuoteNoteImpl) {
    this._props = { ...props, clientId: props.clientId || (randomUUID() as QuoteNoteClientId) };
    this._internal = newQuoteNote?._internal ?? new QuoteNoteState();
  }

  static create(props: QuoteNoteCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteNote.create() call!
    return new NewQuoteNoteImpl(props);
  }

  static rehydrate(props: QuoteNoteHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteNote.rehydrate() call!
    return new PersistedQuoteNoteImpl(props);
  }

  static promote(newNote: NewQuoteNoteImpl, persisted: { id: QuoteNoteId; createdAt: Date }): PersistedQuoteNote {
    const props = { ...newNote._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Contact.promote() call!
    return new PersistedQuoteNoteImpl(props, newNote);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get note() {
    return this._props.content;
  }

  get quote() {
    return this._props.quote;
  }

  get createdByUserProfileId() {
    return this._props.createdByUserProfileId;
  }

  get clientId(): QuoteNoteClientId {
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

  getDirtyRootFields(): (keyof QuoteNoteProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<QuoteNoteProps> {
    const update: Partial<QuoteNoteProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof QuoteNoteProps>(key: K) => {
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
  // Domain actions – Note
  // --------------------------
  // #region actions/note

  updateNote(input: QuoteNoteUpdateProps) {
    if (input.content !== undefined) this.changeContent(input.content);
  }

  changeContent(newContent: string) {
    if (this._props.content === newContent) return;
    const content = newContent.trim();
    if (content.length === 0) throw new Error('Quote-note cannot be empty');
    this._props.content = content;
    this._internal.dirtyFields.add('content');
  }
}

class NewQuoteNoteImpl extends QuoteNote {
  constructor(props: QuoteNoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedQuoteNote {
    return false;
  }
}

class PersistedQuoteNoteImpl extends QuoteNote {
  private readonly _id: QuoteNoteId;
  private readonly _createdAt: Date;

  constructor(props: QuoteNoteHydrationProps, newQuoteNote?: NewQuoteNoteImpl) {
    super(props, newQuoteNote);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedQuoteNote {
    return true;
  }
}
