import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CalendarId } from '../calendar.types.js';
import type { CalendarCategoryId } from '../categories/categories.types.js';
import type { CalendarEventId, CalendarEventSymbol } from './event.types.js';

import { randomUUID } from 'node:crypto';

type CalendarEventProps = {
  title: string;
  calendarId: CalendarId;
  categoryId: CalendarCategoryId;
  description: string;
  color: string | null;
  eventStartAt: Date;
  eventEndAt: Date;
  symbol?: CalendarEventSymbol;
};

export type CalendarEventCreateProps = CalendarEventProps;
export type CalendarEventHydrationProps = CalendarEventCreateProps & { id: CalendarEventId; createdAt: Date };
export type CalendarEventUpdateProps = Partial<CalendarEventProps> & { id: CalendarEventId };

export interface NewCalendarEvent extends CalendarEvent {
  isPersisted(): this is PersistedCalendarEvent;
}

export interface PersistedCalendarEvent extends CalendarEvent {
  readonly id: CalendarEventId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedCalendarEvent;
}

export abstract class CalendarEvent {
  private readonly _props: CalendarEventProps & { symbol: CalendarEventSymbol };
  private readonly _dirtyFields = new Set<keyof CalendarEventProps>();

  private readonly _participants = new Set<UserProfileId>();
  private readonly _addedParticipants = new Set<UserProfileId>();
  private readonly _removedParticipants = new Set<UserProfileId>();

  constructor(props: CalendarEventProps) {
    this._props = { ...props, symbol: props.symbol ?? (randomUUID() as CalendarEventSymbol) };
  }

  static create(props: CalendarEventCreateProps): NewCalendarEvent {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Event.create() call!
    return new NewCalendarEventImpl(props);
  }

  static rehydrate(props: CalendarEventHydrationProps): PersistedCalendarEvent {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Event.rehydrate() call!
    return new PersistedCalendarEventImpl(props);
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

  get categoryId() {
    return this._props.categoryId;
  }

  get description() {
    return this._props.description;
  }

  get color() {
    return this._props.color;
  }

  get eventStartAt() {
    return this._props.eventStartAt;
  }

  get eventEndAt() {
    return this._props.eventEndAt;
  }

  get symbol(): CalendarEventSymbol {
    return this._props.symbol;
  }

  get participants() {
    return [...this._participants];
  }
  // #endregion getters

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – events
  // --------------------------
  // #region actions/events
  updateEvent(input: CalendarEventUpdateProps) {
    if (input.title !== undefined) this.changeTitle(input.title);
    if (input.calendarId !== undefined) this.changeCalendar(input.calendarId);
    if (input.categoryId !== undefined) this.changeCategory(input.categoryId);
    if (input.description !== undefined) this.changeDescription(input.description);
    if (input.color !== undefined) this.changeColor(input.color);
    if (input.eventStartAt !== undefined && input.eventEndAt !== undefined)
      this.changeDate(input.eventStartAt, input.eventEndAt);
  }

  changeTitle(newTitle: string) {
    if (this._props.title === newTitle) return;
    const title = newTitle.trim();
    if (title.length === 0) throw new Error('Event title cannot be empty');
    this._props.title = newTitle;
    this._dirtyFields.add('title');
  }

  changeCalendar(newCalendar: CalendarId) {
    if (this._props.calendarId === newCalendar) return;
    this._props.calendarId = newCalendar;
    this._dirtyFields.add('calendarId');
  }

  changeCategory(category: CalendarCategoryId) {
    if (this._props.categoryId === category) return;
    this._props.categoryId = category;
    this._dirtyFields.add('categoryId');
  }

  changeDescription(newDescription: string) {
    if (this._props.description === newDescription) return;
    const description = newDescription.trim();
    if (description.length === 0) throw new Error('Event description cannot be empty');
    this._props.description = description;
    this._dirtyFields.add('description');
  }

  changeColor(newColorHex: string | null) {
    if (this._props.color === newColorHex) return;

    if (newColorHex === null) {
      this._props.color = null;
    } else {
      const normalized = newColorHex.startsWith('#') ? newColorHex : `#${newColorHex}`;
      if (!/^#(?:[A-F0-9]{6}|[A-F0-9]{3})$/i.test(normalized)) {
        throw new Error('Hexadecimal color format required');
      }
      this._props.color = normalized.toUpperCase();
    }
    this._dirtyFields.add('color');
  }

  changeDate(newStart: Date, newEnd: Date) {
    if (this._props.eventStartAt === newStart && this._props.eventEndAt === newEnd) return;
    if (Number.isNaN(newStart.getTime()) || Number.isNaN(newEnd.getTime())) throw new Error('Invalid time formats');
    this._props.eventStartAt = newStart;
    this._props.eventEndAt = newEnd;
    this._dirtyFields.add('eventStartAt');
    this._dirtyFields.add('eventEndAt');
  }
  // #endregion actions/events

  // --------------------------
  // Domain actions – Commit
  // --------------------------
  // #region actions/commit
  commit() {
    this._dirtyFields.clear();
  }

  getDirtyRootFields(): (keyof CalendarEventProps)[] {
    return [...this._dirtyFields];
  }

  pullDirtyFields(): Partial<CalendarEventProps> {
    const update: Partial<CalendarEventProps> = {};

    this._dirtyFields.forEach(<K extends keyof CalendarEventProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }

  isRootDirty(): boolean {
    return this._dirtyFields.size > 0;
  }
  // #endregion actions/commit
}

class NewCalendarEventImpl extends CalendarEvent {
  constructor(props: CalendarEventCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCalendarEvent {
    return false;
  }
}

class PersistedCalendarEventImpl extends CalendarEvent {
  private readonly _id: CalendarEventId;
  private readonly _createdAt: Date;

  constructor(props: CalendarEventHydrationProps) {
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

  isPersisted(): this is PersistedCalendarEvent {
    return true;
  }
}
