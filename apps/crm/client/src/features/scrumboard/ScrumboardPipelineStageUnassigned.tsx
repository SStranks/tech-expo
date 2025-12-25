import type { PipelineStage } from '@Data/MockScrumboardPipeline';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { useReduxSelector } from '@Redux/hooks';

import { ScrumboardAddCard, ScrumboardColumnAddBtn, ScrumboardPipelineCard } from './index';
import {
  makeSelectorDealIdsSortedForStage,
  makeSelectorDealsTotalForStage,
  makeSelectorStageById,
} from './redux/pipelineSlice';
import { createPipelineStageTargetData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardColumn.module.scss';

interface Props {
  stageId: PipelineStage['id'];
}

function ScrumboardPipelineColumnUnassigned({ stageId }: Props): React.JSX.Element {
  const [, setIsDraggedOver] = useState<boolean>(false);
  const stageRef = useRef(null);
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const selectorDealsTotalForStage = useMemo(() => makeSelectorDealsTotalForStage(), []);
  const stage = useReduxSelector((state) => selectorStageById(state, stageId));
  const selectorDealIdsLexiSorted = useMemo(() => makeSelectorDealIdsSortedForStage(), []);
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
  }, [dealIdsLexiSorted, stage]);

  return (
    <div ref={stageRef} className={styles.column}>
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
            <ScrumboardColumnAddBtn columnId={stage.id} />
          </div>
        </div>
        <span className={styles.pipelineTotal}>${dealsTotal}</span>
      </div>
      <div className={styles.column__cards}>
        {dealIdsLexiSorted.map((dealId, i) => {
          return <ScrumboardPipelineCard key={dealId} dealId={dealId} dealIndex={i} stage={stage} />;
        })}
        {dealIdsLexiSorted.length === 0 && <ScrumboardAddCard columnId={stage.id} />}
      </div>
    </div>
  );
}

export default memo(ScrumboardPipelineColumnUnassigned);
