import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { ReduxRootState } from '@Redux/store';

import { sortOrderKeys } from '@apps/crm-shared/utils';
import { createSelector } from '@reduxjs/toolkit';

import { stageSelectors, taskSelectors } from './kanban.slice';

type TasksById = {
  [taskId: string]: KanbanTask;
};

type MakeSelectorTaskIdsSortedForStageSelector = (
  state: ReduxRootState,
  stageId: KanbanStage['id']
) => KanbanStage['id'][];

type MakeSelectorTaskIdsSortedForKanbanSelector = (
  tasksById: TasksById,
  stageId: KanbanStage['id']
) => KanbanTask['id'][];

const selectAllTasks = taskSelectors.selectAll;
const selectAllStages = stageSelectors.selectAll;

export const selectorKanbanStages = createSelector([selectAllStages], (entities) => Object.values(entities));

export const selectorStagesByNotPermanent = createSelector([selectAllStages], (stages) =>
  stages.filter((stage) => stage.isPermanent === false)
);

export const selectorStagesByPermanent = createSelector([selectAllStages], (stages) =>
  stages.reduce(
    (acc, stage) => (stage.isPermanent === true ? { ...acc, [stage.title]: { id: stage.id } } : acc),
    {} as Record<'unassigned' | 'won' | 'lost', Record<'id', KanbanStage['id']>>
  )
);

export const makeSelectorTaskIdsSortedForStage = (): MakeSelectorTaskIdsSortedForStageSelector =>
  createSelector([selectAllTasks, (_state: ReduxRootState, stageId: KanbanStage['id']) => stageId], (tasks, stageId) =>
    tasks
      .filter((t) => t.stageId === stageId)
      // eslint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
      .map((t) => t.id)
  );

export const makeSelectorTaskIdsSortedForKanban = (): MakeSelectorTaskIdsSortedForKanbanSelector =>
  createSelector(
    [
      (tasksById: TasksById, _stageId: KanbanStage['id']) => tasksById,
      (_tasksById: TasksById, stageId: KanbanStage['id']) => stageId,
    ],
    (tasksById, stageId) =>
      Object.values(tasksById)
        .filter((t) => t.stageId === stageId)
        // eslint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => sortOrderKeys(a.orderKey, b.orderKey))
        .map((t) => t.id)
  );
