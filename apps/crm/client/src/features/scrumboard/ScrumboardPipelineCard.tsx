import type { ITask } from '@Data/MockScrumboardPipeline';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserCircle } from '@Components/general';

import { ScrumboardCardOptionsBtn } from '.';
import { createPipelineCardDropData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardCard.module.scss';

interface IProps {
  task: ITask;
  columnId: string;
  taskIndex: number;
  taskStatus?: 'won' | 'lost';
}

function ScrumBoardPipelineCard({ columnId, task, taskIndex, taskStatus }: IProps): React.JSX.Element {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
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
        getInitialData: () => createPipelineCardDropData(columnId, task.id, taskIndex),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: cardElement,
        getData: ({ element, input }) => {
          const data = createPipelineCardDropData(columnId, task.id, taskIndex);
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
      onDoubleClick={onDoubleClickHandler}
      ref={cardRef}
      className={clsx(
        `${styles.card}`,
        `${taskStatus ? styles[`card--${taskStatus}`] : ''}`,
        `${isDragging ? styles['card--dragging'] : ''}`,
        `${isDragEnter ? styles['card--dragEnter'] : ''}`
      )}>
      <div className={styles.card__upper}>
        <img src={task.companyLogo} alt="" className={styles.companyLogo} />
        <div className={styles.dealInfo}>
          <div className={styles.dealInfo__upper}>
            <span className={styles.dealInfo__company}>{task.companyTitle}</span>
            <ScrumboardCardOptionsBtn taskId={task.id} columnId={columnId} taskStatus={taskStatus} />
          </div>
          <span className={styles.dealInfo__title}>{task.dealTitle}</span>
        </div>
      </div>
      <div className={styles.card__lower}>
        <div className={styles.card__lower__details}>
          <UserCircle userImage={task.userImage} alt={task.userImage} />
          <span>
            {task.daysElapsed} day{task.daysElapsed > 1 ? 's' : ''} ago
          </span>
        </div>
        <span className={styles.card__lower__total}>${task.dealTotal}</span>
      </div>
    </div>
  );
}

export default ScrumBoardPipelineCard;
