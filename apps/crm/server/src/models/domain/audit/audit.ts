import type { UUID } from '@apps/crm-shared';

import type { AuditAction } from '#Graphql/generated/graphql.gen.js';

import type { UserProfileId } from '../user/profile/profile.types.js';
import type { AuditId } from './auditlog.types.js';

type AuditProps = {
  tableName: string;
  entityId: UUID;
  entityAction: AuditAction;
  changedAt: Date;
  changedByUserProfileId: UserProfileId;
  originalValues: JSON;
  newValues: JSON;
};

type AuditCreateProps = AuditProps;
type AuditHydrationProps = AuditCreateProps & { id: AuditId; createdAt: Date };

export type NewAudit = InstanceType<typeof NewAuditImpl>;
export type PersistedAudit = InstanceType<typeof PersistedAuditImpl>;

export abstract class Audit {
  private readonly _tableName: string;
  private readonly _entityId: UUID;
  private readonly _entityAction: AuditAction;
  private readonly _changedByUserProfileId: UserProfileId;
  private readonly _originalValues: JSON;
  private readonly _newValues: JSON;

  private readonly _rootDirty: boolean = false;

  constructor(props: AuditProps) {
    this._tableName = props.tableName;
    this._entityId = props.entityId;
    this._entityAction = props.entityAction;
    this._changedByUserProfileId = props.changedByUserProfileId;
    this._originalValues = props.originalValues;
    this._newValues = props.newValues;
  }

  static create(props: AuditCreateProps): NewAudit {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Audit.create() call!
    return new NewAuditImpl(props);
  }

  static rehydrate(props: AuditHydrationProps): PersistedAudit {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Audit.rehydrate() call!
    return new PersistedAuditImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get isRootDirty() {
    return this._rootDirty;
  }

  get tableName() {
    return this._tableName;
  }

  get entityId() {
    return this._entityId;
  }

  get entityAction() {
    return this._entityAction;
  }

  get changedByUserProfileId() {
    return this._changedByUserProfileId;
  }

  get originalValues() {
    return this._originalValues;
  }

  get newValues() {
    return this._newValues;
  }
  // #endregion getters

  abstract isPersisted(): boolean;
}

class NewAuditImpl extends Audit {
  constructor(props: AuditCreateProps) {
    super(props);
  }

  isPersisted(): this is NewAuditImpl {
    return false;
  }
}

class PersistedAuditImpl extends Audit {
  private readonly _id: AuditId;
  private readonly _createdAt: Date;

  constructor(props: AuditHydrationProps) {
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

  isPersisted(): this is PersistedAuditImpl {
    return true;
  }
}
