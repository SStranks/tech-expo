import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import clsx from 'clsx';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserCircle from '@Components/general/UserCircle';
import { useReduxSelector } from '@Redux/hooks';

import ScrumboardCardOptionsBtn from './components/ScrumboardCardOptionsBtn';
import { makeSelectorDealById } from './redux/pipelineSlice';
import { useFocusContext } from './ScrumboardPipeline';
import { createPipelineDealDropData } from './utils/pragmaticDndValidation';

import styles from './ScrumboardCard.module.scss';

type Props = {
  dealId: PipelineDeal['id'];
  stage: PipelineStage;
  dealIndex: number;
  dealStatus?: 'won' | 'lost';
};

// TODO:  focused Id; get from UI State
function ScrumBoardPipelineDeal({ dealId, dealIndex, dealStatus, stage }: Props) {
  const { focusedId, setFocusedId } = useFocusContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
  const dealRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const selectorDealById = useMemo(() => makeSelectorDealById(), []);
  const deal = useReduxSelector((state) => selectorDealById(state, dealId));

  useEffect(() => {
    const dealElement = dealRef.current;
    if (!dealElement || !deal) return;

    return combine(
      draggable({
        element: dealElement,
        getInitialData: () => createPipelineDealDropData(deal, dealIndex),
        onDrop: () => setIsDragging(false),
        onDragStart: () => {
          setIsDragging(true);
          setFocusedId(deal.id);
        },
      }),
      dropTargetForElements({
        element: dealElement,
        getIsSticky: () => true,
        onDragEnter: () => setIsDragEnter(true),
        onDragLeave: () => setIsDragEnter(false),
        onDrop: () => setIsDragEnter(false),
        getData: ({ element, input }) => {
          const data = createPipelineDealDropData(deal, dealIndex);
          return attachClosestEdge(data, {
            allowedEdges: ['top', 'bottom'],
            element,
            input,
          });
        },
      })
    );
  }, [dealIndex, setFocusedId, deal]);

  if (!deal) return null;

  const isFocused = focusedId === deal.id;

  const onDoubleClickHandler = () => {
    void navigate(`deal/update/${deal.id}`);
  };

  return (
    <li
      id={deal.id}
      onDoubleClick={onDoubleClickHandler}
      onFocus={() => setFocusedId(deal.id)}
      onBlur={() => setFocusedId(undefined)}
      ref={dealRef}
      className={clsx(
        `${styles.card}`,
        `${dealStatus ? styles[`card--${dealStatus}`] : ''}`,
        `${isDragging ? styles['card--dragging'] : ''}`,
        `${isDragEnter ? styles['card--dragEnter'] : ''}`,
        `${isFocused ? styles['card--focus'] : ''}`
      )}
      aria-label={`Pipeline Deal: ${deal.dealTitle}. Stage: ${stage.title}`}
      draggable>
      <div className={styles.card__upper}>
        <img src={deal.companyLogo} alt="" className={styles.companyLogo} />
        <div className={styles.dealInfo}>
          <div className={styles.dealInfo__upper}>
            <span className={styles.dealInfo__company}>{deal.companyTitle}</span>
            <ScrumboardCardOptionsBtn
              deal={deal}
              dealIndex={dealIndex}
              dealStatus={dealStatus}
              stage={stage}
              isFocused={isFocused}
            />
          </div>
          <span className={styles.dealInfo__title}>{deal.dealTitle}</span>
        </div>
      </div>
      <div className={styles.card__lower}>
        <div className={styles.card__lower__details}>
          <UserCircle userImage={deal.userImage} alt={deal.userImage} />
          <span>
            {deal.daysElapsed} day{deal.daysElapsed > 1 ? 's' : ''} ago
          </span>
          <span>{deal.orderKey}</span>
          <span>ASS2</span>
        </div>
        <span className={styles.card__lower__total}>${deal.dealTotal}</span>
      </div>
    </li>
  );
}

export default memo(ScrumBoardPipelineDeal);
