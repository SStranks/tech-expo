import { UserCircle } from '#Components/general';
import { Draggable } from 'react-beautiful-dnd';
import { ScrumboardCardOptionsBtn } from '.';
import styles from './_ScrumboardCard.module.scss';
import { ITask } from '#Data/MockDnD';

interface IProps {
  task: ITask;
  columnId: string;
  index: number;
  taskStatus?: 'won' | 'lost';
}

function ScrumBoardCard({ task, columnId, index, taskStatus }: IProps): JSX.Element {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${taskStatus ? styles[`card--${taskStatus}`] : ''} ${snapshot.isDragging ? styles['card--dragging'] : ''}`}>
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
      )}
    </Draggable>
  );
}

export default ScrumBoardCard;
