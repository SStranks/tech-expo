import type { UUID } from '@apps/crm-shared';

export type TimeZoneId = UUID & { readonly __timeZoneId: unique symbol };
