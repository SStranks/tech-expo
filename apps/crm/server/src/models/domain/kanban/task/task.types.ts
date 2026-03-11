import type { UUID } from '@apps/crm-shared';

export type KanbanTaskId = UUID & { readonly __kanbanTaskId: unique symbol };
export type KanbanTaskClientId = UUID & { readonly __kanbanTaskClientId: unique symbol };
export type KanbanTaskCommentClientId = UUID & { readonly __kanbanTaskCommentClientId: unique symbol };
export type KanbanTaskChecklistClientId = UUID & { readonly __kanbanTaskChecklistClientId: unique symbol };
