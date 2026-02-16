import type { UUID as UUIDv4 } from 'node:crypto';

import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from '../categories/categories.types.js';
import type { CalendarEventId } from './event.types.js';

import { randomUUID } from 'node:crypto';

type EventProps = {
  title: string;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  description: string;
  color: string | null;
  eventStart: Date;
  eventEnd: Date;
  createdAt: Date;
  symbol?: UUIDv4;
};

type EventCreateProps = EventProps;
type EventHydrationProps = EventCreateProps & { id: CalendarEventId; createdAt: Date };

export interface NewEvent extends Event {
  isPersisted(): this is PersistedEvent;
}

export interface PersistedEvent extends Event {
  readonly id: CalendarEventId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedEvent;
}

export abstract class Event {
  private readonly _calendarId: CalendarId;
  private readonly _categoryId: CalendarCategoryId;
  private readonly _symbol: UUIDv4;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _color: string | null;
  private readonly _eventStart: Date;
  private readonly _eventEnd: Date;

  constructor(props: EventProps) {
    this._title = props.title;
    this._calendarId = props.calendarId;
    this._categoryId = props.categoryId;
    this._description = props.description;
    this._color = props.color;
    this._eventStart = props.eventStart;
    this._eventEnd = props.eventEnd;
    this._symbol = props.symbol || randomUUID();
  }

  static create(props: EventCreateProps): NewEvent {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Event.create() call!
    return new NewEventImpl(props);
  }

  static rehydrate(props: EventHydrationProps): PersistedEvent {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Event.rehydrate() call!
    return new PersistedEventImpl(props);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get title() {
    return this._title;
  }

  get calendarId() {
    return this._calendarId;
  }

  get categoryId() {
    return this._categoryId;
  }

  get description() {
    return this._description;
  }

  get color() {
    return this._color;
  }

  get eventStart() {
    return this._eventStart;
  }

  get eventEnd() {
    return this._eventEnd;
  }

  get symbol() {
    return this._symbol;
  }
  // #endregion getters

  abstract isPersisted(): boolean;
}

class NewEventImpl extends Event {
  constructor(props: EventCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedEvent {
    return false;
  }
}

class PersistedEventImpl extends Event {
  private readonly _id: CalendarEventId;
  private readonly _createdAt: Date;

  constructor(props: EventHydrationProps) {
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

  isPersisted(): this is PersistedEvent {
    return true;
  }
}
