import type { UUID } from '@apps/crm-shared';

export type CalendarCategoryId = UUID & { readonly __calendarCategoryId: 'CalendarCategoryId' };

export type CalendarCategoryClientGeneratedId = UUID & {
  readonly __calendarCategoryClientGeneratedId: 'CalendarCategoryClientGeneratedId';
};
