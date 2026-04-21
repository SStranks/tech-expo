import type { PayloadAction } from '@reduxjs/toolkit';

import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { ReduxRootState } from '@Redux/store';

import { sortOrderKeys } from '@apps/crm-shared/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { initialData } from '@Data/MockScrumboardKanban';

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

const stagesAdapter = createEntityAdapter<KanbanStage>();
const tasksAdapter = createEntityAdapter<KanbanTask>();

type KanbanState = {
  error?: string;
  pendingTaskMoves: { [requestId: string]: PendingTaskMove };
  stageOrder: string[];
  stages: ReturnType<typeof stagesAdapter.getInitialState>;
  tasks: ReturnType<typeof tasksAdapter.getInitialState>;
  tasksByStage: { [stageId: string]: KanbanTask['id'][] };
  // stages: { byId: { [id: string]: KanbanStage }; allIds: KanbanStage['id'][] };
  // tasks: {
  //   byId: { [taskId: string]: KanbanTask };
  //   allIds: KanbanTask['id'][];
  //   byStageId: { [stageId: string]: KanbanTask['id'][] };
  // };
};

// const initialState: KanbanState = {
//   error: undefined,
//   pendingTaskMoves: {},
//   stageOrder: initialData.columnOrder,
//   stages: {
//     allIds: initialData.stages.map(({ id }) => id),
//     byId: Object.fromEntries(initialData.stages.map((stage) => [stage.id, stage])),
//   },
//   tasks: {
//     allIds: initialData.tasks.map(({ id }) => id),
//     byId: Object.fromEntries(initialData.tasks.map((task) => [task.id, task])),
//     byStageId: Object.fromEntries(
//       initialData.stages.map((stage) => [
//         stage.id,
//         initialData.tasks.filter((task) => task.stageId === stage.id).map((task) => task.id),
//       ])
//     ),
//   },
// };

const initialState: KanbanState = {
  error: undefined,
  pendingTaskMoves: {},
  stageOrder: initialData.columnOrder,
  stages: stagesAdapter.addMany(stagesAdapter.getInitialState(), initialData.stages),
  tasks: tasksAdapter.addMany(tasksAdapter.getInitialState(), initialData.tasks),
  tasksByStage: Object.fromEntries(
    initialData.stages.map((stage) => [
      stage.id,
      initialData.tasks.filter((task) => task.stageId === stage.id).map((task) => task.id),
    ])
  ),
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
    await new Promise((resolve) => setTimeout(() => resolve(''), 300));
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
      const id = `column-${action.payload.title}`;

      stagesAdapter.addOne(state.stages, {
        id,
        isPermanent: false,
        title: action.payload.title,
      });

      state.stageOrder.push(id);
      state.tasksByStage[id] = [];
    },
    deleteAllTasksInStage(state, action: PayloadAction<{ stageId: KanbanStage['id'] }>) {
      const { stageId } = action.payload;
      tasksAdapter.removeAll(state.tasks);
      state.tasksByStage[stageId] = [];
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
      stagesAdapter.removeOne(state.stages, stageId);
      delete state.tasksByStage[stageId];
      state.stageOrder = state.stageOrder.filter((id) => id !== stageId);
    },
    deleteTask(state, action: PayloadAction<{ taskId: KanbanTask['id']; stageId: KanbanStage['id'] }>) {
      const { stageId, taskId } = action.payload;
      tasksAdapter.removeOne(state.tasks, taskId);
      const tasksByStage = state.tasksByStage[stageId];
      if (!tasksByStage) return;
      tasksByStage.filter((id) => id !== taskId);
    },
    undoTaskMove(state, action: PayloadAction<{ requestId: string }>) {
      const { requestId } = action.payload;
      const request = state.pendingTaskMoves[requestId];
      if (!request) return;

      const { sourceStageId, sourceTaskId, sourceTaskOrderKey } = request;

      const task = state.tasks.entities[sourceTaskId];
      if (!task) return;

      const currentStageId = task.stageId;

      task.stageId = sourceStageId;
      task.orderKey = sourceTaskOrderKey;

      const currentTasks = state.tasksByStage[currentStageId];
      if (currentTasks) {
        state.tasksByStage[currentStageId] = currentTasks.filter((id) => id !== sourceTaskId);
      }

      state.tasksByStage[sourceStageId] ??= [];
      state.tasksByStage[sourceStageId].push(sourceTaskId);

      delete state.pendingTaskMoves[requestId];
    },
    updateStage(state, action: PayloadAction<{ stageId: KanbanStage['id']; stageTitle: KanbanStage['title'] }>) {
      stagesAdapter.updateOne(state.stages, {
        id: action.payload.stageId,
        changes: { title: action.payload.stageTitle },
      });
    },
    updateTaskHorizontalMove(state, action: PayloadAction<MoveTaskPayload>) {
      const { destinationDealOrderKey, destinationStageId, sourceTaskId } = action.payload;
      const task = state.tasks.entities[sourceTaskId];
      if (!task) return;
      task.orderKey = destinationDealOrderKey;
      task.stageId = destinationStageId;
      Object.keys(state.tasksByStage).forEach((stageId) => {
        state.tasksByStage[stageId] = state.tasksByStage[stageId]?.filter((id) => id !== sourceTaskId) ?? [];
      });
      state.tasksByStage[destinationStageId] ??= [];
      state.tasksByStage[destinationStageId].push(sourceTaskId);
    },
    updateTaskVerticalMove(state, action: PayloadAction<Omit<MoveTaskPayload, 'destinationStageId'>>) {
      const { destinationDealOrderKey, sourceTaskId } = action.payload;
      const task = state.tasks.entities[sourceTaskId];
      if (!task) return;
      task.orderKey = destinationDealOrderKey;
    },
  },
});

export const stageSelectors = stagesAdapter.getSelectors((state: ReduxRootState) => state.scrumboardKanban.stages);
export const taskSelectors = tasksAdapter.getSelectors((state: ReduxRootState) => state.scrumboardKanban.tasks);

export const selectorStagesByNotPermanent = createSelector([stageSelectors.selectAll], (stages) =>
  stages.filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([stageSelectors.selectAll], (stages) =>
  stages.reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned', Record<'id', KanbanStage['id']>>
  )
);

export const makeSelectorTaskIdsSortedForStage = () =>
  createSelector(
    [taskSelectors.selectAll, (_state: ReduxRootState, stageId: KanbanStage['id']) => stageId],
    (tasks, stageId) =>
      tasks
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
