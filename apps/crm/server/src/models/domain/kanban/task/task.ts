import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { KanbanStageId } from '../stage/stage.types.js';
import type { KanbanTaskClientId, KanbanTaskId } from './task.types.js';

import { randomUUID } from 'node:crypto';

type KanbanTaskProps = {
  description: string | null;
  title: string;
  orderKey: string;
  completed: boolean | null;
  stageId: KanbanStageId;
  dueDate: Date | null;
  assignedUser: UserProfileId | null;
  clientId?: KanbanTaskClientId;
};

export type KanbanTaskCreateProps = KanbanTaskProps;
export type KanbanTaskHydrationProps = KanbanTaskCreateProps & { id: KanbanTaskId; createdAt: Date };
export type KanbanTaskUpdateProps = Partial<KanbanTaskProps> & { id: KanbanTaskId };

export interface NewKanbanTask extends KanbanTask {
  isPersisted(): this is PersistedKanbanTask;
}

export interface PersistedKanbanTask extends KanbanTask {
  readonly id: KanbanTaskId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedKanbanTask;
}

class KanbanTaskState {
  dirtyFields: Set<keyof KanbanTaskProps> = new Set();
}

export abstract class KanbanTask {
  private readonly _props: KanbanTaskProps & { clientId: KanbanTaskClientId };
  protected _internal: KanbanTaskState;

  constructor(props: KanbanTaskProps, newTask?: NewKanbanTaskImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as KanbanTaskClientId) };
    this._internal = newTask?._internal ?? new KanbanTaskState();
  }

  static create(props: KanbanTaskCreateProps): NewKanbanTask {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Task.create() call!
    return new NewKanbanTaskImpl(props);
  }

  static rehydrate(props: KanbanTaskHydrationProps): PersistedKanbanTask {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Task.rehydration() call!
    return new PersistedKanbanTaskImpl(props);
  }

  static promote(
    newKanbanTask: NewKanbanTaskImpl,
    persisted: { id: KanbanTaskId; createdAt: Date }
  ): PersistedKanbanTask {
    const props = { ...newKanbanTask._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Task.promote() call!
    return new PersistedKanbanTaskImpl(props, newKanbanTask);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get description() {
    return this._props.description;
  }

  get title() {
    return this._props.title;
  }

  get orderKey() {
    return this._props.orderKey;
  }

  get completed() {
    return this._props.completed;
  }

  get stageId() {
    return this._props.stageId;
  }

  get dueDate() {
    return this._props.dueDate;
  }

  get assignedUser() {
    return this._props.assignedUser;
  }

  get clientId(): KanbanTaskClientId {
    return this._props.clientId;
  }

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof KanbanTaskProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<KanbanTaskProps> {
    const update: Partial<KanbanTaskProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof KanbanTaskProps>(key: K) => {
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
  // Domain actions – Task
  // --------------------------
  // #region actions/task

  updateTask(_input: KanbanTaskUpdateProps) {}
  // #endregion actions/task
}

class NewKanbanTaskImpl extends KanbanTask {
  constructor(props: KanbanTaskCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedKanbanTask {
    return false;
  }
}

class PersistedKanbanTaskImpl extends KanbanTask {
  private readonly _id: KanbanTaskId;
  private readonly _createdAt: Date;

  constructor(props: KanbanTaskHydrationProps, newKanbanTask?: NewKanbanTaskImpl) {
    super(props, newKanbanTask);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedKanbanTask {
    return true;
  }
}
