import type { UUID } from '@apps/crm-shared';

export type KanbanId = UUID & { readonly __kanbanId: unique symbol };
export type KanbanClientId = UUID & { readonly __kanbanClientId: unique symbol };
