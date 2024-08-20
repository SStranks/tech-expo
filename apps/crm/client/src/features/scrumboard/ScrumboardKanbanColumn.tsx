import type { IColumn, ITask } from '#Data/MockScrumboardKanban';
import DroppableStrictMode from '#Components/react-beautiful-dnd/DroppableStrictMode';
import { ScrumboardAddCard, ScrumboardKanbanCard, ScrumboardColumnAddBtn, ScrumboardColumnOptionsBtn } from './index';
import styles from './_ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardKanbanColumn(props: IScrumboardColumn): JSX.Element {
  const { column, tasks } = props;

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
          </div>
          <div className={styles.column__cards}>
            {tasks.map((task, i) => {
              return <ScrumboardKanbanCard key={task.id} task={task} index={i} columnId={column.id} />;
            })}
            {tasks.length === 0 && <ScrumboardAddCard columnId={column.id} />}
          </div>
          {provided.placeholder}
        </div>
      )}
    </DroppableStrictMode>
  );
}

export default ScrumboardKanbanColumn;
