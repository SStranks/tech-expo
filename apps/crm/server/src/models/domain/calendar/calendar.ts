import type { CompanyId } from '../company/company.types.js';
import type { CalendarId } from './calendar.types.js';

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

export abstract class Calendar {
  private readonly _companyId: CompanyId;

  constructor(props: CalendarProps) {
    this._companyId = props.companyId;
  }

  static create(props: CalendarCreateProps): NewCalendar {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.create() call!
    return new NewCalendarImpl(props);
  }

  static rehydrate(props: CalendarHydrationProps): PersistedCalendar {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- no top-level Calendar.rehydrate() call!
    return new PersistedCalendarImpl(props);
  }

  get company() {
    return this._companyId;
  }

  abstract isPersisted(): boolean;
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

  constructor(props: CalendarHydrationProps) {
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

  isPersisted(): this is PersistedCalendar {
    return false;
  }
}
