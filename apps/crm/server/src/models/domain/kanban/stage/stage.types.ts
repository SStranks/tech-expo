import type { UUID } from '@apps/crm-shared';

export type KanbanStageId = UUID & { readonly __kanbanStageId: unique symbol };
export type KanbanStageClientId = UUID & { readonly __kanbanStageClientId: unique symbol };
