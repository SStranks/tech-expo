import { ScrumboardAddStage } from './index';

import styles from './ScrumboardColumns.module.scss';

// interface Props {
//   data: KanbanInitialData;
// }

// REFACTOR: Commmented out for commit; needs reworking in-line with Pipeline DnD process
function ScrumboardKanbanColumns(): React.JSX.Element {
  // const columnUnassigned = data.columns.find((column) => column.title === 'column-unassigned');

  // const columnUnassignedTasks = columnUnassigned?.taskIds.map((taskId) =>
  //   data.tasks.find((task) => task.id === taskId)
  // );

  return (
    <div className={styles.columns}>
      {/* <ScrumboardKanbanStageUnassigned
        key={columnUnassigned?.id}
        column={columnUnassigned}
        tasks={columnUnassignedTasks}
      /> */}
      {/* {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

        return <ScrumboardKanbanStage key={column.id} column={column} tasks={tasks} />;
      })} */}
      <ScrumboardAddStage />
    </div>
  );
}

export default ScrumboardKanbanColumns;
