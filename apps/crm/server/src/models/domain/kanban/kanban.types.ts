import type { UUID } from '@apps/crm-shared';

export type KanbanId = UUID & { readonly __kanbanId: 'KanbanId' };
export type KanbanClientGeneratedId = UUID & { readonly __kanbanClientGeneratedId: 'KanbanClientGeneratedId' };
