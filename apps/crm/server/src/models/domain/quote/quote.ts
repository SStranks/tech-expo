import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { NewQuoteNote, PersistedQuoteNote, QuoteNoteCreateProps, QuoteNoteUpdateProps } from './note/note.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from './note/note.types.js';
import type { QuoteClientGeneratedId, QuoteId, QuoteStage } from './quote.types.js';
import type {
  NewQuoteService,
  PersistedQuoteService,
  QuoteServiceCreateProps,
  QuoteServiceUpdateProps,
} from './service/service.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service/service.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { randomUUID } from 'node:crypto';

import { QuoteNote } from './note/note.js';
import { QuoteService } from './service/service.js';

type QuoteProps = {
  clientGeneratedId: QuoteClientGeneratedId;
  companyId: CompanyId;
  dueAt: Date | null;
  issuedAt: Date | null;
  preparedByUserProfileId: UserProfileId;
  preparedForContactId: ContactId;
  salesTax: string;
  stage: QuoteStage;
  title: string;
  totalAmount: string;
};

type QuoteCreateProps = Omit<
  QuoteProps,
  'dueAt' | 'issuedAt' | 'salesTax' | 'stage' | 'totalAmount' | 'clientGeneratedId'
> & {
  clientGeneratedId?: QuoteClientGeneratedId;
};
// type QuoteUpdateProps = QuoteProps;
type QuoteHydrationProps = QuoteProps & { id: QuoteId; clientGeneratedId: QuoteClientGeneratedId; createdAt: Date };

export interface NewQuote extends Quote {
  readonly clientGeneratedId: QuoteClientGeneratedId;
  isPersisted(): this is PersistedQuote;
}

export interface PersistedQuote extends Quote {
  readonly id: QuoteId;
  readonly clientGeneratedId: QuoteClientGeneratedId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedQuote;
}

class QuoteState {
  noteById: Map<QuoteNoteId, PersistedQuoteNote> = new Map();
  noteByClientGeneratedId: Map<QuoteNoteClientGeneratedId, QuoteNoteId> = new Map();
  addedNotes: Map<QuoteNoteClientGeneratedId, NewQuoteNote> = new Map();
  removedNoteIds: Set<QuoteNoteId> = new Set();
  updatedNotes: Map<QuoteNoteId, PersistedQuoteNote> = new Map();
  serviceById: Map<QuoteServiceId, PersistedQuoteService> = new Map();
  serviceByClientGeneratedId: Map<QuoteServiceClientGeneratedId, QuoteServiceId> = new Map();
  addedServices: Map<QuoteServiceClientGeneratedId, NewQuoteService> = new Map();
  removedServiceIds: Set<QuoteServiceId> = new Set();
  updatedServices: Map<QuoteServiceId, PersistedQuoteService> = new Map();
  dirtyFields: Set<keyof QuoteProps> = new Set();
}

export abstract class Quote {
  private readonly _props: QuoteProps & { clientGeneratedId: QuoteClientGeneratedId };
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

  static promote(
    newQuote: NewQuoteImpl,
    persisted: { id: QuoteId; clientGeneratedId: QuoteClientGeneratedId; createdAt: Date }
  ): PersistedQuote {
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

  get companyId() {
    return this._props.companyId;
  }

  get totalAmount() {
    return this._props.totalAmount;
  }

  get salesTax() {
    return this._props.salesTax;
  }

  get stage() {
    return this._props.stage;
  }

  get preparedForContactId() {
    return this._props.preparedForContactId;
  }

  get preparedByUserProfileId() {
    return this._props.preparedByUserProfileId;
  }

  get issuedAt() {
    return this._props.issuedAt;
  }

  get dueAt() {
    return this._props.dueAt;
  }

  get clientGeneratedId() {
    return this._props.clientGeneratedId;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof QuoteProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<QuoteProps> {
    const update: Partial<QuoteProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof QuoteProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }

  pullNoteChanges() {
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
      this._internal.noteByClientGeneratedId.set(note.clientGeneratedId, note.id);
    }

    this._internal.addedNotes.clear();
    this._internal.updatedNotes.clear();
    this._internal.removedNoteIds.clear();
  }

  // --------------------------
  // Domain actions – Quote
  // --------------------------
  // #region actions/quote

  updateProfile(_input: Partial<Omit<QuoteCreateProps, 'id'>>) {
    // if (input.companyId !== undefined) this.changeFirstName(input.firstName);
    // if (input.preparedByUserProfileId !== undefined) this.changeFirstName(input.firstName);
    // if (input.companyId !== undefined) this.changeFirstName(input.firstName);
    // if (input.companyId !== undefined) this.changeFirstName(input.firstName);
  }

  updateQuote(_input: unknown) {}
  // #endregion actions/quote

  // --------------------------
  // Domain actions – Quote Service
  // --------------------------
  // #region actions/services

  addService(props: QuoteServiceCreateProps): NewQuoteService {
    const quoteService = QuoteService.create(props);
    this._internal.addedServices.set(quoteService.clientGeneratedId, quoteService);
    return quoteService;
  }

  updateService(props: QuoteServiceUpdateProps, actor: UserProfileId): PersistedQuoteService {
    const service = this._internal.serviceById.get(props.id);
    if (!service) throw new DomainError({ message: 'Quote-service not found' });
    if (this.preparedByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-service not created by this user' });

    service.updateService(props);
    this._internal.updatedServices.set(service.id, service);
    return service;
  }

  removeService(id: QuoteServiceId, actor: UserProfileId) {
    const service = this._internal.serviceById.get(id);
    if (!service) throw new DomainError({ message: 'Quote-service not found' });
    if (this.preparedByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-service not created by this user' });

    this._internal.removedServiceIds.add(id);
    this._internal.serviceById.delete(id);
    this._internal.serviceByClientGeneratedId.delete(service.clientGeneratedId);
  }

  findServiceByClientId(clientId: QuoteServiceClientGeneratedId) {
    return this._internal.serviceByClientGeneratedId.get(clientId);
  }

  getServiceByClientId(clientId: QuoteServiceClientGeneratedId) {
    const quoteServiceId = this.findServiceByClientId(clientId);
    if (!quoteServiceId) throw new DomainError({ message: 'Quote-service not found' });
    const quoteService = this._internal.serviceById.get(quoteServiceId);
    if (!quoteService) throw new DomainError({ message: 'Quote-service not found' });
    return quoteService;
  }
  // #endregion actions/services

  // --------------------------
  // Domain actions – Quote Note
  // --------------------------
  // #region actions/notes

  addNote(props: QuoteNoteCreateProps): NewQuoteNote {
    const note = QuoteNote.create(props);
    this._internal.addedNotes.set(note.clientGeneratedId, note);
    return note;
  }

  updateNote(props: QuoteNoteUpdateProps, actor: UserProfileId): PersistedQuoteNote {
    const note = this._internal.noteById.get(props.id);
    if (!note) throw new DomainError({ message: 'Quote-note not found' });
    if (this.preparedByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-note not created by this user' });

    note.updateNote(props);
    this._internal.updatedNotes.set(note.id, note);
    return note;
  }

  removeNote(id: QuoteNoteId, actor: UserProfileId) {
    const note = this._internal.noteById.get(id);
    if (!note) throw new DomainError({ message: 'Quote-note not found' });
    if (this.preparedByUserProfileId !== actor)
      throw new DomainError({ message: 'Quote-note not created by this user' });

    this._internal.removedNoteIds.add(id);
    this._internal.noteById.delete(id);
    this._internal.noteByClientGeneratedId.delete(note.clientGeneratedId);
  }

  findNoteByClientId(clientId: QuoteNoteClientGeneratedId) {
    return this._internal.noteByClientGeneratedId.get(clientId);
  }

  getNoteByClientId(clientId: QuoteNoteClientGeneratedId) {
    const quoteNoteId = this.findNoteByClientId(clientId);
    if (!quoteNoteId) throw new DomainError({ message: 'Quote-note not found' });
    const quoteNote = this._internal.noteById.get(quoteNoteId);
    if (!quoteNote) throw new DomainError({ message: 'Quote-note not found' });
    return quoteNote;
  }
  // #endregion actions/notes
}

class NewQuoteImpl extends Quote {
  constructor(props: QuoteCreateProps) {
    const clientGeneratedId = props.clientGeneratedId ?? (randomUUID() as QuoteClientGeneratedId);

    super({
      ...props,
      clientGeneratedId,
      dueAt: null,
      issuedAt: null,
      salesTax: '20.00',
      stage: 'DRAFT',
      totalAmount: '0.00',
    });
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
