import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { QuoteId, QuoteStage } from '#Models/domain/quote/quote.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

export type QuoteOverviewDTO = {
  id: QuoteId;
  company: {
    id: CompanyId;
    logo: string;
    name: string;
  };
  createdAt: Date;
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
  stage: QuoteStage;
  title: string;
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
};
