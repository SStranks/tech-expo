import type { IColumn, ITask } from '#Data/MockDnD';
import { ScrumboardAddCard, ScrumboardCard, ScrumboardColumnAddBtn } from './index';
import DroppableStrictMode from '#Components/react-beautiful-dnd/DroppableStrictMode';
import styles from './_ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardColumnUnassigned(props: IScrumboardColumn): JSX.Element {
  const { column, tasks } = props;
  const dealsTotal = tasks.reduce((acc, cur) => acc + cur.dealTotal, 0);

  return (
    <DroppableStrictMode droppableId={column.id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className={styles.column}>
          <div className={styles.column__header}>
            <div className={styles.headerPanel}>
              <div className={styles.headerDetails}>
                <span>{column.title}</span>
                {column.taskIds.length > 0 && (
                  <div className={styles.cardsTotal}>
                    <span>{column.taskIds.length}</span>
                  </div>
                )}
              </div>
              <div className={styles.headerControls}>
                <ScrumboardColumnAddBtn />
              </div>
            </div>
            <span className={styles.pipelineTotal}>${dealsTotal}</span>
          </div>
          <div className={styles.column__cards}>
            {tasks.map((task, i) => {
              return <ScrumboardCard key={task.id} task={task} index={i} />;
            })}
            {tasks.length === 0 && <ScrumboardAddCard />}
          </div>
          {provided.placeholder}
        </div>
      )}
    </DroppableStrictMode>
  );
}

export default ScrumboardColumnUnassigned;
