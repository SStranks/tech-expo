import type { UUID } from '@apps/crm-shared';

export type CalendarEventId = UUID & { readonly __calendarEventId: 'CalendarEventId' };

export type CalendarEventClientGeneratedId = UUID & {
  readonly __calendarEventClientGeneratedId: 'CalendarEventClientGeneratedId';
};
