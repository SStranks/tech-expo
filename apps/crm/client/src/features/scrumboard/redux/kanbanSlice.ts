import type { ReduxRootState } from '@Redux/store';

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialData, KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import { sortOrderKeys } from '@Utils/lexicographicalRanking';

type MoveTaskPayload = {
  destinationStageId: string;
  destinationDealOrderKey: string;
  sourceTaskId: string;
};

// TEMP DEV: .
// import UserImage from '@Img/image-35.jpg';
// import CompanyLogo from '@Img/CompanyLogo.png';

// interface MoveTaskPayload {
//   sourceColumnId: string;
//   destinationColumnId: string;
//   destinationIndex: number;
//   taskIndex: number;
//   taskId: string;
// }

// interface CreateDealPayload {
//   columnId: string;
//   companyTitle: string;
//   dealTitle: string;
//   dealStage: string;
//   dealTotal: number;
//   dealOwner: string;
// }

// interface UpdateDealPayload extends Omit<CreateDealPayload, 'columnId'> {
//   taskId: string;
// }

type PendingTaskMove = {
  sourceStageId: KanbanStage['id'];
  sourceTaskId: KanbanTask['id'];
  sourceTaskOrderKey: KanbanTask['orderKey'];
};

type KanbanInitialState = {
  stages: { byId: { [id: string]: KanbanStage }; allIds: KanbanStage['id'][] };
  stageOrder: string[];
  error?: string;
  pendingTaskMoves: { [requestId: string]: PendingTaskMove };
  tasks: {
    byId: { [taskId: string]: KanbanTask };
    allIds: KanbanTask['id'][];
    byStageId: { [stageId: string]: KanbanTask['id'][] };
  };
};

const initialState: KanbanInitialState = {
  error: undefined,
  pendingTaskMoves: {},
  stageOrder: initialData.columnOrder,
  stages: {
    allIds: initialData.stages.map(({ id }) => id),
    byId: Object.fromEntries(initialData.stages.map((stage) => [stage.id, stage])),
  },
  tasks: {
    allIds: initialData.tasks.map(({ id }) => id),
    byId: Object.fromEntries(initialData.tasks.map((task) => [task.id, task])),
    byStageId: Object.fromEntries(
      initialData.stages.map((stage) => [
        stage.id,
        initialData.tasks.filter((task) => task.stageId === stage.id).map((task) => task.id),
      ])
    ),
  },
};

type MoveTaskBody = {
  sourceTaskId: KanbanTask['id'];
  sourceTaskOrderKey: KanbanTask['orderKey'];
  sourceStageId: KanbanStage['id'];
  destinationTaskStageId: KanbanTask['stageId'];
  destinationTaskOrderKey: KanbanTask['orderKey'];
};
export const moveTask = createAsyncThunk('kanban/moveTask', async (_body: MoveTaskBody) => {
  try {
    // TODO: Submit to DB
    new Promise((resolve) => setTimeout(() => resolve(''), 300));
    return;
  } catch (error) {
    return error;
  }
});

// TODO:  Error handling/boundary inside reducers.
const kanbanSlice = createSlice({
  name: 'scrumboardKanban',
  initialState,
  reducers: {
    createStage(state, action: PayloadAction<{ title: KanbanStage['title'] }>) {
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
    deleteAllTasksInStage(state, action: PayloadAction<{ stageId: KanbanStage['id'] }>) {
      const { stageId } = action.payload;
      const taskIdsToDeleteSet = new Set(state.tasks.byStageId[stageId] || []);
      state.tasks.allIds = state.tasks.allIds.filter((id) => !taskIdsToDeleteSet.has(id));
      taskIdsToDeleteSet.forEach((taskId) => delete state.tasks.byId[taskId]);
      delete state.tasks.byStageId[stageId];
    },
    // createTask(state, action: PayloadAction<ICreateDealPayload>) {
    //   // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
    //   const { columnId, companyTitle, dealTitle, dealStage, dealTotal, dealOwner } = action.payload;

    //   const newTaskId = `task-${Math.floor(Math.random() * 100_000)}`; // TEMP DEV:  Need to make ID system.
    //   const newTask = {
    //     id: newTaskId,
    //     companyLogo: CompanyLogo,
    //     companyTitle,
    //     dealTitle,
    //     dealOwner,
    //     userImage: UserImage,
    //     daysElapsed: 27,
    //     dealTotal,
    //   };

    //   console.log(dealStage); // Ignored for now.

    //   // Push new task to tasks.
    //   state.tasks[newTaskId] = newTask;
    //   // Find column by id; push task to column taskIds array.
    //   state.columns[columnId].taskIds.push(newTaskId);
    // },
    // updateTask(state, action: PayloadAction<IUpdateDealPayload>) {
    //   // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
    //   const { taskId } = action.payload;
    //   const { dealStage } = action.payload; // TEMP: .
    //   const updateFields = { ...action.payload };

    //   console.log(dealStage); // TEMP: . Ignored for now.

    deleteStage(state, action: PayloadAction<{ stageId: KanbanStage['id'] }>) {
      const { stageId } = action.payload;
      const taskIdsToDeleteSet = new Set(state.tasks.byStageId[stageId] || []);
      state.tasks.allIds = state.tasks.allIds.filter((id) => !taskIdsToDeleteSet.has(id));
      taskIdsToDeleteSet.forEach((dealId) => delete state.tasks.byId[dealId]);
      delete state.tasks.byStageId[stageId];
      state.stages.allIds = state.stages.allIds.filter((id) => id !== stageId);
      delete state.stages.byId[stageId];
    },
    //   const oldFields = state.tasks[taskId];
    //   state.tasks[taskId] = { ...oldFields, ...updateFields };
    // },
    deleteTask(state, action: PayloadAction<{ taskId: KanbanTask['id']; stageId: KanbanStage['id'] }>) {
      const { stageId, taskId } = action.payload;
      delete state.tasks.byId[taskId];
      state.tasks.allIds = state.tasks.allIds.filter((id) => id !== taskId);
      state.tasks.byStageId[stageId] = state.tasks.byStageId[stageId].filter((id) => id !== taskId);
    },
    undoTaskMove(state, action: PayloadAction<{ requestId: string }>) {
      const { requestId } = action.payload;
      const request = state.pendingTaskMoves[requestId];
      state.tasks.byId[request.sourceTaskId].orderKey = state.pendingTaskMoves[requestId].sourceTaskOrderKey;
      state.tasks.byId[request.sourceTaskId].stageId = state.pendingTaskMoves[requestId].sourceStageId;
    },
    updateStage(state, action: PayloadAction<{ stageId: KanbanStage['id']; stageTitle: KanbanStage['title'] }>) {
      const { stageId, stageTitle } = action.payload;
      state.stages.byId[stageId].title = stageTitle;
    },
    updateTaskHorizontalMove(state, action: PayloadAction<MoveTaskPayload>) {
      const { destinationDealOrderKey, destinationStageId, sourceTaskId } = action.payload;
      state.tasks.byId[sourceTaskId].orderKey = destinationDealOrderKey;
      state.tasks.byId[sourceTaskId].stageId = destinationStageId;
    },
    updateTaskVerticalMove(state, action: PayloadAction<Omit<MoveTaskPayload, 'destinationStageId'>>) {
      const { destinationDealOrderKey, sourceTaskId } = action.payload;
      state.tasks.byId[sourceTaskId].orderKey = destinationDealOrderKey;
    },
  },
});

const selectScrumboardKanban = (state: ReduxRootState) => state.scrumboardKanban;

export const makeSelectorDealById = () =>
  createSelector(
    [
      (state: ReduxRootState, _taskId: KanbanTask['id']) => state.scrumboardKanban.tasks.byId,
      (_state: ReduxRootState, taskId: KanbanTask['id']) => taskId,
    ],
    (byId, taskId) => byId[taskId]
  );

export const makeSelectorStageById = () =>
  createSelector(
    [(state: ReduxRootState) => state.scrumboardKanban.stages.byId, (_state, stageId: KanbanStage['id']) => stageId],
    (byId, stageId) => byId[stageId]
  );

export const selectorTasksById = createSelector([selectScrumboardKanban], (state) => state.tasks.byId);

export const selectorStagesByNotPermanent = createSelector([selectScrumboardKanban], (state) =>
  Object.values(state.stages.byId).filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([selectScrumboardKanban], (state) =>
  Object.values(state.stages.byId).reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned', Record<'id', KanbanStage['id']>>
  )
);

export const makeSelectorTaskIdsSortedForStage = () =>
  createSelector(
    [
      (state: ReduxRootState, _stageId: KanbanStage['id']) => state.scrumboardKanban.tasks.byId,
      (_state: ReduxRootState, stageId: KanbanStage['id']) => stageId,
    ],
    (tasksById, stageId) =>
      Object.values(tasksById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

type TasksById = {
  [taskId: string]: KanbanTask;
};
export const makeSelectorTaskIdsSortedForKanban = () =>
  createSelector(
    [
      (tasksById: TasksById, _stageId: KanbanStage['id']) => tasksById,
      (_tasksById: TasksById, stageId: KanbanStage['id']) => stageId,
    ],
    (tasksById, stageId) =>
      Object.values(tasksById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

const actions = kanbanSlice.actions;
export const {
  createStage,
  deleteAllTasksInStage,
  deleteStage,
  deleteTask,
  // createTask,
  // updateTask,
  undoTaskMove,
  updateStage,
  updateTaskHorizontalMove,
  updateTaskVerticalMove,
} = actions;
export default kanbanSlice.reducer;
