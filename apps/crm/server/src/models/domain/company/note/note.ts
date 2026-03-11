import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CompanyId } from '../company.types.js';
import type { CompanyNoteClientId, CompanyNoteId } from './note.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { randomUUID } from 'node:crypto';

type CompanyNoteProps = {
  content: string;
  companyId: CompanyId;
  createdByUserProfileId: UserProfileId;
  clientId?: CompanyNoteClientId;
};

export type CompanyNoteCreateProps = CompanyNoteProps;
export type CompanyNoteHydrationProps = CompanyNoteCreateProps & {
  id: CompanyNoteId;
  createdAt: Date;
};

export interface NewCompanyNote extends CompanyNote {
  isPersisted(): this is PersistedCompanyNote;
}

export interface PersistedCompanyNote extends CompanyNote {
  readonly id: CompanyNoteId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedCompanyNote;
}

class CompanyNoteState {}

export abstract class CompanyNote {
  private readonly _props: CompanyNoteProps & { clientId: CompanyNoteClientId };
  protected _internal: CompanyNoteState;

  protected constructor(props: CompanyNoteProps, newNote?: NewCompanyNoteImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as CompanyNoteClientId) };
    this._internal = newNote?._internal ?? new CompanyNoteState();
  }

  static create(props: CompanyNoteCreateProps): NewCompanyNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level CompanyNote.create() call!
    return new NewCompanyNoteImpl(props);
  }

  static rehydrate(props: CompanyNoteHydrationProps): PersistedCompanyNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level CompanyNote.rehydrate() call!
    return new PersistedCompanyNoteImpl(props);
  }

  static promote(newNote: NewCompanyNoteImpl, persisted: { id: CompanyNoteId; createdAt: Date }): PersistedCompanyNote {
    const props = { ...newNote._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.promote() call!
    return new PersistedCompanyNoteImpl(props, newNote);
  }

  abstract isPersisted(): boolean;

  get content() {
    return this._props.content;
  }

  get createdByUserProfileId() {
    return this._props.createdByUserProfileId;
  }

  get companyId() {
    return this._props.companyId;
  }

  get clientId(): CompanyNoteClientId {
    return this._props.clientId;
  }

  updateContent(newMessage: string, actor: UserProfileId) {
    if (this.createdByUserProfileId !== actor)
      throw new DomainError({ message: 'Company-note not created by this user' });

    if (!newMessage || newMessage.trim() === '') throw new DomainError({ message: 'Message cannot be empty' });

    this._props.content = newMessage;
  }
}

class NewCompanyNoteImpl extends CompanyNote {
  constructor(props: CompanyNoteCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCompanyNote {
    return false;
  }
}

class PersistedCompanyNoteImpl extends CompanyNote {
  private readonly _id: CompanyNoteId;
  private readonly _createdAt: Date;

  constructor(props: CompanyNoteHydrationProps, newNote?: NewCompanyNoteImpl) {
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

  isPersisted(): this is PersistedCompanyNote {
    return true;
  }
}
