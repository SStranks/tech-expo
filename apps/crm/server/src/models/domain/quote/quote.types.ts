import type { UUID } from '@apps/crm-shared';

export type QuoteStage = (typeof QUOTE_STAGE)[number];
export const QUOTE_STAGE = ['DRAFT', 'SENT', 'ACCEPTED'] as const;

export type QuoteId = UUID & { readonly __quoteId: unique symbol };
