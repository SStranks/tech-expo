import type { UUID } from '@apps/crm-shared';

export type PipelineDealId = UUID & { readonly __pipelineDealId: 'PipelineDealId' };
export type PipelineDealClientId = UUID & { readonly __pipelineDealClientId: 'PipelineDealClientId' };
