import type { UUID } from '@apps/crm-shared';

export type PipelineId = UUID & { readonly __pipelineId: unique symbol };
