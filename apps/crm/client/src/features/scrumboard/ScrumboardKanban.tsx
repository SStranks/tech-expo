import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';

import { moveTaskHorizontal, moveTaskVertical } from '@Features/scrumboard/redux/kanbanSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';

import { ScrumboardKanbanColumns } from './index';
import { KANBAN_CARD_TYPE, KANBAN_COLUMN_TYPE } from './types/pragmaticDndTypes';
import { isKanbanCardDropData, isKanbanColumnTargetData } from './utils/pragmaticDndValidation';

import styles from './Scrumboard.module.scss';
function ScrumBoard(): React.JSX.Element {
  const reduxDispatch = useReduxDispatch();
  const data = useReduxSelector((store) => store.scrumboardKanban);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ location, source }) => {
        if (!source || location.current.dropTargets.length === 0) return;
        if (!isKanbanCardDropData(source.data)) return;

        const columnDataInitial = location.initial.dropTargets.find(
          (target) => target.data.type === KANBAN_COLUMN_TYPE
        );
        const columnDataCurrent = location.current.dropTargets.find(
          (target) => target.data.type === KANBAN_COLUMN_TYPE
        );
        if (
          !columnDataInitial ||
          !columnDataCurrent ||
          !isKanbanColumnTargetData(columnDataInitial.data) ||
          !isKanbanColumnTargetData(columnDataCurrent.data)
        )
          return;

        const cardDataInitial = location.initial.dropTargets.find((target) => target.data.type === KANBAN_CARD_TYPE);
        if (!cardDataInitial || !isKanbanCardDropData(cardDataInitial.data)) return;
        const cardDataCurrent = location.current.dropTargets.find((target) => target.data.type === KANBAN_CARD_TYPE);

        // Move card vertically in original column
        if (columnDataInitial.data.columnId === columnDataCurrent.data.columnId) {
          if (cardDataCurrent) {
            if (!isKanbanCardDropData(cardDataCurrent.data)) return;
            // Dragged over another card; move relative to it

            const destinationIndex = getReorderDestinationIndex({
              axis: 'vertical',
              closestEdgeOfTarget: extractClosestEdge(cardDataCurrent.data),
              indexOfTarget: cardDataCurrent.data.taskIndex,
              startIndex: source.data.taskIndex,
            });

            return reduxDispatch(
              moveTaskVertical({
                destinationIndex,
                sourceColumnId: columnDataInitial.data.columnId,
                taskId: source.data.taskId,
                taskIndex: source.data.taskIndex,
              })
            );
          } else {
            // No other card was detected; default move to end of list
            return reduxDispatch(
              moveTaskVertical({
                destinationIndex: columnDataInitial.data.numberOfTasks,
                sourceColumnId: columnDataInitial.data.columnId,
                taskId: source.data.taskId,
                taskIndex: source.data.taskIndex,
              })
            );
          }
        }

        // Move card horizontally to another column
        if (columnDataInitial.data.columnId !== columnDataCurrent.data.columnId) {
          if (cardDataCurrent) {
            // Dragged over another card; move relative to it
            if (!isKanbanCardDropData(cardDataCurrent.data)) return;

            const destinationIndex =
              extractClosestEdge(cardDataCurrent.data) === 'top'
                ? cardDataCurrent.data.taskIndex
                : cardDataCurrent.data.taskIndex + 1;

            return reduxDispatch(
              moveTaskHorizontal({
                destinationColumnId: columnDataCurrent.data.columnId,
                destinationIndex,
                sourceColumnId: columnDataInitial.data.columnId,
                taskId: source.data.taskId,
                taskIndex: source.data.taskIndex,
              })
            );
          } else {
            // No other card was detected; default move to end of list
            return reduxDispatch(
              moveTaskHorizontal({
                destinationColumnId: columnDataCurrent.data.columnId,
                destinationIndex: columnDataCurrent.data.numberOfTasks,
                sourceColumnId: columnDataInitial.data.columnId,
                taskId: source.data.taskId,
                taskIndex: source.data.taskIndex,
              })
            );
          }
        }
        return;
      },
    });
  }, [data.columns, reduxDispatch]);

  return (
    <div className={styles.scrumboard}>
      {' '}
      <ScrumboardKanbanColumns data={data} />{' '}
    </div>
  );
}

export default ScrumBoard;
