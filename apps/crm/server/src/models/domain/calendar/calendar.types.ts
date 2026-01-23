import type { UUID } from '@apps/crm-shared';

export type CalendarId = UUID & { readonly __calendarId: unique symbol };
