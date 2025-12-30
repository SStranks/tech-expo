import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserCircle from '@Components/general/UserCircle';
import { useReduxSelector } from '@Redux/hooks';

import { makeSelectorDealById } from './redux/kanbanSlice';
import { useFocusContext } from './ScrumboardKanban';
import { createKanbanTaskDropData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardCard.module.scss';

type Props = {
  taskId: KanbanTask['id'];
  stage: KanbanStage;
  taskIndex: number;
  taskStatus?: 'won' | 'lost';
};

function ScrumBoardKanbanTask({ stage, taskId, taskIndex, taskStatus }: Props): React.JSX.Element {
  const { focusedId, setFocusedId } = useFocusContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
  const taskRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const selectorDealById = useMemo(() => makeSelectorDealById(), []);
  const task = useReduxSelector((state) => selectorDealById(state, taskId));

  const isFocused = focusedId === task.id;

  const onDoubleClickHandler = () => {
    navigate(`deal/update/${taskId}`, { state: { taskId } });
  };

  useEffect(() => {
    const taskElement = taskRef.current;
    if (!taskElement) return;

    return combine(
      draggable({
        element: taskElement,
        getInitialData: () => createKanbanTaskDropData(task, taskIndex),
        onDragStart: () => {
          setIsDragging(true);
          setFocusedId(task.id);
        },
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: taskElement,
        getData: ({ element, input }) => {
          const data = createKanbanTaskDropData(task, taskIndex);
          return attachClosestEdge(data, {
            allowedEdges: ['top', 'bottom'],
            element,
            input,
          });
        },
        getIsSticky: () => true,
        onDragEnter: () => setIsDragEnter(true),
        onDragLeave: () => setIsDragEnter(false),
        onDrop: () => setIsDragEnter(false),
      })
    );
  }, [setFocusedId, task, taskIndex]);

  return (
    <li
      id={task.id}
      ref={taskRef}
      onDoubleClick={onDoubleClickHandler}
      onFocus={() => setFocusedId(task.id)}
      onBlur={() => setFocusedId(undefined)}
      className={clsx(
        `${styles.card}`,
        `${taskStatus ? styles[`card--${taskStatus}`] : ''}`,
        `${isDragging ? styles['card--dragging'] : ''}`,
        `${isDragEnter ? styles['card--dragEnter'] : ''}`,
        `${isFocused ? styles['card--focus'] : ''}`
      )}
      aria-label={`Kanban Task: ${task.title}. Stage: ${stage.title}`}
      draggable>
      <div className={styles.card__upper}>
        <span className={styles.dealInfo__company}>{task.title}</span>
        {/* <ScrumboardCardOptionsBtn taskId={taskId} columnId={stage.id} taskStatus={taskStatus} />  */}
        {/* TODO: Make new component, separate from the Pipeline one */}
      </div>
      <div className={styles.card__lower}>
        <div className={styles.card__lower__details}>
          {/* Icon Description */}
          {/* Icon Notes Number  */}
          {/* Icon Date Summary */}
        </div>
        <UserCircle userImage={task.userImage} alt={task.userImage} />
      </div>
    </li>
  );
}

export default memo(ScrumBoardKanbanTask);
