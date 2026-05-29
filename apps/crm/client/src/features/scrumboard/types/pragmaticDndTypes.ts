import type { KanbanStage, KanbanTask } from '@Data/MockScrumboardKanban';
import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

import type {
  SYMBOL_KANBAN_STAGE,
  SYMBOL_KANBAN_TASK,
  SYMBOL_PIPELINE_DEAL,
  SYMBOL_PIPELINE_STAGE,
} from '../utils/pragmaticDndValidation';

export const PRAGMATICDND_PIPELINE_DEAL_TYPE = 'pipeline_card' as const;
export type PragmaticDnDPipelineDeal = {
  deal: PipelineDeal;
  dealIndex: number;
  [SYMBOL_PIPELINE_DEAL]: true;
  type: typeof PRAGMATICDND_PIPELINE_DEAL_TYPE;
};

export const PRAGMATICDND_PIPELINE_STAGE_TYPE = 'pipeline_stage' as const;
export type PragmaticDndPipelineStage = {
  dealIds: PipelineDeal['id'][];
  stage: PipelineStage;
  [SYMBOL_PIPELINE_STAGE]: true;
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
  stage: KanbanStage;
  [SYMBOL_KANBAN_STAGE]: true;
  taskIds: KanbanTask['id'][];
  type: typeof PRAGMATICDND_KANBAN_STAGE_TYPE;
};
