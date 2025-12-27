import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import {
  SYMBOL_KANBAN_CARD,
  SYMBOL_KANBAN_COLUMN,
  SYMBOL_PIPELINE_DEAL,
  SYMBOL_PIPELINE_STAGE,
} from '../utils/pragmaticDndValidation';

export const PRAGMATICDND_PIPELINE_DEAL_TYPE = 'pipeline_card' as const;
export type PragmaticDnDPipelineDeal = {
  [SYMBOL_PIPELINE_DEAL]: true;
  deal: PipelineDeal;
  dealIndex: number;
  type: typeof PRAGMATICDND_PIPELINE_DEAL_TYPE;
};

export const PRAGMATICDND_PIPELINE_STAGE_TYPE = 'pipeline_column' as const;
export type PragmaticDndPipelineStage = {
  [SYMBOL_PIPELINE_STAGE]: true;
  stage: PipelineStage;
  dealIds: PipelineDeal['id'][];
  type: typeof PRAGMATICDND_PIPELINE_STAGE_TYPE;
};

export const PRAGMATICDND_KANBAN_CARD_TYPE = 'kanban_card' as const;
export type PragmaticDndKanbanCard = {
  [SYMBOL_KANBAN_CARD]: true;
  column: KanbanStage;
  task: KanbanTask;
  taskIndex: number;
  type: typeof PRAGMATICDND_KANBAN_CARD_TYPE;
};

export const PRAGMATICDND_KANBAN_COLUMN_TYPE = 'kanban_column' as const;
export type PragmaticDndKanbanColumn = {
  [SYMBOL_KANBAN_COLUMN]: true;
  column: KanbanStage;
  type: typeof PRAGMATICDND_KANBAN_COLUMN_TYPE;
};
