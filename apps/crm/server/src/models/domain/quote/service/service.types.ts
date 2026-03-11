import type { UUID } from '@apps/crm-shared';

export type QuoteServiceId = UUID & { readonly __quoteServiceId: unique symbol };
export type QuoteServiceClientId = UUID & { readonly __quoteServiceClientId: unique symbol };
