import type { UUID } from '@apps/crm-shared';
import type { SerializedError } from '@reduxjs/toolkit';

import type { PipelineDeal, PipelineStage } from '@Data/MockScrumboardPipeline';

// ---------- Slice --------- //

export type PendingDealUpdate = {
  previous: PipelineDeal;
  requestId: string;
};

export type PendingStageUpdate = {
  previous: PipelineStage;
  previousStageOrder: string[];
  requestId: string;
};

export type PendingDealDelete = PendingDealUpdate;
export type PendingStageDelete = PendingStageUpdate;

export type PendingDealMove = {
  orderKey: PipelineDeal['orderKey'];
  requestId: string;
  stageId: PipelineStage['id'];
};

export type SaveRequest = {
  status: 'pending' | 'retrying' | 'rejected' | 'fulfilled';
  entityId: string;
  attempt: number;
  error?: SerializedError;
};

// ---------- Thunks --------- //

export type CreateDealPayload = PipelineDeal;
export type CreateDealOptismisticPayload = Omit<CreateDealPayload, 'id'> & { tempId: UUID };
export type CreateDealThunkReturn = CreateDealPayload & { id: UUID };
export type CreateDealThunkArg = Omit<CreateDealPayload, 'id'>;

export type UpdateDealPayload = Pick<PipelineDeal, 'id'> & Partial<Omit<PipelineDeal, 'id'>>;
export type UpdateDealThunkReturn = UpdateDealPayload;
export type UpdateDealThunkArg = UpdateDealPayload;

export type DeleteDealPayload = Pick<PipelineDeal, 'id'>;
export type DeleteDealThunkReturn = DeleteDealPayload;
export type DeleteDealThunkArg = DeleteDealPayload;

export type DeleteAllDealsInStagePayload = Pick<PipelineStage, 'id'>;

export type MoveDealPayload = Pick<PipelineDeal, 'id' | 'orderKey' | 'stageId'>;
export type MoveDealThunkReturn = MoveDealPayload;
export type MoveDealThunkArg = MoveDealPayload;

export type UndoDealMovePayload = Pick<PipelineDeal, 'id'>;

export type CreateStagePayload = Omit<PipelineStage, 'isPermanent'>;
export type CreateStageOptimisticPayload = Omit<CreateStagePayload, 'id' | 'isPermanent'> & { tempId: UUID };
export type CreateStageThunkReturn = CreateStagePayload & { id: UUID };
export type CreateStageThunkArg = Omit<CreateStagePayload, 'id' | 'isPermanent'>;

export type UpdateStagePayload = Pick<PipelineStage, 'id'> & Partial<Omit<PipelineStage, 'id'>>;
export type UpdateStageThunkReturn = UpdateStagePayload;
export type UpdateStageThunkArg = UpdateStagePayload;

export type DeleteStagePayload = Pick<PipelineStage, 'id'>;
export type DeleteStageThunkReturn = DeleteStagePayload;
export type DeleteStageThunkArg = DeleteStagePayload;

export type DeleteSaveRequestPayload = { requestId: string };
