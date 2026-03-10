import type { UUID } from '@apps/crm-shared';

export type CalendarEventId = UUID & { readonly __calendarEventId: unique symbol };

export type CalendarEventSymbol = UUID & { readonly __calendarEventSymbol: unique symbol };
