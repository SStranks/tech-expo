import type { UUID } from '@apps/crm-shared';

import type { CompanyDTO } from '#Models/domain/company/company.dto.js';
import type { CompanyNoteDTO } from '#Models/domain/company/note/note.dto.js';
import type { ContactDTO } from '#Models/domain/contact/contact.dto.js';
import type { ContactStage } from '#Models/domain/contact/contact.types.js';
import type { PipelineDealDTO } from '#Models/domain/pipeline/pipeline.dto.js';
import type { QuoteDTO } from '#Models/domain/quote/quote.dto.js';

export type CompanyOverviewDTO = {
  id: UUID;
  name: string;
  salesOwner: {
    id: UUID;
    firstName: string;
    lastName: string;
    image: string;
  };
  openDealsAmount: string;
  relatedContacts: {
    id: string;
    items: { id: UUID; firstName: string; lastName: string; image: string }[];
    totalCount: number;
  };
};

export type CompanyDetailedDTO = CompanyDTO & {
  salesOwner: UUID;
  contacts: ContactDTO[];
  deals: PipelineDealDTO[];
  quotes: QuoteDTO[];
  notes: CompanyNoteDTO[];
};

export type CompanyPipelineDealSummaryDTO = {
  id: UUID;
  title: string;
  value: string;
  stage: UUID;
  dealOwner: {
    id: UUID;
    firstName: string;
    lastName: string;
  };
  dealContact: {
    id: UUID;
    firstName: string;
    lastName: string;
  };
};

export type CompanyContactSummaryDTO = {
  id: UUID;
  stage: ContactStage;
  firstName: string;
  lastName: string;
  image: string | null;
  jobTitle: string;
};

export type CompanyQuoteSummaryDTO = {
  id: UUID;
  title: string;
  totalAmount: string;
  stage: string;
  preparedFor: {
    id: UUID;
    firstName: string;
    lastName: string;
    image: string;
  };
  preparedBy: {
    id: UUID;
    firstName: string;
    lastName: string;
    image: string;
  };
};
