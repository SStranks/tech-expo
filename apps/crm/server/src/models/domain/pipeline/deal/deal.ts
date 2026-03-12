import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { PipelineStageId } from '../stage/stage.types.js';
import type { PipelineDealClientId, PipelineDealId } from './deal.types.js';

import { randomUUID } from 'node:crypto';

type PipelineDealProps = {
  companyId: CompanyId;
  orderKey: string;
  title: string;
  stageId: PipelineStageId;
  value: string;
  dealOwner: UserProfileId;
  dealContact: ContactId;
  clientId?: PipelineDealClientId;
};

export type PipelineDealCreateProps = PipelineDealProps;
export type PipelineDealHydrationProps = PipelineDealCreateProps & { id: PipelineDealId; createdAt: Date };
export type PipelineDealUpdateProps = Partial<PipelineDealProps> & { id: PipelineDealId };

export interface NewPipelineDeal extends PipelineDeal {
  isPersisted(): this is PersistedPipelineDeal;
}

export interface PersistedPipelineDeal extends PipelineDeal {
  readonly id: PipelineDealId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedPipelineDeal;
}

class PipelineDealState {
  dirtyFields: Set<keyof PipelineDealProps> = new Set();
}

export abstract class PipelineDeal {
  private readonly _props: PipelineDealProps & { clientId: PipelineDealClientId };
  protected _internal: PipelineDealState;

  constructor(props: PipelineDealProps, newPipelineDeal?: NewPipelineDealImpl) {
    this._props = { ...props, clientId: props.clientId || (randomUUID() as PipelineDealClientId) };
    this._internal = newPipelineDeal?._internal ?? new PipelineDealState();
  }

  static create(props: PipelineDealCreateProps): NewPipelineDeal {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level PipelineDeal.create() call!
    return new NewPipelineDealImpl(props);
  }

  static rehydrate(props: PipelineDealHydrationProps): PersistedPipelineDeal {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level PipelineDeal.rehydrate() call!
    return new PersistedPipelineDealImpl(props);
  }

  static promote(
    newPipelineDeal: NewPipelineDealImpl,
    persisted: { id: PipelineDealId; createdAt: Date }
  ): PersistedPipelineDeal {
    const props = { ...newPipelineDeal._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level PipelineDeal.promote() call!
    return new PersistedPipelineDealImpl(props, newPipelineDeal);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Getters
  // --------------------------
  // #region actions/getters

  get companyId() {
    return this._props.companyId;
  }

  get orderKey() {
    return this._props.orderKey;
  }

  get title() {
    return this._props.title;
  }

  get stageId() {
    return this._props.stageId;
  }

  get value() {
    return this._props.value;
  }

  get dealOwner() {
    return this._props.dealOwner;
  }

  get dealContact() {
    return this._props.dealContact;
  }

  get clientId(): PipelineDealClientId {
    return this._props.clientId;
  }
  // #endregion actions/getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof PipelineDealProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<PipelineDealProps> {
    const update: Partial<PipelineDealProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof PipelineDealProps>(key: K) => {
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
  // Domain actions – Deal
  // --------------------------
  // #region actions/deal

  updateDeal(_input: PipelineDealUpdateProps) {}
  // #endregion actions/deal
}

class NewPipelineDealImpl extends PipelineDeal {
  constructor(props: PipelineDealCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedPipelineDeal {
    return false;
  }
}

class PersistedPipelineDealImpl extends PipelineDeal {
  private readonly _id: PipelineDealId;
  private readonly _createdAt: Date;

  constructor(props: PipelineDealHydrationProps, newPipelineDeal?: NewPipelineDealImpl) {
    super(props, newPipelineDeal);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedPipelineDeal {
    return false;
  }
}
