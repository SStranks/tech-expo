/* eslint-disable perfectionist/sort-objects */
import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import type {
  PragmaticDndKanbanStage,
  PragmaticDndKanbanTask,
  PragmaticDnDPipelineDeal,
  PragmaticDndPipelineStage,
} from '../types/pragmaticDndTypes';

import {
  PRAGMATICDND_KANBAN_STAGE_TYPE,
  PRAGMATICDND_KANBAN_TASK_TYPE,
  PRAGMATICDND_PIPELINE_DEAL_TYPE,
  PRAGMATICDND_PIPELINE_STAGE_TYPE,
} from '../types/pragmaticDndTypes';

export const SYMBOL_PIPELINE_DEAL = Symbol();
export const SYMBOL_PIPELINE_STAGE = Symbol();
export const SYMBOL_KANBAN_TASK = Symbol();
export const SYMBOL_KANBAN_STAGE = Symbol();

// -------------------------------- //
// ----------- DRAGGABLES --------- //
// -------------------------------- //

export function isPipelineDealDropData(data: Record<string | symbol, unknown>): data is PragmaticDnDPipelineDeal {
  return Boolean(data[SYMBOL_PIPELINE_DEAL]);
}

export function isKanbanTaskDropData(data: Record<string | symbol, unknown>): data is PragmaticDndKanbanTask {
  return Boolean(data[SYMBOL_KANBAN_TASK]);
}

export function createPipelineDealDropData(deal: PipelineDeal, dealIndex: number): PragmaticDnDPipelineDeal {
  return {
    [SYMBOL_PIPELINE_DEAL]: true,
    type: PRAGMATICDND_PIPELINE_DEAL_TYPE,
    deal,
    dealIndex,
  };
}

export function createKanbanTaskDropData(task: KanbanTask, taskIndex: number): PragmaticDndKanbanTask {
  return {
    [SYMBOL_KANBAN_TASK]: true,
    type: PRAGMATICDND_KANBAN_TASK_TYPE,
    task,
    taskIndex,
  };
}

// -------------------------------- //
// ---------- DROP TARGETS -------- //
// -------------------------------- //

export function isPipelineStageTargetData(data: Record<string | symbol, unknown>): data is PragmaticDndPipelineStage {
  return Boolean(data[SYMBOL_PIPELINE_STAGE]);
}

export function createPipelineStageTargetData(
  stage: PipelineStage,
  dealIds: PipelineDeal['id'][]
): PragmaticDndPipelineStage {
  return {
    [SYMBOL_PIPELINE_STAGE]: true,
    type: PRAGMATICDND_PIPELINE_STAGE_TYPE,
    stage,
    dealIds,
  };
}

export function isKanbanStageTargetData(data: Record<string | symbol, unknown>): data is PragmaticDndKanbanStage {
  return Boolean(data[SYMBOL_KANBAN_STAGE]);
}

export function createKanbanStageTargetData(stage: KanbanStage, taskIds: KanbanTask['id'][]): PragmaticDndKanbanStage {
  return {
    [SYMBOL_KANBAN_STAGE]: true,
    type: PRAGMATICDND_KANBAN_STAGE_TYPE,
    stage,
    taskIds,
  };
}
