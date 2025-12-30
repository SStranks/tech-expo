import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import {
  SYMBOL_KANBAN_STAGE,
  SYMBOL_KANBAN_TASK,
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

export const PRAGMATICDND_PIPELINE_STAGE_TYPE = 'pipeline_stage' as const;
export type PragmaticDndPipelineStage = {
  [SYMBOL_PIPELINE_STAGE]: true;
  stage: PipelineStage;
  dealIds: PipelineDeal['id'][];
  type: typeof PRAGMATICDND_PIPELINE_STAGE_TYPE;
};

export const PRAGMATICDND_KANBAN_TASK_TYPE = 'kanban_task' as const;
export type PragmaticDndKanbanTask = {
  [SYMBOL_KANBAN_TASK]: true;
  task: KanbanTask;
  taskIndex: number;
  type: typeof PRAGMATICDND_KANBAN_TASK_TYPE;
};

export const PRAGMATICDND_KANBAN_STAGE_TYPE = 'kanban_stage' as const;
export type PragmaticDndKanbanStage = {
  [SYMBOL_KANBAN_STAGE]: true;
  stage: KanbanStage;
  taskIds: KanbanTask['id'][];
  type: typeof PRAGMATICDND_KANBAN_STAGE_TYPE;
};
