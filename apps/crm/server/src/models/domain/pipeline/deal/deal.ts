import type { UUID as UUIDv4 } from 'node:crypto';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { PipelineStageId } from '../stage/stage.types.js';
import type { PipelineDealId } from './deal.types.js';

import { randomUUID } from 'node:crypto';

type DealProps = {
  companyId: CompanyId;
  orderKey: string;
  title: string;
  stageId: PipelineStageId;
  value: string;
  dealOwner: UserProfileId;
  dealContact: ContactId;
  symbol?: UUIDv4;
};

type DealCreateProps = DealProps;
type DealHydrationProps = DealCreateProps & { id: PipelineDealId; createdAt: Date };

export type NewDeal = InstanceType<typeof NewDealImpl>;
export type PersistedDeal = InstanceType<typeof PersistedDealImpl>;

export abstract class Deal {
  private readonly _companyId: CompanyId;
  private readonly _symbol: UUIDv4;
  private _orderKey: string;
  private _title: string;
  private _stageId: PipelineStageId;
  private _value: string;
  private _dealOwner: UserProfileId;
  private _dealContact: ContactId;

  constructor(props: DealProps) {
    this._companyId = props.companyId;
    this._orderKey = props.orderKey;
    this._title = props.title;
    this._stageId = props.stageId;
    this._value = props.value;
    this._dealOwner = props.dealOwner;
    this._dealContact = props.dealContact;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: DealCreateProps): NewDeal {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Deal.create() call!
    return new NewDealImpl(props);
  }

  static rehydrate(props: DealHydrationProps): PersistedDeal {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Deal.rehydrate() call!
    return new PersistedDealImpl(props);
  }

  get companyId() {
    return this._companyId;
  }

  get orderKey() {
    return this._orderKey;
  }

  get title() {
    return this._title;
  }

  get stageId() {
    return this._stageId;
  }

  get value() {
    return this._value;
  }

  get dealOwner() {
    return this._dealOwner;
  }

  get dealContact() {
    return this._dealContact;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
}

class NewDealImpl extends Deal {
  constructor(props: DealCreateProps) {
    super(props);
  }

  isPersisted(): this is NewDealImpl {
    return false;
  }
}

class PersistedDealImpl extends Deal {
  private readonly _id: PipelineDealId;
  private readonly _createdAt: Date;

  constructor(props: DealHydrationProps) {
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

  isPersisted(): this is NewDealImpl {
    return false;
  }
}
