import type { UUID } from '@apps/crm-shared';

import type { CompanyId } from '../company/company.types.js';
import type { CalendarId } from './calendar.types.js';
import type {
  CalendarCategoryCreateProps,
  CalendarCategoryUpdateProps,
  NewCalendarCategory,
  PersistedCalendarCategory,
} from './categories/categories.js';
import type { CalendarCategoryClientId, CalendarCategoryId } from './categories/categories.types.js';
import type { CalendarEventClientId, CalendarEventId } from './events/event.types.js';
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
  eventById: Map<UUID, PersistedCalendarEvent> = new Map();
  eventByClientId: Map<CalendarEventClientId, UUID> = new Map();
  addedEvent: Map<CalendarEventClientId, NewCalendarEvent> = new Map();
  removedEventIds: Set<CalendarEventId> = new Set();
  updatedEvent: Map<UUID, PersistedCalendarEvent> = new Map();
  categoryById: Map<UUID, PersistedCalendarCategory> = new Map();
  categoryByClientId: Map<CalendarCategoryClientId, UUID> = new Map();
  addedCategory: Map<CalendarCategoryClientId, NewCalendarCategory> = new Map();
  removedCategoryIds: Set<CalendarCategoryId> = new Set();
  updatedCategory: Map<UUID, PersistedCalendarCategory> = new Map();
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
    for (const category of newCategories) {
      this._internal.categoryById.set(category.id, category);
      this._internal.categoryByClientId.set(category.clientId, category.id);
    }
    this._internal.addedCategory.clear();
    this._internal.updatedCategory.clear();
    this._internal.removedCategoryIds.clear();

    for (const category of this._internal.categoryById.values()) {
      category.commit();
    }
  }

  commitEvents(newEvents: PersistedCalendarEvent[]) {
    for (const event of newEvents) {
      this._internal.eventById.set(event.id, event);
      this._internal.eventByClientId.set(event.clientId, event.id);
    }
    this._internal.addedEvent.clear();
    this._internal.updatedEvent.clear();
    this._internal.removedEventIds.clear();

    for (const event of this._internal.eventById.values()) {
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
    this._internal.addedCategory.set(calendarCategory.clientId, calendarCategory);
    return calendarCategory;
  }

  updateCalendarCategory(props: CalendarCategoryUpdateProps): PersistedCalendarCategory {
    const calendarCategory = this._internal.categoryById.get(props.id);
    if (!calendarCategory) throw new DomainError({ message: 'Calendar-category not found' });

    calendarCategory.updateCategory(props);
    this._internal.updatedCategory.set(calendarCategory.id, calendarCategory);
    return calendarCategory;
  }

  removeCalendarCategory(id: CalendarCategoryId) {
    const calendarCategory = this._internal.categoryById.get(id);
    if (!calendarCategory) throw new DomainError({ message: 'Calendar-category not found' });

    this._internal.removedCategoryIds.add(id);
    this._internal.categoryById.delete(id);
    this._internal.categoryByClientId.delete(calendarCategory.clientId);
  }

  findCalendarCategoryByClientId(clientId: CalendarCategoryClientId) {
    return this._internal.categoryByClientId.get(clientId);
  }

  getCalendarCategoryByClientId(clientId: CalendarCategoryClientId) {
    const calendarCategoryUUID = this.findCalendarCategoryByClientId(clientId);
    if (!calendarCategoryUUID) throw new DomainError({ message: 'Calendar-category not found' });
    const calendarCategory = this._internal.categoryById.get(calendarCategoryUUID);
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
    this._internal.addedEvent.set(calendarEvent.clientId, calendarEvent);
    return calendarEvent;
  }

  updateCalendarEvent(props: CalendarEventUpdateProps): PersistedCalendarEvent {
    const calendarEvent = this._internal.eventById.get(props.id);
    if (!calendarEvent) throw new DomainError({ message: 'Calendar-event not found' });

    calendarEvent.updateEvent(props);
    this._internal.updatedEvent.set(calendarEvent.id, calendarEvent);
    return calendarEvent;
  }

  removeCalendarEvent(id: CalendarEventId) {
    const calendarEvent = this._internal.eventById.get(id);
    if (!calendarEvent) throw new DomainError({ message: 'Calendar-event not found' });

    this._internal.removedEventIds.add(id);
    this._internal.eventById.delete(id);
    this._internal.eventByClientId.delete(calendarEvent.clientId);
  }

  findCalendarEventByClientId(clientId: CalendarEventClientId) {
    return this._internal.eventByClientId.get(clientId);
  }

  getCalendarEventByClientId(clientId: CalendarEventClientId) {
    const calendarEventUUID = this.findCalendarEventByClientId(clientId);
    if (!calendarEventUUID) throw new DomainError({ message: 'Calendar-event not found' });
    const calendarEvent = this._internal.eventById.get(calendarEventUUID);
    if (!calendarEvent) throw new DomainError({ message: 'Calendar-event not found' });
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
