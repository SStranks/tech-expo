import { Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

import { UserCircle } from '@Components/general';
import { ITask } from '@Data/MockScrumboardPipeline';

import { ScrumboardCardOptionsBtn } from '.';

import styles from './ScrumboardCard.module.scss';

interface IProps {
  task: ITask;
  columnId: string;
  index: number;
  taskStatus?: 'won' | 'lost';
}

function ScrumBoardPipelineCard({ columnId, index, task, taskStatus }: IProps): JSX.Element {
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

export default ScrumBoardPipelineCard;
