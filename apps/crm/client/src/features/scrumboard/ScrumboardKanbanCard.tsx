import type { ITask } from '#Data/MockScrumboardKanban';

import { Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

import { UserCircle } from '#Components/general';

import { ScrumboardCardOptionsBtn } from '.';

import styles from './_ScrumboardCard.module.scss';

interface IProps {
  task: ITask;
  columnId: string;
  index: number;
  taskStatus?: 'won' | 'lost';
}

function ScrumBoardKanbanCard({ columnId, index, task, taskStatus }: IProps): JSX.Element {
  const navigate = useNavigate();

  const onDoubleClickHandler = () => {
    navigate(`deal/update/${task.id}`, { state: { taskId: task.id } });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={onDoubleClickHandler}
          ref={provided.innerRef}
          className={`${styles.card} ${taskStatus ? styles[`card--${taskStatus}`] : ''} ${snapshot.isDragging ? styles['card--dragging'] : ''}`}>
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
      )}
    </Draggable>
  );
}

export default ScrumBoardKanbanCard;
