import type { CompanyId } from '../company/company.types.js';
import type { CalendarId } from './calendar.types.js';
import type {
  CalendarCategoryCreateProps,
  CalendarCategoryUpdateProps,
  NewCalendarCategory,
  PersistedCalendarCategory,
} from './categories/categories.js';
import type { CalendarCategoryId, CalendarCategorySymbol } from './categories/categories.types.js';
import type { CalendarEventId, CalendarEventSymbol } from './events/event.types.js';
import type {
  CalendarEventCreateProps,
  CalendarEventUpdateProps,
  NewCalendarEvent,
  PersistedCalendarEvent,
} from './events/events.js';

import DomainError from '#Utils/errors/DomainError.js';

import { CalendarCategory } from './categories/categories.js';
import { CalendarEvent } from './events/events.js';

type CalendarProps = {
  companyId: CompanyId;
};

type CalendarCreateProps = CalendarProps;
type CalendarHydrationProps = CalendarCreateProps & { id: CalendarId; createdAt: Date };

export interface NewCalendar extends Calendar {
  isPersisted(): this is PersistedCalendar;
}

export interface PersistedCalendar extends Calendar {
  readonly id: CalendarId;
  readonly createdAt: Date;
  isPersisted(): this is PersistedCalendar;
}

class CalendarState {
  event: PersistedCalendarEvent[] = [];
  addedEvent: NewCalendarEvent[] = [];
  removedEventIds: CalendarEventId[] = [];
  updatedEvent: PersistedCalendarEvent[] = [];
  category: PersistedCalendarCategory[] = [];
  addedCategory: NewCalendarCategory[] = [];
  removedCategoryIds: CalendarCategoryId[] = [];
  updatedCategory: PersistedCalendarCategory[] = [];
  dirtyFields: Set<keyof CalendarProps> = new Set();
}

export abstract class Calendar {
  private readonly _props: CalendarProps;
  protected _internal: CalendarState;

  constructor(props: CalendarProps, newCalendar?: NewCalendarImpl) {
    this._props = { ...props };
    this._internal = newCalendar?._internal ?? new CalendarState();
  }

  static create(props: CalendarCreateProps): NewCalendar {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.create() call!
    return new NewCalendarImpl(props);
  }

  static rehydrate(props: CalendarHydrationProps): PersistedCalendar {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.rehydrate() call!
    return new PersistedCalendarImpl(props);
  }

  static promote(newCalendar: NewCalendarImpl, persisted: { id: CalendarId; createdAt: Date }): PersistedCalendar {
    const props = { ...newCalendar._props, ...persisted };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.promote() call!
    return new PersistedCalendarImpl(props, newCalendar);
  }

  // --------------------------
  // Getters
  // --------------------------
  // #region getters
  get companyId() {
    return this._props.companyId;
  }
  // #endregion getters

  abstract isPersisted(): boolean;

  // --------------------------
  // Domain actions – Calendar
  // --------------------------
  // #region actions/calendar
  pullCategoryChanges() {
    return {
      addedCategory: this._internal.addedCategory,
      removedCategoryIds: this._internal.removedCategoryIds,
      updatedCategory: this._internal.updatedCategory,
    };
  }

  pullEventChanges() {
    return {
      addedEvent: this._internal.addedEvent,
      removedEventIds: this._internal.removedEventIds,
      updatedEvent: this._internal.updatedEvent,
    };
  }

  commit() {
    this._internal.dirtyFields.clear();
  }

  commitCategories(newCategories: PersistedCalendarCategory[]) {
    this._internal.category.push(...newCategories);
    this._internal.addedCategory = [];
    this._internal.updatedCategory = [];
    this._internal.removedCategoryIds = [];

    for (const category of this._internal.category) {
      category.commit();
    }
  }

  commitEvents(newEvents: PersistedCalendarEvent[]) {
    this._internal.event.push(...newEvents);
    this._internal.addedEvent = [];
    this._internal.updatedEvent = [];
    this._internal.removedEventIds = [];

    for (const event of this._internal.event) {
      event.commit();
    }
  }

  hasDirtyFields() {
    return this._internal.dirtyFields.size > 0;
  }

  getDirtyRootFields(): (keyof CalendarProps)[] {
    return [...this._internal.dirtyFields];
  }

  pullDirtyFields(): Partial<CalendarProps> {
    const update: Partial<CalendarProps> = {};

    this._internal.dirtyFields.forEach(<K extends keyof CalendarProps>(key: K) => {
      // eslint-disable-next-line security/detect-object-injection
      update[key] = this._props[key];
    });

    return update;
  }
  // #endregion actions/calendar

  // --------------------------
  // Domain actions – Category
  // --------------------------
  // #region actions/category
  addCalendarCategory(props: CalendarCategoryCreateProps): NewCalendarCategory {
    const calendarCategory = CalendarCategory.create(props);
    this._internal.addedCategory.push(calendarCategory);
    return calendarCategory;
  }

  updateCalendarCategory(props: CalendarCategoryUpdateProps): PersistedCalendarCategory {
    const calendarCategory = this._internal.category.find((category) => category.id === props.id);
    if (!calendarCategory) throw new DomainError({ message: 'Calendar-category not found' });

    calendarCategory.updateCategory(props);
    this._internal.updatedCategory.push(calendarCategory);
    return calendarCategory;
  }

  removeCalendarCategory(id: CalendarCategoryId) {
    const calendarCategoryIndex = this._internal.category.findIndex((n) => n.id === id);
    if (calendarCategoryIndex === -1) throw new DomainError({ message: 'Calendar-category not found' });

    this._internal.removedCategoryIds.push(id);
    this._internal.category.splice(calendarCategoryIndex, 1);
  }

  findCalendarCategoryBySymbol(symbol: CalendarCategorySymbol) {
    return this._internal.category.find((c) => c.symbol === symbol);
  }

  getCalendarCategoryBySymbol(symbol: CalendarCategorySymbol) {
    const calendarCategory = this._internal.category.find((c) => c.symbol === symbol);
    if (!calendarCategory) throw new DomainError({ message: 'Calendar-category not found' });
    return calendarCategory;
  }
  // #endregion actions/category

  // --------------------------
  // Domain actions – Event
  // --------------------------
  // #region actions/event
  addCalendarEvent(props: CalendarEventCreateProps): NewCalendarEvent {
    const calendarEvent = CalendarEvent.create(props);
    this._internal.addedEvent.push(calendarEvent);
    return calendarEvent;
  }

  updateCalendarEvent(props: CalendarEventUpdateProps): PersistedCalendarEvent {
    const calendarEvent = this._internal.event.find((event) => event.id === props.id);
    if (!calendarEvent) throw new DomainError({ message: 'Calendar-event not found' });

    calendarEvent.updateEvent(props);
    this._internal.updatedEvent.push(calendarEvent);
    return calendarEvent;
  }

  removeCalendarEvent(id: CalendarEventId) {
    const calendarEventIndex = this._internal.event.findIndex((n) => n.id === id);
    if (calendarEventIndex === -1) throw new DomainError({ message: 'Calendar-event not found' });

    this._internal.removedEventIds.push(id);
    this._internal.event.splice(calendarEventIndex, 1);
  }

  findCalendarEventBySymbol(symbol: CalendarEventSymbol) {
    return this._internal.event.find((e) => e.symbol === symbol);
  }

  getCalendarEventBySymbol(symbol: CalendarEventSymbol) {
    const calendarEvent = this._internal.event.find((e) => e.symbol === symbol);
    if (!calendarEvent) throw new DomainError({ message: 'CalendarEvent not found' });
    return calendarEvent;
  }
  // #endregion actions/event
}

class NewCalendarImpl extends Calendar {
  constructor(props: CalendarCreateProps) {
    super(props);
  }

  isPersisted(): this is PersistedCalendar {
    return false;
  }
}

class PersistedCalendarImpl extends Calendar {
  private readonly _id: CalendarId;
  private readonly _createdAt: Date;

  constructor(props: CalendarHydrationProps, newCalendar?: NewCalendarImpl) {
    super(props, newCalendar);
    this._id = props.id;
    this._createdAt = props.createdAt;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  isPersisted(): this is PersistedCalendar {
    return true;
  }
}
