import type { IInitialData } from '@Data/MockScrumboardPipeline';

import {
  ScrumboardAddStage,
  ScrumboardPipelineColumn,
  ScrumboardPipelineColumnLost,
  ScrumboardPipelineColumnUnassigned,
  ScrumboardPipelineColumnWon,
} from './index';

import styles from './ScrumboardColumns.module.scss';

interface IProps {
  data: IInitialData;
}

function ScrumboardPipelineColumns({ data }: IProps): React.JSX.Element {
  const columnUnassigned = data.columns['column-unassigned'];
  const columnUnassignedTasks = columnUnassigned.taskIds.map((taskId) => data.tasks[taskId]);
  const columnWon = data.columns['column-won'];
  const columnWonTasks = columnWon.taskIds.map((taskId) => data.tasks[taskId]);
  const columnLost = data.columns['column-lost'];
  const columnLostTasks = columnLost.taskIds.map((taskId) => data.tasks[taskId]);

  return (
    <div className={styles.columns}>
      <ScrumboardPipelineColumnUnassigned
        key={columnUnassigned.id}
        column={columnUnassigned}
        tasks={columnUnassignedTasks}
      />
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

        return <ScrumboardPipelineColumn key={column.id} column={column} tasks={tasks} />;
      })}
      <ScrumboardAddStage />
      <ScrumboardPipelineColumnWon key={columnWon.id} column={columnWon} tasks={columnWonTasks} />
      <ScrumboardPipelineColumnLost key={columnLost.id} column={columnLost} tasks={columnLostTasks} />
    </div>
  );
}

export default ScrumboardPipelineColumns;
