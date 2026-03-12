import type { CompanyId } from '../company/company.types.js';
import type { NewPipelineDeal, PersistedPipelineDeal } from './deal/deal.js';
import type { PipelineDealClientId, PipelineDealId } from './deal/deal.types.js';
import type { PipelineId } from './pipeline.types.js';
import type { NewPipelineStage, PersistedPipelineStage } from './stage/stage.js';
import type { PipelineStageClientId, PipelineStageId } from './stage/stage.types.js';

type PipelineProps = {
  companyId: CompanyId;
};

type PipelineCreateProps = PipelineProps;
type PipelineHydrationProps = PipelineCreateProps & { id: PipelineId; createdAt: Date };

export interface NewPipeline extends Pipeline {
  isPersisted(): this is PersistedPipeline;
}

export interface PersistedPipeline extends Pipeline {
  readonly id: PipelineId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedPipeline;
}

class PipelineState {
  dealById: Map<PipelineDealId, PersistedPipelineDeal> = new Map();
  dealByClientId: Map<PipelineDealClientId, PipelineDealId> = new Map();
  addedDeal: Map<PipelineDealClientId, NewPipelineDeal> = new Map();
  updatedDeal: Map<PipelineDealId, PersistedPipelineDeal> = new Map();
  removedDealIds: Set<PipelineDealId> = new Set();
  stageById: Map<PipelineStageId, PersistedPipelineStage> = new Map();
  stageByClientId: Map<PipelineStageClientId, PipelineStageId> = new Map();
  addedStage: Map<PipelineStageClientId, NewPipelineStage> = new Map();
  updatedStage: Map<PipelineStageId, PersistedPipelineStage> = new Map();
  removedStageIds: Set<PipelineStageId> = new Set();
  dirtyFields: Set<keyof PipelineProps> = new Set();
}

export abstract class Pipeline {
  private readonly _props: PipelineProps;
  protected _internal: PipelineState;

  constructor(props: PipelineProps, newPipeline?: NewPipelineImpl) {
    this._props = { ...props };
    this._internal = newPipeline?._internal ?? new PipelineState();
  }

  static create(props: PipelineCreateProps): NewPipeline {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Pipeline.create() call!
    return new NewPipelineImpl(props);
  }

  static rehydrate(props: PipelineHydrationProps): PersistedPipeline {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Pipeline.create() call!
    return new PersistedPipelineImpl(props);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get companyId() {
    return this._props.companyId;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof PipelineProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullStageChanges() {
    return {
      addedStage: this._internal.addedStage,
      removedStageIds: this._internal.removedStageIds,
      updatedStage: this._internal.updatedStage,
    };
  }

  pullDealChanges() {
    return {
      addedDeal: this._internal.addedDeal,
      removedDealIds: this._internal.removedDealIds,
      updatedDeal: this._internal.updatedDeal,
    };
  }

  pullDirtyFields(): Partial<PipelineProps> {
    const update: Partial<PipelineProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof PipelineProps>(key: K) => {
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

  commitStages(newStages: PersistedPipelineStage[]) {
    for (const stage of newStages) {
      this._internal.stageById.set(stage.id, stage);
      this._internal.stageByClientId.set(stage.clientId, stage.id);
      stage.commit();
    }

    this._internal.addedStage.clear();
    this._internal.updatedStage.clear();
    this._internal.removedStageIds.clear();
  }

  commitTask(newDeals: PersistedPipelineDeal[]) {
    for (const deal of newDeals) {
      this._internal.dealById.set(deal.id, deal);
      this._internal.dealByClientId.set(deal.clientId, deal.id);
      deal.commit();
    }

    this._internal.addedDeal.clear();
    this._internal.updatedDeal.clear();
    this._internal.removedDealIds.clear();
  }
  // #endregion actions/commit
}

class NewPipelineImpl extends Pipeline {
  constructor(props: PipelineCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedPipeline {
    return false;
  }
}

class PersistedPipelineImpl extends Pipeline {
  private readonly _id: PipelineId;
  private readonly _createdAt: Date;

  constructor(props: PipelineHydrationProps, newPipeline?: NewPipelineImpl) {
    super(props, newPipeline);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedPipeline {
    return true;
  }
}
