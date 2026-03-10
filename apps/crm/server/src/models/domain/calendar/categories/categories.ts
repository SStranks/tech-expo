import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId, CalendarCategorySymbol } from './categories.types.js';

import { randomUUID } from 'node:crypto';

type CalendarCategoryProps = {
  title: string;
  calendarId: CalendarId;
  symbol?: CalendarCategorySymbol;
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

export abstract class CalendarCategory {
  private readonly _props: CalendarCategoryProps & { symbol: CalendarCategorySymbol };
  private readonly _dirtyFields = new Set<keyof CalendarCategoryProps>();

  constructor(props: CalendarCategoryProps) {
    this._props = { ...props, symbol: props.symbol ?? (randomUUID() as CalendarCategorySymbol) };
  }

  static create(props: CalendarCategoryCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.create() call!
    return new NewCalendarCategoryImpl(props);
  }

  static rehydrate(props: CalendarCategoryHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.rehydrate() call!
    return new PersistedCalendarCategoryImpl(props);
  }

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

  get symbol(): CalendarCategorySymbol {
    return this._props.symbol;
  }
  // #endregion getters

  abstract isPersisted(): boolean;

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
    this._dirtyFields.add('title');
  }
  // #endregion actions/categories

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit
  commit() {
    this._dirtyFields.clear();
  }

  getDirtyRootFields(): (keyof CalendarCategoryProps)[] {
    return [...this._dirtyFields];
  }

  pullDirtyFields(): Partial<CalendarCategoryProps> {
    const update: Partial<CalendarCategoryProps> = {};

    this._dirtyFields.forEach(<K extends keyof CalendarCategoryProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    // this._dirtyFields.clear();

    return update;
  }

  isRootDirty(): boolean {
    return this._dirtyFields.size > 0;
  }
  // #endregion actions/commit
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

  constructor(props: CalendarCategoryHydrationProps) {
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

  isPersisted(): this is PersistedCalendarCategory {
    return true;
  }
}
