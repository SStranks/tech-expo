import type { PipelineId } from '../pipeline.types.js';
import type { PipelineStageClientId, PipelineStageId } from './stage.types.js';

import { randomUUID } from 'node:crypto';

type PipelineStageProps = {
  title: string;
  isPermanent: boolean | null;
  pipelineId: PipelineId;
  clientId?: PipelineStageClientId;
};

export type PipelineStageCreateProps = PipelineStageProps;
export type PipelineStageHydrationProps = PipelineStageCreateProps & { id: PipelineStageId; createdAt: Date };
export type PipelineStageUpdateProps = Partial<PipelineStageProps> & { id: PipelineStageId };

export interface NewPipelineStage extends PipelineStage {
  isPersisted(): this is PersistedPipelineStage;
}

export interface PersistedPipelineStage extends PipelineStage {
  readonly id: PipelineStageId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedPipelineStage;
}

class PipelineStageState {
  dirtyFields: Set<keyof PipelineStageProps> = new Set();
}

export abstract class PipelineStage {
  private readonly _props: PipelineStageProps & { clientId: PipelineStageClientId };
  protected _internal: PipelineStageState;

  constructor(props: PipelineStageProps, newPipelineStage?: NewPipelineStageImpl) {
    this._props = { ...props, clientId: props.clientId || (randomUUID() as PipelineStageClientId) };
    this._internal = newPipelineStage?._internal ?? new PipelineStageState();
  }

  static create(props: PipelineStageCreateProps): NewPipelineStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Stage.create() call!
    return new NewPipelineStageImpl(props);
  }

  static rehydrate(props: PipelineStageHydrationProps): PersistedPipelineStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Stage.rehydrate() call!
    return new PersistedPipelineStageImpl(props);
  }

  static promote(
    newPipelineStage: NewPipelineStageImpl,
    persisted: { id: PipelineStageId; createdAt: Date }
  ): PersistedPipelineStage {
    const props = { ...newPipelineStage._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level KanbanStage.promote() call!
    return new PersistedPipelineStageImpl(props, newPipelineStage);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Getters
  // --------------------------
  // #region actions/getters

  get title() {
    return this._props.title;
  }

  get isPermanent() {
    return this._props.isPermanent;
  }

  get pipelineId() {
    return this._props.pipelineId;
  }

  get clientId(): PipelineStageClientId {
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

  getDirtyRootFields(): (keyof PipelineStageProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<PipelineStageProps> {
    const update: Partial<PipelineStageProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof PipelineStageProps>(key: K) => {
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
  // Domain actions – Stage
  // --------------------------
  // #region actions/stage

  updateStage(_input: PipelineStageUpdateProps) {}
  // #endregion actions/stage
}

class NewPipelineStageImpl extends PipelineStage {
  constructor(props: PipelineStageCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedPipelineStage {
    return false;
  }
}

class PersistedPipelineStageImpl extends PipelineStage {
  private readonly _id: PipelineStageId;
  private readonly _createdAt: Date;

  constructor(props: PipelineStageHydrationProps, newPipelineStage?: NewPipelineStageImpl) {
    super(props, newPipelineStage);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedPipelineStage {
    return true;
  }
}
