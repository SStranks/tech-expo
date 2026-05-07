import type { UUID } from '@apps/crm-shared';

export type KanbanTaskId = UUID & { readonly __kanbanTaskId: 'KanbanTaskId' };
export type KanbanTaskClientId = UUID & { readonly __kanbanTaskClientId: 'KanbanTaskClientId' };
export type KanbanTaskCommentClientId = UUID & { readonly __kanbanTaskCommentClientId: 'KanbanTaskCommentClientId' };
export type KanbanTaskChecklistClientId = UUID & {
  readonly __kanbanTaskChecklistClientId: 'KanbanTaskChecklistClientId';
};
