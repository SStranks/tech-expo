import type { UUID } from '@apps/crm-shared';

export type KanbanStageId = UUID & { readonly __kanbanStageId: unique symbol };
export type KanbanStageSymbol = UUID & { readonly __kanbanStageSymbol: unique symbol };
