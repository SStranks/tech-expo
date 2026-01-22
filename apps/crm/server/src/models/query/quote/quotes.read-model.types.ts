import type { UUID } from '@apps/crm-shared';

import type { QuoteStage } from '#Models/domain/quote/quote.types.js';

export type QuoteReadRow = {
  id: UUID;
  title: string;
  company: UUID;
  totalAmount: string;
  salesTax: string;
  stage: QuoteStage;
  preparedFor: UUID;
  preparedBy: UUID;
  issuedAt: Date | null;
  dueAt: Date | null;
  createdAt: Date;
};
