/* eslint-disable perfectionist/sort-objects */
import type { IColumn, ITask } from '@Data/MockScrumboardKanban';

import type { TKanbanCard, TKanbanColumn, TPipelineCard, TPipelineColumn } from '../types/pragmaticDndTypes';

import {
  KANBAN_CARD_TYPE,
  KANBAN_COLUMN_TYPE,
  PIPELINE_CARD_TYPE,
  PIPELINE_COLUMN_TYPE,
} from '../types/pragmaticDndTypes';

export const SYMBOL_PIPELINE_CARD = Symbol();
export const SYMBOL_PIPELINE_COLUMN = Symbol();
export const SYMBOL_KANBAN_CARD = Symbol();
export const SYMBOL_KANBAN_COLUMN = Symbol();

// -------------------------------- //
// ----------- DRAGGABLES --------- //
// -------------------------------- //

export function isPipelineCardDropData(data: Record<string | symbol, unknown>): data is TPipelineCard {
  return Boolean(data[SYMBOL_PIPELINE_CARD]);
}

export function isKanbanCardDropData(data: Record<string | symbol, unknown>): data is TKanbanCard {
  return Boolean(data[SYMBOL_KANBAN_CARD]);
}

export function createPipelineCardDropData(
  columnId: IColumn['id'],
  taskId: ITask['id'],
  taskIndex: number
): TPipelineCard {
  return {
    [SYMBOL_PIPELINE_CARD]: true,
    type: PIPELINE_CARD_TYPE,
    columnId,
    taskId,
    taskIndex,
  };
}
export function createKanbanCardDropData(columnId: IColumn['id'], taskId: ITask['id'], taskIndex: number): TKanbanCard {
  return {
    [SYMBOL_KANBAN_CARD]: true,
    type: KANBAN_CARD_TYPE,
    columnId,
    taskId,
    taskIndex,
  };
}

// -------------------------------- //
// ---------- DROP TARGETS -------- //
// -------------------------------- //

export function isPipelineColumnTargetData(data: Record<string | symbol, unknown>): data is TPipelineColumn {
  return Boolean(data[SYMBOL_PIPELINE_COLUMN]);
}

export function createPipelineColumnTargetData(columnId: IColumn['id'], numberOfTasks: number): TPipelineColumn {
  return {
    [SYMBOL_PIPELINE_COLUMN]: true,
    type: PIPELINE_COLUMN_TYPE,
    columnId,
    numberOfTasks,
  };
}

export function isKanbanColumnTargetData(data: Record<string | symbol, unknown>): data is TKanbanColumn {
  return Boolean(data[SYMBOL_KANBAN_COLUMN]);
}

export function createKanbanColumnTargetData(columnId: IColumn['id'], numberOfTasks: number): TKanbanColumn {
  return {
    [SYMBOL_KANBAN_COLUMN]: true,
    type: KANBAN_COLUMN_TYPE,
    columnId,
    numberOfTasks,
  };
}
