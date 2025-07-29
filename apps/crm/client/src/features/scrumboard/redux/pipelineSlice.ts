import type { DraggableLocation } from 'react-beautiful-dnd';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IColumn, initialData } from '@Data/MockScrumboardPipeline';
import CompanyLogo from '@Img/CompanyLogo.png';
// TEMP DEV: .
import UserImage from '@Img/image-35.jpg';

interface IMoveTaskPayload {
  columnStart: IColumn;
  columnEnd: IColumn;
  destination: DraggableLocation;
  source: DraggableLocation;
  draggableId: string;
}

interface ICreateStagePayload {
  title: string;
}

interface ICreateDealPayload {
  columnId: string;
  companyTitle: string;
  dealTitle: string;
  dealStage: string;
  dealTotal: number;
  dealOwner: string;
  dealValue: number;
}

interface IUpdateDealPayload extends Omit<ICreateDealPayload, 'columnId'> {
  taskId: string;
}

interface IUpdateStagePayload {
  columnId: string;
  stageTitle: string;
}

interface IDeleteStagePayload {
  columnId: string;
}

interface IDeleteDealsAllPayload {
  columnId: string;
}

interface IDeleteDealPayload {
  columnId: string;
  taskId: string;
}

// TODO:  Error handling/boundary inside reducers.
const pipelineSlice = createSlice({
  name: 'scrumboardPipeline',
  initialState: initialData,
  reducers: {
    createDeal(state, action: PayloadAction<ICreateDealPayload>) {
      // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
      const { columnId, companyTitle, dealOwner, dealStage, dealTitle, dealTotal, dealValue } = action.payload;

      const newTaskId = `task-${Math.floor(Math.random() * 100_000)}`; // TEMP DEV:  Need to make ID system.
      const newTask = {
        id: newTaskId,
        companyLogo: CompanyLogo,
        companyTitle,
        daysElapsed: 27,
        dealOwner,
        dealTitle,
        dealTotal,
        dealValue,
        userImage: UserImage,
      };

      console.log(dealStage); // Ignored for now.

      // Push new task to tasks.
      state.tasks[newTaskId] = newTask;
      // Find column by id; push task to column taskIds array.
      state.columns[columnId].taskIds.push(newTaskId);
    },
    createStage(state, action: PayloadAction<ICreateStagePayload>) {
      // Add new column to scrumboard
      const { title } = action.payload;

      // Check if column name already exists
      if (title in state.columns) return;

      // Add new column and push ID to columnOrder
      const id = `column-${title}`;
      const newColumn = { id, taskIds: [], title };
      state.columns[id] = newColumn;
      state.columnOrder.push(id);
    },
    deleteDeal(state, action: PayloadAction<IDeleteDealPayload>) {
      const { columnId, taskId } = action.payload;

      // Delete task from tasks
      delete state.tasks[taskId];
      // Delete task ID from column
      state.columns[columnId].taskIds = state.columns[columnId].taskIds.filter((task) => task !== taskId);
    },
    deleteDealsAll(state, action: PayloadAction<IDeleteDealsAllPayload>) {
      const { columnId } = action.payload;

      // Delete tasks
      state.columns[columnId].taskIds.forEach((taskId) => delete state.tasks[taskId]);
      // Delete task IDs from column
      state.columns[columnId].taskIds = [];
    },
    deleteStage(state, action: PayloadAction<IDeleteStagePayload>) {
      const { columnId } = action.payload;

      // Remove ID from columnOrder
      state.columnOrder = state.columnOrder.filter((column_Id) => column_Id !== columnId);

      // Remove all column tasks by ID
      state.columns[columnId].taskIds.forEach((taskId) => delete state.tasks[taskId]);

      // Delete the column entity
      delete state.columns[columnId];
    },
    moveTaskHorizontal(state, action: PayloadAction<IMoveTaskPayload>) {
      // Move a task across columns based upon user drag-drop
      const { columnEnd, columnStart, destination, draggableId, source } = action.payload;

      state.columns[columnStart.id].taskIds.splice(source.index, 1);
      state.columns[columnEnd.id].taskIds.splice(destination.index, 0, draggableId);
    },
    moveTaskVertical(state, action: PayloadAction<Omit<IMoveTaskPayload, 'columnEnd'>>) {
      // Re-order task in a column based upon user drag-drop
      const { columnStart, destination, draggableId, source } = action.payload;

      state.columns[columnStart.id].taskIds.splice(source.index, 1);
      state.columns[columnStart.id].taskIds.splice(destination.index, 0, draggableId);
    },
    updateDeal(state, action: PayloadAction<IUpdateDealPayload>) {
      // NOTE:  Deal owner is currently hardcoded in PipelineDeal[Create/Update]Page.
      const { taskId } = action.payload;
      const { dealStage } = action.payload; // TEMP: .
      const updateFields = { ...action.payload };

      console.log(dealStage); // TEMP: . Ignored for now.

      const oldFields = state.tasks[taskId];
      state.tasks[taskId] = { ...oldFields, ...updateFields };
    },
    updateStage(state, action: PayloadAction<IUpdateStagePayload>) {
      const { columnId, stageTitle } = action.payload;
      state.columns[columnId].title = stageTitle;
    },
  },
});

export const {
  createDeal,
  createStage,
  deleteDeal,
  deleteDealsAll,
  deleteStage,
  moveTaskHorizontal,
  moveTaskVertical,
  updateDeal,
  updateStage,
} = pipelineSlice.actions;
export default pipelineSlice.reducer;
