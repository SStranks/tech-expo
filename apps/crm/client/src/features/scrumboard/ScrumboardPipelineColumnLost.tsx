import type { IColumn, ITask } from '#Data/MockScrumboardPipeline';
import { ScrumboardPipelineCard, ScrumboardColumnAddBtn } from './index';
import DroppableStrictMode from '#Components/react-beautiful-dnd/DroppableStrictMode';
import styles from './_ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardPipelineColumnLost(props: IScrumboardColumn): JSX.Element {
  const { column, tasks } = props;
  const dealsTotal = tasks.reduce((acc, cur) => acc + cur.dealTotal, 0);

  return (
    <DroppableStrictMode droppableId={column.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${styles.column} ${styles[`column--lost`]}`}>
          <div className={`${styles.column__header} ${styles[`column__header--lost`]}`}>
            <div className={styles.headerPanel}>
              <div className={styles.headerDetails}>
                <span className={styles['headerDetails__title--lost']}>{column.title}</span>
                {column.taskIds.length > 0 && (
                  <div className={`${styles.cardsTotal} ${styles['cardsTotal--lost']}`}>
                    <span>{column.taskIds.length}</span>
                  </div>
                )}
              </div>
              <div className={styles.headerControls}>
                <ScrumboardColumnAddBtn columnId={column.id} columnStyle="lost" />
              </div>
            </div>
            <span className={styles['pipelineTotal--lost']}>${dealsTotal}</span>
          </div>
          <div className={styles.column__cards}>
            {tasks.map((task, i) => {
              return (
                <ScrumboardPipelineCard key={task.id} task={task} index={i} columnId={column.id} taskStatus="lost" />
              );
            })}
          </div>
          {provided.placeholder}
        </div>
      )}
    </DroppableStrictMode>
  );
}

export default ScrumboardPipelineColumnLost;
