import type { PayloadAction } from '@reduxjs/toolkit';

import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';
import type { ReduxRootState } from '@Redux/store';

import type {
  CreateDealOptismisticPayload,
  CreateDealPayload,
  CreateStageOptimisticPayload,
  CreateStagePayload,
  DeleteAllDealsInStagePayload,
  DeleteDealPayload,
  DeleteSaveRequestPayload,
  DeleteStagePayload,
  PendingDealDelete,
  PendingDealMove,
  PendingDealUpdate,
  PendingStageDelete,
  PendingStageUpdate,
  SaveRequest,
  UndoDealMovePayload,
  UpdateDealPayload,
  UpdateStagePayload,
} from './pipeline.types';

import { toUUID } from '@apps/crm-shared/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { initialData } from '@Data/MockScrumboardPipeline';

import {
  createDealThunk,
  createStageThunk,
  deleteDealThunk,
  deleteStageThunk,
  moveDealThunk,
  updateDealThunk,
  updateStageThunk,
} from './pipeline.thunks';

type PipelineState = {
  pendingDealMoves: { [dealId: string]: PendingDealMove };
  pendingDealDeletes: { [dealId: string]: PendingDealDelete };
  pendingDealUpdates: { [dealId: string]: PendingDealUpdate };
  pendingStageDeletes: { [stageId: string]: PendingStageDelete };
  pendingStageUpdates: { [stageId: string]: PendingStageUpdate };
  saveRequests: { [requestId: string]: SaveRequest };
  stageOrder: string[];
  stages: typeof stagesInitialState;
  deals: typeof dealsInitialState;
};

const stagesAdapter = createEntityAdapter<PipelineStage>();
const dealsAdapter = createEntityAdapter<PipelineDeal>();

export interface ExtraDealsState {
  activeRequestIdByDeal: Record<string, string | undefined>;
}
export interface ExtraStagesState {
  activeRequestIdByStage: Record<string, string | undefined>;
}

const dealsInitialState = dealsAdapter.getInitialState<ExtraDealsState>({
  activeRequestIdByDeal: {},
});

const stagesInitialState = stagesAdapter.getInitialState<ExtraStagesState>({
  activeRequestIdByStage: {},
});

const initialState: PipelineState = {
  deals: dealsAdapter.addMany(dealsInitialState, initialData.deals),
  pendingDealDeletes: {},
  pendingDealMoves: {},
  pendingDealUpdates: {},
  pendingStageDeletes: {},
  pendingStageUpdates: {},
  saveRequests: {},
  stageOrder: initialData.stagesOrder,
  stages: stagesAdapter.addMany(stagesInitialState, initialData.stages),
};

const pipelineSlice = createSlice({
  name: 'scrumboardPipeline',
  initialState,
  reducers: {
    createDeal(state, action: PayloadAction<CreateDealPayload>) {
      dealsAdapter.addOne(state.deals, action.payload);
    },
    createDealOptimistic(state, action: PayloadAction<CreateDealOptismisticPayload>) {
      dealsAdapter.addOne(state.deals, { ...action.payload, id: action.payload.tempId });
    },
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
    deleteAllDealsInStage(state, action: PayloadAction<DeleteAllDealsInStagePayload>) {
      const dealIds = Object.values(state.deals.entities)
        .filter((deal) => deal.stageId === action.payload.id)
        .map((deal) => deal.id);
      dealsAdapter.removeMany(state.deals, dealIds);
    },
    deleteDeal(state, action: PayloadAction<DeleteDealPayload>) {
      dealsAdapter.removeOne(state.deals, action.payload.id);
    },
    deleteDealOptimistic(state, action: PayloadAction<DeleteDealPayload>) {
      dealsAdapter.removeOne(state.deals, action.payload.id);
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
    undoDealMove(state, action: PayloadAction<UndoDealMovePayload>) {
      const pendingDealMove = state.pendingDealMoves[action.payload.id];
      if (!pendingDealMove) return;
      const { orderKey, stageId } = pendingDealMove;

      dealsAdapter.updateOne(state.deals, {
        id: action.payload.id,
        changes: { orderKey, stageId },
      });

      delete state.pendingDealMoves[action.payload.id];
    },
    updateDeal(state, action: PayloadAction<UpdateDealPayload>) {
      const { id, ...changes } = action.payload;
      dealsAdapter.updateOne(state.deals, { id, changes });
    },
    updateDealOptimistic(state, action: PayloadAction<UpdateDealPayload>) {
      const { id, ...changes } = action.payload;
      dealsAdapter.updateOne(state.deals, { id, changes });
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDealThunk.pending, (state, { meta }) => {
        const tempId = toUUID(meta.requestId);
        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: tempId,
          status: 'pending',
        };

        pipelineSlice.caseReducers.createDealOptimistic(state, {
          payload: { ...meta.arg, tempId },
          type: 'createDealOptimistic',
        });
      })
      .addCase(createDealThunk.rejected, (state, { error, meta }) => {
        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        const id = toUUID(meta.requestId);
        pipelineSlice.caseReducers.deleteDeal(state, { payload: { id }, type: 'deleteDeal' });
      })
      .addCase(createDealThunk.fulfilled, (state, { meta, payload }) => {
        const id = toUUID(meta.requestId);
        // Substitute optimistic UUID for DB UUID
        const deal = state.deals.entities[id];
        if (!deal) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        pipelineSlice.caseReducers.deleteDeal(state, { payload: { id }, type: 'deleteDeal' });
        // Preserve UI fields first - override with server truth
        pipelineSlice.caseReducers.createDeal(state, { payload: { ...deal, ...payload }, type: 'createDeal' });

        delete state.saveRequests[meta.requestId];
      })
      .addCase(updateDealThunk.pending, (state, { meta }) => {
        state.deals.activeRequestIdByDeal[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.deals.entities[meta.arg.id];
        if (!previous) return;
        state.pendingDealUpdates[meta.arg.id] = { previous, requestId: meta.requestId };

        pipelineSlice.caseReducers.updateDealOptimistic(state, {
          payload: { ...meta.arg },
          type: 'updateDealOptimistic',
        });
      })
      .addCase(updateDealThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingDealUpdates[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.deals.activeRequestIdByDeal[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        delete state.pendingDealUpdates[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      })
      .addCase(updateDealThunk.fulfilled, (state, { meta, payload }) => {
        if (state.deals.activeRequestIdByDeal[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        const deal = state.deals.entities[meta.arg.id];
        if (!deal) return;

        pipelineSlice.caseReducers.updateDeal(state, {
          payload: { ...deal, ...payload },
          type: 'updateDeal',
        });

        delete state.pendingDealUpdates[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      })
      .addCase(deleteDealThunk.pending, (state, { meta }) => {
        state.deals.activeRequestIdByDeal[meta.arg.id] = meta.requestId;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        const previous = state.deals.entities[meta.arg.id];
        if (!previous) return;
        state.pendingDealDeletes[meta.arg.id] = { previous, requestId: meta.requestId };

        pipelineSlice.caseReducers.deleteDealOptimistic(state, {
          payload: { ...meta.arg },
          type: 'deleteDealOptimistic',
        });
      })
      .addCase(deleteDealThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingDealDeletes[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;
        if (state.deals.activeRequestIdByDeal[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        pipelineSlice.caseReducers.createDeal(state, { payload: { ...pending.previous }, type: 'createDeal ' });

        delete state.pendingDealDeletes[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      })
      .addCase(deleteDealThunk.fulfilled, (state, { meta }) => {
        if (state.deals.activeRequestIdByDeal[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        delete state.pendingDealDeletes[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      })
      .addCase(createStageThunk.pending, (state, { meta }) => {
        const tempId = toUUID(meta.requestId);
        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: tempId,
          status: 'pending',
        };

        pipelineSlice.caseReducers.createStageOptimistic(state, {
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
        pipelineSlice.caseReducers.deleteStage(state, { payload: { id }, type: 'deleteStage ' });
      })
      .addCase(createStageThunk.fulfilled, (state, { meta, payload }) => {
        // Substitute optimistic UUID for DB UUID
        const id = toUUID(meta.requestId);
        const stage = state.stages.entities[id];
        if (!stage) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        pipelineSlice.caseReducers.deleteStage(state, {
          payload: { id },
          type: 'deleteStage ',
        });
        pipelineSlice.caseReducers.createStage(state, { payload: { ...stage, ...payload }, type: 'createStage ' });

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

        pipelineSlice.caseReducers.updateStageOptimistic(state, {
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

        pipelineSlice.caseReducers.createStage(state, { payload: { ...pending.previous }, type: 'createStage ' });
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

        pipelineSlice.caseReducers.updateStage(state, {
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

        pipelineSlice.caseReducers.deleteStageOptimistic(state, {
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

        pipelineSlice.caseReducers.createStage(state, { payload: { ...pending.previous }, type: 'createStage ' });
        state.stageOrder = pending.previousStageOrder;

        delete state.pendingStageDeletes[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(deleteStageThunk.fulfilled, (state, { meta, payload }) => {
        if (state.stages.activeRequestIdByStage[meta.arg.id] !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        pipelineSlice.caseReducers.deleteStage(state, {
          payload,
          type: 'deleteStage',
        });
        pipelineSlice.caseReducers.deleteAllDealsInStage(state, {
          payload: { id: meta.arg.id },
          type: 'deleteAllDealsInStage',
        });

        delete state.pendingStageDeletes[meta.arg.id];
        delete state.stages.activeRequestIdByStage[meta.arg.id];
      })
      .addCase(moveDealThunk.pending, (state, { meta }) => {
        const previousDeal = state.deals.entities[meta.arg.id];
        if (!previousDeal) return;

        state.saveRequests[meta.requestId] = {
          attempt: 0,
          entityId: meta.arg.id,
          status: 'pending',
        };

        state.pendingDealMoves[meta.arg.id] = {
          orderKey: previousDeal.orderKey,
          requestId: meta.requestId,
          stageId: previousDeal.stageId,
        };

        state.deals.activeRequestIdByDeal[meta.arg.id] = meta.requestId;
      })
      .addCase(moveDealThunk.rejected, (state, { error, meta }) => {
        const pending = state.pendingDealMoves[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'rejected';
        req.attempt += 1;
        req.error = error;

        dealsAdapter.updateOne(state.deals, {
          id: meta.arg.id,
          changes: { orderKey: pending.orderKey, stageId: pending.stageId },
        });

        delete state.pendingDealMoves[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      })
      .addCase(moveDealThunk.fulfilled, (state, { meta, payload }) => {
        const pending = state.pendingDealMoves[meta.arg.id];
        if (!pending || pending.requestId !== meta.requestId) return;

        const req = state.saveRequests[meta.requestId];
        if (!req) return;
        req.status = 'fulfilled';

        pipelineSlice.caseReducers.updateDeal(state, { payload, type: 'updateDeal' });

        delete state.pendingDealMoves[meta.arg.id];
        delete state.deals.activeRequestIdByDeal[meta.arg.id];
      });
  },
});

export const stageSelectors = stagesAdapter.getSelectors((state: ReduxRootState) => state.scrumboardPipeline.stages);
export const dealSelectors = dealsAdapter.getSelectors((state: ReduxRootState) => state.scrumboardPipeline.deals);

export const { deleteAllDealsInStage, deleteSaveRequest, undoDealMove, updateDeal } = pipelineSlice.actions;

export default pipelineSlice.reducer;
