import type { IInitialData } from '@Data/MockScrumboardKanban';

import { ScrumboardAddStage, ScrumboardKanbanColumn, ScrumboardKanbanColumnUnassigned } from './index';

import styles from './ScrumboardColumns.module.scss';

interface IProps {
  data: IInitialData;
}

function ScrumboardKanbanColumns({ data }: IProps): JSX.Element {
  console.log(data);
  const columnUnassigned = data.columns['column-unassigned'];
  const columnUnassignedTasks = columnUnassigned.taskIds.map((taskId) => data.tasks[taskId]);

  return (
    <div className={styles.columns}>
      <ScrumboardKanbanColumnUnassigned
        key={columnUnassigned.id}
        column={columnUnassigned}
        tasks={columnUnassignedTasks}
      />
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

        return <ScrumboardKanbanColumn key={column.id} column={column} tasks={tasks} />;
      })}
      <ScrumboardAddStage />
    </div>
  );
}

export default ScrumboardKanbanColumns;
