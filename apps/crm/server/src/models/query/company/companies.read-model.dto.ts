import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { CompanyNoteDTO } from '#Models/domain/company/note/note.dto.js';
import type { ContactDTO } from '#Models/domain/contact/contact.dto.js';
import type { ContactId, ContactStage } from '#Models/domain/contact/contact.types.js';
import type { PipelineDealId } from '#Models/domain/pipeline/deal/deal.types.js';
import type { PipelineDealDTO } from '#Models/domain/pipeline/pipeline.dto.js';
import type { PipelineStageId } from '#Models/domain/pipeline/stage/stage.types.js';
import type { QuoteDTO } from '#Models/domain/quote/quote.dto.js';
import type { QuoteId } from '#Models/domain/quote/quote.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

export type CompanyOverviewDTO = {
  id: CompanyId;
  name: string;
  salesOwner: {
    id: UserProfileId;
    firstName: string;
    lastName: string;
    image: string;
  };
  openDealsAmount: {
    id: string;
    amount: string;
    currency: string;
  };
  relatedContacts: {
    id: string;
    items: { id: ContactId; firstName: string; lastName: string; image: string }[];
    totalCount: number;
  };
};

export type CompanyDetailedDTO = CompanyDTO & {
  salesOwner: UserProfileId;
  contacts: ContactDTO[];
  deals: PipelineDealDTO[];
  quotes: QuoteDTO[];
  notes: CompanyNoteDTO[];
};

export type CompanyPipelineDealSummaryDTO = {
  id: PipelineDealId;
  title: string;
  value: string;
  stage: PipelineStageId;
  dealOwner: {
    id: UserProfileId;
    firstName: string;
    lastName: string;
  };
  dealContact: {
    id: ContactId;
    firstName: string;
    lastName: string;
  };
};

export type CompanyContactSummaryDTO = {
  id: ContactId;
  stage: ContactStage;
  firstName: string;
  lastName: string;
  image: string | null;
  jobTitle: string;
};

export type CompanyQuoteSummaryDTO = {
  id: QuoteId;
  title: string;
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
  stage: string;
  preparedFor: {
    id: ContactId;
    firstName: string;
    lastName: string;
    image: string;
  };
  preparedBy: {
    id: UserProfileId;
    firstName: string;
    lastName: string;
    image: string;
  };
};
