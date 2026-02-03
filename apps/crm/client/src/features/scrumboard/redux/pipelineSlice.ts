import type { PayloadAction } from '@reduxjs/toolkit';

import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';
import type { ReduxRootState } from '@Redux/store';

import { sortOrderKeys } from '@apps/crm-shared/utils';
import { createAsyncThunk, createListenerMiddleware, createSelector, createSlice } from '@reduxjs/toolkit';

import { initialData } from '@Data/MockScrumboardPipeline';
import CompanyLogo from '@Img/CompanyLogo.png';
import UserImage from '@Img/image-35.jpg'; // TEMP DEV: .

type MoveDealPayload = {
  destinationStageId: string;
  destinationDealOrderKey: string;
  sourceDealId: string;
};

type CreateDealPayload = {
  stageId: PipelineStage['id'];
  companyTitle: string;
  dealTitle: string;
  dealStage: string;
  dealTotal: number;
  dealOwner: string;
  dealValue: number;
};

type OperationalStatus = 'idle' | 'pending' | 'succeeded' | 'failed';
type PipelineEntityType = 'task' | 'column';
type SaveRequest = {
  status: OperationalStatus;
  entityId: string;
  entityType: PipelineEntityType;
};

type PendingDealMove = {
  sourceStageId: PipelineStage['id'];
  sourceDealId: PipelineDeal['id'];
  sourceDealOrderKey: PipelineDeal['orderKey'];
};
type PipelineInitialState = {
  stages: { byId: { [id: string]: PipelineStage }; allIds: PipelineStage['id'][] };
  stageOrder: string[];
  error?: string;
  pendingDealMoves: { [requestId: string]: PendingDealMove };
  deals: {
    byId: { [taskId: string]: PipelineDeal };
    allIds: PipelineDeal['id'][];
    byStageId: { [stageId: string]: PipelineDeal['id'][] };
  };
  saveRequests: { [key: string]: SaveRequest };
};

const initialState: PipelineInitialState = {
  error: undefined,
  pendingDealMoves: {},
  saveRequests: {},
  stageOrder: initialData.columnOrder,
  deals: {
    allIds: initialData.deals.map(({ id }) => id),
    byId: Object.fromEntries(initialData.deals.map((task) => [task.id, task])),
    byStageId: Object.fromEntries(
      initialData.columns.map((column) => [
        column.id,
        initialData.deals.filter((deal) => deal.stageId === column.id).map((deal) => deal.id),
      ])
    ),
  },
  stages: {
    allIds: initialData.columns.map(({ id }) => id),
    byId: Object.fromEntries(initialData.columns.map((column) => [column.id, column])),
  },
};

// TEMP DEV:
export const mockSaveState = createAsyncThunk('pipeline/mockSaveState', async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return;
});

// type MoveTaskThunkSuccess = { requestId: string };
// type MoveTaskThunkArg = { test: string };
// export type MoveTaskThunkRejected = { rejectValue: { error: unknown; requestId: string } };
// export const moveTask = createAsyncThunk<MoveTaskThunkSuccess, MoveTaskThunkArg, MoveTaskThunkRejected>(
//   'pipeline/moveTask',
//   async (_arg, thunkApi) => {
//     const { rejectWithValue, requestId } = thunkApi;
//     try {
//       const response = await serviceHttp.accountIdentify();
//       return { requestId, response };
//     } catch (error) {
//       return rejectWithValue({ error, requestId });
//     }
//   }
// );

type MoveDealBody = {
  sourceDealId: PipelineDeal['id'];
  sourceDealOrderKey: PipelineDeal['orderKey'];
  sourceStageId: PipelineStage['id'];
  destinationDealStageId: PipelineDeal['stageId'];
  destinationDealOrderKey: PipelineDeal['orderKey'];
};
export const moveDeal = createAsyncThunk('pipeline/moveTask', async (_body: MoveDealBody) => {
  try {
    // TODO: Submit to DB
    new Promise((resolve) => setTimeout(() => resolve(''), 300));
    return;
  } catch (error) {
    return error;
  }
});

// TODO:  Error handling/boundary inside reducers.
const pipelineSlice = createSlice({
  name: 'scrumboardPipeline',
  initialState,
  reducers: {
    createDeal(state, action: PayloadAction<CreateDealPayload>) {
      // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
      const { companyTitle, dealOwner, dealStage, dealTitle, dealTotal, dealValue, stageId } = action.payload;

      const newTaskId = `task-${Math.floor(Math.random() * 100_000)}`; // TEMP DEV:  Need to get ID from backend
      const newTask = {
        id: newTaskId,
        companyLogo: CompanyLogo,
        companyTitle,
        daysElapsed: 27,
        dealOwner,
        dealTitle,
        dealTotal,
        dealValue,
        orderKey: 'a', // TODO: Needs to be lexicographically generated
        stageId,
        userImage: UserImage,
      };

      console.log(dealStage); // Ignored for now.

      state.deals.byId[newTaskId] = newTask;
      // state.stages.byId[columnId].taskIds.push(newTaskId);
      state.deals.allIds.push(newTaskId);
      state.deals.byStageId[stageId].push(newTaskId);
    },
    createStage(state, action: PayloadAction<{ title: PipelineStage['title'] }>) {
      // Add new column to scrumboard
      const { title } = action.payload;

      // Check if column name already exists
      if (title in state.stages) return;

      // Add new column and push ID to columnOrder
      const id = `column-${title}`;
      const newStage = { id, isPermanent: false, taskIds: [], title };
      state.stages.byId[id] = newStage;
      state.stages.allIds.push(newStage.id);
      state.stageOrder.push(id);
    },
    deleteAllDealsInStage(state, action: PayloadAction<{ stageId: PipelineStage['id'] }>) {
      const { stageId } = action.payload;
      const dealIdsToDeleteSet = new Set(state.deals.byStageId[stageId] || []);
      state.deals.allIds = state.deals.allIds.filter((id) => !dealIdsToDeleteSet.has(id));
      dealIdsToDeleteSet.forEach((dealId) => delete state.deals.byId[dealId]);
      delete state.deals.byStageId[stageId];
    },
    deleteDeal(state, action: PayloadAction<{ dealId: PipelineDeal['id']; stageId: PipelineStage['id'] }>) {
      const { dealId, stageId } = action.payload;
      delete state.deals.byId[dealId];
      state.deals.allIds = state.deals.allIds.filter((id) => id !== dealId);
      state.deals.byStageId[stageId] = state.deals.byStageId[stageId].filter((id) => id !== dealId);
    },
    deleteSaveRequest(state, action) {
      delete state.saveRequests[action.payload];
    },
    deleteStage(state, action: PayloadAction<{ stageId: PipelineStage['id'] }>) {
      const { stageId } = action.payload;
      const dealIdsToDeleteSet = new Set(state.deals.byStageId[stageId] || []);
      state.deals.allIds = state.deals.allIds.filter((id) => !dealIdsToDeleteSet.has(id));
      dealIdsToDeleteSet.forEach((dealId) => delete state.deals.byId[dealId]);
      delete state.deals.byStageId[stageId];
      state.stages.allIds = state.stages.allIds.filter((id) => id !== stageId);
      delete state.stages.byId[stageId];
    },
    undoTaskMove(state, action: PayloadAction<{ requestId: string }>) {
      const { requestId } = action.payload;
      const request = state.pendingDealMoves[requestId];
      state.deals.byId[request.sourceDealId].orderKey = state.pendingDealMoves[requestId].sourceDealOrderKey;
      state.deals.byId[request.sourceDealId].stageId = state.pendingDealMoves[requestId].sourceStageId;
    },
    updateDeal(state, action: PayloadAction<{ dealId: PipelineDeal['id']; stageId: PipelineStage['id'] }>) {
      // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
      const { dealId, stageId } = action.payload;
      const updateFields = { ...action.payload };

      console.log(stageId); // TEMP: . Ignored for now.

      const oldFields = state.deals.byId[dealId];
      state.deals.byId[dealId] = { ...oldFields, ...updateFields };
    },
    updateStage(state, action: PayloadAction<{ stageId: PipelineStage['id']; stageTitle: PipelineStage['title'] }>) {
      const { stageId, stageTitle } = action.payload;
      state.stages.byId[stageId].title = stageTitle;
    },
    updateTaskHorizontalMove(state, action: PayloadAction<MoveDealPayload>) {
      const { destinationDealOrderKey, destinationStageId, sourceDealId } = action.payload;
      state.deals.byId[sourceDealId].orderKey = destinationDealOrderKey;
      state.deals.byId[sourceDealId].stageId = destinationStageId;
    },
    updateTaskVerticalMove(state, action: PayloadAction<Omit<MoveDealPayload, 'destinationStageId'>>) {
      const { destinationDealOrderKey, sourceDealId } = action.payload;
      state.deals.byId[sourceDealId].orderKey = destinationDealOrderKey;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mockSaveState.pending, (state, action) => {
        state.saveRequests[action.meta.requestId].status = 'pending';
      })
      .addCase(mockSaveState.rejected, (state, action) => {
        state.saveRequests[action.meta.requestId].status = 'failed';
      })
      .addCase(mockSaveState.fulfilled, (state, action) => {
        state.saveRequests[action.meta.requestId].status = 'succeeded';
      })
      .addCase(moveDeal.pending, (state, action) => {
        const { sourceDealId, sourceDealOrderKey, sourceStageId } = action.meta.arg;
        state.pendingDealMoves[action.meta.requestId] = { sourceDealId, sourceDealOrderKey, sourceStageId };
      })
      .addCase(moveDeal.rejected, (state, action) => {
        const pendingDealMove = state.pendingDealMoves[action.meta.requestId];

        if (!pendingDealMove) return;

        const { sourceDealId, sourceDealOrderKey, sourceStageId } = pendingDealMove;

        state.deals.byId[sourceDealId].orderKey = sourceDealOrderKey;
        state.deals.byId[sourceDealId].stageId = sourceStageId;
        delete state.pendingDealMoves[action.meta.requestId];
      })
      .addCase(moveDeal.fulfilled, (state, action) => {
        delete state.pendingDealMoves[action.meta.requestId];
      });
  },
});

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: mockSaveState.fulfilled,
  effect: async (action, listenerApi) => {
    await listenerApi.delay(2000);
    listenerApi.dispatch(pipelineSlice.actions.deleteSaveRequest(action.meta.requestId));
  },
});

const selectScrumboardPipeline = (state: ReduxRootState) => state.scrumboardPipeline;

export const makeSelectorDealById = () =>
  createSelector(
    [
      (state: ReduxRootState, _dealId: PipelineDeal['id']) => state.scrumboardPipeline.deals.byId,
      (_state: ReduxRootState, dealId: PipelineDeal['id']) => dealId,
    ],
    (byId, dealId) => byId[dealId]
  );

export const makeSelectorStageById = () =>
  createSelector(
    [
      (state: ReduxRootState) => state.scrumboardPipeline.stages.byId,
      (_state, stageId: PipelineStage['id']) => stageId,
    ],
    (byId, stageId) => byId[stageId]
  );

export const makeSelectorDealsTotalForStage = () =>
  createSelector(
    [
      (state: ReduxRootState, stageId: PipelineStage['id']) => state.scrumboardPipeline.deals.byStageId[stageId] ?? [],
      (state: ReduxRootState, _stageId: PipelineStage['id']) => state.scrumboardPipeline.deals.byId,
    ],
    (dealIds, dealsById) => dealIds.reduce((sum, id) => sum + (dealsById[id]?.dealTotal ?? 0), 0)
  );

export const makeSelectorDealIdsForStage = () =>
  createSelector(
    [
      (state: ReduxRootState, _stageId: PipelineStage['id']) => state.scrumboardPipeline.deals.byStageId,
      (_state: ReduxRootState, stageId: PipelineStage['id']) => stageId,
    ],
    (byStageId, stageId) => byStageId[stageId]
  );

export const selectorDealsById = createSelector([selectScrumboardPipeline], (state) => state.deals.byId);

export const selectorDealsByStageId = createSelector([selectScrumboardPipeline], (state) => state.deals.byStageId);

export const selectorStagesByNotPermanent = createSelector([selectScrumboardPipeline], (state) =>
  Object.values(state.stages.byId).filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([selectScrumboardPipeline], (state) =>
  Object.values(state.stages.byId).reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned' | 'won' | 'lost', Record<'id', PipelineStage['id']>>
  )
);

export const selectorStagesById = createSelector([selectScrumboardPipeline], (state) =>
  Object.values(state.stages.byId)
);

export const makeSelectorDealIdsSortedForStage = () =>
  createSelector(
    [
      (state: ReduxRootState, _stageId: PipelineStage['id']) => state.scrumboardPipeline.deals.byId,
      (_state: ReduxRootState, stageId: PipelineStage['id']) => stageId,
    ],
    (tasksById, stageId) =>
      Object.values(tasksById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

type DealsById = {
  [taskId: string]: PipelineDeal;
};
export const makeSelectorDealIdsSortedForPipeline = () =>
  createSelector(
    [
      (dealsById: DealsById, _stageId: PipelineStage['id']) => dealsById,
      (_dealsById: DealsById, stageId: PipelineStage['id']) => stageId,
    ],
    (dealsById, stageId) =>
      Object.values(dealsById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

export const {
  createDeal,
  createStage,
  deleteAllDealsInStage,
  deleteDeal,
  deleteStage,
  undoTaskMove,
  updateDeal,
  updateStage,
  updateTaskHorizontalMove,
  updateTaskVerticalMove,
} = pipelineSlice.actions;
export default pipelineSlice.reducer;
