import type { UUID } from '@apps/crm-shared';

export type KanbanTaskId = UUID & { readonly __kanbanTaskId: unique symbol };
export type KanbanTaskSymbol = UUID & { readonly __kanbanTaskSymbol: unique symbol };
export type KanbanTaskCommentSymbol = UUID & { readonly __kanbanTaskCommentSymbol: unique symbol };
export type KanbanTaskChecklistSymbol = UUID & { readonly __kanbanTaskChecklistSymbol: unique symbol };
