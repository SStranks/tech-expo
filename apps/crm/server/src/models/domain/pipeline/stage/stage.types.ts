import type { UUID } from '@apps/crm-shared';

export type PipelineStageId = UUID & { readonly __pipelineStageId: unique symbol };
