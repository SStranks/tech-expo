import type { UUID } from '@apps/crm-shared';

export type TimeZoneId = UUID & { readonly __timeZoneId: 'TimeZoneId' };
export type TimeZoneClientId = UUID & { readonly __timeZoneClientId: 'TimeZoneClientId' };
