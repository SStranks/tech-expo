import type { UUID as UUIDv4 } from 'node:crypto';

import type { QuoteId } from '../quote.types.js';
import type { QuoteServiceId } from './service.types.js';

import { randomUUID } from 'node:crypto';

type ServiceProps = {
  title: string;
  totalAmount: string;
  price: string;
  quantity: number;
  discount: string;
  quoteId: QuoteId;
  symbol?: UUIDv4;
};

type ServiceCreateProps = ServiceProps;
type ServiceHydrationProps = ServiceCreateProps & { id: QuoteServiceId; createdAt: Date };

export type NewService = InstanceType<typeof NewServiceImpl>;
export type PersistedService = InstanceType<typeof PersistedServiceImpl>;

export abstract class Service {
  private _title: string;
  private _totalAmount: string;
  private _price: string;
  private _quantity: number;
  private _discount: string;
  private _quoteId: QuoteId;
  private readonly _symbol: UUIDv4;

  constructor(props: ServiceProps) {
    this._title = props.title;
    this._totalAmount = props.totalAmount;
    this._price = props.price;
    this._quantity = props.quantity;
    this._discount = props.discount;
    this._quoteId = props.quoteId;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: ServiceCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Service.create() call!
    return new NewServiceImpl(props);
  }

  static rehydrate(props: ServiceHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Service.rehydrate() call!
    return new PersistedServiceImpl(props);
  }

  get title() {
    return this._title;
  }

  get total() {
    return this._totalAmount;
  }

  get price() {
    return this._price;
  }

  get quantity() {
    return this._quantity;
  }

  get discount() {
    return this._discount;
  }

  get quoteId() {
    return this._quoteId;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
}

class NewServiceImpl extends Service {
  constructor(props: ServiceCreateProps) {
    super(props);
  }

  isPersisted(): this is NewServiceImpl {
    return false;
  }
}

class PersistedServiceImpl extends Service {
  private readonly _id: QuoteServiceId;
  private readonly _createdAt: Date;

  constructor(props: ServiceHydrationProps) {
    super(props);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedServiceImpl {
    return true;
  }
}

// type QuoteServicesTableSelect = {
//     id: string & {
//         __uuid?: undefined;
//     };
//     title: string;
//     createdAt: Date;
//     total: string;
//     price: string;
//     quantity: number;
//     discount: string;
//     quoteId: string & {
//         __uuid?: undefined;
//     };
// }
