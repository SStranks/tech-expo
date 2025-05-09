import type { IColumn, ITask } from '@Data/MockScrumboardPipeline';

import DroppableStrictMode from '@Components/react-beautiful-dnd/DroppableStrictMode';

import { ScrumboardColumnAddBtn, ScrumboardPipelineCard } from './index';

import styles from './ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardColumnWon(props: IScrumboardColumn): React.JSX.Element {
  const { column, tasks } = props;
  const dealsTotal = tasks.reduce((acc, cur) => acc + cur.dealTotal, 0);

  return (
    <DroppableStrictMode droppableId={column.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${styles.column} ${styles[`column--won`]}`}>
          <div className={`${styles.column__header} ${styles[`column__header--won`]}`}>
            <div className={styles.headerPanel}>
              <div className={styles.headerDetails}>
                <span className={styles['headerDetails__title--won']}>{column.title}</span>
                {column.taskIds.length > 0 && (
                  <div className={`${styles.cardsTotal} ${styles['cardsTotal--won']}`}>
                    <span>{column.taskIds.length}</span>
                  </div>
                )}
              </div>
              <div className={styles.headerControls}>
                <ScrumboardColumnAddBtn columnStyle="won" columnId={column.id} />
              </div>
            </div>
            <span className={styles['pipelineTotal--won']}>${dealsTotal}</span>
          </div>
          <div className={styles.column__cards}>
            {tasks.map((task, i) => {
              return (
                <ScrumboardPipelineCard key={task.id} task={task} index={i} columnId={column.id} taskStatus="won" />
              );
            })}
          </div>
          {provided.placeholder}
        </div>
      )}
    </DroppableStrictMode>
  );
}

export default ScrumboardColumnWon;
