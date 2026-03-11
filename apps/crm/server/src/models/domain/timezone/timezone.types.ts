import type { UUID } from '@apps/crm-shared';

export type TimeZoneId = UUID & { readonly __timeZoneId: unique symbol };
export type TimeZoneClientId = UUID & { readonly __timeZoneClientId: unique symbol };
