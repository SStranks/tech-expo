import type { UUID } from '@apps/crm-shared';

export type PipelineDealId = UUID & { readonly __pipelineDealId: 'PipelineDealId' };
export type PipelineDealClientGeneratedId = UUID & {
  readonly __pipelineDealClientGeneratedId: 'PipelineDealClientGeneratedId';
};
