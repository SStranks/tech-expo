import type { UUID } from '@apps/crm-shared';

export type KanbanTaskId = UUID & { readonly __kanbanTaskId: 'KanbanTaskId' };
export type KanbanTaskClientGeneratedId = UUID & {
  readonly __kanbanTaskClientGeneratedId: 'KanbanTaskClientGeneratedId';
};

export type KanbanTaskCommentId = UUID & { readonly __kanbanTaskCommentId: 'KanbanTaskCommentId' };
export type KanbanTaskCommentClientGeneratedId = UUID & {
  readonly __kanbanTaskCommentClientGeneratedId: 'KanbanTaskCommentClientGeneratedId';
};

export type KanbanTaskChecklistItemId = UUID & { readonly __kanbanTaskChecklistItemId: 'KanbanTaskChecklistItemId' };
export type KanbanTaskChecklistItemClientId = UUID & {
  readonly __kanbanTaskChecklistItemClientGeneratedId: 'KanbanTaskChecklistItemClientGeneratedId';
};
