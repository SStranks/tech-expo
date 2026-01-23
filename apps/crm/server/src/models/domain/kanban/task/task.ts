import type { UUID as UUIDv4 } from 'node:crypto';

import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { KanbanStageId } from '../stage/stage.types.js';
import type { KanbanTaskId } from './task.types.js';

import { randomUUID } from 'node:crypto';

type TaskProps = {
  description: string | null;
  title: string;
  orderKey: string;
  completed: boolean | null;
  stageId: KanbanStageId;
  dueDate: Date | null;
  assignedUser: UserProfileId | null;
  symbol?: UUIDv4;
};

type TaskCreateProps = TaskProps;
type TaskHydrationProps = TaskCreateProps & { id: KanbanTaskId; createdAt: Date };

export type NewTask = InstanceType<typeof NewTaskImpl>;
export type PersistedTask = InstanceType<typeof PersistedTaskImpl>;

export abstract class Task {
  private readonly _symbol: UUIDv4;
  private _description: string | null;
  private _title: string;
  private _orderKey: string;
  private _completed: boolean | null;
  private _stageId: KanbanStageId;
  private _dueDate: Date | null;
  private _assignedUser: UserProfileId | null;

  constructor(props: TaskProps) {
    this._description = props.description;
    this._title = props.title;
    this._orderKey = props.orderKey;
    this._completed = props.completed;
    this._stageId = props.stageId;
    this._dueDate = props.dueDate;
    this._assignedUser = props.assignedUser;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: TaskCreateProps): NewTask {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Task.create() call!
    return new NewTaskImpl(props);
  }

  static rehydrate(props: TaskHydrationProps): PersistedTask {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Task.rehydration() call!
    return new PersistedTaskImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get description() {
    return this._description;
  }

  get title() {
    return this._title;
  }

  get orderKey() {
    return this._orderKey;
  }

  get completed() {
    return this._completed;
  }

  get stageId() {
    return this._stageId;
  }

  get dueDate() {
    return this._dueDate;
  }

  get assignedUser() {
    return this._assignedUser;
  }

  abstract isPersisted(): boolean;
}

class NewTaskImpl extends Task {
  constructor(props: TaskCreateProps) {
    super(props);
  }

  isPersisted(): this is NewTaskImpl {
    return false;
  }
}

class PersistedTaskImpl extends Task {
  private readonly _id: KanbanTaskId;
  private readonly _createdAt: Date;

  constructor(props: TaskHydrationProps) {
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

  isPersisted(): this is PersistedTaskImpl {
    return true;
  }
}
