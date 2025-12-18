import {
  SYMBOL_KANBAN_CARD,
  SYMBOL_KANBAN_COLUMN,
  SYMBOL_PIPELINE_CARD,
  SYMBOL_PIPELINE_COLUMN,
} from '../utils/pragmaticDndValidation';

export const PIPELINE_CARD_TYPE = 'pipeline_card' as const;
export type TPipelineCard = {
  [SYMBOL_PIPELINE_CARD]: true;
  columnId: string;
  taskId: string;
  taskIndex: number;
  type: typeof PIPELINE_CARD_TYPE;
};

export const PIPELINE_COLUMN_TYPE = 'pipeline_column' as const;
export type TPipelineColumn = {
  [SYMBOL_PIPELINE_COLUMN]: true;
  columnId: string;
  numberOfTasks: number;
  type: typeof PIPELINE_COLUMN_TYPE;
};

export const KANBAN_CARD_TYPE = 'kanban_card' as const;
export type TKanbanCard = {
  [SYMBOL_KANBAN_CARD]: true;
  columnId: string;
  taskId: string;
  taskIndex: number;
  type: typeof KANBAN_CARD_TYPE;
};

export const KANBAN_COLUMN_TYPE = 'kanban_column' as const;
export type TKanbanColumn = {
  [SYMBOL_KANBAN_COLUMN]: true;
  columnId: string;
  numberOfTasks: number;
  type: typeof KANBAN_COLUMN_TYPE;
};
