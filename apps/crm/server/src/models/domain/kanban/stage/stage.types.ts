import type { UUID } from '@apps/crm-shared';

export type KanbanStageId = UUID & { readonly __kanbanStageId: 'KanbanStageId' };
export type KanbanStageClientGeneratedId = UUID & {
  readonly __kanbanStageClientGeneratedId: 'KanbanStageClientGeneratedId';
};
