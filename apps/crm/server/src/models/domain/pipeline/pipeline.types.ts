import type { UUID } from '@apps/crm-shared';

export type PipelineId = UUID & { readonly __pipelineId: 'PipelineId' };
export type PipelineClientId = UUID & { readonly __pipelineClientId: 'PipelineClientId' };
