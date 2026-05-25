import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { QuoteId, QuoteStage } from '#Models/domain/quote/quote.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

export type QuoteOverviewDTO = {
  id: QuoteId;
  title: string;
  company: {
    id: CompanyId;
    name: string;
    logo: string;
  };
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
  stage: QuoteStage;
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
  createdAt: Date;
};
