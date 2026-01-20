import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { ContactId } from '../contact.types.js';
import type { ContactNoteId } from './note.types.js';

import { randomUUID, type UUID as UUIDv4 } from 'node:crypto';

type ContactNoteProps = {
  content: string;
  contact: ContactId;
  createdBy: UserProfileId;
  symbol?: UUIDv4;
};

export type ContactNoteCreateProps = ContactNoteProps;
export type ContactNoteHydrationProps = ContactNoteCreateProps & { id: ContactNoteId; createdAt: Date };

export type NewContactNote = InstanceType<typeof NewContactNoteImpl>;
export type PersistedContactNote = InstanceType<typeof PersistedContactNoteImpl>;

export abstract class ContactNote {
  private readonly _createdBy: UserProfileId;
  private readonly _contact: ContactId;
  private readonly _symbol: UUIDv4;
  private _content: string;

  protected constructor(props: ContactNoteProps) {
    this._content = props.content;
    this._createdBy = props.createdBy;
    this._contact = props.contact;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: ContactNoteCreateProps): NewContactNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level ContactNote.create() call!
    return new NewContactNoteImpl(props) as NewContactNote;
  }

  static rehydrate(props: ContactNoteHydrationProps): PersistedContactNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level ContactNote.rehydrate() call!
    return new PersistedContactNoteImpl(props);
  }

  abstract isPersisted(): boolean;

  get content() {
    return this._content;
  }

  get createdBy() {
    return this._createdBy;
  }

  get contact() {
    return this._contact;
  }

  get symbol() {
    return this._symbol;
  }
}

class NewContactNoteImpl extends ContactNote {
  constructor(props: ContactNoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedContactNoteImpl {
    return false;
  }
}

class PersistedContactNoteImpl extends ContactNote {
  private readonly _id: ContactNoteId;
  private readonly _createdAt: Date;

  constructor(props: ContactNoteHydrationProps) {
    const { contact, content, createdBy } = props;
    super({ contact, content, createdBy });
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedContactNoteImpl {
    return true;
  }
}
