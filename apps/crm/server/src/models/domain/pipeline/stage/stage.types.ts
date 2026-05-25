import type { UUID } from '@apps/crm-shared';

export type PipelineStageId = UUID & { readonly __pipelineStageId: 'PipelineStageId' };
export type PipelineStageClientGeneratedId = UUID & {
  readonly __pipelineStageClientGeneratedId: 'PipelineStageClientGeneratedId';
};
