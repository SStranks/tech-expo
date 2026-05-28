import type { UUID } from '@apps/crm-shared';

import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { PersistedQuoteNote } from './note/note.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from './note/note.types.js';
import type { PersistedQuote } from './quote.js';
import type { PersistedQuoteService } from './service/service.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service/service.types.js';

export type QuoteStage = (typeof QUOTE_STAGE)[number];
export const QUOTE_STAGE = ['DRAFT', 'SENT', 'ACCEPTED'] as const;

export type QuoteId = UUID & { readonly __quoteId: 'QuoteId' };
export type QuoteClientGeneratedId = UUID & { readonly __quoteClientGeneratedId: 'QuoteClientGeneratedId' };

export type CreateQuoteCommand = {
  companyId: CompanyId;
  preparedByUserProfileId: UserProfileId;
  preparedForContactId: ContactId;
  title: string;
  clientGeneratedId?: QuoteClientGeneratedId;
};

export type UpdateQuoteCommand = Partial<Omit<CreateQuoteCommand, 'clientGeneratedId'>> & { id: QuoteId };

export type AddQuoteServiceCommand = {
  clientGeneratedId?: QuoteServiceClientGeneratedId;
  quoteId: QuoteId;
  title: string;
  price: {
    amount: string;
    currency: string;
  };
  quantity: number;
  discount: number;
  totalAmount: {
    amount: string;
    currency: string;
  };
};
export type AddQuoteServiceReturn = { quote: PersistedQuote; quoteService: PersistedQuoteService };

export type UpdateQuoteServiceCommand = Partial<Omit<AddQuoteServiceCommand, 'clientGeneratedId'>> & {
  quoteId: QuoteId;
  quoteServiceId: QuoteServiceId;
};
export type UpdateQuoteServiceReturn = { quote: PersistedQuote; quoteService: PersistedQuoteService };

export type RemoveQuoteServiceCommand = {
  quoteId: QuoteId;
  quoteServiceId: QuoteServiceId;
};

export type AddQuoteNoteCommand = { quoteId: QuoteId; clientGeneratedId?: QuoteNoteClientGeneratedId; content: string };

export type AddQuoteNoteReturn = { quote: PersistedQuote; quoteNote: PersistedQuoteNote };

export type UpdateQuoteNoteCommand = Partial<Omit<AddQuoteNoteCommand, 'clientGeneratedId'>> & {
  quoteId: QuoteId;
  quoteNoteId: QuoteNoteId;
};

export type UpdateQuoteNoteReturn = { quote: PersistedQuote; quoteNote: PersistedQuoteNote };

export type RemoveQuoteNoteCommand = {
  quoteId: QuoteId;
  quoteNoteId: QuoteNoteId;
};
