import type { UUID as UUIDv4 } from 'node:crypto';

import type { KanbanId } from '../kanban.types.js';
import type { KanbanStageId } from './stage.types.js';

import { randomUUID } from 'node:crypto';

type StageProps = {
  title: string;
  kanbanId: KanbanId;
  symbol?: UUIDv4;
};

type StageCreateProps = StageProps;
type StageHydrationProps = StageCreateProps & { id: KanbanStageId; createdAt: Date };

export type NewStage = InstanceType<typeof NewStageImpl>;
export type PersistedStage = InstanceType<typeof PersistedStageImpl>;

export abstract class Stage {
  private readonly _kanbanId: KanbanId;
  private readonly _symbol: UUIDv4;
  private readonly _title: string;

  constructor(props: StageProps) {
    this._title = props.title;
    this._kanbanId = props.kanbanId;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: StageCreateProps): NewStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Stage.create() call!
    return new NewStageImpl(props);
  }

  static rehydrate(props: StageHydrationProps): PersistedStage {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Stage.rehydration() call!
    return new PersistedStageImpl(props);
  }

  get title() {
    return this._title;
  }

  get kanbanId() {
    return this._kanbanId;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
}

class NewStageImpl extends Stage {
  constructor(props: StageCreateProps) {
    super(props);
  }

  isPersisted(): this is NewStageImpl {
    return false;
  }
}

class PersistedStageImpl extends Stage {
  private readonly _id: KanbanStageId;
  private readonly _createdAt: Date;

  constructor(props: StageHydrationProps) {
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

  isPersisted(): this is PersistedStageImpl {
    return true;
  }
}
