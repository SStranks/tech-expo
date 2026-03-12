import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryClientId, CalendarCategoryId } from './categories.types.js';

import { randomUUID } from 'node:crypto';

type CalendarCategoryProps = {
  title: string;
  calendarId: CalendarId;
  clientId?: CalendarCategoryClientId;
};

export type CalendarCategoryCreateProps = CalendarCategoryProps;
export type CalendarCategoryHydrationProps = CalendarCategoryCreateProps & { id: CalendarCategoryId; createdAt: Date };
export type CalendarCategoryUpdateProps = Partial<CalendarCategoryProps> & { id: CalendarCategoryId };

export interface NewCalendarCategory extends CalendarCategory {
  isPersisted(): this is PersistedCalendarCategory;
}
export interface PersistedCalendarCategory extends CalendarCategory {
  readonly id: CalendarCategoryId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedCalendarCategory;
}

class CalendarCategoryState {
  dirtyFields: Set<keyof CalendarCategoryProps> = new Set();
}

export abstract class CalendarCategory {
  private readonly _props: CalendarCategoryProps & { clientId: CalendarCategoryClientId };
  protected _internal: CalendarCategoryState;

  constructor(props: CalendarCategoryProps, newCategory?: NewCalendarCategoryImpl) {
    this._props = { ...props, clientId: props.clientId ?? (randomUUID() as CalendarCategoryClientId) };
    this._internal = newCategory?._internal ?? new CalendarCategoryState();
  }

  static create(props: CalendarCategoryCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.create() call!
    return new NewCalendarCategoryImpl(props);
  }

  static rehydrate(props: CalendarCategoryHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.rehydrate() call!
    return new PersistedCalendarCategoryImpl(props);
  }

  static promote(
    newEvent: NewCalendarCategoryImpl,
    persisted: { id: CalendarCategoryId; createdAt: Date }
  ): PersistedCalendarCategory {
    const props = { ...newEvent._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.promote() call!
    return new PersistedCalendarCategoryImpl(props, newEvent);
  }

  abstract isPersisted(): boolean;

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get title() {
    return this._props.title;
  }

  get calendarId() {
    return this._props.calendarId;
  }

  get clientId(): CalendarCategoryClientId {
    return this._props.clientId;
  }
  // #endregion getters

  // --------------------------
  // Domain actions – Internal
  // --------------------------
  // #region actions/internal

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof CalendarCategoryProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<CalendarCategoryProps> {
    const update: Partial<CalendarCategoryProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof CalendarCategoryProps>(key: K) => {
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
  // Domain actions – categories
  // --------------------------
  // #region actions/categories

  updateCategory(input: CalendarCategoryUpdateProps) {
    if (input.title !== undefined) this.changeTitle(input.title);
  }

  changeTitle(newTitle: string) {
    if (this._props.title === newTitle) return;
    const title = newTitle.trim();
    if (title.length === 0) throw new Error('Category title cannot be empty');
    this._props.title = newTitle;
    this._internal.dirtyFields.add('title');
  }
  // #endregion actions/categories
}

class NewCalendarCategoryImpl extends CalendarCategory {
  constructor(props: CalendarCategoryCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCalendarCategory {
    return false;
  }
}

class PersistedCalendarCategoryImpl extends CalendarCategory {
  private readonly _id: CalendarCategoryId;
  private readonly _createdAt: Date;

  constructor(props: CalendarCategoryHydrationProps, newCategory?: NewCalendarCategoryImpl) {
    super(props, newCategory);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedCalendarCategory {
    return true;
  }
}
