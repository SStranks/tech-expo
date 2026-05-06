import type { PayloadAction } from '@reduxjs/toolkit';

import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { ReduxRootState } from '@Redux/store';

import type {
  CreateStageOptimisticPayload,
  CreateStagePayload,
  CreateTaskOptimisticPayload,
  CreateTaskPayload,
  DeleteAllTasksInStagePayload,
  DeleteSaveRequestPayload,
  DeleteStagePayload,
  DeleteTaskPayload,
  PendingStageDelete,
  PendingStageUpdate,
  PendingTaskDelete,
  PendingTaskMove,
  PendingTaskUpdate,
  SaveRequest,
  UndoTaskMovePayload,
  UpdateStagePayload,
  UpdateTaskPayload,
} from './kanban.types';

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { initialData } from '@Data/MockScrumboardKanban';
import { toUUID } from '@Types/uuid';

import {
  createStageThunk,
  createTaskThunk,
  deleteStageThunk,
  deleteTaskThunk,
  moveTaskThunk,
  updateStageThunk,
  updateTaskThunk,
} from './kanban.thunks';

type KanbanState = {
  pendingTaskMoves: { [taskId: string]: PendingTaskMove };
  pendingTaskDeletes: { [taskId: string]: PendingTaskDelete };
  pendingTaskUpdates: { [taskId: string]: PendingTaskUpdate };
  pendingStageDeletes: { [stageId: string]: PendingStageDelete };
  pendingStageUpdates: { [stageId: string]: PendingStageUpdate };
  saveRequests: { [requestId: string]: SaveRequest };
  stageOrder: string[];
  stages: typeof stagesInitialState;
  tasks: typeof tasksInitialState;
};

const stagesAdapter = createEntityAdapter<KanbanStage>();
const tasksAdapter = createEntityAdapter<KanbanTask>();

const tasksInitialState = tasksAdapter.getInitialState({
  activeRequestIdByTask: {} as Record<string, string | undefined>,
});

const stagesInitialState = stagesAdapter.getInitialState({
  activeRequestIdByStage: {} as Record<string, string | undefined>,
});

const initialState: KanbanState = {
  pendingStageDeletes: {},
  pendingStageUpdates: {},
  pendingTaskDeletes: {},
  pendingTaskMoves: {},
  pendingTaskUpdates: {},
  saveRequests: {},
  stageOrder: initialData.stagesOrder,
  stages: stagesAdapter.addMany(stagesInitialState, initialData.stages),
  tasks: tasksAdapter.addMany(tasksInitialState, initialData.tasks),
};

const kanbanSlice = createSlice({
  name: 'scrumboardKanban',
  initialState,
  reducers: {
    createStage(state, action: PayloadAction<CreateStagePayload>) {
      stagesAdapter.addOne(state.stages, {
        ...action.payload,
        isPermanent: false,
      });

      state.stageOrder.push(action.payload.id);
    },
    createStageOptimistic(state, action: PayloadAction<CreateStageOptimisticPayload>) {
      stagesAdapter.addOne(state.stages, {
        ...action.payload,
        id: action.payload.tempId,
        isPermanent: false,
      });

      state.stageOrder.push(action.payload.tempId);
    },
    createTask(state, action: PayloadAction<CreateTaskPayload>) {
      tasksAdapter.addOne(state.tasks, action.payload);
    },
    createTaskOptimistic(state, action: PayloadAction<CreateTaskOptimisticPayload>) {
      tasksAdapter.addOne(state.tasks, { ...action.payload, id: action.payload.tempId });
    },
    deleteAllTasksInStage(state, action: PayloadAction<DeleteAllTasksInStagePayload>) {
      const taskIds = Object.values(state.tasks.entities)
        .filter((task) => task.stageId === action.payload.id)
        .map((task) => task.id);
      tasksAdapter.removeMany(state.tasks, taskIds);
    },
    deleteSaveRequest(state, action: PayloadAction<DeleteSaveRequestPayload>) {
      delete state.saveRequests[action.payload.requestId];
    },
    deleteStage(state, action: PayloadAction<DeleteStagePayload>) {
      stagesAdapter.removeOne(state.stages, action.payload.id);
      state.stageOrder = state.stageOrder.filter((id) => id !== action.payload.id);
    },
    deleteStageOptimistic(state, action: PayloadAction<DeleteStagePayload>) {
      stagesAdapter.removeOne(state.stages, action.payload.id);
      state.stageOrder = state.stageOrder.filter((id) => id !== action.payload.id);
    },
    deleteTask(state, action: PayloadAction<DeleteTaskPayload>) {
      tasksAdapter.removeOne(state.tasks, action.payload.id);
    },
    deleteTaskOptimistic(state, action: PayloadAction<DeleteTaskPayload>) {
      tasksAdapter.removeOne(state.tasks, action.payload.id);
    },
    undoTaskMove(state, action: PayloadAction<UndoTaskMovePayload>) {
      const pendingTaskMove = state.pendingTaskMoves[action.payload.id];
      if (!pendingTaskMove) return;
      const { orderKey, stageId } = pendingTaskMove;

      tasksAdapter.updateOne(state.tasks, {
        id: action.payload.id,
        changes: { orderKey, stageId },
      });

      delete state.pendingTaskMoves[action.payload.id];
    },
    updateStage(state, action: PayloadAction<UpdateStagePayload>) {
      const { id, ...changes } = action.payload;
      stagesAdapter.updateOne(state.stages, {
        id,
        changes,
      });
    },
    updateStageOptimistic(state, action: PayloadAction<UpdateStagePayload>) {
      const { id, ...changes } = action.payload;
      stagesAdapter.updateOne(state.stages, {
        id,
        changes,
      });
    },
    updateTask(state, action: PayloadAction<UpdateTaskPayload>) {
      const { id, ...changes } = action.payload;
      tasksAdapter.updateOne(state.tasks, { id, changes });
    },
    updateTaskOptimistic(state, action: PayloadAction<UpdateTaskPayload>) {
      const { id, ...changes } = action.payload;
      tasksAdapter.updateOne(state.tasks, { id, changes });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTaskThunk.pending, (state, { meta }) => {
        const tempId = toUUID(meta.requestId);
        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: tempId,
          status: 'pending',
        };

        kanbanSlice.caseReducers.createTaskOptimistic(state, {
          payload: { ...meta.arg, tempId },
          type: 'createTaskOptimistic',
        });
      })
      .addCase(createTaskThunk.rejected, (state, { error, meta }) => {
        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        const id = toUUID(meta.requestId);
        kanbanSlice.caseReducers.deleteTask(state, { payload: { id }, type: 'deleteTask' });
      })
      .addCase(createTaskThunk.fulfilled, (state, { meta, payload }) => {
        const id = toUUID(meta.requestId);
        // Substitute optimistic UUID for DB UUID
        const task = state.tasks.entities[id];
        if (!task) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        kanbanSlice.caseReducers.deleteTask(state, { payload: { id }, type: 'deleteTask' });
        // Preserve UI fields first - override with server truth
        kanbanSlice.caseReducers.createTask(state, { payload: { ...task, ...payload }, type: 'createTask' });

        delete state.saveRequests[meta.requestId];
      })
      .addCase(updateTaskThunk.pending, (state, { meta }) => {
        state.tasks.activeRequestIdByTask[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.tasks.entities[meta.arg.id];
        if (!previous) return;
        state.pendingTaskUpdates[meta.arg.id] = { previous, requestId: meta.requestId };

        kanbanSlice.caseReducers.updateTaskOptimistic(state, {
          payload: { ...meta.arg },
          type: 'updateTaskOptimistic',
        });
      })
      .addCase(updateTaskThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingTaskUpdates[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.tasks.activeRequestIdByTask[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        kanbanSlice.caseReducers.updateTask(state, { payload: { ...pending.previous }, type: 'updateTask ' });

        delete state.pendingTaskUpdates[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      })
      .addCase(updateTaskThunk.fulfilled, (state, { meta, payload }) => {
        if (state.tasks.activeRequestIdByTask[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        const task = state.tasks.entities[meta.arg.id];
        if (!task) return;

        kanbanSlice.caseReducers.updateTask(state, {
          payload: { ...task, ...payload },
          type: 'updateTask',
        });

        delete state.pendingTaskUpdates[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      })
      .addCase(deleteTaskThunk.pending, (state, { meta }) => {
        state.tasks.activeRequestIdByTask[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.tasks.entities[meta.arg.id];
        if (!previous) return;
        state.pendingTaskDeletes[meta.arg.id] = { previous, requestId: meta.requestId };

        kanbanSlice.caseReducers.deleteTaskOptimistic(state, {
          payload: { ...meta.arg },
          type: 'deleteTaskOptimistic',
        });
      })
      .addCase(deleteTaskThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingTaskDeletes[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.tasks.activeRequestIdByTask[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        kanbanSlice.caseReducers.createTask(state, { payload: { ...pending.previous }, type: 'createTask ' });

        delete state.pendingTaskDeletes[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      })
      .addCase(deleteTaskThunk.fulfilled, (state, { meta }) => {
        if (state.tasks.activeRequestIdByTask[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        delete state.pendingTaskDeletes[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      })
      .addCase(createStageThunk.pending, (state, { meta }) => {
        const tempId = toUUID(meta.requestId);
        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: tempId,
          status: 'pending',
        };

        kanbanSlice.caseReducers.createStageOptimistic(state, {
          payload: { ...meta.arg, tempId },
          type: 'createStageOptimistic',
        });
      })
      .addCase(createStageThunk.rejected, (state, { error, meta }) => {
        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        const id = toUUID(meta.requestId);
        kanbanSlice.caseReducers.deleteStage(state, { payload: { id }, type: 'deleteStage' });
      })
      .addCase(createStageThunk.fulfilled, (state, { meta, payload }) => {
        const id = toUUID(meta.requestId);
        // Substitute optimistic UUID for DB UUID
        const stage = state.stages.entities[id];
        if (!stage) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        kanbanSlice.caseReducers.deleteStage(state, { payload: { id }, type: 'deleteStage ' });
        kanbanSlice.caseReducers.createStage(state, { payload: { ...stage, ...payload }, type: 'createStage ' });

        delete state.saveRequests[meta.requestId];
      })
      .addCase(updateStageThunk.pending, (state, { meta }) => {
        state.stages.activeRequestIdByStage[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.stages.entities[meta.arg.id];
        if (!previous) return;
        state.pendingStageUpdates[meta.arg.id] = {
          previous,
          previousStageOrder: state.stageOrder,
          requestId: meta.requestId,
        };

        kanbanSlice.caseReducers.updateStageOptimistic(state, {
          payload: { ...meta.arg },
          type: 'updateStageOptimistic',
        });
      })
      .addCase(updateStageThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingStageUpdates[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.stages.activeRequestIdByStage[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        kanbanSlice.caseReducers.createStage(state, { payload: { ...pending.previous }, type: 'createStage ' });
        state.stageOrder = pending.previousStageOrder;

        delete state.pendingStageUpdates[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(updateStageThunk.fulfilled, (state, { meta, payload }) => {
        if (state.stages.activeRequestIdByStage[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        const stage = state.stages.entities[meta.arg.id];
        if (!stage) return;
        kanbanSlice.caseReducers.updateStage(state, {
          payload: { ...stage, ...payload },
          type: 'updateStage',
        });

        delete state.pendingStageUpdates[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(deleteStageThunk.pending, (state, { meta }) => {
        state.stages.activeRequestIdByStage[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.stages.entities[meta.arg.id];
        if (!previous) return;
        state.pendingStageDeletes[meta.arg.id] = {
          previous,
          previousStageOrder: state.stageOrder,
          requestId: meta.requestId,
        };

        kanbanSlice.caseReducers.deleteStageOptimistic(state, {
          payload: { ...meta.arg },
          type: 'deleteStageOptimistic',
        });
      })
      .addCase(deleteStageThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingStageDeletes[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.stages.activeRequestIdByStage[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        kanbanSlice.caseReducers.createStage(state, { payload: { ...pending.previous }, type: 'createStage ' });
        state.stageOrder = pending.previousStageOrder;

        delete state.pendingStageDeletes[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(deleteStageThunk.fulfilled, (state, { meta, payload }) => {
        if (state.stages.activeRequestIdByStage[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        kanbanSlice.caseReducers.deleteStage(state, {
          payload,
          type: 'deleteStage',
        });
        kanbanSlice.caseReducers.deleteAllTasksInStage(state, {
          payload: { id: meta.arg.id },
          type: 'deleteAllTasksInStage',
        });

        delete state.pendingStageDeletes[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(moveTaskThunk.pending, (state, { meta }) => {
        const previousTask = state.tasks.entities[meta.arg.id];
        if (!previousTask) return;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        state.pendingTaskMoves[meta.arg.id] = {
          orderKey: previousTask.orderKey,
          requestId: meta.requestId,
          stageId: previousTask.stageId,
        };

        state.tasks.activeRequestIdByTask[meta.arg.id] = meta.requestId;
      })
      .addCase(moveTaskThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingTaskMoves[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        tasksAdapter.updateOne(state.tasks, {
          id: meta.arg.id,
          changes: { orderKey: pending.orderKey, stageId: pending.stageId },
        });

        delete state.pendingTaskMoves[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      })
      .addCase(moveTaskThunk.fulfilled, (state, { meta, payload }) => {
        const pending = state.pendingTaskMoves[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        kanbanSlice.caseReducers.updateTask(state, { payload, type: 'updateTask' });

        delete state.pendingTaskMoves[meta.arg.id];
        delete state.tasks.activeRequestIdByTask[meta.arg.id];
      });
  },
});

export const stageSelectors = stagesAdapter.getSelectors((state: ReduxRootState) => state.scrumboardKanban.stages);
export const taskSelectors = tasksAdapter.getSelectors((state: ReduxRootState) => state.scrumboardKanban.tasks);

export const { deleteAllTasksInStage, deleteSaveRequest, undoTaskMove, updateTask } = kanbanSlice.actions;

export default kanbanSlice.reducer;
