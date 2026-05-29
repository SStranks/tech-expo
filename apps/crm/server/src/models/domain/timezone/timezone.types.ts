import type { UUID } from '@apps/crm-shared';

export type TimeZoneId = UUID & { readonly __timeZoneId: 'TimeZoneId' };
export type TimeZoneClientGeneratedId = UUID & { readonly __timeZoneClientGeneratedId: 'TimeZoneClientGeneratedId' };
