import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';
import type { ReduxRootState } from '@Redux/store';

import { sortOrderKeys } from '@apps/crm-shared/utils';
import { createSelector } from '@reduxjs/toolkit';

import { dealSelectors, stageSelectors } from './pipeline.slice';

type DealsById = {
  [dealId: string]: PipelineDeal;
};

type SelectorDealsByStageSelector = (state: ReduxRootState, stageId: PipelineStage['id']) => PipelineDeal[];

type MakeSelectorDealIdsSortedForPipelineSelector = (
  dealsById: DealsById,
  stageId: PipelineStage['id']
) => PipelineDeal['id'][];

type MakeSelectorDealsTotalForStageSelector = (state: ReduxRootState, stageId: PipelineStage['id']) => number;

type MakeSelectorDealIdsSortedForStageSelector = (
  state: ReduxRootState,
  stageId: PipelineStage['id']
) => PipelineDeal['id'][];

const selectAllDeals = dealSelectors.selectAll;
const selectAllStages = stageSelectors.selectAll;

export const selectorPipelineStages = createSelector([selectAllStages], (entities) => Object.values(entities));

export const selectorStagesByNotPermanent = createSelector([selectAllStages], (stages) =>
  stages.filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([selectAllStages], (stages) =>
  stages.reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned' | 'won' | 'lost', Record<'id', PipelineStage['id']>>
  )
);

export const selectorDealsByStage = createSelector(
  [selectAllDeals, (_state: ReduxRootState, stageId: PipelineStage['id']) => stageId],
  (deals, stageId) => deals.filter((d) => d.stageId === stageId)
) as SelectorDealsByStageSelector;

export const makeSelectorDealsTotalForStage = (): MakeSelectorDealsTotalForStageSelector =>
  createSelector([selectAllDeals, (_: ReduxRootState, stageId: PipelineStage['id']) => stageId], (deals, stageId) =>
    deals.filter((d) => d.stageId === stageId).reduce((sum, d) => sum + d.dealTotal, 0)
  );

export const makeSelectorDealIdsSortedForStage = (): MakeSelectorDealIdsSortedForStageSelector =>
  createSelector(
    [selectAllDeals, (_state: ReduxRootState, stageId: PipelineStage['id']) => stageId],
    (deals, stageId) =>
      deals
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );

export const makeSelectorDealIdsSortedForPipeline = (): MakeSelectorDealIdsSortedForPipelineSelector =>
  createSelector(
    [
      (dealsById: DealsById, _stageId: PipelineStage['id']) => dealsById,
      (_dealsById: DealsById, stageId: PipelineStage['id']) => stageId,
    ],
    (dealsById, stageId) =>
      Object.values(dealsById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );
