import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { ContactId } from '../contact.types.js';
import type { ContactNoteId } from './note.types.js';

import { randomUUID, type UUID as UUIDv4 } from 'node:crypto';

type ContactNoteProps = {
  content: string;
  contactId: ContactId;
  createdByUserProfileId: UserProfileId;
  symbol?: UUIDv4;
};

export type ContactNoteCreateProps = ContactNoteProps;
export type ContactNoteHydrationProps = ContactNoteCreateProps & { id: ContactNoteId; createdAt: Date };

export type NewContactNote = InstanceType<typeof NewContactNoteImpl>;
export type PersistedContactNote = InstanceType<typeof PersistedContactNoteImpl>;

export abstract class ContactNote {
  private readonly _createdByUserProfileId: UserProfileId;
  private readonly _contactId: ContactId;
  private readonly _symbol: UUIDv4;
  private _content: string;

  protected constructor(props: ContactNoteProps) {
    this._content = props.content;
    this._createdByUserProfileId = props.createdByUserProfileId;
    this._contactId = props.contactId;
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

  get createdByUserProfileId() {
    return this._createdByUserProfileId;
  }

  get contactId() {
    return this._contactId;
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
    const { contactId: contact, content, createdByUserProfileId: createdBy } = props;
    super({ contactId: contact, content, createdByUserProfileId: createdBy });
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
