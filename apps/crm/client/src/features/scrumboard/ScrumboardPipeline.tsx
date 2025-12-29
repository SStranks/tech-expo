import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

import type { AriaLiveLevel } from '@Components/AriaAnnouncement';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  makeSelectorDealIdsSortedForPipeline,
  moveDeal,
  selectorDealsById,
  undoTaskMove,
  updateTaskHorizontalMove,
  updateTaskVerticalMove,
} from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';
import { uiEventInsert } from '@Redux/reducers/uiSlice';
import { generateOrderKeyBetween } from '@Utils/lexicographicalRanking';

import ScrumboardPipelineStages from './ScrumboardPipelineStages';
import { PRAGMATICDND_PIPELINE_DEAL_TYPE, PRAGMATICDND_PIPELINE_STAGE_TYPE } from './types/pragmaticDndTypes';
import { isPipelineDealDropData, isPipelineStageTargetData } from './utils/pragmaticDndValidation';

import styles from './Scrumboard.module.scss';

type DealMove = {
  sourceDealId: PipelineDeal['id'];
  sourceDealOrderKey: PipelineDeal['orderKey'];
  sourceStageId: PipelineStage['id'];
  destinationDealOrderKey: PipelineDeal['orderKey'];
  destinationDealStageId: PipelineStage['id'];
};
interface FocusContext {
  focusedId: PipelineDeal['id'] | undefined;
  setFocusedId: React.Dispatch<React.SetStateAction<PipelineDeal['id'] | undefined>>;
}

const FocusContext = createContext<FocusContext | null>(null);
export const useFocusContext = () => {
  const context = useContext(FocusContext);
  if (!context) throw new Error('useFocusContext out of scope of ScrumboardPipeline.Provider');
  return context;
};

interface PipelineContext {
  handleHorizontalMove: ({
    destinationDealIndex,
    destinationStage,
    sourceDeal,
  }: {
    destinationStage: PipelineStage;
    destinationDealIndex: number;
    sourceDeal: PipelineDeal;
  }) => Promise<void>;
  handleVerticalMove: ({
    destinationDealIndex,
    sourceDeal,
    sourceStage,
  }: {
    destinationDealIndex: number;
    sourceStage: PipelineStage;
    sourceDeal: PipelineDeal;
  }) => Promise<void>;
}

const PipelineContext = createContext<PipelineContext | null>(null);
export const usePipeineContext = () => {
  const context = useContext(PipelineContext);
  if (!context) throw new Error('usePipeineContext out of scope of ScrumboardPipeline.Provider');
  return context;
};

function ScrumBoardPipeline(): React.JSX.Element {
  const [focusedId, setFocusedId] = useState<PipelineDeal['id']>();
  const reduxDispatch = useReduxDispatch();
  const dealsById = useReduxSelector(selectorDealsById);

  const getDestinationTaskOrderKey = useCallback(
    (deal: PipelineDeal, stage: PipelineStage, destinationDealIndex: number) => {
      const selector = makeSelectorDealIdsSortedForPipeline();
      const dealIdsLexiSorted = selector(dealsById, stage.id).filter((id) => id !== deal.id);
      const prevId = dealIdsLexiSorted[destinationDealIndex - 1] ?? null;
      const nextId = dealIdsLexiSorted[destinationDealIndex] ?? null;

      const prevKey = prevId ? dealsById[prevId].orderKey : null;
      const nextKey = nextId ? dealsById[nextId].orderKey : null;

      return generateOrderKeyBetween(prevKey, nextKey);
    },
    [dealsById]
  );

  const dispatchUiAriaEvent = useCallback(
    (id: string, message: string, politeness: AriaLiveLevel) => {
      reduxDispatch(
        uiEventInsert({
          id,
          data: { message, politeness },
          scope: 'pipeline',
          type: 'aria',
        })
      );
    },
    [reduxDispatch]
  );

  const commitMoveWithUiFeedback = useCallback(
    async (dealMove: DealMove, successMessage: string, errorMessage: string) => {
      const thunk = reduxDispatch(moveDeal(dealMove));
      const { requestId } = thunk;

      try {
        await thunk.unwrap();
        dispatchUiAriaEvent(requestId, successMessage, 'polite');
      } catch {
        reduxDispatch(undoTaskMove({ requestId }));
        dispatchUiAriaEvent(requestId, errorMessage, 'assertive');
      }
    },
    [reduxDispatch, dispatchUiAriaEvent]
  );

  const handleVerticalMove = useCallback(
    async ({
      destinationDealIndex,
      sourceDeal,
      sourceStage,
    }: {
      destinationDealIndex: number;
      sourceStage: PipelineStage;
      sourceDeal: PipelineDeal;
    }) => {
      const destinationDealOrderKey = getDestinationTaskOrderKey(sourceDeal, sourceStage, destinationDealIndex);

      reduxDispatch(
        updateTaskVerticalMove({
          destinationDealOrderKey,
          sourceDealId: sourceDeal.id,
        })
      );

      const dealMove: DealMove = {
        destinationDealOrderKey,
        destinationDealStageId: sourceDeal.stageId,
        sourceDealId: sourceDeal.id,
        sourceDealOrderKey: sourceDeal.orderKey,
        sourceStageId: sourceDeal.stageId,
      };

      await commitMoveWithUiFeedback(
        dealMove,
        `Card ${sourceDeal.dealTitle} moved to index ${destinationDealIndex}`,
        `Failed to move card ${sourceDeal.dealTitle}`
      );
    },
    [commitMoveWithUiFeedback, getDestinationTaskOrderKey, reduxDispatch]
  );

  const handleHorizontalMove = useCallback(
    async ({
      destinationDealIndex,
      destinationStage,
      sourceDeal,
    }: {
      destinationStage: PipelineStage;
      destinationDealIndex: number;
      sourceDeal: PipelineDeal;
    }) => {
      const destinationDealOrderKey = getDestinationTaskOrderKey(sourceDeal, destinationStage, destinationDealIndex);

      reduxDispatch(
        updateTaskHorizontalMove({
          destinationDealOrderKey,
          destinationStageId: destinationStage.id,
          sourceDealId: sourceDeal.id,
        })
      );

      const dealMove: DealMove = {
        destinationDealOrderKey,
        destinationDealStageId: destinationStage.id,
        sourceDealId: sourceDeal.id,
        sourceDealOrderKey: sourceDeal.orderKey,
        sourceStageId: sourceDeal.id,
      };

      await commitMoveWithUiFeedback(
        dealMove,
        `Card ${sourceDeal.dealTitle} moved to column ${destinationStage.title} at index ${destinationDealIndex}`,
        `Failed to move card ${sourceDeal.dealTitle}`
      );
    },
    [commitMoveWithUiFeedback, getDestinationTaskOrderKey, reduxDispatch]
  );

  const onDrop = useCallback(
    async ({ location, source }: BaseEventPayload<ElementDragType>) => {
      if (!source || location.current.dropTargets.length === 0) return;
      if (!isPipelineDealDropData(source.data)) return;

      const stageDataInitial = location.initial.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_PIPELINE_STAGE_TYPE
      );
      const stageDataCurrent = location.current.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_PIPELINE_STAGE_TYPE
      );
      if (
        !stageDataInitial ||
        !stageDataCurrent ||
        !isPipelineStageTargetData(stageDataInitial.data) ||
        !isPipelineStageTargetData(stageDataCurrent.data)
      )
        return;

      const cardDataInitial = location.initial.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_PIPELINE_DEAL_TYPE
      );
      if (!cardDataInitial || !isPipelineDealDropData(cardDataInitial.data)) return;
      const cardDataCurrent = location.current.dropTargets.find(
        (target) => target.data.type === PRAGMATICDND_PIPELINE_DEAL_TYPE
      );

      // Move card vertically in original column
      if (stageDataInitial.data.stage.id === stageDataCurrent.data.stage.id) {
        if (cardDataCurrent) {
          if (!isPipelineDealDropData(cardDataCurrent.data)) return;

          const destinationDealIndex = getReorderDestinationIndex({
            axis: 'vertical',
            closestEdgeOfTarget: extractClosestEdge(cardDataCurrent.data),
            indexOfTarget: cardDataCurrent.data.dealIndex,
            startIndex: source.data.dealIndex,
          });

          await handleVerticalMove({
            destinationDealIndex,
            sourceDeal: source.data.deal,
            sourceStage: stageDataInitial.data.stage,
          }); // Dragged over another card; move relative to it
        } else {
          await handleVerticalMove({
            destinationDealIndex: stageDataInitial.data.dealIds.length,
            sourceDeal: source.data.deal,
            sourceStage: stageDataInitial.data.stage,
          }); // No other card was detected; default move to end of list
        }
      }

      // Move card horizontally to another column
      if (stageDataInitial.data.stage.id !== stageDataCurrent.data.stage.id) {
        if (cardDataCurrent) {
          if (!isPipelineDealDropData(cardDataCurrent.data)) return;

          const destinationDealIndex =
            extractClosestEdge(cardDataCurrent.data) === 'top'
              ? cardDataCurrent.data.dealIndex
              : cardDataCurrent.data.dealIndex + 1;

          handleHorizontalMove({
            destinationDealIndex,
            destinationStage: stageDataCurrent.data.stage,
            sourceDeal: source.data.deal,
          }); // Dragged over another card; move relative to it
        } else {
          handleHorizontalMove({
            destinationDealIndex: stageDataCurrent.data.dealIds.length,
            destinationStage: stageDataCurrent.data.stage,
            sourceDeal: source.data.deal,
          }); // No other card was detected; default move to end of list
        }
      }
      return;
    },
    [handleHorizontalMove, handleVerticalMove]
  );

  useEffect(() => {
    return monitorForElements({ onDrop });
  }, [onDrop]);

  return (
    <FocusContext.Provider value={{ focusedId, setFocusedId }}>
      <PipelineContext.Provider value={{ handleHorizontalMove, handleVerticalMove }}>
        <div className={styles.scrumboard}>
          <ScrumboardPipelineStages />
        </div>
      </PipelineContext.Provider>
    </FocusContext.Provider>
  );
}

export default ScrumBoardPipeline;
