import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserCircle from '@Components/general/UserCircle';

import { createKanbanCardDropData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardCard.module.scss';

type Props = {
  task: KanbanTask;
  stage: KanbanStage;
  taskIndex: number;
  taskStatus?: 'won' | 'lost';
};

function ScrumBoardKanbanCard({ stage, task, taskIndex, taskStatus }: Props): React.JSX.Element {
  const cardRef = useRef(null);
  const [, setIsDragging] = useState<boolean>(false);
  const [, setIsDragEnter] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDoubleClickHandler = () => {
    navigate(`deal/update/${task.id}`, { state: { taskId: task.id } });
  };

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    return combine(
      draggable({
        element: cardElement,
        getInitialData: () => createKanbanCardDropData(stage, task, taskIndex),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: cardElement,
        getData: ({ element, input }) => {
          const data = createKanbanCardDropData(stage, task, taskIndex);
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
  }, [taskIndex, task, stage]);

  return (
    <li
      ref={cardRef}
      onDoubleClick={onDoubleClickHandler}
      className={clsx(`${styles.card}`, `${taskStatus ? styles[`card--${taskStatus}`] : ''}`)}
      aria-label={`Kanban Card: ${task.title}. Column: ${stage.title}`}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      draggable>
      <div className={styles.card__upper}>
        <span className={styles.dealInfo__company}>{task.title}</span>
        {/* <ScrumboardCardOptionsBtn taskId={task.id} columnId={stage.id} taskStatus={taskStatus} />  */}
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

export default ScrumBoardKanbanCard;
