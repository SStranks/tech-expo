import type { UUID } from '@apps/crm-shared';

export type PipelineDealId = UUID & { readonly __pipelineDealId: unique symbol };
