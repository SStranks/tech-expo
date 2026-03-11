import type { UUID } from '@apps/crm-shared';

export type PipelineDealId = UUID & { readonly __pipelineDealId: unique symbol };
export type PipelineDealSymbol = UUID & { readonly __pipelineDealSymbol: unique symbol };
