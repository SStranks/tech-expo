import type { UUID } from '@apps/crm-shared';

export type KanbanId = UUID & { readonly __kanbanId: 'KanbanId' };
export type KanbanClientId = UUID & { readonly __kanbanClientId: 'KanbanClientId' };
