import type { UUID } from '@apps/crm-shared';

export type KanbanStageId = UUID & { readonly __kanbanStageId: 'KanbanStageId' };
export type KanbanStageClientId = UUID & { readonly __kanbanStageClientId: 'KanbanStageClientId' };
