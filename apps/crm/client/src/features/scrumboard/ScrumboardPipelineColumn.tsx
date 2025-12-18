import type { IColumn, ITask } from '@Data/MockScrumboardPipeline';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { ScrumboardAddCard, ScrumboardColumnAddBtn, ScrumboardColumnOptionsBtn, ScrumboardPipelineCard } from './index';
import { createPipelineColumnTargetData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardColumn.module.scss';

interface IScrumboardColumn {
  column: IColumn;
  tasks: ITask[];
}

function ScrumboardPipelineColumn(props: IScrumboardColumn): React.JSX.Element {
  const { column, tasks } = props;
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
  const columnRef = useRef(null);

  const dealsTotal = tasks.reduce((acc, cur) => acc + cur.dealTotal, 0);

  useEffect(() => {
    const columnElement = columnRef.current;
    if (!columnElement) return;

    return dropTargetForElements({
      element: columnElement,
      getData: () => createPipelineColumnTargetData(column.id, tasks.length),
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDragStart: () => setIsDraggedOver(true),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [column, tasks.length]);

  return (
    <div ref={columnRef} className={clsx(`${styles.column}`, `${isDraggedOver ? styles['column--dragEnter'] : ''}`)}>
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
          return <ScrumboardPipelineCard key={task.id} task={task} taskIndex={i} columnId={column.id} />;
        })}
        {tasks.length === 0 && <ScrumboardAddCard columnId={column.id} />}
      </div>
    </div>
  );
}

export default ScrumboardPipelineColumn;
