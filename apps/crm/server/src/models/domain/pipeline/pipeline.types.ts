import type { UUID } from '@apps/crm-shared';

export type PipelineId = UUID & { readonly __pipelineId: unique symbol };
export type PipelineSymbol = UUID & { readonly __pipelineSymbol: unique symbol };
