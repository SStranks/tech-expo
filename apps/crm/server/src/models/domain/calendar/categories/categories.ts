import type { UUID as UUIDv4 } from 'node:crypto';

import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from './categories.types.js';

import { randomUUID } from 'node:crypto';

type CategoriesProps = {
  title: string;
  calendarId: CalendarId;
  symbol?: UUIDv4;
};

type CategoriesCreateProps = CategoriesProps;
type CategoriesHydrationProps = CategoriesCreateProps & { id: CalendarCategoryId; createdAt: Date };

export abstract class Categories {
  private readonly _calendarId: CalendarId;
  private readonly _symbol: UUIDv4;
  private _title: string;

  constructor(props: CategoriesProps) {
    this._title = props.title;
    this._calendarId = props.calendarId;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: CategoriesCreateProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.create() call!
    return new NewCategoriesImpl(props);
  }

  static rehydrate(props: CategoriesHydrationProps) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Categories.rehydrate() call!
    return new PersistedCategoriesImpl(props);
  }

  get title() {
    return this._title;
  }

  get calendarId() {
    return this._calendarId;
  }

  get symbol() {
    return this._symbol;
  }

  abstract isPersisted(): boolean;
}

class NewCategoriesImpl extends Categories {
  constructor(props: CategoriesCreateProps) {
    super(props);
  }

  isPersisted(): this is NewCategoriesImpl {
    return false;
  }
}

class PersistedCategoriesImpl extends Categories {
  private readonly _id: CalendarCategoryId;
  private readonly _createdAt: Date;

  constructor(props: CategoriesHydrationProps) {
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

  isPersisted(): this is PersistedCategoriesImpl {
    return true;
  }
}
