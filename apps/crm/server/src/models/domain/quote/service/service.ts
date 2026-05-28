import type { QuoteId } from '../quote.types.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service.types.js';

import { randomUUID } from 'node:crypto';

type QuoteServiceProps = {
  clientGeneratedId: QuoteServiceClientGeneratedId;
  discount: number;
  price: string;
  quantity: number;
  quoteId: QuoteId;
  title: string;
  totalAmount: string;
};

export type QuoteServiceCreateProps = Omit<QuoteServiceProps, 'clientGeneratedId'> & {
  clientGeneratedId?: QuoteServiceClientGeneratedId;
};
export type QuoteServiceHydrationProps = QuoteServiceCreateProps & {
  id: QuoteServiceId;
  clientGeneratedId: QuoteServiceClientGeneratedId;
  createdAt: Date;
};
export type QuoteServiceUpdateProps = Partial<QuoteServiceProps> & { id: QuoteServiceId };

export interface NewQuoteService extends QuoteService {
  readonly clientGeneratedId: QuoteServiceClientGeneratedId;
  isPersisted(): this is PersistedQuoteService;
}

export interface PersistedQuoteService extends QuoteService {
  readonly id: QuoteServiceId;
  readonly clientGeneratedId: QuoteServiceClientGeneratedId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedQuoteService;
}

class QuoteServiceState {
  dirtyFields: Set<keyof QuoteServiceProps> = new Set();
}

export abstract class QuoteService {
  private readonly _props: QuoteServiceProps & { clientGeneratedId: QuoteServiceClientGeneratedId };
  protected _internal: QuoteServiceState;

  constructor(props: QuoteServiceProps, newQuoteService?: NewQuoteServiceImpl) {
    this._props = { ...props };
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

  static promote(
    newQuoteService: NewQuoteServiceImpl,
    persisted: { id: QuoteServiceId; clientGeneratedId: QuoteServiceClientGeneratedId; createdAt: Date }
  ) {
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
  // Domain actions – Service
  // --------------------------
  // #region actions/service

  updateService(_input: QuoteServiceUpdateProps) {
    // if (input.discount !== undefined) this.changeContent(input.content);
    // if (input.price !== undefined) this.changeContent(input.content);
    // if (input.quantity !== undefined) this.changeContent(input.content);
    // if (input.title !== undefined) this.changeContent(input.content);
    // if (input.totalAmount !== undefined) this.changeContent(input.content);
  }
  // #endregion actions/service
}

class NewQuoteServiceImpl extends QuoteService {
  constructor(props: QuoteServiceCreateProps) {
    const clientGeneratedId = props.clientGeneratedId ?? (randomUUID() as QuoteServiceClientGeneratedId);

    super({ ...props, clientGeneratedId });
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
