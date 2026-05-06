import type { UUID } from '@apps/crm-shared';
import type { SerializedError } from '@reduxjs/toolkit';

import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';

// ---------- Slice --------- //

export type PendingTaskUpdate = {
  previous: KanbanTask;
  requestId: string;
};

export type PendingStageUpdate = {
  previous: KanbanStage;
  previousStageOrder: string[];
  requestId: string;
};

export type PendingTaskDelete = PendingTaskUpdate;
export type PendingStageDelete = PendingStageUpdate;

export type PendingTaskMove = {
  orderKey: KanbanTask['orderKey'];
  requestId: string;
  stageId: KanbanStage['id'];
};

export type SaveRequest = {
  status: 'pending' | 'retrying' | 'rejected' | 'fulfilled';
  entityId: string;
  attempt: number;
  error?: SerializedError;
};

// ---------- Thunks --------- //

export type CreateTaskPayload = KanbanTask;
export type CreateTaskOptimisticPayload = Omit<CreateTaskPayload, 'id'> & { tempId: UUID };
export type CreateTaskThunkReturn = CreateTaskPayload & { id: UUID };
export type CreateTaskThunkArg = Omit<CreateTaskPayload, 'id'>;

export type UpdateTaskPayload = Pick<KanbanTask, 'id'> & Partial<Omit<KanbanTask, 'id'>>;
export type UpdateTaskThunkReturn = UpdateTaskPayload;
export type UpdateTaskThunkArg = UpdateTaskPayload;

export type DeleteTaskPayload = Pick<KanbanTask, 'id'>;
export type DeleteTaskThunkReturn = DeleteTaskPayload;
export type DeleteTaskThunkArg = DeleteTaskPayload;

export type DeleteAllTasksInStagePayload = Pick<KanbanStage, 'id'>;

export type MoveTaskPayload = Pick<KanbanTask, 'id' | 'orderKey' | 'stageId'>;
export type MoveTaskThunkReturn = MoveTaskPayload;
export type MoveTaskThunkArg = MoveTaskPayload;

export type UndoTaskMovePayload = Pick<KanbanTask, 'id'>;

export type CreateStagePayload = Omit<KanbanStage, 'isPermanent'>;
export type CreateStageOptimisticPayload = Omit<CreateStagePayload, 'id' | 'isPermanent'> & { tempId: UUID };
export type CreateStageThunkReturn = CreateStagePayload & { id: UUID };
export type CreateStageThunkArg = Omit<CreateStagePayload, 'id' | 'isPermanent'>;

export type UpdateStagePayload = Pick<KanbanStage, 'id'> & Partial<Omit<KanbanStage, 'id'>>;
export type UpdateStageThunkReturn = UpdateStagePayload;
export type UpdateStageThunkArg = UpdateStagePayload;

export type DeleteStagePayload = Pick<KanbanStage, 'id'>;
export type DeleteStageThunkReturn = DeleteStagePayload;
export type DeleteStageThunkArg = DeleteStagePayload;

export type DeleteSaveRequestPayload = { requestId: string };
