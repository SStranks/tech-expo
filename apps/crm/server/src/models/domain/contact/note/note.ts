import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { ContactId } from '../contact.types.js';
import type { ContactNoteClientId, ContactNoteId } from './note.types.js';

import { randomUUID } from 'node:crypto';

type ContactNoteProps = {
  content: string;
  contactId: ContactId;
  createdByUserProfileId: UserProfileId;
  clientId?: ContactNoteClientId;
};

export type ContactNoteCreateProps = ContactNoteProps;
export type ContactNoteHydrationProps = ContactNoteCreateProps & { id: ContactNoteId; createdAt: Date };
export type ContactNoteUpdateProps = Partial<ContactNoteProps> & { id: ContactNoteId };

export interface NewContactNote extends ContactNote {
  isPersisted(): this is PersistedContactNote;
}

export interface PersistedContactNote extends ContactNote {
  readonly id: ContactNoteId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedContactNote;
}

class ContactNoteState {
  dirtyFields: Set<keyof ContactNoteProps> = new Set();
}

export abstract class ContactNote {
  private readonly _props: ContactNoteProps & { clientId: ContactNoteClientId };
  protected _internal: ContactNoteState;

  protected constructor(props: ContactNoteProps, newNote?: NewContactNoteImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as ContactNoteClientId) };
    this._internal = newNote?._internal ?? new ContactNoteState();
  }

  static create(props: ContactNoteCreateProps): NewContactNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level ContactNote.create() call!
    return new NewContactNoteImpl(props);
  }

  static rehydrate(props: ContactNoteHydrationProps): PersistedContactNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level ContactNote.rehydrate() call!
    return new PersistedContactNoteImpl(props);
  }

  static promote(newNote: NewContactNoteImpl, persisted: { id: ContactNoteId; createdAt: Date }): PersistedContactNote {
    const props = { ...newNote._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level ContactNote.promote() call!
    return new PersistedContactNoteImpl(props, newNote);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get content() {
    return this._props.content;
  }

  get createdByUserProfileId() {
    return this._props.createdByUserProfileId;
  }

  get contactId() {
    return this._props.contactId;
  }

  get clientId(): ContactNoteClientId {
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

  getDirtyRootFields(): (keyof ContactNoteProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<ContactNoteProps> {
    const update: Partial<ContactNoteProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof ContactNoteProps>(key: K) => {
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

  updateNote(input: ContactNoteUpdateProps) {
    if (input.content !== undefined) this.changeContent(input.content);
  }

  changeContent(newContent: string) {
    if (this._props.content === newContent) return;
    const content = newContent.trim();
    if (content.length === 0) throw new Error('Contact note cannot be empty');
    this._props.content = content;
    this._internal.dirtyFields.add('content');
  }
}

class NewContactNoteImpl extends ContactNote {
  constructor(props: ContactNoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedContactNote {
    return false;
  }
}

class PersistedContactNoteImpl extends ContactNote {
  private readonly _id: ContactNoteId;
  private readonly _createdAt: Date;

  constructor(props: ContactNoteHydrationProps, newNote?: NewContactNoteImpl) {
    super(props, newNote);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedContactNote {
    return true;
  }
}
