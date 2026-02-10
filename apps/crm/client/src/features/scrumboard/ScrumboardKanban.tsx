import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

import type { AriaLiveLevel } from '@Components/AriaAnnouncement';
import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';

import { generateOrderKeyBetween } from '@apps/crm-shared/utils';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  makeSelectorTaskIdsSortedForKanban,
  moveTask,
  selectorTasksById,
  undoTaskMove,
  updateTaskHorizontalMove,
  updateTaskVerticalMove,
} from '@Features/scrumboard/redux/kanbanSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';
import { uiEventInsert } from '@Redux/reducers/uiSlice';

import ScrumboardKanbanStages from './ScrumboardKanbanStages';
import { PRAGMATICDND_KANBAN_STAGE_TYPE, PRAGMATICDND_KANBAN_TASK_TYPE } from './types/pragmaticDndTypes';
import { isKanbanStageTargetData, isKanbanTaskDropData } from './utils/pragmaticDndValidation';

import styles from './Scrumboard.module.scss';

type TaskMove = {
  sourceTaskId: KanbanTask['id'];
  sourceTaskOrderKey: KanbanTask['orderKey'];
  sourceStageId: KanbanStage['id'];
  destinationTaskOrderKey: KanbanTask['orderKey'];
  destinationTaskStageId: KanbanStage['id'];
};

type FocusContext = {
  focusedId: KanbanTask['id'] | undefined;
  setFocusedId: React.Dispatch<React.SetStateAction<KanbanStage['id'] | undefined>>;
};

const FocusContext = createContext<FocusContext | null>(null);
export const useFocusContext = () => {
  const context = useContext(FocusContext);
  if (!context) throw new Error('useFocusContext out of scope of ScrumboardKanban.Provider');
  return context;
};

type KanbanContext = {
  handleHorizontalMove: ({
    destinationStage,
    destinationTaskIndex,
    sourceTask,
  }: {
    destinationStage: KanbanStage;
    destinationTaskIndex: number;
    sourceTask: KanbanTask;
  }) => Promise<void>;
  handleVerticalMove: ({
    destinationTaskIndex,
    sourceStage,
    sourceTask,
  }: {
    destinationTaskIndex: number;
    sourceStage: KanbanStage;
    sourceTask: KanbanTask;
  }) => Promise<void>;
};

const KanbanContext = createContext<KanbanContext | null>(null);
export const useKanbanontext = () => {
  const context = useContext(KanbanContext);
  if (!context) throw new Error('useKanbanontext out of scope of ScrumboardKanban.Provider');
  return context;
};

function ScrumBoard(): React.JSX.Element {
  const [focusedId, setFocusedId] = useState<KanbanTask['id']>();
  const reduxDispatch = useReduxDispatch();
  const tasksById = useReduxSelector(selectorTasksById);

  const getDestinationTaskOrderKey = useCallback(
    (task: KanbanTask, stage: KanbanStage, destinationTaskIndex: number) => {
      const selector = makeSelectorTaskIdsSortedForKanban();
      const taskIdsLexiSorted = selector(tasksById, stage.id).filter((id) => id !== task.id);
      const prevId = taskIdsLexiSorted[destinationTaskIndex - 1] ?? null;
      const nextId = taskIdsLexiSorted[destinationTaskIndex] ?? null;

      const prevKey = prevId ? tasksById[prevId].orderKey : null;
      const nextKey = nextId ? tasksById[nextId].orderKey : null;

      return generateOrderKeyBetween(prevKey, nextKey);
    },
    [tasksById]
  );

  const dispatchUiAriaEvent = useCallback(
    (id: string, message: string, politeness: AriaLiveLevel) => {
      reduxDispatch(
        uiEventInsert({
          id,
          data: { message, politeness },
          scope: 'kanban',
          type: 'aria',
        })
      );
    },
    [reduxDispatch]
  );

  const commitMoveWithUiFeedback = useCallback(
    async (taskMove: TaskMove, successMessage: string, errorMessage: string) => {
      const thunk = reduxDispatch(moveTask(taskMove));
      const { requestId } = thunk;

      try {
        await thunk.unwrap();
        dispatchUiAriaEvent(requestId, successMessage, 'polite');
      } catch {
        reduxDispatch(undoTaskMove({ requestId }));
        dispatchUiAriaEvent(requestId, errorMessage, 'assertive');
      }
    },
    [reduxDispatch, dispatchUiAriaEvent]
  );

  const handleVerticalMove = useCallback(
    async ({
      destinationTaskIndex,
      sourceStage,
      sourceTask,
    }: {
      destinationTaskIndex: number;
      sourceStage: KanbanStage;
      sourceTask: KanbanTask;
    }) => {
      const destinationTaskOrderKey = getDestinationTaskOrderKey(sourceTask, sourceStage, destinationTaskIndex);

      reduxDispatch(
        updateTaskVerticalMove({
          destinationDealOrderKey: destinationTaskOrderKey,
          sourceTaskId: sourceTask.id,
        })
      );

      const taskMove: TaskMove = {
        destinationTaskOrderKey: destinationTaskOrderKey,
        destinationTaskStageId: sourceTask.stageId,
        sourceStageId: sourceTask.stageId,
        sourceTaskId: sourceTask.id,
        sourceTaskOrderKey: sourceTask.orderKey,
      };

      await commitMoveWithUiFeedback(
        taskMove,
        `Card ${sourceTask.title} moved to index ${destinationTaskIndex}`,
        `Failed to move card ${sourceTask.title}`
      );
    },
    [commitMoveWithUiFeedback, getDestinationTaskOrderKey, reduxDispatch]
  );

  const handleHorizontalMove = useCallback(
    async ({
      destinationStage,
      destinationTaskIndex,
      sourceTask,
    }: {
      destinationStage: KanbanStage;
      destinationTaskIndex: number;
      sourceTask: KanbanTask;
    }) => {
      const destinationTaskOrderKey = getDestinationTaskOrderKey(sourceTask, destinationStage, destinationTaskIndex);

      reduxDispatch(
        updateTaskHorizontalMove({
          destinationDealOrderKey: destinationTaskOrderKey,
          destinationStageId: destinationStage.id,
          sourceTaskId: sourceTask.id,
        })
      );

      const taskMove: TaskMove = {
        destinationTaskOrderKey: destinationTaskOrderKey,
        destinationTaskStageId: destinationStage.id,
        sourceStageId: sourceTask.id,
        sourceTaskId: sourceTask.id,
        sourceTaskOrderKey: sourceTask.orderKey,
      };

      await commitMoveWithUiFeedback(
        taskMove,
        `Card ${sourceTask.title} moved to column ${destinationStage.title} at index ${destinationTaskIndex}`,
        `Failed to move card ${sourceTask.title}`
      );
    },
    [commitMoveWithUiFeedback, getDestinationTaskOrderKey, reduxDispatch]
  );

  const onDrop = useCallback(
    async ({ location, source }: BaseEventPayload<ElementDragType>) => {
      if (location.current.dropTargets.length === 0) return;
      if (!isKanbanTaskDropData(source.data)) return;

      const stageDataInitial = location.initial.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_KANBAN_STAGE_TYPE
      );
      const stageDataCurrent = location.current.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_KANBAN_STAGE_TYPE
      );
      if (
        !stageDataInitial ||
        !stageDataCurrent ||
        !isKanbanStageTargetData(stageDataInitial.data) ||
        !isKanbanStageTargetData(stageDataCurrent.data)
      )
        return;

      const cardDataInitial = location.initial.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_KANBAN_TASK_TYPE
      );
      if (!cardDataInitial || !isKanbanTaskDropData(cardDataInitial.data)) return;
      const cardDataCurrent = location.current.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_KANBAN_TASK_TYPE
      );

      // Move card vertically in original column
      if (stageDataInitial.data.stage.id === stageDataCurrent.data.stage.id) {
        if (cardDataCurrent) {
          if (!isKanbanTaskDropData(cardDataCurrent.data)) return;

          const destinationTaskIndex = getReorderDestinationIndex({
            axis: 'vertical',
            closestEdgeOfTarget: extractClosestEdge(cardDataCurrent.data),
            indexOfTarget: cardDataCurrent.data.taskIndex,
            startIndex: source.data.taskIndex,
          });

          await handleVerticalMove({
            destinationTaskIndex,
            sourceStage: stageDataInitial.data.stage,
            sourceTask: source.data.task,
          }); // Dragged over another card; move relative to it
        } else {
          await handleVerticalMove({
            destinationTaskIndex: stageDataInitial.data.taskIds.length,
            sourceStage: stageDataInitial.data.stage,
            sourceTask: source.data.task,
          }); // No other card was detected; default move to end of list
        }
      }

      // Move card horizontally to another column
      if (stageDataInitial.data.stage.id !== stageDataCurrent.data.stage.id) {
        if (cardDataCurrent) {
          if (!isKanbanTaskDropData(cardDataCurrent.data)) return;

          const destinationTaskIndex =
            extractClosestEdge(cardDataCurrent.data) === 'top'
              ? cardDataCurrent.data.taskIndex
              : cardDataCurrent.data.taskIndex + 1;

          await handleHorizontalMove({
            destinationStage: stageDataCurrent.data.stage,
            destinationTaskIndex: destinationTaskIndex,
            sourceTask: source.data.task,
          }); // Dragged over another card; move relative to it
        } else {
          await handleHorizontalMove({
            destinationStage: stageDataCurrent.data.stage,
            destinationTaskIndex: stageDataCurrent.data.taskIds.length,
            sourceTask: source.data.task,
          }); // No other card was detected; default move to end of list
        }
      }
      return;
    },
    [handleHorizontalMove, handleVerticalMove]
  );

  // useEffect(() => {
  //   return monitorForElements({
  //     onDrop: ({ location, source }) => {
  //       if (!source || location.current.dropTargets.length === 0) return;
  //       if (!isKanbanCardDropData(source.data)) return;

  //       const columnDataInitial = location.initial.dropTargets.find(
  //         (target) => target.data.type === PRAGMATICDND_KANBAN_COLUMN_TYPE
  //       );
  //       const columnDataCurrent = location.current.dropTargets.find(
  //         (target) => target.data.type === PRAGMATICDND_KANBAN_COLUMN_TYPE
  //       );
  //       if (
  //         !columnDataInitial ||
  //         !columnDataCurrent ||
  //         !isKanbanColumnTargetData(columnDataInitial.data) ||
  //         !isKanbanColumnTargetData(columnDataCurrent.data)
  //       )
  //         return;

  //       const cardDataInitial = location.initial.dropTargets.find(
  //         (target) => target.data.type === PRAGMATICDND_KANBAN_CARD_TYPE
  //       );
  //       if (!cardDataInitial || !isKanbanCardDropData(cardDataInitial.data)) return;
  //       const cardDataCurrent = location.current.dropTargets.find(
  //         (target) => target.data.type === PRAGMATICDND_KANBAN_CARD_TYPE
  //       );

  //       // Move card vertically in original column
  //       if (columnDataInitial.data.column.id === columnDataCurrent.data.column.id) {
  //         if (cardDataCurrent) {
  //           if (!isKanbanCardDropData(cardDataCurrent.data)) return;
  //           // Dragged over another card; move relative to it

  //           const destinationIndex = getReorderDestinationIndex({
  //             axis: 'vertical',
  //             closestEdgeOfTarget: extractClosestEdge(cardDataCurrent.data),
  //             indexOfTarget: cardDataCurrent.data.taskIndex,
  //             startIndex: source.data.taskIndex,
  //           });

  //           return reduxDispatch(
  //             moveTaskVertical({
  //               destinationIndex,
  //               sourceColumnId: columnDataInitial.data.column.id,
  //               taskId: source.data.task.id,
  //               taskIndex: source.data.taskIndex,
  //             })
  //           );
  //         } else {
  //           // No other card was detected; default move to end of list
  //           return reduxDispatch(
  //             moveTaskVertical({
  //               destinationIndex: columnDataInitial.data.column.taskIds.length,
  //               sourceColumnId: columnDataInitial.data.column.id,
  //               taskId: source.data.task.id,
  //               taskIndex: source.data.taskIndex,
  //             })
  //           );
  //         }
  //       }

  //       // Move card horizontally to another column
  //       if (columnDataInitial.data.column.id !== columnDataCurrent.data.column.id) {
  //         if (cardDataCurrent) {
  //           // Dragged over another card; move relative to it
  //           if (!isKanbanCardDropData(cardDataCurrent.data)) return;

  //           const destinationIndex =
  //             extractClosestEdge(cardDataCurrent.data) === 'top'
  //               ? cardDataCurrent.data.taskIndex
  //               : cardDataCurrent.data.taskIndex + 1;

  //           return reduxDispatch(
  //             moveTaskHorizontal({
  //               destinationColumnId: columnDataCurrent.data.column.id,
  //               destinationIndex,
  //               sourceColumnId: columnDataInitial.data.column.id,
  //               taskId: source.data.task.id,
  //               taskIndex: source.data.taskIndex,
  //             })
  //           );
  //         } else {
  //           // No other card was detected; default move to end of list
  //           return reduxDispatch(
  //             moveTaskHorizontal({
  //               destinationColumnId: columnDataCurrent.data.column.id,
  //               destinationIndex: columnDataCurrent.data.column.taskIds.length,
  //               sourceColumnId: columnDataInitial.data.column.id,
  //               taskId: source.data.task.id,
  //               taskIndex: source.data.taskIndex,
  //             })
  //           );
  //         }
  //       }
  //       return;
  //     },
  //   });
  // }, [data.columns, reduxDispatch]);

  useEffect(() => {
    return monitorForElements({
      onDrop: (payload) => {
        void onDrop(payload);
      },
    });
  }, [onDrop]);

  return (
    <FocusContext.Provider value={{ focusedId, setFocusedId }}>
      <KanbanContext.Provider value={{ handleHorizontalMove, handleVerticalMove }}>
        <div className={styles.scrumboard}>
          <ScrumboardKanbanStages />
        </div>
      </KanbanContext.Provider>
    </FocusContext.Provider>
  );
}

export default ScrumBoard;
