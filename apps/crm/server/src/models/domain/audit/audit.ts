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

export interface NewAudit extends Audit {
  isPersisted(): this is PersistedAudit;
}

export interface PersistedAudit extends Audit {
  readonly id: AuditId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedAudit;
}

class AuditState {
  dirtyFields: Set<keyof AuditProps> = new Set();
}

export abstract class Audit {
  private readonly _props: AuditProps;
  protected _internal: AuditState;

  private readonly _rootDirty: boolean = false;

  constructor(props: AuditProps, newAudit?: NewAuditImpl) {
    this._props = { ...props };
    this._internal = newAudit?._internal ?? new AuditState();
  }

  static create(props: AuditCreateProps): NewAudit {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Audit.create() call!
    return new NewAuditImpl(props);
  }

  static rehydrate(props: AuditHydrationProps): PersistedAudit {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Audit.rehydrate() call!
    return new PersistedAuditImpl(props);
  }

  static promote(newAudit: NewAuditImpl, persisted: { id: AuditId; createdAt: Date }): PersistedAudit {
    const props = { ...newAudit._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Audit.promote() call!
    return new PersistedAuditImpl(props, newAudit);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters

  get tableName() {
    return this._props.tableName;
  }

  get entityId() {
    return this._props.entityId;
  }

  get entityAction() {
    return this._props.entityAction;
  }

  get changedByUserProfileId() {
    return this._props.changedByUserProfileId;
  }

  get originalValues() {
    return this._props.originalValues;
  }

  get newValues() {
    return this._props.newValues;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  getDirtyRootFields(): (keyof AuditProps)[] {
    return [...this._internal.dirtyFields];
  }

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  pullDirtyFields(): Partial<AuditProps> {
    const update: Partial<AuditProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof AuditProps>(key: K) => {
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
  // #endregion actions/audit
}

class NewAuditImpl extends Audit {
  constructor(props: AuditCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedAudit {
    return false;
  }
}

class PersistedAuditImpl extends Audit {
  private readonly _id: AuditId;
  private readonly _createdAt: Date;

  constructor(props: AuditHydrationProps, newAudit?: NewAuditImpl) {
    super(props, newAudit);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedAudit {
    return true;
  }
}
