import type { KanbanId } from '../kanban.types.js';
import type { KanbanStageClientId, KanbanStageId } from './stage.types.js';

import { randomUUID } from 'node:crypto';

type KanbanStageProps = {
  title: string;
  kanbanId: KanbanId;
  clientId?: KanbanStageClientId;
};

export type KanbanStageCreateProps = KanbanStageProps;
export type KanbanStageHydrationProps = KanbanStageCreateProps & { id: KanbanStageId; createdAt: Date };
export type KanbanStageUpdateProps = Partial<KanbanStageProps> & { id: KanbanStageId };

export interface NewKanbanStage extends KanbanStage {
  isPersisted(): this is PersistedKanbanStage;
}

export interface PersistedKanbanStage extends KanbanStage {
  readonly id: KanbanStageId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedKanbanStage;
}

class KanbanStageState {
  dirtyFields: Set<keyof KanbanStageProps> = new Set();
}

export abstract class KanbanStage {
  private readonly _props: KanbanStageProps & { clientId: KanbanStageClientId };
  protected _internal: KanbanStageState;

  constructor(props: KanbanStageProps, newKanbanStage?: NewKanbanStageImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as KanbanStageClientId) };
    this._internal = newKanbanStage?._internal ?? new KanbanStageState();
  }

  static create(props: KanbanStageCreateProps): NewKanbanStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level KanbanStage.create() call!
    return new NewKanbanStageImpl(props);
  }

  static rehydrate(props: KanbanStageHydrationProps): PersistedKanbanStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level KanbanStage.rehydration() call!
    return new PersistedKanbanStageImpl(props);
  }

  static promote(
    newKanbanStage: NewKanbanStageImpl,
    persisted: { id: KanbanStageId; createdAt: Date }
  ): PersistedKanbanStage {
    const props = { ...newKanbanStage._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level KanbanStage.promote() call!
    return new PersistedKanbanStageImpl(props, newKanbanStage);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Getters
  // --------------------------
  // #region actions/getters

  get title() {
    return this._props.title;
  }

  get kanbanId() {
    return this._props.kanbanId;
  }

  get clientId(): KanbanStageClientId {
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

  getDirtyRootFields(): (keyof KanbanStageProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<KanbanStageProps> {
    const update: Partial<KanbanStageProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof KanbanStageProps>(key: K) => {
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

  updateStage(_input: KanbanStageUpdateProps) {}
  // #endregion actions/stage
}

class NewKanbanStageImpl extends KanbanStage {
  constructor(props: KanbanStageCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedKanbanStage {
    return false;
  }
}

class PersistedKanbanStageImpl extends KanbanStage {
  private readonly _id: KanbanStageId;
  private readonly _createdAt: Date;

  constructor(props: KanbanStageHydrationProps, newKanbanStage?: NewKanbanStageImpl) {
    super(props, newKanbanStage);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedKanbanStage {
    return true;
  }
}
