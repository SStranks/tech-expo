import type { UUID } from '@apps/crm-shared';

export type KanbanTaskId = UUID & { readonly __kanbanTaskId: unique symbol };
