import type { DraggableLocation } from 'react-beautiful-dnd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumn, initialData } from '#Data/MockDnD';

interface IAddStagePayload {
  title: string;
}

interface IMoveTaskPayload {
  columnStart: IColumn;
  columnEnd: IColumn;
  destination: DraggableLocation;
  source: DraggableLocation;
  draggableId: string;
}

const pipelineSlice = createSlice({
  name: 'scrumboardPipeline',
  initialState: initialData,
  reducers: {
    moveTaskVertical(state, action: PayloadAction<Omit<IMoveTaskPayload, 'columnEnd'>>) {
      // Re-order task in a column based upon user drag-drop
      const { columnStart, source, destination, draggableId } = action.payload;

      state.columns[columnStart.id].taskIds.splice(source.index, 1);
      state.columns[columnStart.id].taskIds.splice(destination.index, 0, draggableId);
    },
    moveTaskHorizontal(state, action: PayloadAction<IMoveTaskPayload>) {
      // Move a task across columns based upon user drag-drop
      const { columnStart, columnEnd, source, destination, draggableId } = action.payload;

      state.columns[columnStart.id].taskIds.splice(source.index, 1);
      state.columns[columnEnd.id].taskIds.splice(destination.index, 0, draggableId);
    },
    addStage(state, action: PayloadAction<IAddStagePayload>) {
      // Add new column to scrumboard
      const { title } = action.payload;

      // Check if column name already exists
      if (title in state.columns) return;

      // Add new column and push ID to columnOrder
      const id = `column-${title}`;
      const newColumn = { id, title, taskIds: [] };
      state.columns[id] = newColumn;
      state.columnOrder.push(id);
    },
  },
});

export const { addStage, moveTaskVertical, moveTaskHorizontal } = pipelineSlice.actions;
export default pipelineSlice.reducer;
