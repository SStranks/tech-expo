import type { PayloadAction } from '@reduxjs/toolkit';

import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';
import type { ReduxRootState } from '@Redux/store';

import { sortOrderKeys } from '@apps/crm-shared/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createListenerMiddleware,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

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

type UpdateDealPayload = {
  dealId: PipelineDeal['id'];
  stageId: PipelineStage['id'];
  companyTitle: string;
  dealOwner: string;
  dealStage: string;
  dealTitle: string;
  dealTotal: number;
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

const stagesAdapter = createEntityAdapter<PipelineStage>();
const dealsAdapter = createEntityAdapter<PipelineDeal>();

type PipelineState = {
  error?: string | undefined;
  pendingDealMoves: { [requestId: string]: PendingDealMove | undefined };
  saveRequests: { [key: string]: SaveRequest | undefined };
  stageOrder: string[];
  stages: ReturnType<typeof stagesAdapter.getInitialState>;
  deals: ReturnType<typeof dealsAdapter.getInitialState>;
  dealsByStage: { [stageId: string]: PipelineDeal['id'][] };
  // stages: { byId: { [id: string]: PipelineStage | undefined }; allIds: PipelineStage['id'][] };
  // deals: {
  //   byId: { [taskId: string]: PipelineDeal | undefined };
  //   allIds: PipelineDeal['id'][];
  //   byStageId: { [stageId: string]: PipelineDeal['id'][] | undefined };
  // };
};

const initialState: PipelineState = {
  deals: dealsAdapter.addMany(dealsAdapter.getInitialState(), initialData.deals),
  error: undefined,
  pendingDealMoves: {},
  saveRequests: {},
  stageOrder: initialData.stagesOrder,
  stages: stagesAdapter.addMany(stagesAdapter.getInitialState(), initialData.stages),
  dealsByStage: Object.fromEntries(
    initialData.stages.map((stage) => [
      stage.id,
      initialData.deals.filter((deal) => deal.stageId === stage.id).map((task) => task.id),
    ])
  ),
  // deals: {
  //   allIds: initialData.deals.map(({ id }) => id),
  //   byId: Object.fromEntries(initialData.deals.map((task) => [task.id, task])),
  //   byStageId: Object.fromEntries(
  //     initialData.columns.map((column) => [
  //       column.id,
  //       initialData.deals.filter((deal) => deal.stageId === column.id).map((deal) => deal.id),
  //     ])
  //   ),
  // },
  // stages: {
  //   allIds: initialData.columns.map(({ id }) => id),
  //   byId: Object.fromEntries(initialData.columns.map((column) => [column.id, column])),
  // },
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
    await new Promise((resolve) => setTimeout(() => resolve(''), 300));
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

      const newDealId = `task-${Math.floor(Math.random() * 100_000)}`; // TEMP DEV:  Need to get ID from backend
      const newDeal = {
        id: newDealId,
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

      const stage = state.dealsByStage[stageId];
      if (!stage) return;
      stage.push(newDealId);
      dealsAdapter.addOne(state.deals, newDeal);
    },
    createStage(state, action: PayloadAction<{ title: PipelineStage['title'] }>) {
      const id = `column-${action.payload.title}`;

      stagesAdapter.addOne(state.stages, {
        id,
        isPermanent: false,
        title: action.payload.title,
      });

      state.stageOrder.push(id);
      state.dealsByStage[id] = [];
    },
    deleteAllDealsInStage(state, action: PayloadAction<{ stageId: PipelineStage['id'] }>) {
      const { stageId } = action.payload;
      dealsAdapter.removeAll(state.deals);
      state.dealsByStage[stageId] = [];
    },
    deleteDeal(state, action: PayloadAction<{ dealId: PipelineDeal['id']; stageId: PipelineStage['id'] }>) {
      const { dealId, stageId } = action.payload;
      dealsAdapter.removeOne(state.deals, dealId);
      const dealsByStage = state.dealsByStage[stageId];
      if (!dealsByStage) return;
      dealsByStage.filter((id) => id !== dealId);
    },
    deleteSaveRequest(state, action: PayloadAction<{ requestId: string }>) {
      const { requestId } = action.payload;
      delete state.saveRequests[requestId];
    },
    deleteStage(state, action: PayloadAction<{ stageId: PipelineStage['id'] }>) {
      const { stageId } = action.payload;
      stagesAdapter.removeOne(state.stages, stageId);
      delete state.dealsByStage[stageId];
      state.stageOrder = state.stageOrder.filter((id) => id !== stageId);
    },
    undoTaskMove(state, action: PayloadAction<{ requestId: string }>) {
      const { requestId } = action.payload;
      const request = state.pendingDealMoves[requestId];
      if (!request) return;

      const { sourceDealId, sourceDealOrderKey, sourceStageId } = request;

      const deal = state.deals.entities[sourceDealId];
      if (!deal) return;

      const currentStageId = deal.stageId;

      deal.stageId = sourceStageId;
      deal.orderKey = sourceDealOrderKey;

      const currentDeals = state.dealsByStage[currentStageId];
      if (currentDeals) {
        state.dealsByStage[currentStageId] = currentDeals.filter((id) => id !== sourceDealId);
      }

      state.dealsByStage[sourceStageId] ??= [];
      state.dealsByStage[sourceStageId].push(sourceDealId);

      delete state.pendingDealMoves[requestId];
    },
    updateDeal(state, action: PayloadAction<UpdateDealPayload>) {
      // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
      const { dealId, ...updateFields } = action.payload;

      const oldFields = state.deals.entities[dealId]!;
      state.deals.entities[dealId] = { ...oldFields, ...updateFields };
    },
    updateStage(state, action: PayloadAction<{ stageId: PipelineStage['id']; stageTitle: PipelineStage['title'] }>) {
      stagesAdapter.updateOne(state.stages, {
        id: action.payload.stageId,
        changes: { title: action.payload.stageTitle },
      });
    },
    updateTaskHorizontalMove(state, action: PayloadAction<MoveDealPayload>) {
      const { destinationDealOrderKey, destinationStageId, sourceDealId } = action.payload;
      const deal = state.deals.entities[sourceDealId];
      if (!deal) return;
      deal.orderKey = destinationDealOrderKey;
      deal.stageId = destinationStageId;
      Object.keys(state.dealsByStage).forEach((stageId) => {
        state.dealsByStage[stageId] = state.dealsByStage[stageId]?.filter((id) => id !== sourceDealId) ?? [];
      });
      state.dealsByStage[destinationStageId] ??= [];
      state.dealsByStage[destinationStageId].push(sourceDealId);
    },
    updateTaskVerticalMove(state, action: PayloadAction<Omit<MoveDealPayload, 'destinationStageId'>>) {
      const { destinationDealOrderKey, sourceDealId } = action.payload;
      const deal = state.deals.entities[sourceDealId];
      if (!deal) return;
      deal.orderKey = destinationDealOrderKey;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mockSaveState.pending, (state, action) => {
        state.saveRequests[action.meta.requestId]!.status = 'pending';
      })
      .addCase(mockSaveState.rejected, (state, action) => {
        state.saveRequests[action.meta.requestId]!.status = 'failed';
      })
      .addCase(mockSaveState.fulfilled, (state, action) => {
        state.saveRequests[action.meta.requestId]!.status = 'succeeded';
      })
      .addCase(moveDeal.pending, (state, action) => {
        const { sourceDealId, sourceDealOrderKey, sourceStageId } = action.meta.arg;
        state.pendingDealMoves[action.meta.requestId] = { sourceDealId, sourceDealOrderKey, sourceStageId };
      })
      .addCase(moveDeal.rejected, (state, action) => {
        const pendingDealMove = state.pendingDealMoves[action.meta.requestId]!;
        const { sourceDealId, sourceDealOrderKey, sourceStageId } = pendingDealMove;

        state.deals.entities[sourceDealId]!.orderKey = sourceDealOrderKey;
        state.deals.entities[sourceDealId]!.stageId = sourceStageId;
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
    const { requestId } = action.meta;
    listenerApi.dispatch(pipelineSlice.actions.deleteSaveRequest({ requestId }));
  },
});

export const stageSelectors = stagesAdapter.getSelectors((state: ReduxRootState) => state.scrumboardPipeline.stages);
export const dealSelectors = dealsAdapter.getSelectors((state: ReduxRootState) => state.scrumboardPipeline.deals);

export const makeSelectorDealsTotalForStage = () =>
  createSelector(
    [
      (state: ReduxRootState, stageId: PipelineStage['id']) => state.scrumboardPipeline.dealsByStage[stageId] ?? [],
      dealSelectors.selectEntities,
    ],
    (dealIds, dealsById) => dealIds.reduce((sum, id) => sum + (dealsById[id]?.dealTotal ?? 0), 0)
  );

export const selectorStagesByNotPermanent = createSelector([stageSelectors.selectAll], (stages) =>
  stages.filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([stageSelectors.selectAll], (stages) =>
  stages.reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned' | 'won' | 'lost', Record<'id', PipelineStage['id']>>
  )
);

export const makeSelectorDealIdsSortedForStage = () =>
  createSelector(
    [dealSelectors.selectAll, (_state: ReduxRootState, stageId: PipelineStage['id']) => stageId],
    (tasks, stageId) =>
      Object.values(tasks)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

type DealsById = {
  [dealId: string]: PipelineDeal;
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
