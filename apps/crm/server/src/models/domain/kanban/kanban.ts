import type { CompanyId } from '../company/company.types.js';
import type { KanbanId } from './kanban.types.js';
import type {
  KanbanStageCreateProps,
  KanbanStageUpdateProps,
  NewKanbanStage,
  PersistedKanbanStage,
} from './stage/stage.js';
import type { KanbanStageClientId, KanbanStageId } from './stage/stage.types.js';
import type { KanbanTaskCreateProps, KanbanTaskUpdateProps, NewKanbanTask, PersistedKanbanTask } from './task/task.js';
import type { KanbanTaskClientId, KanbanTaskId } from './task/task.types.js';

import DomainError from '#Utils/errors/DomainError.js';

import { KanbanStage } from './stage/stage.js';
import { KanbanTask } from './task/task.js';

type KanbanProps = {
  companyId: CompanyId;
};

type KanbanCreateProps = KanbanProps;
type KanbanHydrationProps = KanbanCreateProps & { id: KanbanId; createdAt: Date };

export interface NewKanban extends Kanban {
  isPersisted(): this is PersistedKanban;
}

export interface PersistedKanban extends Kanban {
  readonly id: KanbanId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedKanban;
}

class KanbanState {
  taskById: Map<KanbanTaskId, PersistedKanbanTask> = new Map();
  taskByClientId: Map<KanbanTaskClientId, KanbanTaskId> = new Map();
  addedTask: Map<KanbanTaskClientId, NewKanbanTask> = new Map();
  updatedTask: Map<KanbanTaskId, PersistedKanbanTask> = new Map();
  removedTaskIds: Set<KanbanTaskId> = new Set();
  stageById: Map<KanbanStageId, PersistedKanbanStage> = new Map();
  stageByClientId: Map<KanbanStageClientId, KanbanStageId> = new Map();
  addedStage: Map<KanbanStageClientId, NewKanbanStage> = new Map();
  updatedStage: Map<KanbanStageId, PersistedKanbanStage> = new Map();
  removedStageIds: Set<KanbanStageId> = new Set();
  dirtyFields: Set<keyof KanbanProps> = new Set();
}

export abstract class Kanban {
  private readonly _props: KanbanProps;
  protected _internal: KanbanState;

  constructor(props: KanbanProps, newKanban?: NewKanbanImpl) {
    this._props = { ...props };
    this._internal = newKanban?._internal ?? new KanbanState();
  }

  static create(props: KanbanCreateProps): NewKanban {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Kanban.create() call!
    return new NewKanbanImpl(props);
  }

  static rehydrate(props: KanbanHydrationProps): PersistedKanban {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Kanban.rehydrate() call!
    return new PersistedKanbanImpl(props);
  }

  static promote(newKanban: NewKanbanImpl, persisted: { id: KanbanId; createdAt: Date }): PersistedKanbanImpl {
    const props = { ...newKanban._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.promote() call!
    return new PersistedKanbanImpl(props, newKanban);
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

  getDirtyRootFields(): (keyof KanbanProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullStageChanges() {
    return {
      addedStage: this._internal.addedStage,
      removedStageIds: this._internal.removedStageIds,
      updatedStage: this._internal.updatedStage,
    };
  }

  pullTaskChanges() {
    return {
      addedTask: this._internal.addedTask,
      removedTaskIds: this._internal.removedTaskIds,
      updatedTask: this._internal.updatedTask,
    };
  }

  pullDirtyFields(): Partial<KanbanProps> {
    const update: Partial<KanbanProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof KanbanProps>(key: K) => {
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

  commitStages(newStages: PersistedKanbanStage[]) {
    for (const stage of newStages) {
      this._internal.stageById.set(stage.id, stage);
      this._internal.stageByClientId.set(stage.clientId, stage.id);
      stage.commit();
    }

    this._internal.addedStage.clear();
    this._internal.updatedStage.clear();
    this._internal.removedStageIds.clear();
  }

  commitTask(newTasks: PersistedKanbanTask[]) {
    for (const task of newTasks) {
      this._internal.taskById.set(task.id, task);
      this._internal.taskByClientId.set(task.clientId, task.id);
      task.commit();
    }

    this._internal.addedTask.clear();
    this._internal.updatedTask.clear();
    this._internal.removedTaskIds.clear();
  }
  // #endregion actions/commit

  // --------------------------
  // Domain actions – Kanban
  // --------------------------
  // #region actions/kanban
  // #endregion actions/kanban

  // --------------------------
  // Domain actions – Kanban Task
  // --------------------------
  // #region actions/task
  addKanbanTask(props: KanbanTaskCreateProps): NewKanbanTask {
    const kanbanTask = KanbanTask.create(props);
    this._internal.addedTask.set(kanbanTask.clientId, kanbanTask);
    return kanbanTask;
  }

  updateKanbanTask(props: KanbanTaskUpdateProps): PersistedKanbanTask {
    const kanbanTask = this._internal.taskById.get(props.id);
    if (!kanbanTask) throw new DomainError({ message: 'Kanban-task not found' });

    kanbanTask.updateTask(props);
    this._internal.updatedTask.set(kanbanTask.id, kanbanTask);
    return kanbanTask;
  }

  removeKanbanTask(id: KanbanTaskId) {
    const kanbanTask = this._internal.taskById.get(id);
    if (!kanbanTask) throw new DomainError({ message: 'Kanban-task not found' });

    this._internal.removedTaskIds.add(id);
    this._internal.taskById.delete(id);
    this._internal.taskByClientId.delete(kanbanTask.clientId);
  }

  findKanbanTaskByClientId(clientId: KanbanTaskClientId) {
    return this._internal.taskByClientId.get(clientId);
  }

  getKanbanTaskByClientId(clientId: KanbanTaskClientId) {
    const kanbanTaskUUID = this.findKanbanTaskByClientId(clientId);
    if (!kanbanTaskUUID) throw new DomainError({ message: 'Kanban-task not found' });
    const kanbanTask = this._internal.taskById.get(kanbanTaskUUID);
    if (!kanbanTask) throw new DomainError({ message: 'Kanban-task not found' });
    return kanbanTask;
  }
  // #endregion actions/task

  // --------------------------
  // Domain actions – Kanban Stage
  // --------------------------
  // #region actions/stage
  addKanbanStage(props: KanbanStageCreateProps): NewKanbanStage {
    const kanbanStage = KanbanStage.create(props);
    this._internal.addedStage.set(kanbanStage.clientId, kanbanStage);
    return kanbanStage;
  }

  updateKanbanStage(props: KanbanStageUpdateProps): PersistedKanbanStage {
    const kanbanStage = this._internal.stageById.get(props.id);
    if (!kanbanStage) throw new DomainError({ message: 'Kanban-stage not found' });

    kanbanStage.updateStage(props);
    this._internal.updatedStage.set(kanbanStage.id, kanbanStage);
    return kanbanStage;
  }

  removeKanbanStage(id: KanbanStageId) {
    const kanbanStage = this._internal.stageById.get(id);
    if (!kanbanStage) throw new DomainError({ message: 'Kanban-stage not found' });

    this._internal.removedStageIds.add(id);
    this._internal.stageById.delete(id);
    this._internal.stageByClientId.delete(kanbanStage.clientId);
  }

  findKanbanStageByClientId(clientId: KanbanStageClientId) {
    return this._internal.stageByClientId.get(clientId);
  }

  getKanbanStageByClientId(clientId: KanbanStageClientId) {
    const kanbanStageUUID = this.findKanbanStageByClientId(clientId);
    if (!kanbanStageUUID) throw new DomainError({ message: 'Kanban-stage not found' });
    const kanbanStage = this._internal.stageById.get(kanbanStageUUID);
    if (!kanbanStage) throw new DomainError({ message: 'Kanban-stage not found' });
    return kanbanStage;
  }
  // #endregion actions/stage
}

class NewKanbanImpl extends Kanban {
  constructor(props: KanbanCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedKanban {
    return false;
  }
}

class PersistedKanbanImpl extends Kanban {
  private readonly _id: KanbanId;
  private readonly _createdAt: Date;

  constructor(props: KanbanHydrationProps, newKanban?: NewKanbanImpl) {
    super(props, newKanban);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedKanban {
    return false;
  }
}
