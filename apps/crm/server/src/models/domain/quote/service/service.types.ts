import type { UUID } from '@apps/crm-shared';

export type QuoteServiceId = UUID & { readonly __quoteServiceId: 'QuoteServiceId' };
export type QuoteServiceClientId = UUID & { readonly __quoteServiceClientId: 'QuoteServiceClientId' };
