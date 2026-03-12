import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { NewQuoteNote, PersistedQuoteNote, QuoteNoteCreateProps, QuoteNoteUpdateProps } from './note/note.js';
import type { QuoteNoteClientId, QuoteNoteId } from './note/note.types.js';
import type { QuoteId, QuoteStage } from './quote.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { QuoteNote } from './note/note.js';

type QuoteProps = {
  title: string;
  createdAt: Date;
  company: string;
  totalAmount: string;
  salesTax: string;
  stage: QuoteStage;
  preparedFor: ContactId;
  preparedBy: UserProfileId;
  issuedAt: Date | null;
  dueAt: Date | null;
};

type QuoteCreateProps = QuoteProps;
type QuoteHydrationProps = QuoteCreateProps & { id: QuoteId; createdAt: Date };

export interface NewQuote extends Quote {
  isPersisted(): this is PersistedQuote;
}

export interface PersistedQuote extends Quote {
  readonly id: QuoteId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedQuote;
}

class QuoteState {
  noteById: Map<QuoteNoteId, PersistedQuoteNote> = new Map();
  noteByClientId: Map<QuoteNoteClientId, QuoteNoteId> = new Map();
  addedNotes: Map<QuoteNoteClientId, NewQuoteNote> = new Map();
  removedNoteIds: Set<QuoteNoteId> = new Set();
  updatedNotes: Map<QuoteNoteId, PersistedQuoteNote> = new Map();
  dirtyFields: Set<keyof QuoteProps> = new Set();
}

export abstract class Quote {
  private readonly _props: QuoteProps;
  protected _internal: QuoteState;

  constructor(props: QuoteProps, newQuote?: NewQuoteImpl) {
    this._props = { ...props };
    this._internal = newQuote?._internal ?? new QuoteState();
  }

  static create(props: QuoteCreateProps): NewQuote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Quote.create() call!
    return new NewQuoteImpl(props);
  }

  static rehydrate(props: QuoteHydrationProps): PersistedQuote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Quote.create() call!
    return new PersistedQuoteImpl(props);
  }

  static promote(newQuote: NewQuoteImpl, persisted: { id: QuoteId; createdAt: Date }): PersistedQuote {
    const props = { ...newQuote._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Quote.promote() call!
    return new PersistedQuoteImpl(props, newQuote);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get title() {
    return this._props.title;
  }

  get company() {
    return this._props.company;
  }

  get total() {
    return this._props.totalAmount;
  }

  get salesTax() {
    return this._props.salesTax;
  }

  get stage() {
    return this._props.stage;
  }

  get preparedFor() {
    return this._props.preparedFor;
  }

  get preparedBy() {
    return this._props.preparedBy;
  }

  get issuedAt() {
    return this._props.issuedAt;
  }

  get dueAt() {
    return this._props.dueAt;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  pullChanges() {
    return {
      addedNotes: this._internal.addedNotes,
      removedNoteIds: this._internal.removedNoteIds,
      updatedNotes: this._internal.updatedNotes,
    };
  }
  // #endregion actions/internal

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit
  // #endregion actions/commit

  commit() {
    this._internal.dirtyFields.clear();
  }

  commitNotes(newNotes: PersistedQuoteNote[]) {
    for (const note of newNotes) {
      this._internal.noteById.set(note.id, note);
      this._internal.noteByClientId.set(note.clientId, note.id);
    }

    this._internal.addedNotes.clear();
    this._internal.updatedNotes.clear();
    this._internal.removedNoteIds.clear();
  }

  // --------------------------
  // Domain actions – Quote
  // --------------------------
  // #region actions/quote

  updateQuote(_input: unknown) {}
  // #endregion actions/quote

  // --------------------------
  // Domain actions – Quote Service
  // --------------------------
  // #region actions/notes
  // #endregion actions/notes

  // --------------------------
  // Domain actions – Quote Note
  // --------------------------
  // #region actions/notes

  addNote(props: QuoteNoteCreateProps): NewQuoteNote {
    const note = QuoteNote.create(props);
    this._internal.addedNotes.set(note.clientId, note);
    return note;
  }

  updateNote(props: QuoteNoteUpdateProps, actor: UserProfileId): PersistedQuoteNote {
    const note = this._internal.noteById.get(props.id);
    if (!note) throw new DomainError({ message: 'Quote-note not found' });
    if (props.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-note not created by this user' });

    note.updateNote(props);
    this._internal.updatedNotes.set(note.id, note);
    return note;
  }

  removeNote(id: QuoteNoteId, actor: UserProfileId) {
    const note = this._internal.noteById.get(id);
    if (!note) throw new DomainError({ message: 'Quote-note not found' });
    if (note.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-note not created by this user' });

    this._internal.removedNoteIds.add(id);
    this._internal.noteById.delete(id);
    this._internal.noteByClientId.delete(note.clientId);
  }

  findNoteByClientId(clientId: QuoteNoteClientId) {
    return this._internal.noteByClientId.get(clientId);
  }

  getNoteByClientId(clientId: QuoteNoteClientId) {
    const contactNoteUUID = this.findNoteByClientId(clientId);
    if (!contactNoteUUID) throw new DomainError({ message: 'Quote-note not found' });
    const contactNote = this._internal.noteById.get(contactNoteUUID);
    if (!contactNote) throw new DomainError({ message: 'Quote-note not found' });
    return contactNote;
  }
  // #endregion actions/notes
}

class NewQuoteImpl extends Quote {
  constructor(props: QuoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedQuote {
    return false;
  }
}

class PersistedQuoteImpl extends Quote {
  private readonly _id: QuoteId;
  private readonly _createdAt: Date;

  constructor(props: QuoteHydrationProps, newQuote?: NewQuoteImpl) {
    super(props, newQuote);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedQuote {
    return true;
  }
}
