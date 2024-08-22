import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { moveTaskHorizontal, moveTaskVertical } from '#Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '#Redux/hooks';
import { ScrumboardPipelineColumns } from './index';
import styles from './_Scrumboard.module.scss';

function ScrumBoardPipeline(): JSX.Element {
  const reduxDispatch = useReduxDispatch();
  const data = useReduxSelector((store) => store.scrumboardPipeline);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If location is null or the same starting point
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const columnStart = data.columns[source.droppableId];
    const columnEnd = data.columns[destination.droppableId];

    // If a task is moved within the same column
    if (columnStart === columnEnd)
      return reduxDispatch(moveTaskVertical({ columnStart, destination, source, draggableId }));

    // If a task is moved between columns
    return reduxDispatch(moveTaskHorizontal({ columnStart, columnEnd, destination, source, draggableId }));
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
