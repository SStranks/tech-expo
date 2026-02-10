import type { PipelineStage } from '@Data/MockScrumboardPipeline';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { useReduxSelector } from '@Redux/hooks';

import ScrumboardColumnAddBtn from './components/ScrumboardColumnAddBtn';
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

function ScrumboardPipelineStageLost({ stageId }: Props) {
  const [, setIsDraggedOver] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const selectorDealsTotalForStage = useMemo(() => makeSelectorDealsTotalForStage(), []);
  const selectorDealIdsLexiSorted = useMemo(() => makeSelectorDealIdsSortedForStage(), []);
  const dealIdsLexiSorted = useReduxSelector((state) => selectorDealIdsLexiSorted(state, stageId));
  const stage = useReduxSelector((state) => selectorStageById(state, stageId));

  const dealsTotal = useReduxSelector((state) => selectorDealsTotalForStage(state, stageId));

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement || !stage) return;

    return dropTargetForElements({
      element: stageElement,
      getData: () => createPipelineStageTargetData(stage, dealIdsLexiSorted),
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDragStart: () => setIsDraggedOver(true),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [dealIdsLexiSorted, stage]);

  if (!stage) return null;

  return (
    <div ref={stageRef} className={`${styles.column} ${styles[`column--lost`]}`}>
      <div className={`${styles.column__header} ${styles[`column__header--lost`]}`}>
        <div className={styles.headerPanel}>
          <div className={styles.headerDetails}>
            <span className={styles['headerDetails__title--lost']}>{stage.title}</span>
            {dealIdsLexiSorted.length > 0 && (
              <div className={`${styles.cardsTotal} ${styles['cardsTotal--lost']}`}>
                <span>{dealIdsLexiSorted.length}</span>
              </div>
            )}
          </div>
          <div className={styles.headerControls}>
            <ScrumboardColumnAddBtn stageId={stage.id} columnStyle="lost" />
          </div>
        </div>
        <span className={styles['pipelineTotal--lost']}>${dealsTotal}</span>
      </div>
      <div className={styles.column__cards}>
        {dealIdsLexiSorted.map((dealId, i) => {
          return <ScrumboardPipelineDeal key={dealId} dealId={dealId} dealIndex={i} stage={stage} dealStatus="lost" />;
        })}
      </div>
    </div>
  );
}

export default memo(ScrumboardPipelineStageLost);
