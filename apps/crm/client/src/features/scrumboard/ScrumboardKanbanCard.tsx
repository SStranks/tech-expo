import type { ITask } from '@Data/MockScrumboardKanban';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserCircle } from '@Components/general';

import { ScrumboardCardOptionsBtn } from '.';
import { createKanbanCardDropData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardCard.module.scss';

interface IProps {
  task: ITask;
  columnId: string;
  taskIndex: number;
  taskStatus?: 'won' | 'lost';
}

function ScrumBoardKanbanCard({ columnId, task, taskIndex, taskStatus }: IProps): React.JSX.Element {
  const cardRef = useRef(null);
  const [, setIsDragging] = useState<boolean>(false);
  const [, setIsDragEnter] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDoubleClickHandler = () => {
    navigate(`deal/update/${task.id}`, { state: { taskId: task.id } });
  };

  console.log(columnId, task, taskIndex, taskStatus);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    return combine(
      draggable({
        element: cardElement,
        getInitialData: () => createKanbanCardDropData(columnId, task.id, taskIndex),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: cardElement,
        getData: ({ element, input }) => {
          const data = createKanbanCardDropData(columnId, task.id, taskIndex);
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
  }, [taskIndex, task, columnId]);

  return (
    <div
      ref={cardRef}
      onDoubleClick={onDoubleClickHandler}
      className={clsx(`${styles.card}`, `${taskStatus ? styles[`card--${taskStatus}`] : ''}`)}>
      <div className={styles.card__upper}>
        <span className={styles.dealInfo__company}>{task.title}</span>
        <ScrumboardCardOptionsBtn taskId={task.id} columnId={columnId} taskStatus={taskStatus} />
      </div>
      <div className={styles.card__lower}>
        <div className={styles.card__lower__details}>
          {/* Icon Description */}
          {/* Icon Notes Number  */}
          {/* Icon Date Summary */}
        </div>
        <UserCircle userImage={task.userImage} alt={task.userImage} />
      </div>
    </div>
  );
}

export default ScrumBoardKanbanCard;
