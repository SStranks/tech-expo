import type { CompanyId } from '../company/company.types.js';
import type { KanbanId } from './kanban.types.js';

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

export abstract class Kanban {
  private readonly _companyId: CompanyId;

  constructor(props: KanbanProps) {
    this._companyId = props.companyId;
  }

  static create(props: KanbanCreateProps): NewKanban {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Kanban.create() call!
    return new NewKanbanImpl(props);
  }

  static rehydrate(props: KanbanHydrationProps): PersistedKanban {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Kanban.rehydrate() call!
    return new PersistedKanbanImpl(props);
  }

  get companyId() {
    return this._companyId;
  }

  abstract isPersisted(): boolean;
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

  constructor(props: KanbanHydrationProps) {
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

  isPersisted(): this is PersistedKanban {
    return false;
  }
}
