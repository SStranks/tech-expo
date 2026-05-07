import type { UUID } from '@apps/crm-shared';

export type CalendarCategoryId = UUID & { readonly __calendarCategoryId: 'CalendarCategoryId' };

export type CalendarCategoryClientId = UUID & { readonly __calendarCategoryClientId: 'CalendarCategoryClientId' };
