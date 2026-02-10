import type { KanbanStage } from '@Data/MockScrumboardKanban';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { useReduxSelector } from '@Redux/hooks';

import ScrumboardAddCard from './components/ScrumboardAddCard';
import ScrumboardColumnAddBtn from './components/ScrumboardColumnAddBtn';
import { makeSelectorStageById, makeSelectorTaskIdsSortedForStage } from './redux/kanbanSlice';
import ScrumboardKanbanTask from './ScrumboardKanbanTask';
import { createKanbanStageTargetData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardColumn.module.scss';

type Props = {
  stageId: KanbanStage['id'];
};

function ScrumboardKanbanColumnUnassigned({ stageId }: Props): React.JSX.Element {
  const [, setIsDraggedOver] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const stage = useReduxSelector((state) => selectorStageById(state, stageId));
  const selectorTaskIdsLexiSorted = useMemo(() => makeSelectorTaskIdsSortedForStage(), []);
  const taskIdsLexiSorted = useReduxSelector((state) => selectorTaskIdsLexiSorted(state, stageId));

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement) return;

    return dropTargetForElements({
      element: stageElement,
      getData: () => createKanbanStageTargetData(stage, taskIdsLexiSorted),
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDragStart: () => setIsDraggedOver(true),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [taskIdsLexiSorted, stage]);

  return (
    <div ref={stageRef} className={styles.column}>
      <div className={styles.column__header}>
        <div className={styles.headerPanel}>
          <div className={styles.headerDetails}>
            <span>{stage.title}</span>
            {taskIdsLexiSorted.length > 0 && (
              <div className={styles.cardsTotal}>
                <span>{taskIdsLexiSorted.length}</span>
              </div>
            )}
          </div>
          <div className={styles.headerControls}>
            <ScrumboardColumnAddBtn stageId={stage.id} />
          </div>
        </div>
      </div>
      <div className={styles.column__cards}>
        {taskIdsLexiSorted.map((taskId, i) => {
          return <ScrumboardKanbanTask key={taskId} taskId={taskId} taskIndex={i} stage={stage} />;
        })}
        {taskIdsLexiSorted.length === 0 && <ScrumboardAddCard stageId={stage.id} />}
      </div>
    </div>
  );
}

export default memo(ScrumboardKanbanColumnUnassigned);
