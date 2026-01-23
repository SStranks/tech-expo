import type { UUID } from '@apps/crm-shared';

export type CalendarCategoryId = UUID & { readonly __calendarCategoryId: unique symbol };
