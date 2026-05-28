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
  openDealsAmount: {
    id: string;
    amount: string;
    currency: string;
  };
  relatedContacts: {
    id: string;
    items: { id: ContactId; firstName: string; image: string; lastName: string }[];
    totalCount: number;
  };
  salesOwner: {
    id: UserProfileId;
    firstName: string;
    image: string;
    lastName: string;
  };
};

export type CompanyDetailedDTO = CompanyDTO & {
  contacts: ContactDTO[];
  deals: PipelineDealDTO[];
  notes: CompanyNoteDTO[];
  quotes: QuoteDTO[];
  salesOwner: UserProfileId;
};

export type CompanyPipelineDealSummaryDTO = {
  id: PipelineDealId;
  dealContact: {
    id: ContactId;
    firstName: string;
    lastName: string;
  };
  dealOwner: {
    id: UserProfileId;
    firstName: string;
    lastName: string;
  };
  stage: PipelineStageId;
  title: string;
  value: string;
};

export type CompanyContactSummaryDTO = {
  id: ContactId;
  firstName: string;
  image: string | null;
  jobTitle: string;
  lastName: string;
  stage: ContactStage;
};

export type CompanyQuoteSummaryDTO = {
  id: QuoteId;
  preparedBy: {
    id: UserProfileId;
    firstName: string;
    image: string;
    lastName: string;
  };
  preparedFor: {
    id: ContactId;
    firstName: string;
    image: string;
    lastName: string;
  };
  stage: string;
  title: string;
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
};
