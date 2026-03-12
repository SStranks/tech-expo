import type { QuoteId } from '../quote.types.js';
import type { QuoteServiceClientId, QuoteServiceId } from './service.types.js';

import { randomUUID } from 'node:crypto';

type QuoteServiceProps = {
  title: string;
  totalAmount: string;
  price: string;
  quantity: number;
  discount: string;
  quoteId: QuoteId;
  clientId?: QuoteServiceClientId;
};

export type QuoteServiceCreateProps = QuoteServiceProps;
export type QuoteServiceHydrationProps = QuoteServiceCreateProps & { id: QuoteServiceId; createdAt: Date };
export type QuoteServiceUpdateProps = Partial<QuoteServiceProps> & { id: QuoteServiceId };

export interface NewQuoteService extends QuoteService {
  isPersisted(): this is PersistedQuoteService;
}

export interface PersistedQuoteService extends QuoteService {
  readonly id: QuoteServiceId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedQuoteService;
}

class QuoteServiceState {
  dirtyFields: Set<keyof QuoteServiceProps> = new Set();
}

export abstract class QuoteService {
  private readonly _props: QuoteServiceProps & { clientId: QuoteServiceClientId };
  protected _internal: QuoteServiceState;

  constructor(props: QuoteServiceProps, newQuoteService?: NewQuoteServiceImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as QuoteServiceClientId) };
    this._internal = newQuoteService?._internal ?? new QuoteServiceState();
  }

  static create(props: QuoteServiceCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteService.create() call!
    return new NewQuoteServiceImpl(props);
  }

  static rehydrate(props: QuoteServiceHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteService.rehydrate() call!
    return new PersistedQuoteServiceImpl(props);
  }

  static promote(newQuoteService: NewQuoteServiceImpl, persisted: { id: QuoteServiceId; createdAt: Date }) {
    const props = { ...newQuoteService._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level QuoteService.promote() call!
    return new PersistedQuoteServiceImpl(props, newQuoteService);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get title() {
    return this._props.title;
  }

  get total() {
    return this._props.totalAmount;
  }

  get price() {
    return this._props.price;
  }

  get quantity() {
    return this._props.quantity;
  }

  get discount() {
    return this._props.discount;
  }

  get quoteId() {
    return this._props.quoteId;
  }

  get clientId(): QuoteServiceClientId {
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

  getDirtyRootFields(): (keyof QuoteServiceProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<QuoteServiceProps> {
    const update: Partial<QuoteServiceProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof QuoteServiceProps>(key: K) => {
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

  updateNote(_input: QuoteServiceUpdateProps) {}
}

class NewQuoteServiceImpl extends QuoteService {
  constructor(props: QuoteServiceCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedQuoteService {
    return false;
  }
}

class PersistedQuoteServiceImpl extends QuoteService {
  private readonly _id: QuoteServiceId;
  private readonly _createdAt: Date;

  constructor(props: QuoteServiceHydrationProps, newQuoteService?: NewQuoteServiceImpl) {
    super(props, newQuoteService);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedQuoteService {
    return true;
  }
}
