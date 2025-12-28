import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef, useState } from 'react';

import ScrumboardAddCard from './components/ScrumboardAddCard';
import ScrumboardColumnAddBtn from './components/ScrumboardColumnAddBtn';
import ScrumboardKanbanTask from './ScrumboardKanbanTask';
import { createKanbanColumnTargetData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardColumn.module.scss';

interface Props {
  column: KanbanStage;
  tasks: KanbanTask[];
}

function ScrumboardKanbanColumnUnassigned(props: Props): React.JSX.Element {
  const { column, tasks } = props;
  const [, setIsDraggedOver] = useState<boolean>(false);
  const columnRef = useRef(null);

  useEffect(() => {
    const columnElement = columnRef.current;
    if (!columnElement) return;

    return dropTargetForElements({
      element: columnElement,
      getData: () => createKanbanColumnTargetData(column),
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDragStart: () => setIsDraggedOver(true),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [column, tasks.length]);

  return (
    <div ref={columnRef} className={styles.column}>
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
            <ScrumboardColumnAddBtn columnId={column.id} />
          </div>
        </div>
      </div>
      <div className={styles.column__cards}>
        {tasks.map((task, i) => {
          return <ScrumboardKanbanTask key={task.id} task={task} taskIndex={i} stage={column} />;
        })}
        {tasks.length === 0 && <ScrumboardAddCard columnId={column.id} />}
      </div>
    </div>
  );
}

export default ScrumboardKanbanColumnUnassigned;
