import type { UUID } from '@apps/crm-shared';

export type PipelineStageId = UUID & { readonly __pipelineStageId: unique symbol };
export type PipelineStageClientId = UUID & { readonly __pipelineStageClientId: unique symbol };
