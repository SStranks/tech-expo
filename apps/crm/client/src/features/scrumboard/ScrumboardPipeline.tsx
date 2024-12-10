import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import { moveTaskHorizontal, moveTaskVertical } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';

import { ScrumboardPipelineColumns } from './index';

import styles from './Scrumboard.module.scss';

function ScrumBoardPipeline(): React.JSX.Element {
  const reduxDispatch = useReduxDispatch();
  const data = useReduxSelector((store) => store.scrumboardPipeline);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result;

    // If location is null or the same starting point
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const columnStart = data.columns[source.droppableId];
    const columnEnd = data.columns[destination.droppableId];

    // If a task is moved within the same column
    if (columnStart === columnEnd)
      return reduxDispatch(moveTaskVertical({ columnStart, destination, draggableId, source }));

    // If a task is moved between columns
    return reduxDispatch(moveTaskHorizontal({ columnEnd, columnStart, destination, draggableId, source }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.scrumboard}>
        <ScrumboardPipelineColumns data={data} />
      </div>
    </DragDropContext>
  );
}

export default ScrumBoardPipeline;
