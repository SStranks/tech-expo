import type { CompanyId } from '../company/company.types.js';
import type { PipelineId } from './pipeline.types.js';

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

export abstract class Pipeline {
  private readonly _companyId: CompanyId;

  constructor(props: PipelineProps) {
    this._companyId = props.companyId;
  }

  static create(props: PipelineCreateProps): NewPipeline {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Pipeline.create() call!
    return new NewPipelineImpl(props);
  }

  static rehydrate(props: PipelineHydrationProps): PersistedPipeline {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Pipeline.create() call!
    return new PersistedPipelineImpl(props);
  }

  get companyId() {
    return this._companyId;
  }

  abstract isPersisted(): boolean;
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

  constructor(props: PipelineHydrationProps) {
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

  isPersisted(): this is PersistedPipeline {
    return true;
  }
}
