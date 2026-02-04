import type { Key } from 'react-aria-components';

import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import { useEffect, useMemo, useRef } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
} from 'react-aria-components';

import IconArrowRightDoubleAlt from '@Components/svg/IconArrowRightDoubleAlt';
import IconDelete from '@Components/svg/IconDelete';
import IconEye from '@Components/svg/IconEye';
import IconMenuDots from '@Components/svg/IconMenuDots';
import { useReduxSelector } from '@Redux/hooks';

import { makeSelectorDealIdsForStage, selectorStagesById } from '../redux/pipelineSlice';
import { usePipeineContext } from '../ScrumboardPipeline';

import styles from './ScrumboardCardOptionsBtn.module.scss';

type MoveKey = 'top' | 'up' | 'down' | 'bottom';

const moveIndexMap: Record<MoveKey, (index: number, length: number) => number> = {
  bottom: (_, len) => len - 1,
  down: (i, len) => Math.min(len - 1, i + 1),
  top: () => 0,
  up: (i) => Math.max(0, i - 1),
};

type Props = {
  deal: PipelineDeal;
  dealIndex: number;
  stage: PipelineStage;
  dealStatus?: 'won' | 'lost';
  isFocused: boolean;
};

function ScrumboardCardOptionsBtn({ deal, dealIndex, dealStatus, isFocused, stage }: Props): React.JSX.Element {
  const { handleHorizontalMove, handleVerticalMove } = usePipeineContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectorDealIdsForStage = useMemo(() => makeSelectorDealIdsForStage(), []);
  const dealIds = useReduxSelector((state) => selectorDealIdsForStage(state, stage.id));
  const stages = useReduxSelector(selectorStagesById);

  const moveTaskHorizontalHandler = (destinationStage: PipelineStage) => {
    const destinationDealIndex = dealIds.length;
    if (destinationDealIndex === undefined) return;

    return handleHorizontalMove({ destinationDealIndex, destinationStage, sourceDeal: deal });
  };

  const moveTaskVerticalHandler = (key: Key) => {
    if (typeof key !== 'string' || !(key in moveIndexMap)) return;
    if (dealIds === undefined) return;
    const destinationDealIndex = moveIndexMap[key as MoveKey](dealIndex, dealIds.length);

    return handleVerticalMove({ destinationDealIndex, sourceDeal: deal, sourceStage: stage });
  };

  useEffect(() => {
    if (isFocused && buttonRef.current) buttonRef.current?.focus();
  }, [isFocused]);

  return (
    <MenuTrigger>
      <Button
        ref={buttonRef}
        className={`${styles.cardOptionsBtn} ${dealStatus ? styles[`cardOptionsBtn--${dealStatus}`] : ''}`}
        aria-label={`Options for card ${deal.dealTitle}`}>
        <IconMenuDots svgClass={styles.cardOptionsBtn__svg} />
      </Button>
      <Popover placement="bottom start" className={styles.cardOptionsBtn__popover}>
        <Menu className={styles.cardOptionsBtn__menu}>
          <MenuSection>
            <MenuItem
              href={`pipeline/deal/update/${deal.id}`}
              routerOptions={{ state: { sourceTaskId: deal.id } }}
              className={styles.cardOptionsBtn__menuItem}>
              <IconEye svgClass={styles.cardOptionsBtn__menuItem__svg} />
              <span>View Card</span>
            </MenuItem>
            <SubmenuTrigger>
              <MenuItem className={styles.cardOptionsBtn__menuItem}>
                <span className={styles.cardOptionsBtn__menuItem}>Move Card</span>
                <IconArrowRightDoubleAlt svgClass={styles.cardOptionsBtn__menuItem__svg} />
              </MenuItem>
              <Popover placement="end top" className={styles.cardOptionsBtn__popover}>
                <Menu onAction={(key: Key) => moveTaskVerticalHandler(key)} className={styles.cardOptionsBtn__menu}>
                  <MenuSection>
                    <MenuItem id="top" isDisabled={dealIndex === 0} className={styles.cardOptionsBtn__menuItem}>
                      <span className={styles.cardOptionsBtn__menuItem}>Move to top</span>
                    </MenuItem>
                    <MenuItem id="up" isDisabled={dealIndex === 0} className={styles.cardOptionsBtn__menuItem}>
                      <span className={styles.cardOptionsBtn__menuItem}>Move up</span>
                    </MenuItem>
                    <MenuItem
                      id="down"
                      isDisabled={dealIndex === dealIds.length - 1}
                      className={styles.cardOptionsBtn__menuItem}>
                      <span className={styles.cardOptionsBtn__menuItem}>Move down</span>
                    </MenuItem>
                    <MenuItem
                      id="bottom"
                      isDisabled={dealIndex === dealIds.length - 1}
                      className={styles.cardOptionsBtn__menuItem}>
                      <span className={styles.cardOptionsBtn__menuItem}>Move to bottom</span>
                    </MenuItem>
                  </MenuSection>
                  <Separator className={styles.cardOptionsBtn__separator} />
                  <SubmenuTrigger>
                    <MenuItem className={styles.cardOptionsBtn__menuItem}>
                      <span className={styles.cardOptionsBtn__menuItem}>Move to column</span>
                      <IconArrowRightDoubleAlt svgClass={styles.cardOptionsBtn__menuItem__svg} />
                    </MenuItem>
                    <Popover placement="end top" className={styles.cardOptionsBtn__popover}>
                      <Menu>
                        <MenuSection>
                          {stages.map((stage) => (
                            <MenuItem
                              key={stage.id}
                              textValue={stage.title}
                              onAction={() => moveTaskHorizontalHandler(stage)}
                              className={styles.cardOptionsBtn__menuItem}>
                              <span>{stage.title}</span>
                            </MenuItem>
                          ))}
                        </MenuSection>
                      </Menu>
                    </Popover>
                  </SubmenuTrigger>
                </Menu>
              </Popover>
            </SubmenuTrigger>
          </MenuSection>
          <Separator className={styles.cardOptionsBtn__separator} />
          <MenuSection>
            <MenuItem
              href={`pipeline/deal/delete/${deal.id}`}
              routerOptions={{ state: { columnId: stage, sourceTaskId: deal.id } }}
              className={styles.cardOptionsBtn__menuItemWarning}>
              <IconDelete svgClass={styles.cardOptionsBtn__menuItemWarning__svg} />
              <span>Delete Card</span>
            </MenuItem>
          </MenuSection>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export default ScrumboardCardOptionsBtn;
