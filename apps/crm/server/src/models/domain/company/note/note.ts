import type { UUID as UUIDv4 } from 'node:crypto';

import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CompanyId } from '../company.types.js';
import type { CompanyNoteId } from './note.types.js';

import { randomUUID } from 'node:crypto';

type CompanyNoteProps = {
  content: string;
  company: CompanyId;
  createdBy: UserProfileId;
  symbol?: UUIDv4;
};

export type CompanyNoteCreateProps = CompanyNoteProps;
export type CompanyNoteHydrationProps = CompanyNoteCreateProps & {
  id: CompanyNoteId;
  createdAt: Date;
};

export type NewCompanyNote = InstanceType<typeof NewCompanyNoteImpl>;
export type PersistedCompanyNote = InstanceType<typeof PersistedCompanyNoteImpl>;

export abstract class CompanyNote {
  private readonly _createdBy: UserProfileId;
  private readonly _company: CompanyId;
  private readonly _symbol: UUIDv4;
  private _content: string;

  protected constructor(props: CompanyNoteProps) {
    this._content = props.content;
    this._createdBy = props.createdBy;
    this._company = props.company;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: CompanyNoteCreateProps): NewCompanyNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level CompanyNote.create() call!
    return new NewCompanyNoteImpl(props) as NewCompanyNote;
  }

  static rehydrate(props: CompanyNoteHydrationProps): PersistedCompanyNote {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level CompanyNote.rehydrate() call!
    return new PersistedCompanyNoteImpl(props);
  }

  abstract isPersisted(): boolean;

  get content() {
    return this._content;
  }

  get createdBy() {
    return this._createdBy;
  }

  get company() {
    return this._company;
  }

  get symbol() {
    return this._symbol;
  }
}

class NewCompanyNoteImpl extends CompanyNote {
  constructor(props: CompanyNoteCreateProps) {
    const { company, content, createdBy } = props;
    super({ company, content, createdBy });
  }

  isPersisted(): this is PersistedCompanyNoteImpl {
    return false;
  }
}

class PersistedCompanyNoteImpl extends CompanyNote {
  private readonly _id: CompanyNoteId;
  private readonly _createdAt: Date;

  constructor(props: CompanyNoteHydrationProps) {
    const { company, content, createdBy } = props;
    super({ company, content, createdBy });
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedCompanyNoteImpl {
    return true;
  }
}
