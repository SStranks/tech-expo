import type { UUID } from '@apps/crm-shared';

export type KanbanStageId = UUID & { readonly __kanbanStageId: unique symbol };
