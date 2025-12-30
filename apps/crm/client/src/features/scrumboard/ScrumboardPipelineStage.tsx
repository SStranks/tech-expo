import type { PipelineStage } from '@Data/MockScrumboardPipeline';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { useReduxSelector } from '@Redux/hooks';

import ScrumboardAddCard from './components/ScrumboardAddCard';
import ScrumboardColumnAddBtn from './components/ScrumboardColumnAddBtn';
import ScrumboardColumnOptionsBtn from './components/ScrumboardColumnOptionsBtn';
import {
  makeSelectorDealIdsSortedForStage,
  makeSelectorDealsTotalForStage,
  makeSelectorStageById,
} from './redux/pipelineSlice';
import ScrumboardPipelineDeal from './ScrumboardPipelineDeal';
import { createPipelineStageTargetData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardColumn.module.scss';

type Props = {
  stageId: PipelineStage['id'];
};

function ScrumboardPipelineStage({ stageId }: Props): React.JSX.Element {
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
  const stageRef = useRef(null);
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const selectorDealIdsLexiSorted = useMemo(() => makeSelectorDealIdsSortedForStage(), []);
  const selectorDealsTotalForStage = useMemo(() => makeSelectorDealsTotalForStage(), []);
  const stage = useReduxSelector((state) => selectorStageById(state, stageId));
  const dealIdsLexiSorted = useReduxSelector((state) => selectorDealIdsLexiSorted(state, stageId));
  const dealsTotal = useReduxSelector((state) => selectorDealsTotalForStage(state, stageId));

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement) return;

    return dropTargetForElements({
      element: stageElement,
      getData: () => createPipelineStageTargetData(stage, dealIdsLexiSorted),
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDragStart: () => setIsDraggedOver(true),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [stage, dealIdsLexiSorted]);

  return (
    <div ref={stageRef} className={clsx(`${styles.column}`, `${isDraggedOver ? styles['column--dragEnter'] : ''}`)}>
      <div className={styles.column__header}>
        <div className={styles.headerPanel}>
          <div className={styles.headerDetails}>
            <span>{stage.title}</span>
            {dealIdsLexiSorted.length > 0 && (
              <div className={styles.cardsTotal}>
                <span>{dealIdsLexiSorted.length}</span>
              </div>
            )}
          </div>
          <div className={styles.headerControls}>
            <ScrumboardColumnOptionsBtn stageId={stage.id} stageTitle={stage.title} />
            <ScrumboardColumnAddBtn stageId={stage.id} />
          </div>
        </div>
        <span className={styles.pipelineTotal}>${dealsTotal}</span>
      </div>
      <div className={styles.column__cards}>
        {dealIdsLexiSorted.map((dealId, i) => {
          return <ScrumboardPipelineDeal key={dealId} dealId={dealId} dealIndex={i} stage={stage} />;
        })}
        {dealIdsLexiSorted.length === 0 && <ScrumboardAddCard stageId={stage.id} />}
      </div>
    </div>
  );
}

export default memo(ScrumboardPipelineStage);
