/* eslint-disable perfectionist/sort-objects */
import type { KanbanColumn, KanbanTask } from '@Data/MockScrumboardKanban';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import type {
  PragmaticDndKanbanCard,
  PragmaticDndKanbanColumn,
  PragmaticDnDPipelineDeal,
  PragmaticDndPipelineStage,
} from '../types/pragmaticDndTypes';

import {
  PRAGMATICDND_KANBAN_CARD_TYPE,
  PRAGMATICDND_KANBAN_COLUMN_TYPE,
  PRAGMATICDND_PIPELINE_DEAL_TYPE,
  PRAGMATICDND_PIPELINE_STAGE_TYPE,
} from '../types/pragmaticDndTypes';

export const SYMBOL_PIPELINE_DEAL = Symbol();
export const SYMBOL_PIPELINE_STAGE = Symbol();
export const SYMBOL_KANBAN_CARD = Symbol();
export const SYMBOL_KANBAN_COLUMN = Symbol();

// -------------------------------- //
// ----------- DRAGGABLES --------- //
// -------------------------------- //

export function isPipelineDealDropData(data: Record<string | symbol, unknown>): data is PragmaticDnDPipelineDeal {
  return Boolean(data[SYMBOL_PIPELINE_DEAL]);
}

export function isKanbanCardDropData(data: Record<string | symbol, unknown>): data is PragmaticDndKanbanCard {
  return Boolean(data[SYMBOL_KANBAN_CARD]);
}

export function createPipelineDealDropData(deal: PipelineDeal, dealIndex: number): PragmaticDnDPipelineDeal {
  return {
    [SYMBOL_PIPELINE_DEAL]: true,
    type: PRAGMATICDND_PIPELINE_DEAL_TYPE,
    deal,
    dealIndex,
  };
}

export function createKanbanCardDropData(
  column: KanbanColumn,
  task: KanbanTask,
  taskIndex: number
): PragmaticDndKanbanCard {
  return {
    [SYMBOL_KANBAN_CARD]: true,
    type: PRAGMATICDND_KANBAN_CARD_TYPE,
    column,
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

export function isKanbanColumnTargetData(data: Record<string | symbol, unknown>): data is PragmaticDndKanbanColumn {
  return Boolean(data[SYMBOL_KANBAN_COLUMN]);
}

export function createKanbanColumnTargetData(column: KanbanColumn): PragmaticDndKanbanColumn {
  return {
    [SYMBOL_KANBAN_COLUMN]: true,
    type: PRAGMATICDND_KANBAN_COLUMN_TYPE,
    column,
  };
}
