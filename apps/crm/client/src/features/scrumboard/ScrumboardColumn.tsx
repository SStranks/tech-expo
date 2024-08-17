import type { IColumn, ITask } from '#Data/MockDnD';
import DroppableStrictMode from '#Components/react-beautiful-dnd/DroppableStrictMode';
import { ScrumboardAddCard, ScrumboardCard, ScrumboardColumnAddBtn, ScrumboardColumnOptionsBtn } from './index';
import styles from './_ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardColumn(props: IScrumboardColumn): JSX.Element {
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
                <ScrumboardColumnOptionsBtn columnId={column.id} columnTitle={column.title} />
                <ScrumboardColumnAddBtn columnId={column.id} />
              </div>
            </div>
            <span className={styles.pipelineTotal}>${dealsTotal}</span>
          </div>
          <div className={styles.column__cards}>
            {tasks.map((task, i) => {
              return <ScrumboardCard key={task.id} task={task} index={i} columnId={column.id} />;
            })}
            {tasks.length === 0 && <ScrumboardAddCard columnId={column.id} />}
          </div>
          {provided.placeholder}
        </div>
      )}
    </DroppableStrictMode>
  );
}

export default ScrumboardColumn;
